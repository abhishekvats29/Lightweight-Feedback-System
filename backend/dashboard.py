from flask import Blueprint, request, jsonify
from models import get_db
from utils import decode_token

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/feedbacks', methods=['GET'])
def get_feedbacks():
    token = request.headers.get('Authorization', '').split(' ')[1]
    user = decode_token(token)

    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    feedbacks = db.execute("SELECT * FROM feedback WHERE receiver_email = ? ORDER BY timestamp DESC", 
                           (user['email'],)).fetchall()
    return jsonify([dict(row) for row in feedbacks])

@dashboard_bp.route('/acknowledge/<int:feedback_id>', methods=['PATCH'])
def acknowledge_feedback(feedback_id):
    token = request.headers.get('Authorization', '').split(' ')[1]
    user = decode_token(token)

    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    db.execute("UPDATE feedback SET acknowledged = 1 WHERE id = ?", (feedback_id,))
    db.commit()
    return jsonify({'message': 'Feedback acknowledged'})
