import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///database/business.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Business settings
    BUSINESS_NAME_MIN_LENGTH = 3
    BUSINESS_NAME_MAX_LENGTH = 100
    PRODUCT_NAME_MIN_LENGTH = 2
    PRODUCT_NAME_MAX_LENGTH = 100
    
    # WhatsApp settings
    WHATSAPP_BASE_URL = "https://wa.me/"
    
class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False
    
class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'