from flask import Blueprint, jsonify, request
from services.portfolio_service import PortfolioService

portfolio_bp = Blueprint('portfolio', __name__)
service = PortfolioService()

@portfolio_bp.route('/analyze', methods=['POST'])
def analyze():
    try:
        # On reçoit une liste d'actifs du Frontend
        # Ex: [{"ticker": "AAPL", "qty": 10, "type": "stock"}, ...]
        data = request.get_json()
        assets = data.get('assets', [])
        
        if not assets:
            return jsonify({'success': True, 'result': {'total_value': 0, 'assets': []}})

        result = service.analyze_portfolio(assets)
        return jsonify({'success': True, 'result': result})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500