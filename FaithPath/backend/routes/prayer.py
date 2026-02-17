from flask import Blueprint, render_template, request, redirect, url_for, session
from models import Prayer
from database import db

prayer_bp = Blueprint("prayer", __name__)

@prayer_bp.route("/prayer", methods=["GET", "POST"])
def prayer():
    if 'user_id' not in session:
        return redirect('/login')
    user_id = session['user_id']
    if request.method == "POST":
        content = request.form.get("content")

        if not content:
            return redirect(url_for("prayer.prayer"))

        prayer = Prayer(
            content=content,
            user_id=user_id
        )

        db.session.add(prayer)
        db.session.commit()

        return redirect(url_for("prayer.prayer"))

    prayers = Prayer.query.filter_by(user_id=user_id).order_by(Prayer.created_at.desc()).all()
    return render_template("prayer.html", prayers=prayers)
