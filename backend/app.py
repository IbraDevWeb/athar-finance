import os
from flask import Flask, jsonify
from flask_cors import CORS

# On définit l'app tout de suite pour éviter les erreurs de "gunicorn"
app = Flask(__name__)

# 1. Autoriser le Frontend (CORS)
CORS(app, resources={r"/*": {"origins": "*"}})

# 2. Importer les routes avec gestion d'erreur
try:
    from routes.screening import screening_bp
    # On enregistre la route sur /api/screening
    app.register_blueprint(screening_bp, url_prefix='/api/screening')
    print("✅ Routes Screening chargées avec succès.")
except Exception as e:
    print(f"❌ ERREUR IMPORT ROUTES: {e}")
    # On continue quand même pour ne pas faire crasher le serveur entier

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "API Athar Finance V2 prête 🚀",
        "routes_loaded": "screening_bp" in locals()
    })

# Pour le développement local
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)