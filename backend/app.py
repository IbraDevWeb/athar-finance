import os
from flask import Flask, jsonify
from flask_cors import CORS

# Importation des Blueprints
from api.routes.screening import screening_bp
from api.routes.news import news_bp
# [NOUVEAU] Importation du module de prix en direct
from api.routes.market import market_bp

def create_app():
    app = Flask(__name__)

    # --- CONFIGURATION DES CORS ---
    # Autorise ton frontend à communiquer avec l'API
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # --- ENREGISTREMENT DES BLUEPRINTS ---
    # Chaque module a son propre préfixe pour éviter les conflits
    app.register_blueprint(screening_bp, url_prefix='/api/screening')
    app.register_blueprint(news_bp, url_prefix='/api/news')
    # [NOUVEAU] Route pour le "Marché en Direct" de l'accueil
    app.register_blueprint(market_bp, url_prefix='/api/market')

    # --- ROUTE DE TEST (HEALTH CHECK) ---
    @app.route('/')
    def health_check():
        return jsonify({
            "status": "online",
            "message": "Athar API is running",
            "version": "1.1.0"
        }), 200

    return app

app = create_app()

if __name__ == "__main__":
    # Récupération du port défini par Render (ou 5000 par défaut)
    port = int(os.environ.get("PORT", 5000))
    # En production, debug est mis à False
    app.run(host='0.0.0.0', port=port, debug=False)