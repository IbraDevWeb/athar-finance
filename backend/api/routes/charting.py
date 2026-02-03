from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd

charting_bp = Blueprint('charting', __name__)

@charting_bp.route('/history', methods=['POST'])
def get_stock_history():
    data = request.json
    ticker_symbol = data.get('ticker', '').upper()
    period = data.get('period', '1y') # 1d, 5d, 1mo, 6mo, 1y, 5y, max
    
    if not ticker_symbol:
        return jsonify({"error": "Ticker manquant"}), 400

    try:
        # Configuration de l'intervalle selon la période
        interval = "1d"
        if period in ["1d", "5d"]:
            interval = "15m" # Plus précis pour le court terme
        
        stock = yf.Ticker(ticker_symbol)
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            return jsonify({"error": "Aucune donnée disponible"}), 404

        # Formatage des données pour le graphique
        chart_data = []
        for date, row in hist.iterrows():
            chart_data.append({
                # Convertir la date en string (ISO format)
                "date": date.strftime('%Y-%m-%d %H:%M') if period in ["1d", "5d"] else date.strftime('%Y-%m-%d'),
                "price": round(row['Close'], 2),
                "volume": int(row['Volume']),
                "open": round(row['Open'], 2),
                "high": round(row['High'], 2),
                "low": round(row['Low'], 2)
            })

        # Récupération infos temps réel
        info = stock.info
        current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
        previous_close = info.get('regularMarketPreviousClose', 0)
        change_p = 0
        if previous_close:
            change_p = round(((current_price - previous_close) / previous_close) * 100, 2)

        return jsonify({
            "ticker": ticker_symbol,
            "name": info.get('longName', ticker_symbol),
            "current_price": current_price,
            "change_p": change_p,
            "currency": info.get('currency', 'USD'),
            "history": chart_data
        })

    except Exception as e:
        print(f"Erreur Charting: {e}")
        return jsonify({"error": str(e)}), 500