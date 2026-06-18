from app import db, bcrypt
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id         = db.Column(db.Integer, primary_key=True)
    username   = db.Column(db.String(80), unique=True, nullable=False)
    email      = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password   = db.Column(db.String(255), nullable=False)
    role       = db.Column(db.String(20), default='admin')
    is_active  = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, pw):
        self.password = bcrypt.generate_password_hash(pw).decode()
    def check_password(self, pw):
        return bcrypt.check_password_hash(self.password, pw)
    def to_dict(self):
        return {'id':self.id,'username':self.username,'email':self.email,'role':self.role,'is_active':self.is_active}
