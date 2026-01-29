from flask import Blueprint, jsonify, request
from services.zakat_service import ZakatService

zakat_bp = Blueprint('zakat', __name__)
service = ZakatService()

@zakat_bp.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        result = service.calculate_zakat(data)
        
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500