from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd

screening_bp = Blueprint('screening', __name__)

def sanitize_value(val, default=0, is_percent=False):
    """Nettoie et arrondit les valeurs financières."""
    if pd.isna(val) or val is None:
        return default
    
    # Si c'est un pourcentage (ex: 0.035 -> 3.5)
    if is_percent and isinstance(val, (int, float)):
        if -1 <= val <= 1: # Probablement un ratio décimal
            return round(val * 100, 2)
        return round(val, 2) # Déjà en format 1-100
        
    return round(val, 2) if isinstance(val, (int, float)) else val

@screening_bp.route('/analyze', methods=['POST'])
def analyze_ticker():
    data = request.json
    ticker_input = data.get('tickers', '').upper()
    
    if not ticker_input:
        return jsonify({"error": "Ticker manquant"}), 400

    try:
        stock = yf.Ticker(ticker_input)
        info = stock.info
        
        # --- CALCULS AAOIFI ---
        market_cap = info.get('marketCap', 0)
        total_debt = info.get('totalDebt', 0)
        total_cash = info.get('totalCash', 0)
        
        debt_ratio = (total_debt / market_cap * 100) if market_cap > 0 else 0
        cash_ratio = (total_cash / market_cap * 100) if market_cap > 0 else 0
        
        # --- SCREENER SECTORIEL ---
        banned = ['bank', 'insurance', 'casino', 'gambling', 'alcohol', 'brewery', 'tobacco', 'pork', 'defense', 'weapon']
        business_text = f"{info.get('sector', '')} {info.get('industry', '')} {info.get('longBusinessSummary', '')}".lower()
        found_keywords = [w for w in banned if w in business_text]
        
        # Verdict
        is_halal = len(found_keywords) == 0 and debt_ratio < 33 and cash_ratio < 33

        result = {
            "ticker": ticker_input,
            "name": info.get('longName', ticker_input),
            "price": info.get('currentPrice', info.get('regularMarketPrice', 0)),
            "sector": info.get('sector', 'N/A'),
            "industry": info.get('industry', 'N/A'),
            "ratios": {
                "debt_ratio": round(debt_ratio, 2),
                "cash_ratio": round(cash_ratio, 2)
            },
            "compliance": {
                "is_halal": is_halal,
                "business_check": {
                    "failed": len(found_keywords) > 0,
                    "found_keywords": found_keywords
                }
            },
            "technicals": {
                # Ici on utilise sanitize_value pour arrondir proprement
                "per": sanitize_value(info.get('trailingPE'), "N/A"),
                "roe": sanitize_value(info.get('returnOnEquity'), "N/A", is_percent=True),
                "dividend_yield": sanitize_value(info.get('dividendYield'), 0, is_percent=True)
            }
        }

        return jsonify({"results": [result]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500