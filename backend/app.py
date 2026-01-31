import os
import yfinance as yf
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- CONFIGURATION DU SERVEUR ---
app = Flask(__name__)
# On autorise tout le monde (*) pour régler définitivement le CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# --- LOGIQUE MÉTIER (Directement ici, plus de problèmes d'import) ---
def analyze_stock(ticker):
    try:
        stock = yf.Ticker(ticker)
        # On force la récupération rapide
        info = stock.fast_info 
        # Fallback sur info classique si besoin
        full_info = stock.info
        
        # Récupération sécurisée des données
        name = full_info.get('longName', ticker)
        price = full_info.get('currentPrice', full_info.get('regularMarketPreviousClose', 0))
        sector = full_info.get('sector', 'Unknown')
        industry = full_info.get('industry', 'Unknown')
        summary = full_info.get('longBusinessSummary', '') or ''
        
        # Bilans
        balance = stock.balance_sheet
        if balance.empty: return None

        # 1. DETTE
        mkt_cap = full_info.get('marketCap', 1) or 1
        debt = balance.loc['Total Debt'].iloc[0] if 'Total Debt' in balance.index else 0
        debt_ratio = (debt / mkt_cap) * 100

        # 2. CASH
        cash = 0
        if 'Cash And Cash Equivalents' in balance.index:
            cash = balance.loc['Cash And Cash Equivalents'].iloc[0]
        elif 'Cash Financial' in balance.index: # Pour les banques/holdings
            cash = balance.loc['Cash Financial'].iloc[0]
        cash_ratio = (cash / mkt_cap) * 100

        # 3. ACTIVITÉ (Mots-clés)
        forbidden = ['alcohol', 'tobacco', 'gambling', 'casino', 'pork', 'music', 'bank', 'interest', 'insurance', 'defense']
        found = [w for w in forbidden if w in summary.lower()]
        
        # VERDICT
        is_halal = (debt_ratio < 33) and (cash_ratio < 33) and (len(found) == 0)

        return {
            "ticker": ticker,
            "name": name,
            "price": price,
            "sector": sector,
            "industry": industry,
            "ratios": { "debt_ratio": round(debt_ratio, 2), "cash_ratio": round(cash_ratio, 2) },
            "compliance": { "is_halal": is_halal, "business_check": { "failed": len(found) > 0, "found_keywords": found } }
        }
    except Exception as e:
        print(f"Erreur sur {ticker}: {e}")
        return None

# --- LES ROUTES (Endpoints) ---

@app.route('/')
def home():
    return jsonify({"status": "online", "mode": "monolith"})

# La route exacte que ton Frontend appelle
@app.route('/api/screening/analyze', methods=['POST'])
def analyze_route():
    data = request.get_json()
    tickers_raw = data.get('tickers', '')
    
    if not tickers_raw:
        return jsonify({"error": "Pas de ticker envoyé"}), 400
        
    # Nettoyage et liste
    tickers = [t.strip().upper() for t in tickers_raw.split(',')]
    results = []
    
    for t in tickers:
        data = analyze_stock(t)
        if data:
            results.append(data)
            
    return jsonify({"results": results})

# --- LANCEMENT ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)