from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    prayers = db.relationship("Prayer", backref="user", lazy=True)


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
class Prayer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())


class Verse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reference = db.Column(db.String(50), nullable=False)   # e.g. John 3:16
    text = db.Column(db.Text, nullable=False)
    day = db.Column(db.Date, unique=True, nullable=False, default=date.today)

