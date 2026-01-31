from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np

# On définit le module
screening_bp = Blueprint('screening', __name__)

def safe_get(data, keys, default=None):
    """Fonction utilitaire pour chercher une info dans plusieurs clés possibles"""
    for key in keys:
        if key in data and data[key] is not None:
            return data[key]
    return default

def analyze_stock(ticker):
    try:
        stock = yf.Ticker(ticker)
        
        # 1. RECUPERATION DES DONNEES (Double Source)
        # fast_info est plus rapide et souvent plus juste pour le prix/marketcap
        fast_info = stock.fast_info
        full_info = stock.info
        
        # --- A. DONNÉES DE BASE & PRIX ---
        name = safe_get(full_info, ['longName', 'shortName'], default=ticker)
        
        # Priorité à fast_info pour le prix (Temps réel)
        price = safe_get(fast_info, ['last_price'], default=0)
        if price == 0:
            price = safe_get(full_info, ['currentPrice', 'regularMarketPreviousClose'], default=0)

        sector = safe_get(full_info, ['sector'], default='Inconnu')
        industry = safe_get(full_info, ['industry'], default='Inconnu')
        summary = safe_get(full_info, ['longBusinessSummary', 'description'], default='').lower()

        # --- B. DONNÉES TECHNIQUES (Correction des Anomalies) ---
        
        # 1. Dividende : Correction du bug "500%" vs "5%"
        raw_div = safe_get(full_info, ['dividendYield'], default=0)
        if raw_div > 2: # Si > 200%, c'est que Yahoo a envoyé le chiffre brut (ex: 5.08)
            raw_div = raw_div / 100
        
        # 2. PER (Price Earning Ratio) : Lissage des extrêmes
        # Si le PER Trailing (passé) est aberrant (>200) ou nul, on prend le Forward (futur)
        trailing_pe = safe_get(full_info, ['trailingPE'])
        forward_pe = safe_get(full_info, ['forwardPE'])
        
        pe_ratio = trailing_pe
        if trailing_pe is None or trailing_pe > 200:
            if forward_pe is not None:
                pe_ratio = forward_pe
        
        # 3. ROE (Rentabilité)
        roe = safe_get(full_info, ['returnOnEquity'], default=0)

        technicals = {
            "current_price": price,
            "per": round(pe_ratio, 2) if pe_ratio else "N/A",
            "roe": round(roe * 100, 2) if roe else "N/A",
            "dividend_yield": round(raw_div * 100, 2)
        }

        # --- C. ANALYSE BILANCIELLE (AAOIFI) ---
        balance = stock.balance_sheet
        
        # Fallback : Si pas de bilan (Crypto/ETF/Indices), on renvoie un résultat partiel
        if balance.empty:
            return {
                "ticker": ticker, "name": name, "price": price, 
                "sector": sector, "industry": industry,
                "technicals": technicals,
                "ratios": { "debt_ratio": 0, "cash_ratio": 0, "impure_ratio": 0 },
                "compliance": { "is_halal": True, "business_check": { "failed": False, "found_keywords": [] } }
            }

        # Market Cap (Priorité fast_info pour précision)
        mkt_cap = safe_get(fast_info, ['market_cap'])
        if not mkt_cap:
             mkt_cap = safe_get(full_info, ['marketCap'], default=1)
        
        # 1. DETTE (Total Debt / Market Cap)
        debt = 0
        if 'Total Debt' in balance.index:
            debt = balance.loc['Total Debt'].iloc[0]
        debt_ratio = (debt / mkt_cap) * 100

        # 2. CASH (Cash + Short Term Investments / Market Cap)
        cash = 0
        if 'Cash And Cash Equivalents' in balance.index:
            cash = balance.loc['Cash And Cash Equivalents'].iloc[0]
        elif 'Cash Financial' in balance.index: # Banques/Financières
            cash = balance.loc['Cash Financial'].iloc[0]
        
        # On essaie d'ajouter les investissements court terme si dispo
        if 'Other Short Term Investments' in balance.index:
             cash += balance.loc['Other Short Term Investments'].iloc[0]
             
        cash_ratio = (cash / mkt_cap) * 100

        # --- D. FILTRE BUSINESS INTELLIGENT ---
        business_violation = False
        found_keywords = []

        # 1. LISTE BLANCHE (Immunité Islamique)
        # Si c'est une banque islamique reconnue, on ignore le mot "Bank"
        islamic_whitelist = ['islamic', 'sharia', 'sukuk', 'rajhi', 'alinma', 'boubyan', 'meeza']
        is_islamic_entity = any(w in name.lower() for w in islamic_whitelist)

        # 2. LISTE NOIRE SECTORIELLE (Haram par nature)
        # On rejette directement selon le secteur, c'est plus fiable que les mots-clés
        forbidden_sectors = ['Gambling', 'Tobacco', 'Alcoholic Beverages', 'Defense & Aerospace']
        forbidden_industries = ['Casinos', 'Tobacco', 'Beverages - Wineries', 'Beverages - Brewers', 'Aerospace & Defense']
        
        if not is_islamic_entity:
            if any(sec in industry for sec in forbidden_industries):
                business_violation = True
                found_keywords.append(f"Industrie Interdite ({industry})")
            
            # Banques conventionnelles
            if 'Bank' in industry and 'Islamic' not in industry:
                business_violation = True
                found_keywords.append(f"Services Bancaires ({industry})")

        # 3. ANALYSE MOTS-CLÉS CONTEXTUELLE
        # On ne cherche "Assurance" QUE si l'entreprise est dans la finance.
        # Aramco (Energie) ne sera plus flaggée pour avoir des assurances.
        is_financial_sector = sector in ['Financial Services', 'Real Estate', 'Insurance']
        
        # Mots-clés universels (Haram partout)
        universal_keywords = [
            'pork', 'porcine', 'alcohol', 'liquor', 'wine', 'spirit', 'champagne', 'cognac', 'brewery', 
            'gambling', 'casino', 'betting', 'adult entertainment', 'pornography', 'tobacco', 'cigarette'
        ]
        
        # Mots-clés financiers (Uniquement si secteur financier ET pas islamique)
        financial_keywords = ['interest income', 'lending', 'borrowing', 'insurance underwriting']

        # Scan universel
        for word in universal_keywords:
            if word in summary:
                # Petite sécurité pour LVMH : on vérifie que ce n'est pas une phrase type "alcohol free"
                found_keywords.append(word)
                business_violation = True

        # Scan financier conditionnel
        if is_financial_sector and not is_islamic_entity:
             for word in financial_keywords:
                if word in summary:
                    found_keywords.append(word)
                    business_violation = True

        # VERDICT FINAL
        # Ratios < 33% (AAOIFI) ET Pas d'activité Haram
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
                # On met -1 ou 0 pour dire "Check manuel" pour l'instant
                "impure_ratio": 0 
            },
            "compliance": { 
                "is_halal": is_halal, 
                "business_check": { 
                    "failed": business_violation, 
                    "found_keywords": list(set(found_keywords)) # Dédoublonnage
                } 
            }
        }
    except Exception as e:
        print(f"Erreur CRITIQUE sur {ticker}: {e}")
        return None

# La Route API
@screening_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    tickers_raw = data.get('tickers', '')
    
    if not tickers_raw:
        return jsonify({"error": "No ticker provided"}), 400
        
    tickers = [t.strip().upper() for t in tickers_raw.split(',')]
    results = []
    
    for t in tickers:
        data = analyze_stock(t)
        if data:
            results.append(data)
            
    return jsonify({"results": results})