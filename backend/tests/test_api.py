import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import create_app
from api.routes.news import normalize_item


class ApiSmokeTests(unittest.TestCase):
    def setUp(self):
        app = create_app()
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_health_and_registered_routes(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "online")
        self.assertEqual(self.client.post("/api/chart/history", json={"ticker": ""}).status_code, 400)
        self.assertEqual(self.client.post("/api/portfolio/analyze", json={"assets": "invalid"}).status_code, 400)
        self.assertEqual(self.client.post("/api/simulation/calculate", json={"start_year": 3000}).status_code, 400)

    def test_screening_rejects_invalid_symbols(self):
        result = self.client.post("/api/screening/analyze", json={"tickers": ";DROP TABLE"})
        self.assertEqual(result.status_code, 400)

    @patch("api.routes.screening.fmp_get")
    def test_screening_marks_missing_financial_data(self, mocked):
        mocked.side_effect = [
            ([{"symbol": "AAPL", "companyName": "Apple", "price": 190, "marketCap": 3000000000000, "changePercentage": 1.2, "currency": "USD"}], None),
            (None, ("Accès réservé", 503)),
            (None, ("Accès réservé", 503)),
        ]
        response = self.client.post("/api/screening/analyze", json={"tickers": "AAPL"})
        self.assertEqual(response.status_code, 200)
        item = response.json["results"][0]
        self.assertEqual(item["price"], 190)
        self.assertEqual(item["compliance"]["status"], "indeterminate")
        self.assertIsNone(item["ratios"]["debt_ratio"])

    @patch("api.routes.screening.fmp_get")
    def test_screening_multiple_tickers(self, mocked):
        def fake(endpoint, params):
            symbol = params["symbol"]
            if endpoint == "/profile":
                return ([{"symbol": symbol, "companyName": symbol, "price": 100, "marketCap": 1000000, "sector": "Technology"}], None)
            if endpoint == "/balance-sheet-statement":
                return ([{"totalDebt": 10000, "cashAndShortTermInvestments": 10000}], None)
            return ([{"returnOnEquityTTM": 0.12, "earningsYieldTTM": 0.04}], None)
        mocked.side_effect = fake
        response = self.client.post("/api/screening/analyze", json={"tickers": "AAA,BBB"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json["results"]), 2)
        self.assertEqual(response.json["results"][0]["compliance"]["status"], "potentially_compliant")
        self.assertEqual(response.json["results"][0]["technicals"]["roe"], 12)

    def test_news_normalization_new_payload(self):
        result = normalize_item({
            "content": {
                "title": "Financial news",
                "canonicalUrl": {"url": "https://example.com/article"},
                "pubDate": "2026-11-14T11:00:00Z",
                "provider": {"displayName": "Example News"},
            }
        }, "Or")
        self.assertEqual(result["publisher"], "Example News")
        self.assertGreater(result["timestamp"], 0)


if __name__ == "__main__":
    unittest.main()
