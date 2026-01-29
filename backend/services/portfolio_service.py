import yfinance as yf

class PortfolioService:
    """Service de valorisation et purification de portefeuille"""

    def analyze_portfolio(self, assets: list) -> dict:
        total_value = 0
        total_purification = 0
        enriched_assets = []

        print(f"💼 Analyse de {len(assets)} actifs...")

        for asset in assets:
            ticker = asset.get('ticker').upper().strip()
            qty = float(asset.get('qty', 0))
            asset_type = asset.get('type', 'stock') # 'stock', 'etf_islamic', 'sukuk'
            
            try:
                # Récupération données Yahoo
                stock = yf.Ticker(ticker)
                
                # Prix actuel (avec fallback)
                history = stock.history(period="1d")
                if not history.empty:
                    current_price = history['Close'].iloc[-1]
                else:
                    # Si Yahoo échoue, on garde le prix d'achat pour ne pas casser le tableau
                    current_price = float(asset.get('avg_price', 0))

                # Calcul Valeur
                current_value = current_price * qty
                avg_price = float(asset.get('avg_price', 0))
                gain = current_value - (avg_price * qty)
                gain_percent = (gain / (avg_price * qty) * 100) if avg_price > 0 else 0

                # --- LOGIQUE DE PURIFICATION ---
                dividend_yield = stock.info.get('dividendYield', 0) or 0
                estimated_annual_dividends = current_value * dividend_yield
                
                purification_amount = 0
                purification_rate = 0

                if asset_type == 'stock':
                    # Règle standard : On purifie ~5% des dividendes perçus
                    purification_rate = 0.05 
                    purification_amount = estimated_annual_dividends * purification_rate
                    
                elif asset_type == 'etf_islamic':
                    # Les ETF Sharia (SPUS, HLAL) font souvent le ménage en interne.
                    # Par sécurité, certains purifient encore une infime partie, mais souvent 0.
                    purification_rate = 0.0
                    purification_amount = 0
                    
                elif asset_type == 'sukuk':
                    # Sukuk = Dette Halal = Pas d'intérêts illicites = 0 purification
                    purification_rate = 0.0
                    purification_amount = 0

                # Ajout à la liste finale
                enriched_assets.append({
                    **asset, # On garde les infos de base
                    "current_price": round(current_price, 2),
                    "current_value": round(current_value, 2),
                    "gain": round(gain, 2),
                    "gain_percent": round(gain_percent, 2),
                    "dividend_yield_percent": round(dividend_yield * 100, 2),
                    "purification_amount": round(purification_amount, 2),
                    "purification_note": "5% des dividendes" if asset_type == 'stock' else "Exonéré (Déjà purifié/Halal)"
                })

                total_value += current_value
                total_purification += purification_amount

            except Exception as e:
                print(f"⚠️ Erreur sur {ticker}: {e}")
                # En cas d'erreur, on renvoie l'actif tel quel pour ne pas perdre la ligne
                enriched_assets.append(asset)

        return {
            "total_value": round(total_value, 2),
            "total_purification_annual": round(total_purification, 2),
            "assets": enriched_assets
        }