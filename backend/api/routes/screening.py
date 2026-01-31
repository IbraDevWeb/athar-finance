from flask import Blueprint, request, jsonify
import yfinance as yf

screening_bp = Blueprint('screening', __name__)

def analyze_stock(ticker):
    # Initialisation des variables par défaut (pour éviter les crashs)
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
        
        # --- 1. RÉCUPÉRATION ROBUSTE (INFO) ---
        # On ne compte QUE sur .info pour la stabilité (fast_info fait planter Danone parfois)
        info = stock.info
        
        # Si Yahoo ne renvoie rien (cas Danone buggé), on arrête là proprement
        if not info:
            print(f"⚠️ Pas d'info Yahoo pour {ticker}")
            return None

        # --- 2. DONNÉES DE BASE ---
        data["name"] = info.get('longName', info.get('shortName', ticker))
        data["sector"] = info.get('sector', 'Inconnu')
        data["industry"] = info.get('industry', 'Inconnu')
        
        # Prix : on cherche partout
        price = info.get('currentPrice') or info.get('regularMarketPreviousClose') or info.get('previousClose') or 0
        data["price"] = price
        data["technicals"]["current_price"] = price

        # --- 3. CORRECTION DIVIDENDES (THALÈS) ---
        # Yahoo renvoie parfois 0.03 (3%) ou 3.0 (3%). C'est le chaos.
        raw_div = info.get('dividendYield', 0)
        
        if raw_div is None:
            final_div = 0
        elif raw_div > 1:
            # Si > 1 (ex: 3.5), c'est déjà un pourcentage -> on garde 3.5
            # Sauf si c'est GÉANT (ex: 500 pour 5%), alors on divise
            if raw_div > 50: 
                final_div = raw_div / 100
            else:
                final_div = raw_div
        else:
            # Si <= 1 (ex: 0.03), c'est un ratio -> on multiplie par 100
            final_div = raw_div * 100
            
        data["technicals"]["dividend_yield"] = round(final_div, 2)

        # --- 4. RATIOS TECHNIQUES (PER / ROE) ---
        per = info.get('trailingPE') or info.get('forwardPE')
        data["technicals"]["per"] = round(per, 2) if per else "N/A"

        roe = info.get('returnOnEquity')
        data["technicals"]["roe"] = round(roe * 100, 2) if roe else "N/A"

        # --- 5. ANALYSE BILAN (DETTE & CASH) ---
        # On utilise des valeurs par défaut sûres si le bilan manque
        market_cap = info.get('marketCap', 1) # Eviter division par zero
        if market_cap is None or market_cap == 0: market_cap = 1

        balance = stock.balance_sheet
        
        total_debt = 0
        cash = 0

        if not balance.empty:
            # Dette
            if 'Total Debt' in balance.index:
                total_debt = balance.loc['Total Debt'].iloc[0]
            
            # Cash
            if 'Cash And Cash Equivalents' in balance.index:
                cash = balance.loc['Cash And Cash Equivalents'].iloc[0]
            elif 'Cash Financial' in balance.index:
                cash = balance.loc['Cash Financial'].iloc[0]

        # Calculs Ratios
        debt_ratio = (total_debt / market_cap) * 100
        cash_ratio = (cash / market_cap) * 100

        data["ratios"]["debt_ratio"] = round(debt_ratio, 2)
        data["ratios"]["cash_ratio"] = round(cash_ratio, 2)

        # --- 6. FILTRE ISLAMIQUE (SECTEUR & MOTS CLÉS) ---
        # On simplifie : liste noire stricte
        summary = (info.get('longBusinessSummary') or info.get('description') or "").lower()
        business_violation = False
        found_keywords = []

        # Exceptions (Banques Islamiques)
        is_islamic = 'islamic' in data["name"].lower() or 'rajhi' in data["name"].lower()

        # Liste Interdite
        forbidden_terms = [
            'alcohol', 'wine', 'spirit', 'champagne', 'brewery', # Alcool
            'pork', 'porcine', # Porc
            'casino', 'gambling', 'betting', # Jeux
            'tobacco', 'cigarette', # Tabac
            'defense systems', 'weapon', 'defense' # Armement
            'adult entertainment' # Pornographie
        ]
        
        # Finance (Sauf si islamique)
        if not is_islamic:
            forbidden_terms.extend(['interest income', 'insurance underwriting', 'lending'])
            # Si le secteur est explicitement banque/assurance
            if 'Bank' in data["industry"] or 'Insurance' in data["industry"]:
                 # Petite tolérance pour Aramco (Energy) qui n'est pas une banque
                 if data["sector"] not in ['Energy', 'Basic Materials', 'Technology']: 
                    business_violation = True
                    found_keywords.append(f"Secteur: {data['industry']}")

        # Scan du résumé
        for word in forbidden_terms:
            if word in summary:
                # Protection LVMH : Si le mot est trouvé, c'est haram
                business_violation = True
                found_keywords.append(word)

        data["compliance"]["business_check"]["failed"] = business_violation
        data["compliance"]["business_check"]["found_keywords"] = list(set(found_keywords))
        
        # Verdict Final
        data["compliance"]["is_halal"] = (debt_ratio < 33) and (cash_ratio < 33) and (not business_violation)

        return data

    except Exception as e:
        print(f"❌ Erreur sur {ticker}: {e}")
        # En cas d'erreur, on renvoie quand même les données partielles si on les a, sinon None
        return None

@screening_bp.route('/analyze', methods=['POST'])
def analyze():
    req_data = request.get_json()
    tickers_input = req_data.get('tickers', '')
    
    if not tickers_input:
        return jsonify({"error": "No ticker provided"}), 400
        
    tickers_list = [t.strip().upper() for t in tickers_input.split(',')]
    results = []
    
    for t in tickers_list:
        res = analyze_stock(t)
        if res:
            results.append(res)
            
    return jsonify({"results": results})