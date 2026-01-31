from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd

screening_bp = Blueprint('screening', __name__)

def analyze_stock(ticker):
    try:
        stock = yf.Ticker(ticker)
        
        # 1. Infos
        fast_info = stock.fast_info
        full_info = stock.info
        
        # Nom et Prix
        name = full_info.get('longName', full_info.get('shortName', ticker))
        price = full_info.get('currentPrice', full_info.get('regularMarketPreviousClose', 0))
        if price == 0 and hasattr(fast_info, 'last_price'):
             price = fast_info.last_price

        # --- NETTOYAGE DES DONNÉES ---
        sector = full_info.get('sector', 'Inconnu')
        industry = full_info.get('industry', 'Inconnu')
        summary = (full_info.get('longBusinessSummary', '') or '').lower()
        
        # Correction Bug Dividende (Si Yahoo envoie 5.08 au lieu de 0.0508)
        raw_div = full_info.get('dividendYield', 0)
        if raw_div and raw_div > 5: # Si > 500%, c'est surement déjà un pourcentage
             raw_div = raw_div / 100
        
        technicals = {
            "current_price": price,
            "per": round(full_info.get('trailingPE', 0), 2) if full_info.get('trailingPE') else None,
            "roe": round((full_info.get('returnOnEquity', 0) or 0) * 100, 2),
            "dividend_yield": round((raw_div or 0) * 100, 2)
        }

        # --- ANALYSE BUSINESS (INTELLIGENTE) ---
        business_violation = False
        found_keywords = []

        # A. LISTE BLANCHE (Exceptions Islamiques)
        # Si le nom ou le résumé contient ces mots, on est plus tolérant sur "Bank"
        islamic_whitelist = ['islamic', 'sharia', 'sukuk', 'rajhi', 'alinma', 'takaful']
        is_explicitly_islamic = any(w in name.lower() or w in summary for w in islamic_whitelist)

        # B. LISTE NOIRE SECTORIELLE (Haram par nature)
        # On vérifie l'industrie fournie par Yahoo
        forbidden_industries = [
            'Tobacco', 'Gambling', 'Casinos', 'Beverages - Wineries', 
            'Beverages - Brewers', 'Aerospace & Defense'
        ]
        
        # Si c'est une banque conventionnelle (et pas islamique)
        if 'Bank' in industry and not is_explicitly_islamic:
            business_violation = True
            found_keywords.append(f"Secteur Bancaire ({industry})")

        if any(ind in industry for ind in forbidden_industries):
             business_violation = True
             found_keywords.append(f"Secteur Interdit ({industry})")

        # C. MOTS-CLÉS (Raffinés)
        # On ne cherche "Insurance" QUE si c'est une financière
        financial_sector = sector in ['Financial Services', 'Real Estate']
        
        keywords_generic = [
            'alcohol', 'tobacco', 'gambling', 'casino', 'pork', 'adult entertainment', 
            'pornography', 'weapon', 'defense systems',
            'wine', 'spirit', 'liquor', 'beer', 'brewery', 'distill', 'champagne', 'cognac' # Pour LVMH
        ]
        
        # On ajoute les mots financiers SEULEMENT si ce n'est pas une banque islamique connue
        if not is_explicitly_islamic:
            keywords_generic.extend(['interest income', 'conventional bank'])
            if financial_sector:
                keywords_generic.extend(['insurance', 'lending', 'borrowing'])

        # Recherche dans le résumé
        for word in keywords_generic:
            if word in summary:
                # Petite sécurité : éviter les faux positifs comme "anti-money laundering" pour "lending"
                # Mais pour l'instant on reste simple
                found_keywords.append(word)
                business_violation = True

        # --- RATIOS FINANCIERS ---
        balance = stock.balance_sheet
        if balance.empty:
            # Pas de bilan (Crypto/Indices) -> On se base sur le business uniquement
             return {
                "ticker": ticker, "name": name, "price": price, "sector": sector, "industry": industry,
                "technicals": technicals,
                "ratios": { "debt_ratio": 0, "cash_ratio": 0 },
                "compliance": { "is_halal": not business_violation, "business_check": { "failed": business_violation, "found_keywords": found_keywords } }
            }

        mkt_cap = full_info.get('marketCap', 1) or 1
        debt = balance.loc['Total Debt'].iloc[0] if 'Total Debt' in balance.index else 0
        debt_ratio = (debt / mkt_cap) * 100

        cash = 0
        if 'Cash And Cash Equivalents' in balance.index:
            cash = balance.loc['Cash And Cash Equivalents'].iloc[0]
        elif 'Cash Financial' in balance.index:
            cash = balance.loc['Cash Financial'].iloc[0]
        cash_ratio = (cash / mkt_cap) * 100

        # VERDICT FINAL
        is_halal = (debt_ratio < 33) and (cash_ratio < 33) and (not business_violation)

        return {
            "ticker": ticker,
            "name": name,
            "price": price,
            "sector": sector,
            "industry": industry,
            "technicals": technicals,
            "ratios": { "debt_ratio": round(debt_ratio, 2), "cash_ratio": round(cash_ratio, 2) },
            "compliance": { 
                "is_halal": is_halal, 
                "business_check": { "failed": business_violation, "found_keywords": found_keywords } 
            }
        }
    except Exception as e:
        print(f"Erreur sur {ticker}: {e}")
        return None

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