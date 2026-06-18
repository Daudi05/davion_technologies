import os, uuid
from flask import Blueprint, request, send_from_directory, current_app
from flask_jwt_extended import jwt_required
from app.utils import ok, err

uploads_bp = Blueprint('uploads', __name__)
ALLOWED = {'png','jpg','jpeg','webp','gif','pdf'}

@uploads_bp.post('')
@jwt_required()
def upload():
    if 'file' not in request.files: return err('No file')
    file = request.files['file']
    ext  = (file.filename or '').rsplit('.',1)[-1].lower()
    if ext not in ALLOWED: return err(f'.{ext} not allowed')
    name = f'{uuid.uuid4().hex}.{ext}'
    file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], name))
    return ok({'url': f'/api/uploads/{name}'}, code=201)

@uploads_bp.get('/<filename>')
def serve(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], os.path.basename(filename))
