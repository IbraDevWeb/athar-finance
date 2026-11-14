import yfinance as yf
import pandas as pd
from datetime import datetime

class SimulationService:
    """Service de simulation DCA (Investissement Mensuel)"""

    def simulate_dca(self, tickers_str: str, monthly_amount: float, start_year: int) -> dict:
        # Nettoyage des tickers (ex: "AAPL, MSFT" -> ["AAPL", "MSFT"])
        tickers = [t.strip().upper() for t in tickers_str.split(',') if t.strip()]
        
        if not tickers:
            return None

        # On divise le budget mensuel par le nombre d'actions
        # Ex: 100€ sur 2 actions = 50€ chacune par mois
        amount_per_ticker = monthly_amount / len(tickers)
        
        total_invested = 0
        total_current_value = 0
        total_dividends = 0
        portfolio_breakdown = []

        print(f"💰 Simulation DCA depuis {start_year} sur {tickers}...")

        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                
                # On récupère l'historique depuis le début de l'année choisie
                start_date = f"{start_year}-01-01"
                history = stock.history(start=start_date, auto_adjust=False)
                
                if history.empty:
                    continue

                # On convertit les données en "Mensuel" (Fin de mois)
                # On prend le prix de clôture de chaque mois
                monthly_data = history['Close'].resample('ME').last()
                
                # Simulation de l'achat mensuel
                shares_owned = 0
                cash_invested_in_stock = 0
                
                for date, price in monthly_data.items():
                    # On achète pour 'amount_per_ticker'
                    if pd.notna(price) and price > 0:
                        shares_bought = amount_per_ticker / price
                        shares_owned += shares_bought
                        cash_invested_in_stock += amount_per_ticker

                # Valeur actuelle de cette position
                current_price = history['Close'].iloc[-1]
                final_value = shares_owned * current_price
                
                # Calcul des dividendes (Approximation sur la période)
                # On additionne tous les dividendes versés par action * nombre d'actions moyen
                dividends_per_share = stock.history(start=start_date)['Dividends'].sum()
                dividends_received = dividends_per_share * shares_owned # Simplifié

                # Ajout aux totaux globaux
                total_invested += cash_invested_in_stock
                total_current_value += final_value
                total_dividends += dividends_received
                
                portfolio_breakdown.append({
                    "ticker": ticker,
                    "shares": round(shares_owned, 2),
                    "value": round(final_value, 2),
                    "gain_percent": round(((final_value - cash_invested_in_stock) / cash_invested_in_stock) * 100, 2)
                })

            except Exception as e:
                print(f"Erreur sur {ticker}: {e}")
                continue

        # Calculs finaux
        purification = None  # Pas de taux de purification automatique fiable.
        total_gain = (total_current_value + total_dividends) - total_invested
        total_return = (total_gain / total_invested) * 100 if total_invested > 0 else 0

        return {
            "strategy": "DCA Mensuel",
            "start_year": start_year,
            "monthly_investment": monthly_amount,
            "total_invested": round(total_invested, 2),
            "final_value": round(total_current_value, 2),
            "dividends": round(total_dividends, 2),
            "dividends_are_approximate": True,
            "purification": purification,
            "total_gain": round(total_gain, 2),
            "total_return": round(total_return, 2),
            "breakdown": portfolio_breakdown
        }