from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Business(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    whatsapp_number = db.Column(db.String(20), nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)  # For custom URL
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    products = db.relationship('Product', backref='business', lazy=True)
    orders = db.relationship('Order', backref='business', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey('business.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, db.ForeignKey('business.id'), nullable=False)
    customer_name = db.Column(db.String(100))
    customer_phone = db.Column(db.String(20))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product_name = db.Column(db.String(100))
    quantity = db.Column(db.Integer, default=1)
    total_amount = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')  # pending, completed, cancelled
    order_message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)