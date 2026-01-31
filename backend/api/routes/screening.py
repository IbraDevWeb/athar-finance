from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np

screening_bp = Blueprint('screening', __name__)

def safe_get(data, keys, default=None):
    """Pour les dictionnaires classiques (info)"""
    for key in keys:
        if key in data and data[key] is not None:
            return data[key]
    return default

def get_fast_val(fast_info, key, default=None):
    """NOUVEAU : Pour l'objet FastInfo de Yahoo (Danone Fix)"""
    try:
        if hasattr(fast_info, key):
            val = getattr(fast_info, key)
            if val is not None:
                return val
    except:
        pass
    return default

def analyze_stock(ticker):
    try:
        stock = yf.Ticker(ticker)
        
        # 1. RECUPERATION DONNEES
        fast_info = stock.fast_info
        full_info = stock.info
        
        # A. NOM & PRIX
        name = safe_get(full_info, ['longName', 'shortName'], default=ticker)
        
        # Correction Prix : On utilise la nouvelle fonction get_fast_val
        price = get_fast_val(fast_info, 'last_price', 0)
        if price == 0:
            price = safe_get(full_info, ['currentPrice', 'regularMarketPreviousClose'], default=0)

        # B. SECTEUR & BUSINESS
        sector = safe_get(full_info, ['sector'], default='Inconnu')
        industry = safe_get(full_info, ['industry'], default='Inconnu')
        summary = safe_get(full_info, ['longBusinessSummary', 'description'], default='').lower()

        # C. DONNÉES TECHNIQUES
        raw_div = safe_get(full_info, ['dividendYield'], default=0)
        if raw_div > 2: raw_div = raw_div / 100 # Fix du 500%

        trailing_pe = safe_get(full_info, ['trailingPE'])
        forward_pe = safe_get(full_info, ['forwardPE'])
        pe_ratio = trailing_pe if (trailing_pe and trailing_pe < 200) else forward_pe

        roe = safe_get(full_info, ['returnOnEquity'], default=0)

        technicals = {
            "current_price": price,
            "per": round(pe_ratio, 2) if pe_ratio else "N/A",
            "roe": round(roe * 100, 2) if roe else "N/A",
            "dividend_yield": round(raw_div * 100, 2)
        }

        # D. ANALYSE BILAN
        balance = stock.balance_sheet
        
        # Fallback si pas de bilan
        if balance.empty:
            return {
                "ticker": ticker, "name": name, "price": price, 
                "sector": sector, "industry": industry,
                "technicals": technicals,
                "ratios": { "debt_ratio": 0, "cash_ratio": 0, "impure_ratio": 0 },
                "compliance": { "is_halal": True, "business_check": { "failed": False, "found_keywords": [] } }
            }

        # CORRECTION MARKET CAP (Cause du bug Danone)
        # On ne traite plus fast_info comme un dictionnaire
        mkt_cap = get_fast_val(fast_info, 'market_cap')
        if not mkt_cap:
             mkt_cap = safe_get(full_info, ['marketCap'], default=1)
        
        # Sécurité division par zéro
        if mkt_cap is None or mkt_cap == 0: mkt_cap = 1

        # Ratios
        debt = balance.loc['Total Debt'].iloc[0] if 'Total Debt' in balance.index else 0
        debt_ratio = (debt / mkt_cap) * 100

        cash = 0
        if 'Cash And Cash Equivalents' in balance.index:
            cash = balance.loc['Cash And Cash Equivalents'].iloc[0]
        elif 'Cash Financial' in balance.index:
            cash = balance.loc['Cash Financial'].iloc[0]
        cash_ratio = (cash / mkt_cap) * 100

        # E. FILTRE BUSINESS (Secteurs + Mots-clés)
        business_violation = False
        found_keywords = []

        # Listes
        islamic_whitelist = ['islamic', 'sharia', 'sukuk', 'rajhi']
        is_islamic = any(w in name.lower() for w in islamic_whitelist)

        forbidden_industries = ['Casinos', 'Tobacco', 'Beverages - Wineries', 'Beverages - Brewers', 'Aerospace & Defense']
        
        # Vérif Secteur
        if not is_islamic:
            if any(sec in industry for sec in forbidden_industries):
                business_violation = True
                found_keywords.append(f"Industrie: {industry}")
            if 'Bank' in industry and 'Islamic' not in industry:
                business_violation = True
                found_keywords.append("Secteur Bancaire")

        # Vérif Mots-clés
        universal_keywords = ['pork', 'alcohol', 'wine', 'spirit', 'champagne', 'gambling', 'casino', 'tobacco']
        financial_keywords = ['interest income', 'lending', 'insurance underwriting']
        is_financial = sector in ['Financial Services', 'Real Estate', 'Insurance']

        for word in universal_keywords:
            if word in summary:
                found_keywords.append(word)
                business_violation = True

        if is_financial and not is_islamic:
             for word in financial_keywords:
                if word in summary:
                    found_keywords.append(word)
                    business_violation = True

        # VERDICT
        is_halal = (debt_ratio < 33) and (cash_ratio < 33) and (not business_violation)

        return {
            "ticker": ticker,
            "name": name,
            "price": price,
            "sector": sector,
            "industry": industry,
            "technicals": technicals,
            "ratios": { 
                "debt_ratio": round(debt_ratio, 2), 
                "cash_ratio": round(cash_ratio, 2),
                "impure_ratio": 0 
            },
            "compliance": { 
                "is_halal": is_halal, 
                "business_check": { "failed": business_violation, "found_keywords": list(set(found_keywords)) } 
            }
        }
    except Exception as e:
        print(f"Erreur CRITIQUE sur {ticker}: {e}")
        return None # Le frontend affichera "Aucun résultat" proprement

@screening_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    tickers_raw = data.get('tickers', '')
    if not tickers_raw: return jsonify({"error": "No ticker provided"}), 400
    tickers = [t.strip().upper() for t in tickers_raw.split(',')]
    results = []
    for t in tickers:
        data = analyze_stock(t)
        if data: results.append(data)
    return jsonify({"results": results})