import os
from flask import Flask, jsonify
from flask_cors import CORS

# Importation des Blueprints (les modules que nous avons créés)
from api.routes.screening import screening_bp
from api.routes.news import news_bp

def create_app():
    app = Flask(__name__)

    # --- CONFIGURATION DES CORS ---
    # En développement, on autorise tout (*). 
    # En production, on pourrait restreindre à l'URL de ton frontend Render.
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # --- ENREGISTREMENT DES BLUEPRINTS ---
    # On préfixe les routes pour une structure propre : /api/screening/...
    app.register_blueprint(screening_bp, url_prefix='/api/screening')
    app.register_blueprint(news_bp, url_prefix='/api/news')

    # --- ROUTE DE TEST (HEALTH CHECK) ---
    @app.route('/')
    def health_check():
        return jsonify({
            "status": "online",
            "message": "Athar API is running",
            "version": "1.0.0"
        }), 200

    return app

app = create_app()

if __name__ == "__main__":
    # Render utilise la variable d'environnement PORT
    port = int(os.environ.get("PORT", 5000))
    # debug=False en production pour la sécurité
    app.run(host='0.0.0.0', port=port, debug=False)