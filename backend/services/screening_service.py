import yfinance as yf
import pandas as pd
import numpy as np

class HalalScreeningService:
    def _calculate_rsi(self, series, period=14):
        """Calcul manuel du RSI pour ne pas dépendre de librairies lourdes"""
        delta = series.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()

        rs = gain / loss
        return 100 - (100 / (1 + rs))

    def get_company_profile(self, ticker: str):
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            # --- 1. TYPE D'ACTIF ---
            quote_type = info.get('quoteType', 'EQUITY').upper()
            is_crypto = quote_type == 'CRYPTOCURRENCY'
            
            # --- 2. DONNÉES TECHNIQUES (NOUVEAU) 📈 ---
            # On récupère 3 mois d'historique pour calculer le RSI
            history = stock.history(period="3mo")
            rsi_val = 50 # Neutre par défaut
            price_change_1y = "N/A"
            
            if not history.empty and len(history) > 15:
                # Calcul RSI
                rsi_series = self._calculate_rsi(history['Close'])
                if not rsi_series.empty:
                    rsi_val = round(rsi_series.iloc[-1], 2)
            
            # Position par rapport au plus haut/bas 52 semaines
            high_52 = info.get('fiftyTwoWeekHigh')
            low_52 = info.get('fiftyTwoWeekLow')
            current_price = info.get('currentPrice') or info.get('regularMarketPrice')
            
            price_position = 50 # Pourcentage (0 = au plus bas, 100 = au plus haut)
            if high_52 and low_52 and current_price:
                price_position = round(((current_price - low_52) / (high_52 - low_52)) * 100)

            # --- 3. LOGIQUE HALAL (Standard) ---
            name = info.get('longName', info.get('shortName', ticker))
            sector = info.get('sector', 'Unknown')
            industry = info.get('industry', 'Unknown')
            summary = info.get('description', info.get('longBusinessSummary', ''))
            
            # Logique Crypto
            if is_crypto:
                riba_coins = ['USDT-USD', 'USDC-USD', 'BUSD-USD', 'DAI-USD'] 
                is_halal = True
                reason = "Projet Crypto Standard"
                score = 80 

                if ticker in riba_coins:
                    is_halal = False
                    reason = "Stablecoin (Risque Riba)"
                    score = 0
                elif 'Lending' in summary or 'Interest' in summary:
                    is_halal = False
                    reason = "DeFi Riba"
                    score = 20
                if ticker in ['BTC-USD', 'ETH-USD']:
                    score = 95
                    reason = "Actif Numérique Majeur"
                
                return {
                    "ticker": ticker,
                    "name": name,
                    "sector": "Crypto-Actif",
                    "type": "CRYPTO",
                    "is_halal": is_halal,
                    "sharia_score": score,
                    "reason": reason,
                    "ratios": { "debt": 0, "cash": 0 },
                    "financials": { "revenue": 0, "per": "N/A", "roe": "N/A", "div": "0" },
                    "technicals": { # 👈 NOUVEAU
                        "rsi": rsi_val,
                        "position_52w": price_position,
                        "current_price": current_price
                    },
                    "rating": 3
                }

            # Logique Actions (AAOIFI)
            total_assets = info.get('totalAssets')
            total_debt = info.get('totalDebt')
            cash = info.get('totalCash') or info.get('cashAndCashEquivalents')
            market_cap = info.get('marketCap')
            total_revenue = info.get('totalRevenue') 

            denominator = market_cap if market_cap else total_assets
            debt_ratio = 0
            cash_ratio = 0
            
            if denominator and denominator > 0:
                if total_debt: debt_ratio = round((total_debt / denominator) * 100, 2)
                if cash: cash_ratio = round((cash / denominator) * 100, 2)

            # Filtres Activité
            forbidden_terms = [
                'alcohol', 'tobacco', 'gambling', 'casino', 'pork', 'music', 
                'cinema', 'adult', 'porn', 'bank', 'insurance', 'interest', 
                'lending', 'defense', 'weapon', 'military', 'distiller', 'brewer', 'wine',
                'hotel', 'resort', 'entertainment'
            ]
            manual_blacklist = ['PLTR', 'LMT', 'RTX', 'BA', 'JPM', 'BAC'] 
            manual_whitelist = ['SPUS', 'HLAL', 'ISDW.L', 'ISDU.L', 'GLDM', 'SPSK']

            is_activity_halal = True
            activity_issues = [] 

            if ticker in manual_whitelist: is_activity_halal = True
            elif ticker in manual_blacklist:
                is_activity_halal = False
                activity_issues.append("Exclusion manuelle")
            elif summary:
                found_terms = [term for term in forbidden_terms if term in summary.lower()]
                if found_terms:
                    is_activity_halal = False
                    activity_issues.append(f"Activité : {', '.join(found_terms)}")
            
            if 'Financial' in sector and 'Bank' in industry and ticker not in manual_whitelist:
                is_activity_halal = False
                activity_issues.append("Secteur Bancaire")

            ratios_ok = (debt_ratio < 33) and (cash_ratio < 33)
            is_halal = is_activity_halal and ratios_ok

            reasons = activity_issues[:]
            if debt_ratio >= 33: reasons.append(f"Dette excessive ({debt_ratio}%)")
            if cash_ratio >= 33: reasons.append(f"Cash excessif ({cash_ratio}%)")
            final_reason = " & ".join(reasons) if reasons else "✅ Conforme AAOIFI"

            sharia_score = 0
            if is_activity_halal:
                sharia_score += 40
                if ticker in manual_whitelist: sharia_score = 100
                else:
                    if debt_ratio < 33: sharia_score += 30 * (1 - (debt_ratio / 33))
                    if cash_ratio < 33: sharia_score += 30 * (1 - (cash_ratio / 33))
            
            sharia_score = round(max(0, min(100, sharia_score)))

            # Données Financières
            per = info.get('trailingPE')
            roe = info.get('returnOnEquity')
            profit_margin = info.get('profitMargins')
            div_yield = info.get('dividendYield')
            peg = info.get('pegRatio')

            rating = 1
            if roe and roe > 0.15: rating += 1
            if profit_margin and profit_margin > 0.15: rating += 1
            if peg and peg < 1.5: rating += 1
            if is_halal: rating += 1
            if ticker in manual_whitelist: rating = 5

            return {
                "ticker": ticker,
                "name": name,
                "sector": sector,
                "type": "STOCK",
                "is_halal": is_halal,
                "sharia_score": sharia_score,
                "reason": final_reason,
                "ratios": { "debt": debt_ratio, "cash": cash_ratio },
                "financials": {
                    "revenue": total_revenue,
                    "per": round(per, 2) if per else "N/A",
                    "roe": round(roe * 100, 2) if roe else "N/A",
                    "margin": round(profit_margin * 100, 2) if profit_margin else "N/A",
                    "div": round(div_yield * 100, 2) if div_yield else "0",
                    "peg": peg if peg else "N/A"
                },
                "technicals": { # 👈 NOUVEAU
                    "rsi": rsi_val,
                    "position_52w": price_position,
                    "current_price": current_price
                },
                "rating": min(5, rating)
            }
        except Exception as e:
            print(f"Erreur pour {ticker}: {e}")
            return None