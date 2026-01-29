from flask import Flask
from flask_cors import CORS
from api.routes.screening import screening_bp
from api.routes.simulation import simulation_bp
from api.routes.zakat import zakat_bp 
from api.routes.portfolio import portfolio_bp

def create_app():
    app = Flask(__name__)
    
    # 👇 CORRECTION MAJEURE ICI : On autorise explicitement toutes les origines (*)
    # Cela règle le problème "Blocked by CORS policy"
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(screening_bp, url_prefix='/api/screening')
    app.register_blueprint(simulation_bp, url_prefix='/api/simulation')
    app.register_blueprint(zakat_bp, url_prefix='/api/zakat')
    app.register_blueprint(portfolio_bp, url_prefix='/api/portfolio')
    
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'Modular API Running'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)