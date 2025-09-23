from flask import Blueprint, request, jsonify
from models import get_db
from utils import decode_token
from datetime import datetime

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/submit', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    token = request.headers.get('Authorization', '').split(' ')[1]
    user = decode_token(token)

    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    db.execute('''
        INSERT INTO feedback (sender_id, receiver_email, message, tag, is_anonymous, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        user['id'],
        data['receiver_email'],
        data['message'],
        data.get('tag', ''),
        int(data.get('is_anonymous', False)),
        datetime.utcnow().isoformat()
    ))
    db.commit()
    return jsonify({'message': 'Feedback submitted'})
    
    # print("message submitted successfully")
