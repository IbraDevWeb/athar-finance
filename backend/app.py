from flask import Flask, jsonify
from flask_cors import CORS
import os

# Import de tes routes (Vérifie que le fichier backend/routes/screening.py existe bien)
from routes.screening import screening_bp

app = Flask(__name__)

# --- 1. ACTIVATION DE CORS (LA CORRECTION) ---
# Cela autorise toutes les origines (*) à accéder à ton API.
# C'est ce qui va faire disparaître l'erreur rouge "CORS Policy" de ta console.
CORS(app, resources={r"/*": {"origins": "*"}})

# --- 2. ENREGISTREMENT DES BLUEPRINTS ---
# Si ton frontend appelle "https://.../screening/analyze", le préfixe doit être /screening
app.register_blueprint(screening_bp, url_prefix='/screening')

# --- 3. ROUTE D'ACCUEIL (Health Check) ---
# Utile pour vérifier si le serveur est en vie en allant sur l'URL de base
@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "API Athar Finance opérationnelle 🚀",
        "version": "2.0"
    })

# --- 4. LANCEMENT DU SERVEUR ---
if __name__ == '__main__':
    # Render donne un port via la variable d'environnement PORT
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)