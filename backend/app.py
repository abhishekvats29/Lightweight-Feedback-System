from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from auth import auth_bp
from database import init_db

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret-key"
CORS(app)
JWTManager(app)

# Register routes
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# Initialize DB
init_db()

@app.route("/")
def home():
    return "✅ Flask Backend is Running Successfully!"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

