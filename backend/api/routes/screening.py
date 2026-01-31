from flask import Blueprint, request, jsonify
import yfinance as yf
import math

screening_bp = Blueprint('screening', __name__)

# --- FONCTION ANTI-CRASH (Le Secret) ---
def clean_nan(value):
    """Remplace les NaN et Infinite par 0 ou None pour éviter l'erreur 500"""
    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return 0
    return value

def sanitize_result(data):
    """Nettoie tout le dictionnaire avant l'envoi"""
    if isinstance(data, dict):
        return {k: sanitize_result(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_result(v) for v in data]
    else:
        return clean_nan(data)

# --- ANALYSE ---
def analyze_stock(ticker):
    # Modèle vide par défaut
    data = {
        "ticker": ticker,
        "name": ticker,
        "price": 0,
        "sector": "Inconnu",
        "industry": "Inconnu",
        "technicals": {"current_price": 0, "per": "N/A", "roe": "N/A", "dividend_yield": 0},
        "ratios": {"debt_ratio": 0, "cash_ratio": 0, "impure_ratio": 0},
        "compliance": {"is_halal": False, "business_check": {"failed": False, "found_keywords": []}}
    }

    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Si Yahoo ne répond rien (fréquent sur Euronext), on renvoie le modèle vide mais propre
        if not info:
            print(f"⚠️ Info vide pour {ticker}")
            return data 

        # 1. INFO DE BASE
        data["name"] = info.get('longName', info.get('shortName', ticker))
        data["sector"] = info.get('sector', 'Inconnu')
        data["industry"] = info.get('industry', 'Inconnu')
        
        # Prix (gestion de tous les cas possibles)
        price = info.get('currentPrice') or info.get('regularMarketPreviousClose') or info.get('previousClose') or 0
        data["price"] = price
        data["technicals"]["current_price"] = price

        # 2. DIVIDENDES (Logique blindée)
        raw_div = info.get('dividendYield', 0)
        if raw_div is None: 
            final_div = 0
        elif raw_div > 100: # Ex: 500 pour 5% -> on divise
            final_div = raw_div / 100
        elif raw_div > 1: # Ex: 3.5 pour 3.5% -> on garde
            final_div = raw_div
        else: # Ex: 0.03 pour 3% -> on multiplie
            final_div = raw_div * 100
        data["technicals"]["dividend_yield"] = round(final_div, 2)

        # 3. PER & ROE
        per = info.get('trailingPE') or info.get('forwardPE')
        data["technicals"]["per"] = round(per, 2) if (per and not math.isnan(per)) else "N/A"

        roe = info.get('returnOnEquity')
        data["technicals"]["roe"] = round(roe * 100, 2) if (roe and not math.isnan(roe)) else "N/A"

        # 4. BILAN (Dette & Cash)
        mkt_cap = info.get('marketCap', 1) or 1
        
        balance = stock.balance_sheet
        total_debt = 0
        cash = 0

        if not balance.empty:
            # On utilise .get() sur les séries pour éviter les crashs si la ligne manque
            try:
                if 'Total Debt' in balance.index:
                    val = balance.loc['Total Debt'].iloc[0]
                    total_debt = val if not math.isnan(val) else 0
                
                if 'Cash And Cash Equivalents' in balance.index:
                    val = balance.loc['Cash And Cash Equivalents'].iloc[0]
                    cash = val if not math.isnan(val) else 0
                elif 'Cash Financial' in balance.index:
                    val = balance.loc['Cash Financial'].iloc[0]
                    cash = val if not math.isnan(val) else 0
            except Exception as e:
                print(f"Erreur lecture bilan {ticker}: {e}")

        # Calcul sécurisé
        debt_ratio = (total_debt / mkt_cap) * 100
        cash_ratio = (cash / mkt_cap) * 100

        data["ratios"]["debt_ratio"] = round(debt_ratio, 2)
        data["ratios"]["cash_ratio"] = round(cash_ratio, 2)

        # 5. VERDICT ISLAMIQUE
        summary = (info.get('longBusinessSummary') or info.get('description') or "").lower()
        
        # Liste noire
        forbidden = ['alcohol', 'wine', 'spirit', 'champagne', 'brewery', 'pork', 'casino', 'gambling', 'tobacco', 'defense systems', 'weapon', 'adult entertainment']
        finance_keywords = ['interest income', 'insurance underwriting', 'lending']
        
        is_islamic = 'islamic' in data["name"].lower() or 'rajhi' in data["name"].lower()
        business_violation = False
        found = []

        # Scan universel
        for word in forbidden:
            if word in summary:
                found.append(word)
                business_violation = True
        
        # Scan finance (si pas islamique et pas "Energy" comme Aramco/Total)
        if not is_islamic and data["sector"] not in ['Energy', 'Basic Materials', 'Utilities']:
            if 'Bank' in data["industry"] or 'Insurance' in data["industry"]:
                found.append(f"Secteur: {data['industry']}")
                business_violation = True
            for word in finance_keywords:
                if word in summary:
                    found.append(word)
                    business_violation = True

        data["compliance"]["business_check"]["failed"] = business_violation
        data["compliance"]["business_check"]["found_keywords"] = list(set(found))
        data["compliance"]["is_halal"] = (debt_ratio < 33) and (cash_ratio < 33) and (not business_violation)

        # PASSAGE FINAL DU NETTOYEUR (Crucial pour éviter l'erreur 500)
        return sanitize_result(data)

    except Exception as e:
        print(f"❌ CRASH TOTAL sur {ticker}: {e}")
        return None

@screening_bp.route('/analyze', methods=['POST'])
def analyze():
    req = request.get_json()
    tickers = [t.strip().upper() for t in req.get('tickers', '').split(',') if t.strip()]
    
    results = []
    for t in tickers:
        res = analyze_stock(t)
        if res:
            results.append(res)
            
    return jsonify({"results": results})