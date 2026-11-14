"""Optional Zoya live compliance provider.

Never use Zoya sandbox to produce a real-world compliance verdict.
This integration must only be enabled with an authorized live account and
written permission for displaying its data on a public website.
"""
import os
import requests

ENDPOINT = "https://api.zoya.finance/graphql"
QUERY = """
query GetReport($symbol: String!) {
  basicCompliance {
    report(symbol: $symbol) {
      symbol
      name
      exchange
      status
      reportDate
      purificationRatio
    }
  }
}
"""
STATUS = {
    "COMPLIANT": ("compliant", True),
    "NON_COMPLIANT": ("non_compliant", False),
    "QUESTIONABLE": ("indeterminate", None),
    "UNRATED": ("indeterminate", None),
}


def analyze_zoya_symbol(symbol):
    key = os.getenv("ZOYA_API_KEY", "").strip()
    if not key:
        return None, ("Clé ZOYA_API_KEY absente sur le serveur.", 503)
    if not key.startswith("live-"):
        return None, ("Zoya : une clé live est nécessaire. Les données sandbox sont fictives.", 503)
    if os.getenv("ZOYA_PUBLIC_DISPLAY_AUTHORIZED", "").strip().lower() != "true":
        return None, ("Zoya : l'autorisation écrite d'affichage public doit être confirmée sur le serveur.", 503)
    # Basic is strictly limited to US-listed stocks. A Yahoo ticker such as
    # MC.PA cannot be converted safely into a Zoya exchange identifier here.
    if "." in symbol or "-" in symbol or symbol[0].isdigit():
        return None, ("Zoya Basic couvre les actions américaines uniquement. Ce symbole nécessite un accès international et une adaptation des identifiants.", 422)
    try:
        response = requests.post(
            ENDPOINT,
            headers={"Authorization": key, "Content-Type": "application/json"},
            json={"query": QUERY, "variables": {"symbol": symbol}},
            timeout=12,
        )
        if response.status_code == 429:
            return None, ("Limite de requêtes Zoya atteinte.", 429)
        if response.status_code in (401, 403):
            return None, ("Accès Zoya refusé : vérifier l'abonnement et la clé live.", 503)
        response.raise_for_status()
        payload = response.json()
        if not isinstance(payload, dict) or payload.get("errors"):
            return None, ("Zoya n'a pas pu fournir ce rapport (accès ou requête non autorisé).", 502)
        report = (payload.get("data") or {}).get("basicCompliance") or {}
        report = report.get("report")
        if not report:
            return None, ("Aucun rapport Zoya pour ce symbole. Vérifiez sa couverture.", 404)
        provider_status = str(report.get("status") or "").upper()
        mapped, verdict = STATUS.get(provider_status, ("indeterminate", None))
        purification = report.get("purificationRatio")
        if not isinstance(purification, (int, float)) or isinstance(purification, bool):
            purification = None
        return {
            "ticker": report.get("symbol") or symbol,
            "name": report.get("name") or symbol,
            "price": None, "currency": None, "change_p": None,
            "sector": "Non communiqué", "industry": "Non communiqué",
            "source": "Zoya", "report_date": report.get("reportDate"),
            "purification_ratio": purification,
            "ratios": {"debt_ratio": None, "cash_ratio": None},
            "compliance": {
                "is_halal": verdict, "status": mapped,
                "provider_status": provider_status,
                "business_check": {"failed": None, "found_keywords": []},
                "disclaimer": "Rapport Zoya selon AAOIFI, pas une fatwa individuelle.",
            },
            "technicals": {"per": None, "roe": None, "dividend_yield": None},
            "data_quality": {
                "partial": True,
                "financial_statements_available": False,
                "metrics_available": False,
            },
        }, None
    except (requests.Timeout, requests.ConnectionError):
        return None, ("Le fournisseur Zoya ne répond pas.", 503)
    except (requests.RequestException, ValueError, TypeError, AttributeError):
        return None, ("Réponse Zoya invalide ou momentanément indisponible.", 502)
