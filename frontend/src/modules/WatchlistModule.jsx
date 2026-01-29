import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const API_URL = 'https://athar-api.onrender.com/api';

export default function WatchlistModule({ onAnalyze }) {
  const [favorites, setFavorites] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // États pour les Alertes (Prix Cibles)
  const [targets, setTargets] = useState(() => {
    return JSON.parse(localStorage.getItem('myPriceTargets')) || {};
  });

  // 1. CHARGEMENT DES FAVORIS
  useEffect(() => {
    loadWatchlistData();
  }, []);

  // Sauvegarde des cibles
  useEffect(() => {
    localStorage.setItem('myPriceTargets', JSON.stringify(targets));
  }, [targets]);

  const loadWatchlistData = async () => {
    const savedTickers = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    
    if (savedTickers.length === 0) {
        setLoading(false);
        return;
    }

    try {
        setFavorites(savedTickers);
        // On appelle le backend pour avoir les données fraîches de TOUS les favoris d'un coup
        const response = await fetch(`${API_URL}/screening/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: savedTickers.join(',') })
        });
        const data = await response.json();
        
        if (data.success) {
            // On transforme le tableau en objet pour accès rapide par ticker
            const dataMap = {};
            data.results.forEach(item => {
                dataMap[item.ticker] = item;
            });
            setMarketData(dataMap);
        }
    } catch (err) {
        console.error("Erreur chargement watchlist", err);
    } finally {
        setLoading(false);
    }
  };

  const removeFromWatchlist = (ticker) => {
    const newFavs = favorites.filter(t => t !== ticker);
    setFavorites(newFavs);
    localStorage.setItem('myWatchlist', JSON.stringify(newFavs));
    // Mise à jour locale sans recharger l'API
    const newData = { ...marketData };
    delete newData[ticker];
    setMarketData(newData);
  };

  const updateTarget = (ticker, price) => {
    setTargets({ ...targets, [ticker]: price });
  };

  const formatMoney = (val) => {
      if (!val) return 'N/A';
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-brand-gold/10 pb-6">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">❤️</span>
                <h1 className="font-display text-4xl font-bold text-brand-dark">Mes Listes</h1>
            </div>
            <p className="font-serif italic text-gray-500">
                Surveillez vos opportunités. Achetez au bon prix.
            </p>
        </div>
        <div className="flex gap-2">
            <span className="px-4 py-2 bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase tracking-widest rounded-lg border border-brand-gold/20">
                {favorites.length} Actifs suivis
            </span>
        </div>
      </div>

      {loading ? (
          <div className="text-center py-20 animate-pulse text-brand-gold font-bold">Chargement de vos favoris...</div>
      ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white border border-brand-gold/20 rounded-3xl">
              <div className="text-6xl mb-4 grayscale opacity-30">🔭</div>
              <h3 className="text-xl font-bold text-gray-400 mb-4">Votre liste est vide</h3>
              <p className="text-gray-400 mb-6">Utilisez le Screener pour ajouter des actions à surveiller.</p>
              <button onClick={() => onAnalyze('')} className="btn-gold shadow-lg">Aller au Screener</button>
          </div>
      ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.map(ticker => {
                  const data = marketData[ticker];
                  if (!data) return null; // Donnée pas encore chargée

                  const currentPrice = data.technicals?.current_price || 0;
                  const targetPrice = targets[ticker] || '';
                  const distToTarget = targetPrice ? ((currentPrice - targetPrice) / currentPrice) * 100 : null;
                  
                  // Alert Logic
                  const isPriceGood = targetPrice && currentPrice <= targetPrice;
                  
                  // Mini Chart Data (Simulé pour l'esthétique car pas d'historique complet dans /analyze)
                  const sparkData = Array.from({length: 10}, (_, i) => ({ val: Math.random() * 10 + 50 + (i*2) }));

                  return (
                      <div key={ticker} className={`group relative bg-white p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isPriceGood ? 'border-brand-emerald shadow-emerald-100' : 'border-gray-100 hover:border-brand-gold/30'}`}>
                          
                          {/* DELETE BUTTON */}
                          <button 
                            onClick={() => removeFromWatchlist(ticker)}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors z-10"
                          >
                            ✕
                          </button>

                          {/* HEADER CARD */}
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-brand-paper border border-brand-gold/10 flex items-center justify-center font-bold text-brand-dark shadow-inner text-sm">
                                      {ticker.substring(0, 2)}
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-brand-dark leading-none">{ticker}</h3>
                                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{data.name}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <div className="font-mono font-bold text-xl text-brand-dark">{formatMoney(currentPrice)}</div>
                                  <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${data.is_halal ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                      {data.is_halal ? 'HALAL' : 'HARAM'}
                                  </div>
                              </div>
                          </div>

                          {/* INDICATEURS RAPIDES */}
                          <div className="grid grid-cols-3 gap-2 mb-6">
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <div className="text-[9px] text-gray-400 uppercase">Score</div>
                                  <div className="font-bold text-brand-gold">{data.sharia_score}/100</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <div className="text-[9px] text-gray-400 uppercase">RSI</div>
                                  <div className={`font-bold ${data.technicals?.rsi < 30 ? 'text-emerald-600' : 'text-gray-600'}`}>
                                      {data.technicals?.rsi || '-'}
                                  </div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 rounded-lg">
                                  <div className="text-[9px] text-gray-400 uppercase">Rating</div>
                                  <div className="text-xs">
                                    {[...Array(data.rating || 0)].map((_, i) => '★').join('')}
                                  </div>
                              </div>
                          </div>

                          {/* ZONE ALERTE PRIX */}
                          <div className={`p-4 rounded-xl border transition-colors ${isPriceGood ? 'bg-emerald-50 border-emerald-200' : 'bg-brand-paper border-gray-100'}`}>
                              <div className="flex justify-between items-center mb-2">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Votre Prix Cible</label>
                                  {isPriceGood && <span className="text-[10px] font-bold text-emerald-600 animate-pulse">● PRIX ATTEINT</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className="text-gray-400 font-serif">$</span>
                                  <input 
                                    type="number" 
                                    value={targetPrice}
                                    onChange={(e) => updateTarget(ticker, e.target.value)}
                                    placeholder="Ex: 150"
                                    className="w-full bg-transparent border-b border-gray-300 focus:border-brand-gold outline-none font-bold text-brand-dark"
                                  />
                              </div>
                              {targetPrice && !isPriceGood && (
                                  <div className="mt-2 text-[10px] text-right text-gray-400">
                                      Encore {distToTarget > 0 ? '-' : '+'}{Math.abs(distToTarget).toFixed(1)}% pour atteindre la cible
                                  </div>
                              )}
                          </div>

                          {/* BOUTON ANALYSE */}
                          <button 
                            onClick={() => onAnalyze(ticker)}
                            className="w-full mt-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-gold border border-transparent hover:border-brand-gold/20 rounded-lg transition-colors"
                          >
                            Voir l'analyse complète →
                          </button>

                      </div>
                  );
              })}
          </div>
      )}
    </div>
  );
}