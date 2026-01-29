from flask import Blueprint, jsonify, request
from services.simulation_service import SimulationService

simulation_bp = Blueprint('simulation', __name__)
service = SimulationService()

@simulation_bp.route('/calculate', methods=['POST'])
def calculate_simulation():
    try:
        data = request.get_json()
        
        # Nouveaux paramètres
        tickers = data.get('tickers', 'AAPL') # Ex: "AAPL, MSFT"
        monthly_amount = float(data.get('monthly_amount', 100))
        start_year = int(data.get('start_year', 2018))
        
        result = service.simulate_dca(tickers, monthly_amount, start_year)
        
        if result:
            return jsonify({'success': True, 'result': result})
        else:
            return jsonify({'success': False, 'error': "Erreur lors de la simulation"}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500