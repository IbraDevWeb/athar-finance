import yfinance as yf

class ZakatService:
    """Service de calcul de la Zakat avec double Nisab (Or & Argent)"""

    def get_metal_prices(self):
        """Récupère les prix Or et Argent en EUR"""
        # VALEURS PAR DÉFAUT (Mises à jour janv 2026 selon vos chiffres)
        # Si le scraping échoue, on utilise ces valeurs réelles
        prices = {
            "gold_gram": 136.0,   # ~136€ le gramme
            "silver_gram": 2.82,  # ~2.82€ le gramme
            "source": "backup"    # Indique qu'on est sur les valeurs de secours
        }
        
        try:
            print("🏆 Tentative de connexion Yahoo Finance...")
            # Tickers : XAUEUR=X (Or/Euro), XAGEUR=X (Argent/Euro)
            tickers = yf.Tickers("XAUEUR=X XAGEUR=X")
            
            # OR (Gold) - XAU
            if 'XAUEUR=X' in tickers.tickers:
                history_gold = tickers.tickers['XAUEUR=X'].history(period="1d")
                if not history_gold.empty:
                    # Yahoo donne le prix de l'ONCE (Troy Ounce)
                    oz_price = history_gold['Close'].iloc[-1]
                    # 1 Once Troy = 31.1035 grammes
                    live_price = oz_price / 31.1035
                    
                    # On vérifie que la donnée est cohérente (> 50€) sinon on garde le backup
                    if live_price > 50:
                        prices["gold_gram"] = live_price
                        prices["source"] = "live"

            # ARGENT (Silver) - XAG
            if 'XAGEUR=X' in tickers.tickers:
                history_silver = tickers.tickers['XAGEUR=X'].history(period="1d")
                if not history_silver.empty:
                    oz_price = history_silver['Close'].iloc[-1]
                    live_price = oz_price / 31.1035
                    
                    if live_price > 0.5:
                        prices["silver_gram"] = live_price

        except Exception as e:
            print(f"⚠️ Le live a échoué ({e}), utilisation des valeurs manuelles (136€/2.82€).")
        
        return prices

    def calculate_zakat(self, data: dict) -> dict:
        try:
            # 1. Récupérer les prix (Live ou Backup)
            metals = self.get_metal_prices()
            
            # 2. Calculer les deux Nisabs
            # Nisab Or = 85 grammes
            nisab_gold = metals["gold_gram"] * 85
            
            # Nisab Argent = 595 grammes
            nisab_silver = metals["silver_gram"] * 595

            # 3. Récupération des actifs utilisateur
            cash = float(data.get('cash', 0))
            savings = float(data.get('savings', 0))
            stocks = float(data.get('stocks', 0))
            crypto = float(data.get('crypto', 0))
            gold_silver = float(data.get('gold', 0))
            debts = float(data.get('debts', 0))

            # 4. Calcul Patrimoine Net
            total_assets = cash + savings + stocks + crypto + gold_silver
            net_wealth = total_assets - debts

            # 5. Calcul Zakat (2.5%)
            zakat_amount = net_wealth * 0.025

            return {
                "net_wealth": round(net_wealth, 2),
                "zakat_payable": round(zakat_amount if zakat_amount > 0 else 0, 2),
                "nisab_data": {
                    "gold_threshold": round(nisab_gold, 2),
                    "silver_threshold": round(nisab_silver, 2),
                    "gold_price_g": round(metals["gold_gram"], 2),
                    "silver_price_g": round(metals["silver_gram"], 2),
                    "source": metals["source"]
                }
            }

        except Exception as e:
            print(f"Erreur Zakat: {e}")
            return None