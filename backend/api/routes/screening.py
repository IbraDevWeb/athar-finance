from flask import Blueprint, request, jsonify
import yfinance as ticker_data
import pandas as pd

screening_bp = Blueprint('screening', __name__)

# --- CONFIGURATION DES RÈGLES ---
MAX_DEBT_RATIO = 33.0  # (Dette Totale / Capitalisation) < 33%
MAX_CASH_RATIO = 33.0  # (Cash + Intérêts / Capitalisation) < 33%
BANNED_KEYWORDS = [
    'bank', 'insurance', 'casino', 'gambling', 'alcohol', 'brewery', 
    'tobacco', 'pork', 'defense', 'weapon', 'entertainment', 'cinema'
]

def sanitize_value(val, default=0):
    """Nettoie les données pour éviter les erreurs JSON avec NaN ou None."""
    if pd.isna(val) or val is None:
        return default
    return val

@screening_bp.route('/analyze', methods=['POST'])
def analyze_ticker():
    data = request.json
    ticker_input = data.get('tickers', '').upper()
    
    if not ticker_input:
        return jsonify({"error": "Aucun ticker fourni"}), 400

    try:
        # 1. Récupération des données via yfinance
        stock = ticker_data.Ticker(ticker_input)
        info = stock.info
        
        # 2. Extraction des fondamentaux
        market_cap = info.get('marketCap', 0)
        total_debt = info.get('totalDebt', 0)
        total_cash = info.get('totalCash', 0)
        
        # 3. Calcul des Ratios (AAOIFI)
        # On évite la division par zéro si la Market Cap est absente
        debt_ratio = (total_debt / market_cap * 100) if market_cap > 0 else 0
        cash_ratio = (total_cash / market_cap * 100) if market_cap > 0 else 0
        
        # 4. Screener Sectoriel (Business Check)
        sector = info.get('sector', '').lower()
        industry = info.get('industry', '').lower()
        business_summary = info.get('longBusinessSummary', '').lower()
        
        found_keywords = [
            word for word in BANNED_KEYWORDS 
            if word in sector or word in industry or word in business_summary
        ]
        
        business_failed = len(found_keywords) > 0

        # 5. Verdict Final
        is_halal = (
            not business_failed and 
            debt_ratio < MAX_DEBT_RATIO and 
            cash_ratio < MAX_CASH_RATIO
        )

        # 6. Formatage du résultat pour le Frontend
        result = {
            "ticker": ticker_input,
            "name": info.get('longName', ticker_input),
            "price": info.get('currentPrice', info.get('regularMarketPrice')),
            "sector": info.get('sector', 'N/A'),
            "industry": info.get('industry', 'N/A'),
            "ratios": {
                "debt_ratio": round(debt_ratio, 2),
                "cash_ratio": round(cash_ratio, 2)
            },
            "compliance": {
                "is_halal": is_halal,
                "business_check": {
                    "failed": business_failed,
                    "found_keywords": found_keywords
                }
            },
            "technicals": {
                "per": sanitize_value(info.get('trailingPE'), "N/A"),
                "roe": sanitize_value(info.get('returnOnEquity', 0) * 100, "N/A"),
                "dividend_yield": sanitize_value(info.get('dividendYield', 0) * 100, 0)
            }
        }

        return jsonify({"results": [result]})

    except Exception as e:
        print(f"Erreur lors de l'analyse de {ticker_input}: {str(e)}")
        return jsonify({"error": "Erreur lors de l'analyse des données financières"}), 500