import os
import yfinance as yf
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURATION DU SERVEUR ---
app = Flask(__name__)
# On autorise tout le monde (*)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- LOGIQUE MÉTIER ---
def analyze_stock(ticker):
    try:
        stock = yf.Ticker(ticker)
        
        # 1. Récupération des infos
        # On essaie d'abord fast_info pour la rapidité
        fast_info = stock.fast_info
        # On récupère info complet pour les ratios (PER, ROE...)
        full_info = stock.info
        
        # Récupération sécurisée des données de base
        name = full_info.get('longName', full_info.get('shortName', ticker))
        price = full_info.get('currentPrice', full_info.get('regularMarketPreviousClose', 0))
        if price == 0 and hasattr(fast_info, 'last_price'):
             price = fast_info.last_price

        sector = full_info.get('sector', 'Inconnu')
        industry = full_info.get('industry', 'Inconnu')
        summary = full_info.get('longBusinessSummary', '') or ''
        
        # 2. Récupération des FONDAMENTAUX (PER, ROE, DIV)
        # C'est ce bloc qu'il manquait !
        per = full_info.get('trailingPE')
        roe = full_info.get('returnOnEquity')
        div = full_info.get('dividendYield')

        technicals = {
            "current_price": price, # Important pour l'accueil
            "per": round(per, 2) if per else None,
            "roe": round(roe * 100, 2) if roe else None,
            "dividend_yield": round(div * 100, 2) if div else 0
        }

        # 3. Bilans (Dette & Cash)
        balance = stock.balance_sheet
        if balance.empty: 
            # Si pas de bilan, on renvoie quand même les infos techniques (pour les indices/cryptos)
            return {
                "ticker": ticker,
                "name": name,
                "price": price,
                "sector": sector,
                "industry": industry,
                "technicals": technicals, # On inclut les datas ici
                "ratios": { "debt_ratio": 0, "cash_ratio": 0 },
                "compliance": { "is_halal": True, "business_check": { "failed": False, "found_keywords": [] } }
            }

        # Calcul Dette
        mkt_cap = full_info.get('marketCap', 1) or 1
        debt = balance.loc['Total Debt'].iloc[0] if 'Total Debt' in balance.index else 0
        debt_ratio = (debt / mkt_cap) * 100

        # Calcul Cash
        cash = 0
        if 'Cash And Cash Equivalents' in balance.index:
            cash = balance.loc['Cash And Cash Equivalents'].iloc[0]
        elif 'Cash Financial' in balance.index:
            cash = balance.loc['Cash Financial'].iloc[0]
        cash_ratio = (cash / mkt_cap) * 100

        # 4. ACTIVITÉ (Mots-clés)
        forbidden = ['alcohol', 'tobacco', 'gambling', 'casino', 'pork', 'music', 'bank', 'interest', 'insurance', 'defense']
        found = [w for w in forbidden if w in summary.lower()]
        
        # VERDICT FINAL
        is_halal = (debt_ratio < 33) and (cash_ratio < 33) and (len(found) == 0)

        return {
            "ticker": ticker,
            "name": name,
            "price": price,
            "sector": sector,
            "industry": industry,
            "technicals": technicals, # 👈 C'est ici que le Frontend va chercher les infos manquantes
            "ratios": { "debt_ratio": round(debt_ratio, 2), "cash_ratio": round(cash_ratio, 2) },
            "compliance": { "is_halal": is_halal, "business_check": { "failed": len(found) > 0, "found_keywords": found } }
        }
    except Exception as e:
        print(f"Erreur sur {ticker}: {e}")
        return None

# --- ROUTES ---

@app.route('/')
def home():
    return jsonify({"status": "online", "mode": "monolith_v2"})

@app.route('/api/screening/analyze', methods=['POST'])
def analyze_route():
    data = request.get_json()
    tickers_raw = data.get('tickers', '')
    
    if not tickers_raw:
        return jsonify({"error": "Pas de ticker envoyé"}), 400
        
    tickers = [t.strip().upper() for t in tickers_raw.split(',')]
    results = []
    
    for t in tickers:
        data = analyze_stock(t)
        if data:
            results.append(data)
            
    return jsonify({"results": results})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)