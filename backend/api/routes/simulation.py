from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from services.simulation_service import SimulationService

simulation_bp = Blueprint("simulation", __name__)
service = SimulationService()


@simulation_bp.post("/calculate")
def calculate():
    body = request.get_json(silent=True) or {}
    try:
        tickers = body.get("tickers", "")
        amount = float(body.get("monthly_amount", 100))
        start_year = int(body.get("start_year", 2018))
        if not isinstance(tickers, str) or not 0 < amount <= 1000000:
            raise ValueError("Montant ou symboles invalides.")
        if not 1990 <= start_year <= datetime.now(timezone.utc).year:
            raise ValueError("Année de départ invalide.")
        result = service.simulate_dca(tickers, amount, start_year)
        if not result or not result.get("breakdown"):
            return jsonify(success=False, error="Historique indisponible pour ces actifs."), 404
        return jsonify(success=True, result=result)
    except (ValueError, TypeError) as error:
        return jsonify(success=False, error=str(error)), 400
    except Exception:
        return jsonify(success=False, error="Simulation momentanément indisponible."), 503
