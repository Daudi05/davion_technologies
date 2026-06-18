from flask import Blueprint, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import datetime
from app import db, bcrypt, limiter
from app.models.user import User
from app.utils import ok, err, current_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.post('/login')
@limiter.limit('10 per minute')
def login():
    d     = request.get_json() or {}
    email = (d.get('email') or '').lower().strip()
    pw    = d.get('password','')
    if not email or not pw:
        return err('Email and password required')
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(pw):
        return err('Invalid credentials', 401)
    if not user.is_active:
        return err('Account deactivated', 403)
    access  = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)
    return ok({'access_token': access, 'refresh_token': refresh, 'user': user.to_dict()})


@auth_bp.post('/refresh')
@jwt_required(refresh=True)
def refresh():
    uid  = get_jwt_identity()
    user = User.query.get(uid)
    if not user or not user.is_active:
        return err('Unauthorized', 401)
    return ok({'access_token': create_access_token(identity=uid)})


@auth_bp.get('/me')
@jwt_required()
def me():
    user = current_user()
    if not user: return err('Not found', 404)
    return ok(user.to_dict())
