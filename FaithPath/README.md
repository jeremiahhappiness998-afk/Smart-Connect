# FaithPath
FROM JEREMIAH HAPPINESS 
## CS50 Final Project

FaithPath is a web application designed to help users grow in their faith through daily Bible verses and personal prayer tracking. Built with Flask, it provides a simple platform for Christians to stay encouraged and consistent in their spiritual journey.

## collaboration/ assistance;
i collaborated with ;
Git-Hub Copilot chat, Chat-GPT and i reveiwed the code and test it for debbuging sake, i got assistance and help in debugging.

## Features

- **User Authentication**: Secure registration and login system
- **Daily Bible Verses**: Display of daily encouraging Bible verses
- **Prayer Journal**: Personal prayer logging and tracking
- **Responsive Design**: Mobile-friendly interface using Bootstrap
- **Session Management**: Secure user sessions

## Technologies Used

- **Backend**: Python Flask
- **Database**: SQLite with SQLAlchemy
- **Frontend**: HTML, CSS, Bootstrap 5
- **Authentication**: Werkzeug for password hashing
- **Deployment**: Local development server

## Installation

1. **Clone or download the project**:
   ```
   cd /path/to/your/directory
   ```

2. **Navigate to the backend directory**:
   ```
   cd FaithPath/backend
   ```

3. **Create a virtual environment** (optional but it is recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

5. **Set up the database**:
   ```
   python init_db.py
   ```

## Usage

1. **Run the application**:
   ```
   python app.py
   ```

2. **Open your browser** and go to `http://localhost:5000`

3. **Register** a new account or **login** with existing credentials

4. **Navigate through the app**:
   - **Home**: View today's verse and recent prayers
   - **Word**: Dedicated page for daily encouragement
   - **Prayer**: Add and view your prayer entries

## Database Schema

The application uses three main models:

- **User**: Stores user information (email, password hash)
- **Verse**: Contains daily Bible verses (reference, text, date)
- **Prayer**: User prayer entries (content, user_id, timestamp)

## Project Structure

```
FaithPath/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models.py              # Database models
│   ├── database.py            # Database configuration
│   ├── init_db.py             # Database initialization
│   ├── requirements.txt       # Python dependencies
│   ├── routes/
│   │   ├── prayer.py          # Prayer-related routes
│   │   └── verse.py           # Verse-related routes
│   ├── templates/             # HTML templates
│   │   ├── layout.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── prayer.html
│   │   └── word.html
│   ├── static/                # Static files (CSS, JS, images)
│   └── instance/              # Database files
└── readme.md                  # This file
```
you can access more of this in a file called Folder-structure

## API Endpoints

- `GET /`: Home page (requires login)
- `GET /login`: Login page
- `POST /login`: Process login
- `GET /register`: Registration page
- `POST /register`: Process registration
- `GET /logout`: Logout
- `GET /word`: Daily word page
- `GET /prayer`: Prayer page
- `POST /prayer`: Add new prayer
- `GET /api/verse/today`: Get today's verse (JSON)

## Security Features

- Password hashing using Werkzeug
- Session-based authentication
- CSRF protection via Flask-WTF (implicit)
- Input validation

## Future Enhancements

- Email notifications for daily verses
- Prayer request sharing
- Bible study plans
- Community features
- Mobile app version
- in app bible

## Acknowledgments

- CS50 for the inspiration and learning
- Bootstrap for the UI framework
- Flask community for excellent documentation

## License

This project is submitted as part of CS50's final project requirements.