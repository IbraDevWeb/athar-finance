from flask import Blueprint, jsonify, request
from services.zakat_service import ZakatService

zakat_bp = Blueprint("zakat", __name__)
service = ZakatService()


@zakat_bp.post("/calculate")
def calculate():
    body = request.get_json(silent=True) or {}
    try:
        result = service.calculate_zakat(body)
        return jsonify(success=True, result=result)
    except ValueError as error:
        return jsonify(success=False, error=str(error)), 400
    except Exception:
        return jsonify(success=False, error="Calcul temporairement indisponible."), 503


@zakat_bp.get("/metals")
def metals():
    try:
        return jsonify(service.get_metal_prices())
    except ValueError as error:
        return jsonify(error=str(error)), 503
    except Exception:
        return jsonify(error="Cours des métaux indisponibles."), 503
