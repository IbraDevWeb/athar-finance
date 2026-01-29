from flask import Flask
from flask_cors import CORS
from api.routes.screening import screening_bp
from api.routes.simulation import simulation_bp
from api.routes.zakat import zakat_bp 
from api.routes.portfolio import portfolio_bp

def create_app():
    app = Flask(__name__)
    
    # 👇 On autorise toutes les origines (*) pour éviter les blocages CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Enregistrement des routes (Blueprints)
    app.register_blueprint(screening_bp, url_prefix='/api/screening')
    app.register_blueprint(simulation_bp, url_prefix='/api/simulation')
    app.register_blueprint(zakat_bp, url_prefix='/api/zakat')
    app.register_blueprint(portfolio_bp, url_prefix='/api/portfolio')
    
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'Modular API Running'}

    return app

# 👇 CORRECTION CRUCIALE POUR RENDER :
# On crée l'application ici (niveau global) pour que Gunicorn puisse la trouver.
app = create_app()

if __name__ == '__main__':
    # Ceci ne s'exécute que si tu lances "python app.py" sur ton PC
    app.run(host='0.0.0.0', port=5000, debug=True)