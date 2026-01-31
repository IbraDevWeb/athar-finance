from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
import requests_cache
from datetime import timedelta

screening_bp = Blueprint('screening', __name__)

# --- CONFIGURATION DU CACHE (CORRIGÉ POUR RENDER) ---
# On utilise backend='memory' pour stocker le cache en RAM.
# Cela évite l'erreur 500 car Render interdit souvent l'écriture de fichiers (.sqlite)
session = requests_cache.CachedSession('yfinance_cache', backend='memory', expire_after=timedelta(days=1))

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

# --- ROUTE 1 : ANALYSE ACTION ---
@screening_bp.route('/analyze', methods=['POST'])
def analyze_ticker():
    data = request.json
    ticker_input = data.get('tickers', '').upper()
    
    if not ticker_input:
        return jsonify({"error": "Ticker manquant"}), 400

    try:
        # On passe la session de cache ici
        stock = yf.Ticker(ticker_input, session=session)
        info = stock.info
        
        # --- CALCULS AAOIFI ---
        market_cap = info.get('marketCap', 0)
        total_debt = info.get('totalDebt', 0)
        total_cash = info.get('totalCash', 0)
        
        debt_ratio = (total_debt / market_cap * 100) if market_cap > 0 else 0
        cash_ratio = (total_cash / market_cap * 100) if market_cap > 0 else 0
        
        # --- SCREENER SECTORIEL ---
        banned = [
            'bank', 'insurance', 'reinsurance', 'mortgage', 'lending', 'interest',
            'casino', 'gambling', 'betting', 'lottery', 'adult entertainment', 'pornography', 'music',
            'alcohol', 'liquor', 'brewery', 'distillery', 'wine', 'tobacco', 'cigarette', 'cigar',
            'pork', 'bacon', 'ham', 'swine',
            'defense', 'military', 'weapon', 'armament', 'missile'
        ]
        
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
                "per": sanitize_value(info.get('trailingPE'), "N/A"),
                "roe": sanitize_value(info.get('returnOnEquity'), "N/A", is_percent=True),
                "dividend_yield": sanitize_value(info.get('dividendYield'), 0, is_percent=True)
            }
        }

        return jsonify({"results": [result]})

    except Exception as e:
        print(f"Erreur Analyse: {e}")
        return jsonify({"error": str(e)}), 500


# --- ROUTE 2 : ETF X-RAY ---
@screening_bp.route('/etf-scan', methods=['POST'])
def scan_etf():
    data = request.json
    ticker_input = data.get('ticker', '').upper()
    
    if not ticker_input:
        return jsonify({"error": "Ticker manquant"}), 400

    try:
        # On passe la session de cache ici aussi
        etf = yf.Ticker(ticker_input, session=session)
        info = etf.info
        
        # 1. Récupération des Holdings (Composition)
        try:
            holdings_df = etf.holdings
            if holdings_df is not None and not holdings_df.empty:
                top_holdings = []
                for index, row in holdings_df.head(10).iterrows():
                    name = index if isinstance(index, str) else "Inconnu"
                    if 'Name' in holdings_df.columns:
                        name = row['Name']
                    
                    percent = row.get('% Assets', row.get('Weight', 0))
                    if percent < 1: percent = percent * 100
                    
                    top_holdings.append({
                        "name": str(name),
                        "percent": round(float(percent), 2)
                    })
            else:
                top_holdings = []
        except:
            top_holdings = []

        # 2. Répartition Sectorielle
        sectors = []
        raw_sectors = info.get('sectorWeightings', [])
        if raw_sectors:
            for s in raw_sectors:
                for k, v in s.items():
                    sectors.append({"name": k, "value": round(v * 100, 2)})
        
        # Fallback
        if not sectors and info.get('category'):
            sectors = [{"name": info.get('category'), "value": 100}]

        result = {
            "ticker": ticker_input,
            "name": info.get('longName', ticker_input),
            "description": info.get('longBusinessSummary', "Pas de description disponible."),
            "holdings": top_holdings,
            "sectors": sectors,
            "top_region": "Global"
        }

        return jsonify(result)

    except Exception as e:
        print(f"Erreur ETF: {e}")
        return jsonify({"error": "Impossible d'analyser cet ETF ou données indisponibles."}), 500