from flask import Blueprint, jsonify
import yfinance as yf

market_bp = Blueprint('market', __name__)

@market_bp.route('/live-prices', methods=['GET'])
def get_live_prices():
    # Sélection Sharia Compliant
    assets = {
        "SGLD.L": "Or Physique",
        "SSLV.L": "Argent Phys.",
        "ISDW.L": "World Islamic"
    }
    
    results = []
    try:
        # On récupère tout d'un coup pour la vitesse
        tickers = yf.Tickers(' '.join(assets.keys()))
        
        for symbol, name in assets.items():
            t = tickers.tickers[symbol]
            hist = t.history(period="2d") # Pour calculer la variation
            
            if len(hist) >= 2:
                price = hist['Close'].iloc[-1]
                prev_price = hist['Close'].iloc[-2]
                change = ((price - prev_price) / prev_price) * 100
            else:
                price = t.info.get('regularMarketPrice', 0)
                change = 0

            results.append({
                "symbol": symbol,
                "name": name,
                "price": round(price, 2),
                "change": round(change, 2),
                "currency": "USD" if "L" in symbol else "$"
            })
            
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500