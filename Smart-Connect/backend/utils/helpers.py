"""
Helper functions for the Small Business WhatsApp Store application.
Includes utilities for slug generation, message formatting, validation, etc.
"""

import re
import unicodedata
import random
import string
from urllib.parse import quote
from datetime import datetime

def generate_slug(business_name):
    """
    Generate a URL-friendly slug from a business name.
    
    Args:
        business_name (str): The name of the business
        
    Returns:
        str: URL-friendly slug (e.g., "Mama Put Restaurant" -> "mama-put-restaurant")
    """
    if not business_name:
        return ''
    
    # Convert to lowercase and normalize unicode characters
    slug = unicodedata.normalize('NFKD', business_name)
    slug = slug.encode('ascii', 'ignore').decode('ascii')
    
    # Replace spaces and special characters with hyphens
    slug = re.sub(r'[^\w\s-]', '', slug.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    
    # Add random suffix for uniqueness (optional)
    # suffix = ''.join(random.choices(string.digits, k=4))
    # slug = f"{slug}-{suffix}"
    
    return slug

def format_whatsapp_message(order_details):
    """
    Format order details for WhatsApp message.
    
    Args:
        order_details (dict): Dictionary containing order information
        
    Returns:
        str: URL-encoded WhatsApp message
    """
    if not order_details:
        return ''
    
    # Build message with emojis for better readability
    message = f"🛍️ *NEW ORDER*\n"
    message += f"━━━━━━━━━━━━━━━\n\n"
    
    # Product details
    message += f"📦 *Product:* {order_details.get('product_name', 'N/A')}\n"
    message += f"🔢 *Quantity:* {order_details.get('quantity', 1)}\n"
    message += f"💰 *Price per item:* ₦{order_details.get('unit_price', 0):,.2f}\n"
    message += f"💵 *Total:* ₦{order_details.get('total_amount', 0):,.2f}\n\n"
    
    # Customer details
    message += f"👤 *Customer Details*\n"
    message += f"├─ Name: {order_details.get('customer_name', 'Not provided')}\n"
    
    if order_details.get('customer_phone'):
        message += f"├─ Phone: {order_details.get('customer_phone')}\n"
    
    if order_details.get('delivery_address'):
        message += f"└─ Address: {order_details.get('delivery_address')}\n"
    
    # Additional message
    if order_details.get('order_message'):
        message += f"\n📝 *Additional Notes:*\n{order_details.get('order_message')}\n"
    
    # Order info
    message += f"\n🆔 *Order ID:* #{order_details.get('order_id', 'N/A')}\n"
    message += f"⏰ *Time:* {datetime.now().strftime('%d/%m/%Y %I:%M %p')}\n"
    
    # URL encode the message
    return quote(message)

def validate_phone_number(phone):
    """
    Validate Nigerian phone numbers.
    
    Args:
        phone (str): Phone number to validate
        
    Returns:
        tuple: (is_valid, normalized_number)
    """
    if not phone:
        return False, None
    
    # Remove any spaces, dashes, parentheses
    phone = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Nigerian phone number patterns:
    # 1. 08031234567 (11 digits starting with 0)
    # 2. 2348031234567 (13 digits starting with 234)
    # 3. +2348031234567 (14 digits with +)
    
    # Remove leading + if present
    if phone.startswith('+'):
        phone = phone[1:]
    
    # Check if it's a Nigerian number
    # Pattern: starts with 234 or 0, followed by 10 digits (for 234) or 10 digits (for 0)
    if re.match(r'^234[789][01]\d{8}$', phone):
        # Already in international format
        return True, phone
    elif re.match(r'^0[789][01]\d{8}$', phone):
        # Convert local format to international
        normalized = '234' + phone[1:]
        return True, normalized
    else:
        return False, None

def calculate_total(products):
    """
    Calculate total amount for multiple products.
    
    Args:
        products (list): List of product dictionaries with 'price' and optional 'quantity'
        
    Returns:
        float: Total amount
    """
    if not products:
        return 0.0
    
    total = 0.0
    for product in products:
        price = float(product.get('price', 0))
        quantity = int(product.get('quantity', 1))
        total += price * quantity
    
    return total

def format_price(amount, currency='₦'):
    """
    Format price with currency symbol and thousands separator.
    
    Args:
        amount (float): Amount to format
        currency (str): Currency symbol (default: ₦)
        
    Returns:
        str: Formatted price (e.g., "₦1,500.00")
    """
    try:
        amount = float(amount)
        return f"{currency}{amount:,.2f}"
    except (ValueError, TypeError):
        return f"{currency}0.00"

def sanitize_input(text, max_length=None):
    """
    Sanitize user input to prevent XSS and other injection attacks.
    
    Args:
        text (str): Input text to sanitize
        max_length (int, optional): Maximum allowed length
        
    Returns:
        str: Sanitized text
    """
    if not text:
        return ''
    
    # Convert to string if not already
    text = str(text)
    
    # Remove any HTML tags
    text = re.sub(r'<[^>]*>', '', text)
    
    # Remove any script tags and content
    text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.DOTALL)
    
    # Escape special characters
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    text = text.replace('"', '&quot;')
    text = text.replace("'", '&#x27;')
    text = text.replace('/', '&#x2F;')
    
    # Trim to max length if specified
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text.strip()

def generate_order_id(business_id):
    """
    Generate a unique order ID.
    
    Args:
        business_id (int): Business ID to include in order ID
        
    Returns:
        str: Unique order ID (e.g., "ORD-12345-ABC12")
    """
    timestamp = datetime.now().strftime('%y%m%d%H%M')
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"ORD-{business_id}-{timestamp}-{random_chars}"

def send_whatsapp_notification(phone_number, message):
    """
    Generate WhatsApp notification URL.
    
    Args:
        phone_number (str): Recipient's phone number
        message (str): Message to send
        
    Returns:
        str: WhatsApp URL
    """
    # Validate and normalize phone number
    is_valid, normalized = validate_phone_number(phone_number)
    if not is_valid:
        return None
    
    # URL encode the message
    encoded_message = quote(message)
    
    # Generate WhatsApp URL
    return f"https://wa.me/{normalized}?text={encoded_message}"

def extract_mentions(text):
    """
    Extract @mentions from text.
    
    Args:
        text (str): Text to extract mentions from
        
    Returns:
        list: List of mentioned usernames
    """
    if not text:
        return []
    
    # Find all @mentions
    mentions = re.findall(r'@(\w+)', text)
    return list(set(mentions))  # Remove duplicates

def truncate_text(text, max_length=100, suffix='...'):
    """
    Truncate text to specified length.
    
    Args:
        text (str): Text to truncate
        max_length (int): Maximum length
        suffix (str): Suffix to add when truncated
        
    Returns:
        str: Truncated text
    """
    if not text or len(text) <= max_length:
        return text
    
    return text[:max_length].rsplit(' ', 1)[0] + suffix

def parse_whatsapp_number(wa_url):
    """
    Extract phone number from WhatsApp URL.
    
    Args:
        wa_url (str): WhatsApp URL
        
    Returns:
        str: Phone number or None
    """
    if not wa_url:
        return None
    
    # Pattern: https://wa.me/2348031234567?text=...
    match = re.search(r'wa\.me/(\d+)', wa_url)
    if match:
        return match.group(1)
    
    return None

# Package initialization message (optional)
print("✅ Utils package loaded successfully")