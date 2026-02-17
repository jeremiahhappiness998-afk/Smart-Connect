from flask import Blueprint, jsonify
from models import Verse
from datetime import date

verse_bp = Blueprint("verse", __name__)

@verse_bp.route("/api/verse/today")
def today_verse():
    today = date.today()
    verse = Verse.query.filter_by(day=today).first()

    if not verse:
        return jsonify({"error": "No verse for today"}), 404

    return jsonify({
        "reference": verse.reference,
        "text": verse.text
    })
