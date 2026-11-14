"""Estimated zakat with explicit data-source quality.

No hard-coded 'current' metal prices: when live quotes are unavailable, clients
must provide verified EUR/gram values (gold_price_g, silver_price_g).
"""
import math
import yfinance as yf

TROY_OUNCE_GRAMS = 31.1034768


def nonnegative(value, name):
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        raise ValueError("Montant invalide : " + name)
    if not math.isfinite(parsed) or parsed < 0:
        raise ValueError("Montant invalide : " + name)
    return parsed


class ZakatService:
    def get_metal_prices(self, gold_override=None, silver_override=None):
        prices = {"gold_gram": None, "silver_gram": None, "source": "yfinance"}
        try:
            for symbol, key in [("XAUEUR=X", "gold_gram"), ("XAGEUR=X", "silver_gram")]:
                history = yf.Ticker(symbol).history(period="5d")
                if not history.empty:
                    amount = float(history["Close"].dropna().iloc[-1])
                    if math.isfinite(amount) and amount > 0:
                        prices[key] = amount / TROY_OUNCE_GRAMS
        except Exception:
            pass
        if gold_override is not None:
            prices["gold_gram"] = nonnegative(gold_override, "gold_price_g")
            prices["source"] = "manual"
        if silver_override is not None:
            prices["silver_gram"] = nonnegative(silver_override, "silver_price_g")
            prices["source"] = "manual"
        if not prices["gold_gram"] or not prices["silver_gram"]:
            raise ValueError("Prix des métaux indisponibles : saisissez gold_price_g et silver_price_g (EUR/g) après vérification.")
        return prices

    def calculate_zakat(self, data):
        metals = self.get_metal_prices(data.get("gold_price_g"), data.get("silver_price_g"))
        wealth = sum(nonnegative(data.get(key, 0), key) for key in ("cash", "savings", "stocks", "crypto", "gold"))
        debt = nonnegative(data.get("debts", 0), "debts")
        net_wealth = max(0, wealth - debt)
        gold_threshold = metals["gold_gram"] * 85
        silver_threshold = metals["silver_gram"] * 595
        # A full religious obligation depends on the lunar holding period and personal circumstances.
        return {
            "net_wealth": round(net_wealth, 2),
            "zakat_payable": round(net_wealth * 0.025, 2),
            "eligible_gold_nisab": net_wealth >= gold_threshold,
            "eligible_silver_nisab": net_wealth >= silver_threshold,
            "nisab_data": {
                "gold_threshold": round(gold_threshold, 2),
                "silver_threshold": round(silver_threshold, 2),
                "gold_price_g": round(metals["gold_gram"], 2),
                "silver_price_g": round(metals["silver_gram"], 2),
                "source": metals["source"],
            },
            "disclaimer": "Estimation seulement ; le hawl et la méthode de calcul restent à vérifier.",
        }
