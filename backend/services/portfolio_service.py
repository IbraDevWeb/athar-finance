import math
import re
import yfinance as yf

SYMBOL_PATTERN = re.compile(r"^[A-Z0-9.\^=\-]{1,20}$")


class PortfolioService:
    """Estimate position values; never silently substitute purchase prices for live quotes."""

    def analyze_portfolio(self, assets):
        enriched, totals_by_currency, failures = [], {}, []
        for asset in assets:
            if not isinstance(asset, dict):
                raise ValueError("Chaque position doit être un objet.")
            symbol = str(asset.get("ticker") or "").strip().upper()
            if not SYMBOL_PATTERN.fullmatch(symbol):
                raise ValueError("Symbole de position invalide.")
            try:
                quantity = float(asset.get("qty"))
                avg_price = float(asset.get("avg_price", 0))
            except (TypeError, ValueError):
                raise ValueError("Quantité ou prix d'achat invalide.")
            if not all(math.isfinite(x) for x in (quantity, avg_price)) or quantity <= 0 or avg_price < 0:
                raise ValueError("Quantité positive et prix d'achat positif ou nul requis.")
            entry = {**asset, "ticker": symbol, "qty": quantity, "avg_price": avg_price}
            try:
                ticker = yf.Ticker(symbol)
                history = ticker.history(period="5d", auto_adjust=True)
                if history.empty:
                    raise ValueError("Aucun cours disponible")
                price = float(history["Close"].dropna().iloc[-1])
                if not math.isfinite(price):
                    raise ValueError("Cours invalide")
                try:
                    currency = (ticker.get_history_metadata() or {}).get("currency") or "INCONNUE"
                except Exception:
                    currency = "INCONNUE"
                value = round(price * quantity, 2)
                entry.update({
                    "current_price": round(price, 3),
                    "current_value": value,
                    "gain": round(value - quantity * avg_price, 2),
                    "gain_percent": round((price / avg_price - 1) * 100, 2) if avg_price > 0 else None,
                    "currency": currency,
                    "as_of": str(history.index[-1]),
                    "quote_available": True,
                })
                totals_by_currency[currency] = round(totals_by_currency.get(currency, 0) + value, 2)
            except Exception:
                entry.update({"quote_available": False, "current_price": None, "current_value": None, "currency": None})
                failures.append(symbol)
            enriched.append(entry)
        return {"assets": enriched, "totals_by_currency": totals_by_currency, "unavailable": failures}
