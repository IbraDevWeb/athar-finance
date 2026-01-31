from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd

# On définit le "Blueprint" (le module)
screening_bp = Blueprint('screening', __name__)

def analyze_stock(ticker):
    try:
        stock = yf.Ticker(ticker)
        
        # 1. Infos Rapides & Complètes
        fast_info = stock.fast_info
        full_info = stock.info
        
        # Nom et Prix
        name = full_info.get('longName', full_info.get('shortName', ticker))
        price = full_info.get('currentPrice', full_info.get('regularMarketPreviousClose', 0))
        if price == 0 and hasattr(fast_info, 'last_price'):
             price = fast_info.last_price

        sector = full_info.get('sector', 'Inconnu')
        industry = full_info.get('industry', 'Inconnu')
        summary = full_info.get('longBusinessSummary', '') or ''

        # 2. Données Techniques (PER, ROE, Dividendes)
        per = full_info.get('trailingPE')
        roe = full_info.get('returnOnEquity')
        div = full_info.get('dividendYield')

        technicals = {
            "current_price": price,
            "per": round(per, 2) if per else None,
            "roe": round(roe * 100, 2) if roe else None,
            "dividend_yield": round(div * 100, 2) if div else 0
        }

        # 3. Bilans
        balance = stock.balance_sheet
        if balance.empty:
            # Retour minimal pour indices/cryptos sans bilan
            return {
                "ticker": ticker, "name": name, "price": price, "sector": sector, "industry": industry,
                "technicals": technicals,
                "ratios": { "debt_ratio": 0, "cash_ratio": 0 },
                "compliance": { "is_halal": True, "business_check": { "failed": False, "found_keywords": [] } }
            }

        # Calculs Ratios (33%)
        mkt_cap = full_info.get('marketCap', 1) or 1
        debt = balance.loc['Total Debt'].iloc[0] if 'Total Debt' in balance.index else 0
        debt_ratio = (debt / mkt_cap) * 100

        cash = 0
        if 'Cash And Cash Equivalents' in balance.index:
            cash = balance.loc['Cash And Cash Equivalents'].iloc[0]
        elif 'Cash Financial' in balance.index:
            cash = balance.loc['Cash Financial'].iloc[0]
        cash_ratio = (cash / mkt_cap) * 100

        # 4. Filtre Business
        forbidden = ['alcohol', 'tobacco', 'gambling', 'casino', 'pork', 'music', 'bank', 'interest', 'insurance', 'defense']
        found = [w for w in forbidden if w in summary.lower()]
        
        is_halal = (debt_ratio < 33) and (cash_ratio < 33) and (len(found) == 0)

        return {
            "ticker": ticker,
            "name": name,
            "price": price,
            "sector": sector,
            "industry": industry,
            "technicals": technicals,
            "ratios": { "debt_ratio": round(debt_ratio, 2), "cash_ratio": round(cash_ratio, 2) },
            "compliance": { "is_halal": is_halal, "business_check": { "failed": len(found) > 0, "found_keywords": found } }
        }
    except Exception as e:
        print(f"Erreur sur {ticker}: {e}")
        return None

# La Route API (reliée au Blueprint)
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