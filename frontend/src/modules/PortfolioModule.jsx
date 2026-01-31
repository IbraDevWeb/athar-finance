import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Wallet, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Calculator 
} from 'lucide-react';

export default function PortfolioModule() {
  // Simulation de base de données locale
  const [assets, setAssets] = useState([
    { id: 1, ticker: 'AAPL', name: 'Apple Inc.', qty: 10, avgPrice: 150, currentPrice: 175, type: 'Action' },
    { id: 2, ticker: 'SPUS', name: 'S&P 500 Sharia', qty: 50, avgPrice: 30, currentPrice: 35, type: 'ETF' },
    { id: 3, ticker: 'GLDM', name: 'Gold Mini', qty: 20, avgPrice: 40, currentPrice: 42, type: 'Or' },
  ]);

  const [newAsset, setNewAsset] = useState({ ticker: '', qty: '', price: '' });
  const [showForm, setShowForm] = useState(false);

  // Totaux
  const totalValue = assets.reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);
  const totalCost = assets.reduce((acc, curr) => acc + (curr.qty * curr.avgPrice), 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = (totalPL / totalCost) * 100;

  // Données Graphique Répartition
  const chartData = assets.map(a => ({ name: a.ticker, value: a.qty * a.currentPrice }));
  const COLORS = ['#1e293b', '#c5a059', '#64748b', '#94a3b8', '#cbd5e1'];

  const handleAddAsset = () => {
      if(!newAsset.ticker || !newAsset.qty) return;
      // Simulation d'ajout (prix actuel = prix d'achat pour l'exemple)
      const asset = {
          id: Date.now(),
          ticker: newAsset.ticker.toUpperCase(),
          name: newAsset.ticker.toUpperCase(),
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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      
      {/* HEADER DASHBOARD */}
      <div className="grid lg:grid-cols-3 gap-6">
          {/* Carte Principale */}
          <div className="lg:col-span-2 bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-32 bg-brand-gold blur-[100px] opacity-20 rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                  <div>
                      <p className="text-brand-gold font-bold uppercase tracking-widest text-xs mb-2">Valeur Totale</p>
                      <h2 className="text-5xl font-display font-bold mb-4">{formatMoney(totalValue)}</h2>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold ${totalPL >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {totalPL >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span>{totalPL >= 0 ? '+' : ''}{formatMoney(totalPL)} ({totalPLPercent.toFixed(2)}%)</span>
                      </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                       <Wallet size={32} className="text-brand-gold" />
                  </div>
              </div>
          </div>

          {/* Carte Zakat */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg flex flex-col justify-between">
              <div>
                  <div className="flex items-center gap-2 mb-4 text-brand-gold">
                      <Calculator size={20} />
                      <span className="font-bold uppercase tracking-widest text-xs">Zakat Estimée</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{formatMoney(totalValue * 0.025)}</p>
                  <p className="text-xs text-gray-400 mt-2">
                      Basé sur 2.5% de la valeur totale (si éligible au Nissab).
                  </p>
              </div>
              <button className="w-full mt-4 py-3 bg-brand-gold/10 text-brand-gold font-bold rounded-xl hover:bg-brand-gold hover:text-white transition-colors text-sm">
                  Voir Détails Zakat →
              </button>
          </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
          
          {/* GRAPHIQUE RÉPARTITION (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-dark rounded-full"></span>
                  Allocation
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie
                          data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                      >
                          {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                      </Pie>
                      <Tooltip formatter={(val) => formatMoney(val)} />
                      <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
              </ResponsiveContainer>
          </div>

          {/* LISTE DES ACTIFS (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-brand-gold rounded-full"></span>
                      Mes Positions
                  </h3>
                  <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                      <Plus size={16} /> Ajouter
                  </button>
              </div>

              {/* FORMULAIRE AJOUT */}
              {showForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 animate-fade-in grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                      <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400">Ticker</label>
                          <input type="text" placeholder="ex: AAPL" value={newAsset.ticker} onChange={e => setNewAsset({...newAsset, ticker: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 font-bold uppercase outline-none focus:border-brand-gold" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400">Quantité</label>
                          <input type="number" placeholder="10" value={newAsset.qty} onChange={e => setNewAsset({...newAsset, qty: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 font-bold outline-none focus:border-brand-gold" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400">Prix Moyen</label>
                          <input type="number" placeholder="150" value={newAsset.price} onChange={e => setNewAsset({...newAsset, price: e.target.value})} className="w-full p-2 rounded-lg border border-gray-300 font-bold outline-none focus:border-brand-gold" />
                      </div>
                      <button onClick={handleAddAsset} className="h-[42px] bg-brand-gold text-white font-bold rounded-lg hover:bg-yellow-600">Valider</button>
                  </div>
              )}

              {/* TABLEAU */}
              <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead>
                          <tr className="text-left text-[10px] font-bold uppercase text-gray-400 border-b border-gray-100">
                              <th className="pb-3 pl-2">Actif</th>
                              <th className="pb-3">Qté</th>
                              <th className="pb-3">Prix Moyen</th>
                              <th className="pb-3">Valeur</th>
                              <th className="pb-3">P/L (+/-)</th>
                              <th className="pb-3 text-right pr-2">Action</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm">
                          {assets.map((asset) => {
                              const val = asset.qty * asset.currentPrice;
                              const pl = val - (asset.qty * asset.avgPrice);
                              const plPercent = (pl / (asset.qty * asset.avgPrice)) * 100;
                              
                              return (
                                  <tr key={asset.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                                      <td className="py-4 pl-2 font-bold text-gray-800 flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                                              {asset.ticker.substring(0,2)}
                                          </div>
                                          <div>
                                              <p>{asset.ticker}</p>
                                              <p className="text-[10px] text-gray-400 font-normal hidden md:block">{asset.name}</p>
                                          </div>
                                      </td>
                                      <td className="py-4 font-mono text-gray-600">{asset.qty}</td>
                                      <td className="py-4 font-mono text-gray-600">{asset.avgPrice} €</td>
                                      <td className="py-4 font-bold text-brand-dark">{formatMoney(val)}</td>
                                      <td className={`py-4 font-bold ${pl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                          {pl >= 0 ? '+' : ''}{formatMoney(pl)} <span className="text-[10px] opacity-70">({plPercent.toFixed(1)}%)</span>
                                      </td>
                                      <td className="py-4 text-right pr-2">
                                          <button onClick={() => handleDelete(asset.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                              <Trash2 size={16} />
                                          </button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
                  
                  {assets.length === 0 && (
                      <div className="text-center py-10 text-gray-400 italic text-sm">
                          Votre portefeuille est vide. Ajoutez une position pour commencer.
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}