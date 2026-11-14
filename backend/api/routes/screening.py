"""Company and ETF analysis using the documented FMP stable API.

Compliance is indicative only. Missing financial data is never treated as proof
of compliance. The API key must be provided via FMP_API_KEY on the server.
"""
import math
import os
import re
import requests
from flask import Blueprint, jsonify, request
from api.routes.zoya_provider import analyze_zoya_symbol

screening_bp = Blueprint("screening", __name__)
FMP_BASE = "https://financialmodelingprep.com/stable"
SYMBOL_RE = re.compile(r"^[A-Z0-9.\^=\-]{1,20}$")
BANNED_KEYWORDS = (
    "bank", "insurance", "reinsurance", "mortgage", "lending",
    "casino", "gambling", "betting", "lottery", "pornography",
    "alcohol", "liquor", "brewery", "distillery", "tobacco",
    "cigarette", "pork", "swine", "weapons manufacturing",
)


def fmp_get(endpoint, params=None):
    api_key = os.getenv("FMP_API_KEY", "").strip()
    if not api_key:
        return None, ("FMP_API_KEY n'est pas configurée sur le serveur.", 503)
    try:
        response = requests.get(
            FMP_BASE + endpoint,
            params={**(params or {}), "apikey": api_key},
            timeout=12,
        )
        if response.status_code == 429:
            return None, ("Limite de requêtes du fournisseur atteinte.", 429)
        if response.status_code in (401, 403):
            return None, ("Accès FMP refusé : vérifiez la clé et l'abonnement.", 503)
        if response.status_code == 404:
            return None, ("Symbole ou donnée introuvable.", 404)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and ("Error Message" in data or "error" in data):
            return None, (str(data.get("Error Message") or data["error"]), 502)
        return data, None
    except (requests.Timeout, requests.ConnectionError):
        return None, ("Le fournisseur de données ne répond pas.", 503)
    except (requests.RequestException, ValueError):
        return None, ("Réponse invalide du fournisseur de données.", 502)


def record(data):
    return data[0] if isinstance(data, list) and data else (data if isinstance(data, dict) else {})


def number(value):
    try:
        value = float(value)
        return value if math.isfinite(value) else None
    except (TypeError, ValueError):
        return None


def pct(value):
    value = number(value)
    return round(value * 100, 2) if value is not None else None


def symbols_from_body(body):
    raw = body.get("tickers", "")
    if not isinstance(raw, str):
        return None
    symbols = list(dict.fromkeys(s.strip().upper() for s in raw.split(",") if s.strip()))
    if not symbols or len(symbols) > 12 or not all(SYMBOL_RE.fullmatch(s) for s in symbols):
        return None
    return symbols


def analyze_symbol(symbol):
    provider = os.getenv("SCREENING_PROVIDER", "").strip().lower()
    if not provider:
        provider = "zoya" if os.getenv("ZOYA_API_KEY", "").strip() else "fmp"
    if provider == "zoya":
        return analyze_zoya_symbol(symbol)
    if provider != "fmp":
        return None, ("SCREENING_PROVIDER doit être fmp ou zoya.", 503)
    profile_data, error = fmp_get("/profile", {"symbol": symbol})
    if error:
        return None, error
    profile = record(profile_data)
    if not profile.get("symbol"):
        return None, ("Actif introuvable.", 404)

    balance_data, balance_error = fmp_get("/balance-sheet-statement", {"symbol": symbol, "limit": 1})
    balance = record(balance_data) if not balance_error else {}
    metrics_data, metrics_error = fmp_get("/key-metrics-ttm", {"symbol": symbol})
    metrics = record(metrics_data) if not metrics_error else {}

    market_cap = number(profile.get("marketCap") or profile.get("mktCap"))
    debt = number(balance.get("totalDebt"))
    if debt is None and balance:
        short_debt = number(balance.get("shortTermDebt"))
        long_debt = number(balance.get("longTermDebt"))
        if short_debt is not None and long_debt is not None:
            debt = short_debt + long_debt
    cash = number(balance.get("cashAndShortTermInvestments"))
    if cash is None and balance:
        cash_eq = number(balance.get("cashAndCashEquivalents"))
        short_investments = number(balance.get("shortTermInvestments"))
        if cash_eq is not None and short_investments is not None:
            cash = cash_eq + short_investments

    debt_ratio = round(debt / market_cap * 100, 2) if debt is not None and market_cap and market_cap > 0 else None
    cash_ratio = round(cash / market_cap * 100, 2) if cash is not None and market_cap and market_cap > 0 else None
    business_text = " ".join(str(profile.get(key) or "") for key in ("sector", "industry", "description")).lower()
    found = [term for term in BANNED_KEYWORDS if re.search(r"\b" + re.escape(term) + r"\b", business_text)]

    has_ratios = debt_ratio is not None and cash_ratio is not None
    status = "non_compliant" if found or (debt_ratio is not None and debt_ratio >= 33) or (cash_ratio is not None and cash_ratio >= 33) else ("potentially_compliant" if has_ratios and business_text else "indeterminate")

    roe_value = number(metrics.get("returnOnEquityTTM") if metrics.get("returnOnEquityTTM") is not None else metrics.get("roeTTM"))
    # For P/E, use the documented earnings yield if an explicit P/E is absent.
    pe_value = number(metrics.get("priceToEarningsRatioTTM") if metrics.get("priceToEarningsRatioTTM") is not None else metrics.get("peRatioTTM"))
    earnings_yield = number(metrics.get("earningsYieldTTM"))
    if pe_value is None and earnings_yield and earnings_yield > 0:
        pe_value = round(1 / earnings_yield, 2)
    price = number(profile.get("price"))
    dividend = number(profile.get("lastDividend") or profile.get("lastDiv"))
    dividend_yield = round(dividend / price * 100, 2) if dividend is not None and price and price > 0 else None

    return {
        "ticker": symbol,
        "source": "FMP",
        "name": profile.get("companyName") or symbol,
        "price": round(price, 2) if price is not None else None,
        "currency": profile.get("currency") or None,
        "change_p": number(profile.get("changePercentage") if profile.get("changePercentage") is not None else profile.get("changesPercentage")),
        "sector": profile.get("sector") or "Non renseigné",
        "industry": profile.get("industry") or "Non renseigné",
        "ratios": {"debt_ratio": debt_ratio, "cash_ratio": cash_ratio},
        "compliance": {
            "is_halal": True if status == "potentially_compliant" else (False if status == "non_compliant" else None),
            "status": status,
            "business_check": {"failed": bool(found), "found_keywords": found},
            "disclaimer": "Filtrage indicatif, non assimilable à une certification charia.",
        },
        "technicals": {
            "per": round(pe_value, 2) if pe_value is not None else None,
            "roe": round(roe_value * 100, 2) if roe_value is not None else None,
            "dividend_yield": dividend_yield,
        },
        "data_quality": {
            "financial_statements_available": bool(balance),
            "metrics_available": bool(metrics),
            "partial": bool(balance_error or metrics_error),
        },
    }, None


@screening_bp.post("/analyze")
def analyze_ticker():
    symbols = symbols_from_body(request.get_json(silent=True) or {})
    if not symbols:
        return jsonify(error="Fournissez entre 1 et 12 symboles valides, séparés par des virgules."), 400

    results, errors = [], []
    for symbol in symbols:
        result, err = analyze_symbol(symbol)
        if result:
            results.append(result)
        else:
            errors.append({"ticker": symbol, "message": err[0]})
            if err[1] in (429, 503) and not results:
                return jsonify(error=err[0], results=[], success=False), err[1]
    if not results:
        return jsonify(error="Aucun résultat exploitable.", results=[], errors=errors, success=False), 404
    return jsonify(success=True, results=results, errors=errors)


@screening_bp.post("/etf-scan")
def scan_etf():
    body = request.get_json(silent=True) or {}
    symbol = str(body.get("ticker") or "").strip().upper()
    if not SYMBOL_RE.fullmatch(symbol):
        return jsonify(error="Symbole ETF invalide."), 400

    profile_data, error = fmp_get("/profile", {"symbol": symbol})
    if error:
        return jsonify(error=error[0]), error[1]
    profile = record(profile_data)
    if not profile:
        return jsonify(error="ETF introuvable."), 404

    holdings_data, holdings_error = fmp_get("/etf/holdings", {"symbol": symbol})
    sectors_data, sectors_error = fmp_get("/etf/sector-weightings", {"symbol": symbol})
    holdings, sectors = [], []
    for item in holdings_data if isinstance(holdings_data, list) else []:
        weight = number(item.get("weightPercentage") or item.get("weight"))
        if weight is not None:
            holdings.append({"name": item.get("name") or item.get("asset") or item.get("symbol") or "Actif", "percent": round(weight, 2)})
    for item in sectors_data if isinstance(sectors_data, list) else []:
        value = number(item.get("weightPercentage") or item.get("exposure"))
        if value is not None:
            sectors.append({"name": item.get("sector") or "Secteur", "value": round(value, 2)})
    return jsonify(
        ticker=symbol,
        name=profile.get("companyName") or symbol,
        description=profile.get("description") or "",
        holdings=sorted(holdings, key=lambda x: x["percent"], reverse=True)[:15],
        sectors=sectors,
        holdings_notice="Données de composition indisponibles avec cet accès FMP." if holdings_error else None,
        sectors_notice="Données sectorielles indisponibles avec cet accès FMP." if sectors_error else None,
        top_region=None,
    )
