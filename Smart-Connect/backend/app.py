from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from models import db, Business, Product, Order
import os
from datetime import datetime
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///business.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Public storefront endpoints
@app.route('/store/<slug>')
def get_store(slug):
    """Get business storefront by slug"""
    business = Business.query.filter_by(slug=slug).first()
    if not business:
        return jsonify({'error': 'Store not found'}), 404
    
    products = Product.query.filter_by(business_id=business.id).all()
    
    return jsonify({
        'business': {
            'id': business.id,
            'name': business.business_name,
            'description': business.description,
            'whatsapp': business.whatsapp_number
        },
        'products': [{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'image': p.image_url
        } for p in products]
    })

@app.route('/api/order', methods=['POST'])
def create_order():
    """Create new order from WhatsApp click"""
    data = request.json
    
    business = Business.query.get(data['business_id'])
    if not business:
        return jsonify({'error': 'Business not found'}), 404
    
    # Create order record
    order = Order(
        business_id=business.id,
        customer_name=data.get('customer_name', ''),
        customer_phone=data.get('customer_phone', ''),
        product_id=data.get('product_id'),
        product_name=data.get('product_name'),
        quantity=data.get('quantity', 1),
        total_amount=data.get('total_amount'),
        order_message=data.get('order_message', ''),
        status='pending'
    )
    
    db.session.add(order)
    db.session.commit()
    
    # Generate WhatsApp message
    wa_message = f"New Order:\nProduct: {data['product_name']}\nQuantity: {data.get('quantity', 1)}\nTotal: ₦{data['total_amount']}\nCustomer: {data.get('customer_name', 'Anonymous')}"
    
    wa_url = f"https://wa.me/{business.whatsapp_number}?text={wa_message}"
    
    return jsonify({
        'success': True,
        'order_id': order.id,
        'whatsapp_url': wa_url
    })

# Admin dashboard endpoints
@app.route('/api/business/register', methods=['POST'])
def register_business():
    """Register new business"""
    data = request.json
    
    # Generate slug from business name
    slug = data['business_name'].lower().replace(' ', '-')
    
    business = Business(
        business_name=data['business_name'],
        description=data.get('description', ''),
        whatsapp_number=data['whatsapp_number'],
        slug=slug
    )
    
    db.session.add(business)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'business_id': business.id,
        'store_url': f"/store/{slug}"
    })

@app.route('/api/business/<int:business_id>/products', methods=['GET', 'POST'])
def manage_products(business_id):
    """Get or add products for a business"""
    if request.method == 'GET':
        products = Product.query.filter_by(business_id=business_id).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'image': p.image_url
        } for p in products])
    
    elif request.method == 'POST':
        data = request.json
        product = Product(
            business_id=business_id,
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            image_url=data.get('image_url', '')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({'success': True, 'product_id': product.id})

@app.route('/api/business/<int:business_id>/orders')
def get_orders(business_id):
    """Get all orders for a business"""
    orders = Order.query.filter_by(business_id=business_id).order_by(Order.created_at.desc()).all()
    
    return jsonify([{
        'id': o.id,
        'customer_name': o.customer_name,
        'product_name': o.product_name,
        'quantity': o.quantity,
        'total_amount': o.total_amount,
        'status': o.status,
        'created_at': o.created_at.isoformat(),
        'order_message': o.order_message
    } for o in orders])

@app.route('/api/order/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.json
    order.status = data['status']
    db.session.commit()
    
    return jsonify({'success': True})

load_dotenv()

if __name__ == '__main__':
    app.run(debug=True, port=5000)