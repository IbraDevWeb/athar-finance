import math
import re
from flask import Blueprint, jsonify, request
import yfinance as yf

charting_bp = Blueprint("charting", __name__)
ALLOWED_PERIODS = {"1d": "5m", "5d": "15m", "1mo": "1d", "6mo": "1d", "1y": "1d", "5y": "1wk", "max": "1mo"}
SYMBOL_PATTERN = re.compile(r"^[A-Z0-9.\^=\-]{1,20}$")


def finite(value):
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (ValueError, TypeError):
        return None


@charting_bp.post("/history")
def get_stock_history():
    body = request.get_json(silent=True) or {}
    symbol = str(body.get("ticker") or "").strip().upper()
    period = str(body.get("period") or "1y")
    if not SYMBOL_PATTERN.fullmatch(symbol):
        return jsonify(error="Symbole invalide."), 400
    if period not in ALLOWED_PERIODS:
        return jsonify(error="Période non prise en charge."), 400
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period=period, interval=ALLOWED_PERIODS[period], auto_adjust=True)
        if history.empty:
            return jsonify(error="Aucun historique disponible pour cet actif."), 404
        rows = []
        for date, row in history.iterrows():
            price = finite(row.get("Close"))
            if price is None:
                continue
            rows.append({
                "date": date.strftime("%Y-%m-%d %H:%M") if period in ("1d", "5d") else date.strftime("%Y-%m-%d"),
                "price": round(price, 3),
                "volume": int(finite(row.get("Volume")) or 0),
                "open": finite(row.get("Open")),
                "high": finite(row.get("High")),
                "low": finite(row.get("Low")),
            })
        if not rows:
            return jsonify(error="Historique inexploitable."), 404
        closes = [row["price"] for row in rows]
        previous = closes[-2] if len(closes) > 1 else None
        change = (closes[-1] - previous) / previous * 100 if previous and previous > 0 else 0
        try:
            metadata = ticker.get_history_metadata() or {}
        except Exception:
            metadata = {}
        return jsonify({
            "ticker": symbol,
            "name": metadata.get("shortName") or symbol,
            "current_price": closes[-1],
            "change_p": round(change, 2),
            "currency": metadata.get("currency") or "",
            "history": rows,
            "delayed": True,
        })
    except Exception:
        return jsonify(error="Impossible de récupérer l'historique boursier."), 503
