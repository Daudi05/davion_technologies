from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from app.models.user import User
from app import db


def ok(data=None, msg='OK', code=200, **kwargs):
    r = {'success': True, 'message': msg}
    if data is not None: r['data'] = data
    r.update(kwargs)
    return jsonify(r), code

def created(data=None, msg='Created'): return ok(data, msg, 201)
def err(msg='Error', code=400):        return jsonify({'success': False, 'message': msg}), code

def current_user():
    uid = get_jwt_identity()
    return User.query.get(uid)

def require_admin(fn):
    from functools import wraps
    from flask_jwt_extended import jwt_required
    @wraps(fn)
    @jwt_required()
    def wrapper(*a, **kw):
        user = current_user()
        if not user or not user.is_active:
            return err('Unauthorized', 401)
        return fn(*a, **kw)
    return wrapper

def paginate(query, page=1, per_page=10):
    p = query.paginate(page=page, per_page=per_page, error_out=False)
    return {'items': p.items, 'total': p.total, 'page': p.page,
            'per_page': p.per_page, 'pages': p.pages,
            'has_next': p.has_next, 'has_prev': p.has_prev}
