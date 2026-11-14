from flask import Blueprint, jsonify, request
from services.portfolio_service import PortfolioService

portfolio_bp = Blueprint("portfolio", __name__)
service = PortfolioService()


@portfolio_bp.post("/analyze")
def analyze():
    body = request.get_json(silent=True) or {}
    assets = body.get("assets", [])
    if not isinstance(assets, list) or len(assets) > 50:
        return jsonify(success=False, error="Le portefeuille doit contenir au maximum 50 positions."), 400
    try:
        return jsonify(success=True, result=service.analyze_portfolio(assets))
    except ValueError as error:
        return jsonify(success=False, error=str(error)), 400
    except Exception:
        return jsonify(success=False, error="Valorisation momentanément indisponible."), 503
