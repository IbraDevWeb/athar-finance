import os
from flask import Flask, jsonify
from flask_cors import CORS

# IMPORT CORRECT : On suit le chemin api -> routes -> screening
try:
    from api.routes.screening import screening_bp
    routes_loaded = True
except ImportError as e:
    print(f"❌ Erreur Import : {e}")
    routes_loaded = False

app = Flask(__name__)
# Autoriser tout le monde (CORS)
CORS(app, resources={r"/*": {"origins": "*"}})

# Enregistrement du module
if routes_loaded:
    app.register_blueprint(screening_bp, url_prefix='/api/screening')

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "architecture": "modulaire (clean)",
        "routes_active": routes_loaded
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)