import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Wallet, Plus, Trash2, TrendingUp, TrendingDown, 
  Calculator, ArrowUpRight, Briefcase, X, PieChart as PieIcon 
} from 'lucide-react';

export default function PortfolioModule() {
  // Données simulées
  const [assets, setAssets] = useState([
    { id: 1, ticker: 'AAPL', name: 'Apple Inc.', qty: 10, avgPrice: 150, currentPrice: 175, type: 'Action' },
    { id: 2, ticker: 'SPUS', name: 'S&P 500 Sharia', qty: 50, avgPrice: 30, currentPrice: 35, type: 'ETF' },
    { id: 3, ticker: 'GLDM', name: 'Gold Mini', qty: 20, avgPrice: 40, currentPrice: 42, type: 'Or' },
    { id: 4, ticker: 'NVDA', name: 'Nvidia Corp.', qty: 5, avgPrice: 400, currentPrice: 380, type: 'Action' },
  ]);

  const [newAsset, setNewAsset] = useState({ ticker: '', qty: '', price: '' });
  const [showForm, setShowForm] = useState(false);

  // --- CALCULS ---
  const totalValue = assets.reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);
  const totalCost = assets.reduce((acc, curr) => acc + (curr.qty * curr.avgPrice), 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
  
  // Zakat Estimée (2.5% si > Nissab, ici on affiche juste le montant potentiel)
  const zakatEstimated = totalValue * 0.025;

  // Données Graphique
  const chartData = assets.map(a => ({ name: a.ticker, value: a.qty * a.currentPrice }));
  const COLORS = ['#10b981', '#fbbf24', '#6366f1', '#f43f5e', '#8b5cf6', '#06b6d4'];

  const handleAddAsset = () => {
      if(!newAsset.ticker || !newAsset.qty) return;
      const asset = {
          id: Date.now(),
          ticker: newAsset.ticker.toUpperCase(),
          name: newAsset.ticker.toUpperCase(), // Idéalement, récupérer le nom via API
          qty: Number(newAsset.qty),
          avgPrice: Number(newAsset.price),
          currentPrice: Number(newAsset.price), // Simulé
          type: 'Action'
      };
      setAssets([...assets, asset]);
      setNewAsset({ ticker: '', qty: '', price: '' });
      setShowForm(false);
  };

  const handleDelete = (id) => {
      setAssets(assets.filter(a => a.id !== id));
  };

  const formatMoney = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-8">
      
      {/* HEADER & TITRE */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pt-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
             <div className="p-2 bg-brand-gold/10 rounded-xl text-brand-gold border border-brand-gold/20">
                <Briefcase size={28} strokeWidth={1.5} />
             </div>
             Mon Portefeuille
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 ml-1 text-sm">
             Suivi de la performance et allocation de vos actifs.
          </p>
        </div>
        
        <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg active:scale-95"
        >
            {showForm ? <X size={18} /> : <Plus size={18} />} 
            {showForm ? "Fermer" : "Ajouter un actif"}
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid lg:grid-cols-3 gap-6">
          
          {/* CARTE PRINCIPALE (SOLDE) */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f172a] to-[#1e293b] dark:from-[#121212] dark:to-[#1a1a1a] p-8 md:p-10 text-white shadow-2xl border border-gray-800 dark:border-white/10 group">
              {/* Effet Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-gold/20 transition-colors duration-700"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-6">
                  <div>
                      <p className="text-brand-gold font-bold uppercase tracking-[0.2em] text-xs mb-3 flex items-center gap-2">
                          <Wallet size={14} /> Valeur Totale
                      </p>
                      <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-4">
                          {formatMoney(totalValue)}
                      </h2>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md border border-white/5 ${totalPL >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {totalPL >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span>
                              {totalPL >= 0 ? '+' : ''}{formatMoney(totalPL)} 
                              <span className="opacity-70 ml-1">({totalPLPercent.toFixed(2)}%)</span>
                          </span>
                      </div>
                  </div>

                  {/* Indicateur Zakat */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl md:text-right min-w-[200px]">
                       <div className="flex md:justify-end items-center gap-2 text-gray-400 mb-1">
                           <Calculator size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Zakat Potentielle</span>
                       </div>
                       <p className="text-2xl font-mono font-bold text-white">{formatMoney(zakatEstimated)}</p>
                       <p className="text-[10px] text-gray-500 mt-1">2.5% de la valeur totale</p>
                  </div>
              </div>
          </div>

          {/* CARTE ALLOCATION (Graphique) */}
          <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                      <PieIcon size={16} className="text-brand-gold"/> Répartition
                  </h3>
              </div>
              <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={chartData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none"
                          >
                              {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip 
                              formatter={(val) => formatMoney(val)} 
                              contentStyle={{backgroundColor: '#1a1a1a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px'}}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold', color: '#9ca3af'}}/>
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* SECTION LISTE & FORMULAIRE */}
      <div className="grid lg:grid-cols-1 gap-8">
          <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
              
              {/* FORMULAIRE D'AJOUT (ANIMÉ) */}
              {showForm && (
                  <div className="mb-8 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5 animate-fade-in-down">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Nouvelle Position</h3>
                          <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"><X size={16}/></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Ticker / Symbole</label>
                              <input 
                                type="text" placeholder="ex: TSLA" 
                                value={newAsset.ticker} onChange={e => setNewAsset({...newAsset, ticker: e.target.value})} 
                                className="w-full p-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl font-bold uppercase text-gray-900 dark:text-white outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" 
                              />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Quantité</label>
                              <input 
                                type="number" placeholder="0" 
                                value={newAsset.qty} onChange={e => setNewAsset({...newAsset, qty: e.target.value})} 
                                className="w-full p-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-900 dark:text-white outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" 
                              />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Prix Moyen ($)</label>
                              <input 
                                type="number" placeholder="0.00" 
                                value={newAsset.price} onChange={e => setNewAsset({...newAsset, price: e.target.value})} 
                                className="w-full p-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-900 dark:text-white outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" 
                              />
                          </div>
                      </div>
                      <button 
                        onClick={handleAddAsset} 
                        className="mt-4 w-full py-3 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl shadow-lg shadow-brand-gold/20 transition-all active:scale-[0.98]"
                      >
                          Ajouter au portefeuille
                      </button>
                  </div>
              )}

              {/* TABLEAU DES ACTIFS */}
              <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead>
                          <tr className="text-left text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 tracking-wider">
                              <th className="pb-4 pl-4">Actif</th>
                              <th className="pb-4 text-center">Quantité</th>
                              <th className="pb-4 text-right">Prix Moyen</th>
                              <th className="pb-4 text-right">Valeur Actuelle</th>
                              <th className="pb-4 text-right">Performance</th>
                              <th className="pb-4 text-right pr-4">Action</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm">
                          {assets.map((asset) => {
                              const val = asset.qty * asset.currentPrice;
                              const pl = val - (asset.qty * asset.avgPrice);
                              const plPercent = (pl / (asset.qty * asset.avgPrice)) * 100;
                              
                              return (
                                  <tr key={asset.id} className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                      <td className="py-5 pl-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs font-bold shadow-sm">
                                                  {asset.ticker.substring(0,2)}
                                              </div>
                                              <div>
                                                  <p className="font-bold text-gray-900 dark:text-white">{asset.ticker}</p>
                                                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide hidden md:block">{asset.name}</p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="py-5 text-center font-mono font-bold text-gray-600 dark:text-gray-400">{asset.qty}</td>
                                      <td className="py-5 text-right font-mono text-gray-500 dark:text-gray-400">{asset.avgPrice} $</td>
                                      <td className="py-5 text-right font-mono font-bold text-gray-900 dark:text-white">{formatMoney(val)}</td>
                                      <td className="py-5 text-right">
                                          <div className={`inline-flex flex-col items-end ${pl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                              <span className="font-bold text-sm flex items-center gap-1">
                                                {pl >= 0 ? '+' : ''}{formatMoney(pl)}
                                              </span>
                                              <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded-md mt-1">
                                                {plPercent.toFixed(2)}%
                                              </span>
                                          </div>
                                      </td>
                                      <td className="py-5 text-right pr-4">
                                          <button 
                                            onClick={() => handleDelete(asset.id)} 
                                            className="p-2 text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                                          >
                                              <Trash2 size={18} />
                                          </button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
                  
                  {assets.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl mt-4">
                          <Wallet size={48} strokeWidth={1} className="mb-4 opacity-50"/>
                          <p className="text-sm font-medium">Votre portefeuille est vide.</p>
                          <button onClick={() => setShowForm(true)} className="text-brand-gold text-xs font-bold mt-2 hover:underline uppercase tracking-wider">
                              Ajouter votre première position
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}