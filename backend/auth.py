from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import find_user_by_emp_id, insert_user
import hashlib

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# ✅ Password hashing helper
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


# ✅ GET /signup - browser-friendly
@auth_bp.route('/signup', methods=['GET'])
def signup_info():
    return jsonify({
        "message": "This endpoint is for registering users. Please send a POST request with name, emp_id, password, role, and department."
    }), 200


# ✅ POST /signup - register new user
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    required = ["name", "emp_id", "password", "role", "department"]

    if not all(field in data for field in required):
        return jsonify({"message": "Missing fields"}), 400

    if find_user_by_emp_id(data["emp_id"]):
        return jsonify({"message": "User already exists"}), 409

    insert_user(
        data["name"],
        data["emp_id"],
        hash_password(data["password"]),
        data["role"],
        data["department"]
    )

    return jsonify({"message": "User registered successfully"}), 201


# ✅ GET /login - browser-friendly
@auth_bp.route('/login', methods=['GET'])
def login_info():
    return jsonify({
        "message": "This endpoint is for logging in. Please send a POST request with emp_id, password, and role."
    }), 200


# ✅ POST /login - authenticate user
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    emp_id = data.get("emp_id")
    password = data.get("password")
    role = data.get("role")

    if not emp_id or not password or not role:
        return jsonify({"message": "Missing credentials"}), 400

    user = find_user_by_emp_id(emp_id)
    print("📥 Incoming Login Data:", data)
    print("🔍 Found User in DB:", user)

    if not user or user["password"] != hash_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    if user["role"] != role:
        return jsonify({"message": "Role mismatch"}), 403

    token = create_access_token(identity={
        "id": user["id"],
        "emp_id": user["emp_id"],
        "role": user["role"]
    })

    print("✅ Login successful for:", user["emp_id"])

    return jsonify({
        "token": token,
        "id": user["emp_id"],
        "role": user["role"]
    }), 200
