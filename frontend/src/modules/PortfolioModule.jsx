import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const API_URL = 'http://localhost:5000/api';

export default function PortfolioModule() {
  // --- ÉTATS ---
  const [assets, setAssets] = useState(() => {
    try {
      const saved = localStorage.getItem('myPortfolio');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erreur lecture Portfolio:", e);
      return [];
    }
  });

  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Formulaire
  const [newTicker, setNewTicker] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // --- CHARGEMENT ---
  useEffect(() => {
    localStorage.setItem('myPortfolio', JSON.stringify(assets));
    if (assets.length > 0) refreshPrices();
  }, [assets]);

  const refreshPrices = async () => {
    setLoading(true);
    try {
        const uniqueTickers = [...new Set(assets.map(a => a.ticker).filter(Boolean))];
        if (uniqueTickers.length === 0) return;

        const response = await fetch(`${API_URL}/screening/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: uniqueTickers.join(',') })
        });
        const data = await response.json();
        
        if (data.success && Array.isArray(data.results)) {
            const map = {};
            data.results.forEach(item => {
                map[item.ticker] = item;
            });
            setLiveData(map);
        }
    } catch (err) {
        console.error("Erreur prix live portfolio", err);
    } finally {
        setLoading(false);
    }
  };

  const addAsset = () => {
    const qtyNum = parseFloat(newQty);
    const priceNum = parseFloat(newPrice);
    
    if (!newTicker || isNaN(qtyNum) || isNaN(priceNum)) return;
    
    const newItem = {
        id: Date.now(),
        ticker: newTicker.toUpperCase().trim(),
        qty: qtyNum,
        buyPrice: priceNum,
        date: new Date().toISOString().slice(0, 10)
    };
    setAssets([...assets, newItem]);
    setNewTicker(''); setNewQty(''); setNewPrice('');
  };

  const removeAsset = (id) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  // --- FONCTION DE SÉCURITÉ ---
  // C'est elle qui empêche le crash "toFixed"
  const safeNum = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
  };

  // --- CALCULS GLOBAUX ---
  let totalInvested = 0;
  let totalValue = 0;
  const allocationData = [];

  assets.forEach(asset => {
      const safeQty = safeNum(asset.qty);
      const safeBuyPrice = safeNum(asset.buyPrice);

      const data = liveData[asset.ticker];
      // Si pas de prix live, on utilise le prix d'achat, sinon 0
      const currentPrice = data?.technicals?.current_price ? safeNum(data.technicals.current_price) : safeBuyPrice;
      
      const invested = safeQty * safeBuyPrice;
      const val = safeQty * currentPrice;

      totalInvested += invested;
      totalValue += val;

      const sectorName = data?.sector || 'Autre';
      const existingSector = allocationData.find(d => d.name === sectorName);
      if (existingSector) existingSector.value += val;
      else allocationData.push({ name: sectorName, value: val });
  });

  const totalPL = totalValue - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  const COLORS = ['#c5a059', '#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ef4444'];
  
  const formatMoney = (val) => {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(safeNum(val));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* HEADER KPI */}
      <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 border-l-4 border-brand-gold bg-brand-dark text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💼</div>
              <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">Valeur Totale</p>
              <h2 className="text-4xl font-serif font-bold">{formatMoney(totalValue)}</h2>
              <p className="text-xs text-gray-400 mt-2">Investi : {formatMoney(totalInvested)}</p>
          </div>

          <div className={`glass rounded-2xl p-6 border-l-4 ${totalPL >= 0 ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'} relative`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${totalPL >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Performance</p>
              <h2 className={`text-4xl font-serif font-bold ${totalPL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                 {totalPL >= 0 ? '+' : ''}{formatMoney(totalPL)}
              </h2>
              <p className={`text-sm font-bold mt-2 ${totalPL >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                 {totalPL >= 0 ? '▲' : '▼'} {safeNum(totalPLPercent).toFixed(2)}%
              </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-brand-gold/20">
              <h3 className="font-bold text-brand-dark text-sm uppercase mb-3">Ajouter Transaction</h3>
              <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Ticker" value={newTicker} onChange={e => setNewTicker(e.target.value.toUpperCase())} className="w-1/3 p-2 rounded border text-xs font-bold uppercase outline-none focus:border-brand-gold" />
                  <input type="number" placeholder="Qté" value={newQty} onChange={e => setNewQty(e.target.value)} className="w-1/3 p-2 rounded border text-xs outline-none focus:border-brand-gold" />
                  <input type="number" placeholder="Prix" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-1/3 p-2 rounded border text-xs outline-none focus:border-brand-gold" />
              </div>
              <button onClick={addAsset} className="w-full btn-gold py-2 text-xs shadow-none">Ajouter</button>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* TABLEAU */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-bold text-brand-dark">Positions</h3>
                  <button onClick={refreshPrices} disabled={loading} className="text-xs text-brand-gold hover:underline">
                      {loading ? '...' : '🔄 Actualiser'}
                  </button>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="text-[10px] uppercase text-gray-400 border-b border-gray-100">
                              <th className="p-3">Actif</th>
                              <th className="p-3 text-center">Qté</th>
                              <th className="p-3 text-center">Achat</th>
                              <th className="p-3 text-center">Actuel</th>
                              <th className="p-3 text-center">Valeur</th>
                              <th className="p-3 text-center">P&L</th>
                              <th className="p-3 text-center">Audit</th>
                              <th className="p-3"></th>
                          </tr>
                      </thead>
                      <tbody className="text-sm">
                          {assets.length === 0 ? (
                              <tr><td colSpan="8" className="text-center py-10 text-gray-400 italic">Vide.</td></tr>
                          ) : assets.map((asset) => {
                              const safeQty = safeNum(asset.qty);
                              const safeBuy = safeNum(asset.buyPrice);
                              
                              const data = liveData[asset.ticker];
                              const currentPrice = data?.technicals?.current_price ? safeNum(data.technicals.current_price) : safeBuy;
                              
                              const value = safeQty * currentPrice;
                              const pl = value - (safeQty * safeBuy);
                              // Sécurité division par zéro
                              const plPercent = safeBuy > 0 ? ((currentPrice - safeBuy) / safeBuy) * 100 : 0;

                              return (
                                  <tr key={asset.id} className="border-b border-gray-50 hover:bg-brand-paper transition">
                                      <td className="p-3 font-bold text-brand-dark">
                                          {asset.ticker}
                                      </td>
                                      <td className="p-3 text-center font-mono text-gray-600">{safeQty}</td>
                                      <td className="p-3 text-center font-mono text-gray-500">{safeBuy.toFixed(2)}</td>
                                      <td className="p-3 text-center font-mono font-bold">{currentPrice.toFixed(2)}</td>
                                      <td className="p-3 text-center font-bold text-brand-dark">{Math.round(value).toLocaleString()} €</td>
                                      <td className={`p-3 text-center font-bold ${pl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                          {pl > 0 ? '+' : ''}{Math.round(pl)} € <br/>
                                          <span className="text-[9px] opacity-80">({plPercent.toFixed(1)}%)</span>
                                      </td>
                                      <td className="p-3 text-center">
                                          {data ? (
                                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${data.is_halal ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                  {data.is_halal ? 'OK' : 'NO'}
                                              </span>
                                          ) : <span className="text-gray-300 text-xs">...</span>}
                                      </td>
                                      <td className="p-3 text-right">
                                          <button onClick={() => removeAsset(asset.id)} className="text-gray-300 hover:text-red-400">×</button>
                                      </td>
                                  </tr>
                              )
                          })}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* DIVERSIFICATION */}
          <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center">
              <h3 className="font-display font-bold text-brand-dark mb-4 w-full text-left">Diversification</h3>
              {totalValue > 0 ? (
                  <div className="w-full h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                  {allocationData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatMoney(value)} />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              ) : (
                  <div className="text-gray-400 text-sm italic py-10">Pas de données.</div>
              )}
          </div>
      </div>
    </div>
  );
}