import os
import requests
from flask import Blueprint, request, jsonify

screening_bp = Blueprint('screening', __name__)

FMP_API_KEY = os.getenv("FMP_API_KEY", "")
FMP_BASE    = "https://financialmodelingprep.com"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fmp_get(path: str, params: dict | None = None, timeout: int = 8):
    """GET vers FMP avec gestion d'erreur centralisée.
    Retourne (data, error_dict).  L'un des deux est None.
    """
    url = f"{FMP_BASE}{path}"
    p   = {"apikey": FMP_API_KEY, **(params or {})}
    try:
        r = requests.get(url, params=p, timeout=timeout)
        if r.status_code == 429:
            return None, ("Limite de requêtes FMP atteinte (250/jour sur le plan gratuit). "
                          "Réessayez demain ou passez sur un plan payant.", 429)
        if r.status_code == 403:
            return None, ("Clé API FMP invalide ou endpoint non accessible sur ce plan.", 403)
        if r.status_code == 404:
            return None, ("Ticker introuvable sur FMP.", 404)
        if not r.ok:
            return None, (f"Erreur FMP {r.status_code}", 502)

        data = r.json()

        # FMP renvoie parfois {"Error Message": "..."} avec un 200
        if isinstance(data, dict) and "Error Message" in data:
            msg = data["Error Message"]
            if "not found" in msg.lower() or "invalid" in msg.lower():
                return None, (msg, 404)
            return None, (msg, 502)

        return data, None

    except requests.exceptions.Timeout:
        return None, ("Timeout : FMP n'a pas répondu à temps.", 504)
    except requests.exceptions.RequestException as e:
        return None, (str(e), 503)


def safe_float(val, default=0):
    try:
        return round(float(val), 2) if val is not None else default
    except (TypeError, ValueError):
        return default


def safe_pct(val, default=0):
    """Convertit un ratio décimal FMP (0.12) → 12.0 si besoin."""
    try:
        v = float(val)
        if -1 < v < 1 and v != 0:
            v = v * 100
        return round(v, 2)
    except (TypeError, ValueError):
        return default


# Mots-clés prohibés pour le screener sectoriel (sharia)
BANNED_KEYWORDS = [
    'bank', 'insurance', 'reinsurance', 'mortgage', 'lending',
    'casino', 'gambling', 'betting', 'lottery',
    'adult entertainment', 'pornography',
    'alcohol', 'liquor', 'brewery', 'distillery', 'wine',
    'tobacco', 'cigarette', 'cigar',
    'pork', 'bacon', 'ham', 'swine',
    'defense', 'military', 'weapon', 'armament', 'missile',
]


# ---------------------------------------------------------------------------
# ROUTE 1 : ANALYSE ACTION
# ---------------------------------------------------------------------------

@screening_bp.route('/analyze', methods=['POST'])
def analyze_ticker():
    body         = request.json or {}
    ticker_input = body.get('tickers', '').strip().upper()

    if not ticker_input:
        return jsonify({"error": "Ticker manquant"}), 400

    # ── 1. Profil (prix, secteur, description, dividende, market cap) ────────
    profile_data, err = fmp_get(f"/stable/profile/{ticker_input}")
    if err:
        return jsonify({"error": err[0]}), err[1]

    # /stable/profile/{symbol} renvoie un objet unique (dict) ou une liste
    profile = profile_data[0] if isinstance(profile_data, list) else profile_data
    if not profile or not profile.get("symbol"):
        return jsonify({"error": "Ticker introuvable ou données insuffisantes"}), 404

    market_cap = profile.get("mktCap") or profile.get("marketCap") or 0

    # ── 2. Bilan (dette + cash) ───────────────────────────────────────────────
    bs_data, bs_err = fmp_get(
        f"/v3/balance-sheet-statement/{ticker_input}",
        params={"limit": 1}
    )
    total_debt = 0
    total_cash = 0
    if not bs_err and bs_data:
        latest = bs_data[0] if isinstance(bs_data, list) else bs_data
        total_debt = latest.get("totalDebt") or 0
        total_cash = (latest.get("cashAndCashEquivalents") or 0) + \
                     (latest.get("shortTermInvestments") or 0)

    # ── 3. Métriques clés TTM (PE, ROE) ──────────────────────────────────────
    km_data, km_err = fmp_get(f"/v3/key-metrics-ttm/{ticker_input}", params={"limit": 1})
    pe_ratio = "N/A"
    roe      = "N/A"
    if not km_err and km_data:
        km = km_data[0] if isinstance(km_data, list) else km_data
        pe_ratio = safe_float(km.get("peRatioTTM"), "N/A")
        roe      = safe_pct(km.get("roeTTM"), "N/A")

    # ── 4. Calculs AAOIFI ────────────────────────────────────────────────────
    debt_ratio = (total_debt / market_cap * 100) if market_cap > 0 else 0
    cash_ratio = (total_cash / market_cap * 100) if market_cap > 0 else 0

    # ── 5. Screener sectoriel (sharia) ───────────────────────────────────────
    business_text = " ".join([
        profile.get("sector", ""),
        profile.get("industry", ""),
        profile.get("description", ""),
    ]).lower()

    found_keywords = [kw for kw in BANNED_KEYWORDS if kw in business_text]
    is_halal = (
        len(found_keywords) == 0
        and debt_ratio < 33
        and cash_ratio < 33
    )

    # ── 6. Variation % ───────────────────────────────────────────────────────
    # FMP renvoie changesPercentage directement en % (ex: -1.23)
    change_p = safe_float(
        profile.get("changesPercentage") or profile.get("changePercent"), 0
    )

    result = {
        "ticker":   ticker_input,
        "name":     profile.get("companyName", ticker_input),
        "price":    safe_float(profile.get("price")),
        "change_p": change_p,
        "sector":   profile.get("sector", "N/A"),
        "industry": profile.get("industry", "N/A"),
        "ratios": {
            "debt_ratio": round(debt_ratio, 2),
            "cash_ratio": round(cash_ratio, 2),
        },
        "compliance": {
            "is_halal": is_halal,
            "business_check": {
                "failed":         len(found_keywords) > 0,
                "found_keywords": found_keywords,
            },
        },
        "technicals": {
            "per":            pe_ratio,
            "roe":            roe,
            "dividend_yield": safe_pct(profile.get("lastDiv") and
                              (profile.get("lastDiv", 0) / profile.get("price", 1) * 100)
                              if profile.get("price") else profile.get("dividendYield"), 0),
        },
    }

    return jsonify({"results": [result]})


# ---------------------------------------------------------------------------
# ROUTE 2 : ETF X-RAY
# ---------------------------------------------------------------------------

@screening_bp.route('/etf-scan', methods=['POST'])
def scan_etf():
    body         = request.json or {}
    ticker_input = body.get('ticker', '').strip().upper()

    if not ticker_input:
        return jsonify({"error": "Ticker manquant"}), 400

    # ── 1. Profil ETF ─────────────────────────────────────────────────────────
    profile_data, err = fmp_get(f"/stable/profile/{ticker_input}")
    if err:
        return jsonify({"error": err[0]}), err[1]

    profile = profile_data[0] if isinstance(profile_data, list) else profile_data
    if not profile or not profile.get("symbol"):
        return jsonify({"error": "ETF introuvable ou données insuffisantes"}), 404

    # ── 2. Holdings (endpoint payant — dégradé gracieux sur free) ────────────
    holdings, sectors = [], []

    holdings_data, h_err = fmp_get(
        "/stable/etf/holdings",
        params={"symbol": ticker_input}
    )
    if not h_err and holdings_data:
        for item in (holdings_data[:10] if isinstance(holdings_data, list) else []):
            weight = item.get("weightPercentage") or item.get("weight") or 0
            if isinstance(weight, float) and weight < 1:
                weight = weight * 100
            holdings.append({
                "name":    item.get("name") or item.get("asset") or "Inconnu",
                "percent": round(float(weight), 2),
            })

    # ── 3. Répartition sectorielle ───────────────────────────────────────────
    sector_data, s_err = fmp_get(
        "/stable/etf/sector-weighting",
        params={"symbol": ticker_input}
    )
    if not s_err and sector_data:
        for item in (sector_data if isinstance(sector_data, list) else []):
            weight = item.get("weightPercentage") or item.get("exposure") or 0
            if isinstance(weight, float) and weight < 1:
                weight = weight * 100
            sectors.append({
                "name":  item.get("sector", "Inconnu"),
                "value": round(float(weight), 2),
            })

    # Fallback secteur si vide
    if not sectors and profile.get("sector"):
        sectors = [{"name": profile.get("sector"), "value": 100}]

    # Message si holdings vides (plan free)
    holdings_notice = None
    if not holdings:
        holdings_notice = (
            "Les holdings détaillés nécessitent un plan FMP payant (Starter ~$22/mois). "
            "Activez-le sur https://site.financialmodelingprep.com/developer/docs/pricing"
        )

    result = {
        "ticker":          ticker_input,
        "name":            profile.get("companyName", ticker_input),
        "description":     profile.get("description", "Pas de description disponible."),
        "holdings":        holdings,
        "holdings_notice": holdings_notice,
        "sectors":         sectors,
        "top_region":      "Global",
    }

    return jsonify(result)
