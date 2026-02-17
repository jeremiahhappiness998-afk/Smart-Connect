from app import app, db
from models import Verse
from datetime import date

with app.app_context():
    db.create_all()
    # Add a sample verse for today
    if not Verse.query.filter_by(day=date.today()).first():
        verse = Verse(reference="John 3:16", text="For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", day=date.today())
        db.session.add(verse)
        db.session.commit()
