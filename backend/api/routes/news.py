from flask import Blueprint, jsonify
import yfinance as yf
from datetime import datetime

news_bp = Blueprint('news', __name__)

def get_news_for_ticker(ticker_symbol):
    try:
        ticker = yf.Ticker(ticker_symbol)
        news = ticker.news
        return news if news else []
    except:
        return []

@news_bp.route('/latest', methods=['GET'])
def get_market_news():
    # On surveille les actifs majeurs qui font bouger le marché
    # GC=F (Or), SI=F (Argent), BTC-USD (Bitcoin), ^GSPC (S&P 500)
    assets = ["GC=F", "SI=F", "BTC-USD", "^GSPC"]
    
    all_news = []
    seen_titles = set()

    for asset in assets:
        news_items = get_news_for_ticker(asset)
        for item in news_items:
            title = item.get('title')
            # Éviter les doublons (une même news peut apparaître sur plusieurs actifs)
            if title and title not in seen_titles:
                seen_titles.add(title)
                
                # Formatage de la date (timestamp vers lisible)
                publish_time = item.get('providerPublishTime', 0)
                date_obj = datetime.fromtimestamp(publish_time)
                
                all_news.append({
                    "title": title,
                    "publisher": item.get('publisher'),
                    "link": item.get('link'),
                    "date": date_obj.strftime("%d/%m %H:%M"),
                    "timestamp": publish_time,
                    "related": asset # Pour savoir de quoi ça parle
                })

    # Trier par date (du plus récent au plus ancien)
    all_news.sort(key=lambda x: x['timestamp'], reverse=True)

    # On garde les 10 dernières news les plus pertinentes
    return jsonify(all_news[:12])