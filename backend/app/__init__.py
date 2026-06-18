import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Mail
from dotenv import load_dotenv
from datetime import timedelta
import logging

load_dotenv()

db      = SQLAlchemy()
migrate = Migrate()
jwt     = JWTManager()
bcrypt  = Bcrypt()
mail    = Mail()
limiter = Limiter(key_func=get_remote_address, storage_uri='memory://')

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')


def create_app():
    app = Flask(__name__)

    app.config.update(
        SECRET_KEY                     = os.getenv('SECRET_KEY', 'dev-secret'),
        JWT_SECRET_KEY                 = os.getenv('JWT_SECRET_KEY', 'dev-jwt'),
        JWT_ACCESS_TOKEN_EXPIRES       = timedelta(hours=12),
        JWT_REFRESH_TOKEN_EXPIRES      = timedelta(days=30),
        SQLALCHEMY_DATABASE_URI        = os.getenv('DATABASE_URL'),
        SQLALCHEMY_TRACK_MODIFICATIONS = False,
        SQLALCHEMY_ENGINE_OPTIONS      = {'pool_pre_ping': True, 'pool_recycle': 300},
        MAIL_SERVER                    = os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
        MAIL_PORT                      = int(os.getenv('MAIL_PORT', 587)),
        MAIL_USE_TLS                   = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true',
        MAIL_USERNAME                  = os.getenv('MAIL_USERNAME'),
        MAIL_PASSWORD                  = os.getenv('MAIL_PASSWORD'),
        MAIL_DEFAULT_SENDER            = os.getenv('MAIL_DEFAULT_SENDER'),
        MAX_CONTENT_LENGTH             = 10 * 1024 * 1024,
        UPLOAD_FOLDER                  = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads'),
    )

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)

    CORS(app,
     origins=[
         os.getenv('FRONTEND_URL', 'http://localhost:5173'),
         'http://localhost:5173',
         'http://localhost:5174',
         'http://localhost:3000',
     ],
     supports_credentials=True,
     methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])
    
    @app.after_request
    def headers(r):
        r.headers['X-Content-Type-Options'] = 'nosniff'
        r.headers['X-Frame-Options']        = 'DENY'
        return r

    @jwt.unauthorized_loader
    def missing_token(r): return jsonify(success=False,message='Authorization required'),401
    @jwt.invalid_token_loader
    def invalid_token(r): return jsonify(success=False,message='Invalid token'),401
    @jwt.expired_token_loader
    def expired_token(h,p): return jsonify(success=False,message='Token expired'),401

    from app.routes.auth    import auth_bp
    from app.routes.public  import public_bp
    from app.routes.admin   import admin_bp
    from app.routes.uploads import uploads_bp

    app.register_blueprint(auth_bp,    url_prefix='/api/auth')
    app.register_blueprint(public_bp,  url_prefix='/api/public')
    app.register_blueprint(admin_bp,   url_prefix='/api/admin')
    app.register_blueprint(uploads_bp, url_prefix='/api/uploads')

    @app.errorhandler(404)
    def not_found(e): return jsonify(success=False,message='Not found'),404
    @app.errorhandler(500)
    def server_error(e): return jsonify(success=False,message='Internal server error'),500

    @app.get('/api/health')
    def health(): return jsonify(status='ok',service='Davion Technologies API v1.0')

    return app
