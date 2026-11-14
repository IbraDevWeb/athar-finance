"""Best-effort delayed market quotes from Yahoo Finance via yfinance."""
import math
from flask import Blueprint, jsonify
import yfinance as yf

market_bp = Blueprint("market", __name__)
ASSETS = {
    "SGLD.L": "Or physique",
    "SSLV.L": "Argent physique",
    "ISDW.L": "World Islamic",
}


@market_bp.get("/live-prices")
def get_live_prices():
    results = []
    for symbol, name in ASSETS.items():
        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period="5d", auto_adjust=True)
            if history.empty:
                continue
            closes = history["Close"].dropna()
            if closes.empty:
                continue
            current = float(closes.iloc[-1])
            previous = float(closes.iloc[-2]) if len(closes) > 1 else None
            if not math.isfinite(current):
                continue
            change = ((current - previous) / previous * 100) if previous and previous > 0 else 0
            metadata = ticker.get_history_metadata() or {}
            results.append({
                "symbol": symbol,
                "name": name,
                "price": round(current, 3),
                "change": round(change, 2),
                "currency": metadata.get("currency") or "",
                "as_of": closes.index[-1].isoformat(),
                "delayed": True,
            })
        except Exception:
            # A partial quote list is better than failing all tickers.
            continue
    if not results:
        return jsonify(error="Cotations temporairement indisponibles."), 503
    return jsonify(results)
