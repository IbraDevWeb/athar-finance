from flask import Blueprint, request, jsonify
# 👇 IMPORT CORRECT
from services.screening_service import HalalScreeningService 

screening_bp = Blueprint('screening', __name__)
# 👇 INSTANCIATION CORRECTE
screener = HalalScreeningService() 

@screening_bp.route('/analyze', methods=['POST'])
def analyze_stocks():
    data = request.json
    tickers_input = data.get('tickers', '')
    
    if not tickers_input:
        return jsonify({"success": False, "error": "No tickers provided"}), 400
    
    # Nettoyage
    tickers = [t.strip().upper() for t in tickers_input.replace(',', ' ').split() if t.strip()]
    
    results = []
    for ticker in tickers:
        analysis = screener.get_company_profile(ticker)
        if analysis:
            results.append(analysis)
    
    return jsonify({"success": True, "results": results})