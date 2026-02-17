
# Import helper functions to make them available at package level
from .helpers import (
    generate_slug,
    format_whatsapp_message,
    validate_phone_number,
    calculate_total,
    format_price,
    sanitize_input,
    generate_order_id,
    send_whatsapp_notification
)

# Define what gets imported with "from utils import *"
__all__ = [
    'generate_slug',
    'format_whatsapp_message', 
    'validate_phone_number',
    'calculate_total',
    'format_price',
    'sanitize_input',
    'generate_order_id',
    'send_whatsapp_notification'
]

# Package metadata
__version__ = '1.0.0'
__author__ = 'Small Business WA Team'
__description__ = 'Utility functions for Small Business WhatsApp Store'