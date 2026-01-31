import os
from flask import Flask, jsonify
from flask_cors import CORS

# --- CONFIGURATION DE L'APPLICATION ---
app = Flask(__name__)

# Autoriser toutes les origines (CORS) pour éviter les blocages Vercel/Render
CORS(app, resources={r"/*": {"origins": "*"}})

# --- CHARGEMENT DES MODULES (SÉCURISÉ) ---
# On utilise try/except pour que le serveur démarre même si un fichier manque.

# 1. Module SCREENING (Analyse Actions)
try:
    from api.routes.screening import screening_bp
    app.register_blueprint(screening_bp, url_prefix='/api/screening')
    print("✅ Module Screening chargé sur /api/screening")
    screening_active = True
except ImportError as e:
    print(f"⚠️ Erreur Import Screening: {e}")
    screening_active = False
except Exception as e:
    print(f"❌ Erreur Critique Screening: {e}")
    screening_active = False

# 2. Module NEWS (Actualités Marché)
try:
    from api.routes.news import news_bp
    app.register_blueprint(news_bp, url_prefix='/api/news')
    print("✅ Module News chargé sur /api/news")
    news_active = True
except ImportError:
    print("ℹ️ Module News non détecté (Optionnel)")
    news_active = False
except Exception as e:
    print(f"❌ Erreur Critique News: {e}")
    news_active = False

# --- ROUTES DE BASE ---

@app.route('/')
def home():
    """Route pour vérifier que le serveur est en vie"""
    return jsonify({
        "status": "Online 🚀",
        "project": "Athar Finance API",
        "modules": {
            "screening": "Actif" if screening_active else "Inactif",
            "news": "Actif" if news_active else "Inactif"
        }
    })

# --- LANCEMENT DU SERVEUR ---
if __name__ == '__main__':
    # Render fournit le PORT via une variable d'environnement
    port = int(os.environ.get('PORT', 10000))
    # host='0.0.0.0' est obligatoire pour que le serveur soit accessible de l'extérieur
    app.run(host='0.0.0.0', port=port)