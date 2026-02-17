
from datetime import date
from flask import Flask, jsonify, render_template, request, redirect, session, url_for

from flask_jwt_extended import JWTManager, current_user
from flask_login import current_user, login_required

from database import db

from models import Prayer, User, Verse

from flask import Blueprint

# ... existing imports

from routes.prayer import prayer_bp

# from routes.verse import verse_bp  # removed

verse_bp = Blueprint("verse", __name__)


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///faithpath.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = 'super-secret-key-change-this'

app.config['SECRET_KEY'] = 'session-secret-key'

app.register_blueprint(prayer_bp)


app.register_blueprint(verse_bp)


db.init_app(app)

jwt = JWTManager(app)

@app.route("/")

def index():

    if 'user_id' not in session:

        return redirect('/login')

    user_id = session.get('user_id')

    today = date.today()

    verse = Verse.query.filter_by(day=today).first()

    prayers = Prayer.query.filter_by(user_id=user_id).order_by(Prayer.created_at.desc()).limit(10).all()

    return render_template("index.html", verse=verse, prayers=prayers)


@app.route("/word")

def word():

    if 'user_id' not in session:

        return redirect('/login')

    today = date.today()

    verse = Verse.query.filter_by(day=today).first()

    return render_template("word.html", verse=verse)

@app.route("/register", methods=['GET', 'POST'])

def register():

    if request.method == 'POST':

        email = request.form.get('email')

        password = request.form.get('password')

        if User.query.filter_by(email=email).first():

            return redirect('/register')

        user = User(email=email)

        user.set_password(password)

        db.session.add(user)

        db.session.commit()

        return redirect('/login')

    return render_template("register.html")

@app.route("/login", methods=['GET', 'POST'])

def login():

    if request.method == 'POST':

        email = request.form.get('loginEmail')

        password = request.form.get('loginPassword')

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):

            session['user_id'] = user.id

            return redirect('/')

        else:

            return redirect('/login')

    return render_template("login.html")

@app.route("/logout")

def logout():

    session.clear()

    return redirect('/login')




if __name__ == '__main__':

    app.run(debug=True)

