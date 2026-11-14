import os
from flask import Flask, jsonify
from flask_cors import CORS

from api.routes.screening import screening_bp
from api.routes.news import news_bp
from api.routes.market import market_bp
from api.routes.charting import charting_bp
from api.routes.portfolio import portfolio_bp
from api.routes.simulation import simulation_bp
from api.routes.zakat import zakat_bp


def create_app():
    app = Flask(__name__)
    configured_origins = os.getenv("CORS_ORIGINS", "*")
    origins = [origin.strip() for origin in configured_origins.split(",")] if configured_origins != "*" else "*"
    CORS(app, resources={r"/api/*": {"origins": origins}})

    app.register_blueprint(screening_bp, url_prefix="/api/screening")
    app.register_blueprint(charting_bp, url_prefix="/api/chart")
    app.register_blueprint(news_bp, url_prefix="/api/news")
    app.register_blueprint(market_bp, url_prefix="/api/market")
    app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")
    app.register_blueprint(simulation_bp, url_prefix="/api/simulation")
    app.register_blueprint(zakat_bp, url_prefix="/api/zakat")

    @app.get("/")
    @app.get("/api/health")
    def health_check():
        return jsonify(status="online", service="athar-finance-api", version="2.0.0")

    @app.errorhandler(404)
    def not_found(_):
        return jsonify(error="Endpoint introuvable"), 404

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
