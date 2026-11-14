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
