from flask import Blueprint, jsonify
import yfinance as yf
from datetime import datetime
import logging

news_bp = Blueprint('news', __name__)

def get_news_for_ticker(ticker_symbol):
    try:
        ticker = yf.Ticker(ticker_symbol)
        # ticker.news est une liste de dictionnaires
        return ticker.news if ticker.news else []
    except Exception as e:
        logging.error(f"Erreur News pour {ticker_symbol}: {e}")
        return []

@news_bp.route('/latest', methods=['GET'])
def get_market_news():
    assets = {
        "GC=F": "Or",
        "SI=F": "Argent", 
        "BTC-USD": "Bitcoin", 
        "^GSPC": "S&P 500"
    }
    
    all_news = []
    seen_titles = set()

    for symbol, label in assets.items():
        news_items = get_news_for_ticker(symbol)
        
        for item in news_items:
            title = item.get('title')
            if title and title not in seen_titles:
                seen_titles.add(title)
                
                publish_time = item.get('providerPublishTime', 0)
                date_obj = datetime.fromtimestamp(publish_time)
                
                # Récupération de l'image si elle existe
                thumbnail = item.get('thumbnail', {})
                img_url = None
                if thumbnail and 'resolutions' in thumbnail:
                    # On prend la résolution la plus haute disponible
                    img_url = thumbnail['resolutions'][0].get('url')

                all_news.append({
                    "title": title,
                    "publisher": item.get('publisher'),
                    "link": item.get('link'),
                    "date": date_obj.strftime("%d/%m %H:%M"),
                    "timestamp": publish_time,
                    "asset_label": label,
                    "thumbnail": img_url,
                    # Certains providers donnent un petit résumé
                    "summary": item.get('summary', '') 
                })

    # Tri par plus récent
    all_news.sort(key=lambda x: x['timestamp'], reverse=True)

    return jsonify(all_news[:12])