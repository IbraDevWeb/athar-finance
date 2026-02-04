import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Calculator, Heart, Info, Coins, Banknote, Landmark, 
  TrendingUp, AlertCircle, CheckCircle, ArrowRight, Wallet, Sparkles, Scale 
} from 'lucide-react';

export default function ZakatModule() {
  const [activeTab, setActiveTab] = useState('maal'); // 'maal' or 'purification'

  // --- ÉTATS ZAKAT AL MAAL ---
  const [goldPrice, setGoldPrice] = useState(70); 
  const [assets, setAssets] = useState({
    cash: 0,        // Comptes courants + Espèces
    savings: 0,     // Livrets (A, LDD...)
    gold: 0,        // Valeur Or/Argent physique
    shares: 0,      // Actions / ETF / Crypto
    business: 0,    // Marchandises
    debts: 0        // Dettes à court terme
  });

  // --- ÉTATS PURIFICATION ---
  const [dividendAmount, setDividendAmount] = useState(100);
  const [impurePercent, setImpurePercent] = useState(3);

  // --- CALCULS ---
  const nissab = goldPrice * 85; 
  const totalAssets = (assets.cash + assets.savings + assets.gold + assets.shares + assets.business);
  const netWealth = totalAssets - assets.debts;
  const zakatDue = Math.max(0, netWealth * 0.025); 
  const isEligible = netWealth >= nissab;
  const progression = Math.min((netWealth / (nissab * 1.5)) * 100, 100);

  const purificationDue = dividendAmount * (impurePercent / 100);

  // Données Graphique
  const chartData = [
    { name: 'Liquidités', value: assets.cash + assets.savings },
    { name: 'Investissements', value: assets.shares + assets.business },
    { name: 'Or & Bijoux', value: assets.gold },
  ].filter(d => d.value > 0);

  const COLORS = ['#10b981', '#fbbf24', '#6366f1']; // Emerald, Amber, Indigo
  
  const formatMoney = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in space-y-10">
      
      {/* HEADER */}
      <div className="text-center pt-8 space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold shadow-[0_0_30px_-10px_rgba(251,191,36,0.3)]">
           <Scale size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
           Purification & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-300">Partage</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
          "Prélève de leurs biens une aumône par laquelle tu les purifies et les bénis." <span className="text-brand-gold font-serif italic text-sm">(Coran 9:103)</span>
        </p>

        {/* NAVIGATION TABS */}
        <div className="flex justify-center mt-8">
             <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-2xl flex relative">
                 {/* Fond animé du tab actif */}
                 <div 
                    className={`absolute top-1 bottom-1 w-[48%] bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm transition-all duration-300 ease-out ${activeTab === 'maal' ? 'left-1' : 'left-[51%]'}`}
                 ></div>
                 
                 <button 
                    onClick={() => setActiveTab('maal')}
                    className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'maal' ? 'text-brand-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                 >
                     Zakat Al-Maal
                 </button>
                 <button 
                    onClick={() => setActiveTab('purification')}
                    className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'purification' ? 'text-brand-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                 >
                     Purification
                 </button>
             </div>
        </div>
      </div>

      {/* --- SECTION 1 : ZAKAT AL MAAL --- */}
      {activeTab === 'maal' && (
          <div className="grid lg:grid-cols-12 gap-8 animate-fade-in-up">
              
              {/* GAUCHE : CALCULATEUR */}
              <div className="lg:col-span-7 space-y-6">
                  
                  {/* Carte Paramètres (Nissab) */}
                  <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                      <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-brand-gold/10 text-brand-gold">
                              <Info size={24} />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Seuil Imposable (Nissab)</p>
                              <p className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{formatMoney(nissab)}</p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                           <span className="text-[10px] font-bold text-gray-500 uppercase">Prix Or / g</span>
                           <div className="relative w-20">
                               <input 
                                  type="number" 
                                  value={goldPrice} 
                                  onChange={(e) => setGoldPrice(Number(e.target.value))}
                                  className="w-full bg-transparent text-right font-mono font-bold outline-none border-b border-brand-gold/50 focus:border-brand-gold text-brand-dark dark:text-white"
                               />
                           </div>
                           <span className="text-xs font-bold text-brand-gold">€</span>
                      </div>
                  </div>

                  {/* Formulaire Avoirs */}
                  <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                          <Wallet className="text-brand-gold"/> Vos Avoirs <span className="text-xs font-normal text-gray-400 ml-auto">(Possédés depuis 1 an)</span>
                      </h3>
                      
                      <div className="space-y-4">
                          <InputRow label="Comptes & Espèces" icon={Banknote} value={assets.cash} onChange={(v) => setAssets({...assets, cash: v})} />
                          <InputRow label="Épargne (Livrets)" icon={Landmark} value={assets.savings} onChange={(v) => setAssets({...assets, savings: v})} />
                          <InputRow label="Investissements (Actions)" icon={TrendingUp} value={assets.shares} onChange={(v) => setAssets({...assets, shares: v})} />
                          <InputRow label="Or & Argent" icon={Coins} value={assets.gold} onChange={(v) => setAssets({...assets, gold: v})} />
                      </div>
                      
                      <div className="pt-6 mt-6 border-t border-dashed border-gray-200 dark:border-white/10">
                          <InputRow 
                            label="Dettes à court terme" 
                            icon={AlertCircle} 
                            isDeduction
                            value={assets.debts} 
                            onChange={(v) => setAssets({...assets, debts: v})} 
                          />
                      </div>
                  </div>
              </div>

              {/* DROITE : RÉSULTATS & ANALYSE */}
              <div className="lg:col-span-5 space-y-6">
                  
                  {/* Carte Résultat Principal */}
                  <div className={`relative overflow-hidden p-8 rounded-[2.5rem] text-center transition-all duration-500 shadow-2xl ${isEligible ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white border border-brand-gold/30' : 'bg-gray-100 dark:bg-white/5 text-gray-400 border border-transparent'}`}>
                      
                      {/* Fond animé si éligible */}
                      {isEligible && <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none"></div>}

                      <p className="font-bold uppercase tracking-[0.2em] text-[10px] mb-4 opacity-70 relative z-10">
                          {isEligible ? "Montant de la Zakat" : "Non Imposable"}
                      </p>
                      
                      <div className="text-6xl font-mono font-bold mb-6 relative z-10 tracking-tight">
                          {isEligible ? formatMoney(zakatDue) : "0 €"}
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold relative z-10 ${isEligible ? 'bg-brand-gold text-brand-dark' : 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}>
                          {isEligible ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                          <span>{isEligible ? "Paiement Obligatoire" : `Patrimoine < Nissab`}</span>
                      </div>
                  </div>

                  {/* Jauge de Progression */}
                  <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                      <div className="flex justify-between items-end mb-4">
                          <div>
                              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Patrimoine Net</p>
                              <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">{formatMoney(netWealth)}</p>
                          </div>
                          <span className={`text-xs font-bold ${isEligible ? 'text-emerald-500' : 'text-gray-400'}`}>
                              {Math.round(progression)}% du seuil
                          </span>
                      </div>
                      
                      {/* Barre */}
                      <div className="h-3 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden relative">
                          {/* Ligne Rouge Nissab */}
                          <div className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20 shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ left: `${(1 / 1.5) * 100}%` }}></div>
                          
                          {/* Barre Progression */}
                          <div 
                             className={`h-full transition-all duration-1000 ease-out rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-brand-gold'}`}
                             style={{ width: `${progression}%` }}
                          ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                          <span>0€</span>
                          <span className="text-rose-500 font-bold">Nissab</span>
                          <span>Objectif</span>
                      </div>
                  </div>

                  {/* Graphique Répartition */}
                  {netWealth > 0 && (
                      <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm h-[280px] flex flex-col">
                          <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 text-center">Répartition du Patrimoine</h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1a1a1a', borderRadius: '12px', border: 'none', color: '#fff'}}
                                    itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                                    formatter={(val) => formatMoney(val)} 
                                />
                                <Legend wrapperStyle={{fontSize: '11px', fontWeight: '600', opacity: 0.7}} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                      </div>
                  )}

              </div>
          </div>
      )}

      {/* --- SECTION 2 : PURIFICATION --- */}
      {activeTab === 'purification' && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
              
              {/* Carte Explicative */}
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 text-center mb-10">
                  <div className="inline-flex justify-center items-center w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full mb-4 shadow-sm">
                      <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">La pureté avant le profit</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                      Même une entreprise "Halal" (comme Apple ou Tesla) peut avoir une petite part de revenus illicites (placements de trésorerie). 
                      Pour que vos gains soient totalement licites, vous devez "nettoyer" cette partie en la donnant.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                  
                  {/* Calculateur */}
                  <div className="bg-white dark:bg-[#121212] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-8 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                          <Calculator size={14} className="text-brand-gold"/> Calculateur Rapide
                      </h4>
                      
                      <div className="space-y-8">
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Dividendes Reçus</label>
                              <div className="relative mt-2 group">
                                  <input 
                                      type="number" value={dividendAmount} onChange={(e) => setDividendAmount(Number(e.target.value))}
                                      className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl font-mono text-2xl font-bold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-black focus:border-brand-gold/50 focus:shadow-lg transition-all"
                                  />
                                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                              </div>
                          </div>
                          
                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Part Impure</label>
                                  <span className="text-[10px] bg-red-100 dark:bg-red-500/20 text-red-500 px-2 py-0.5 rounded-md font-bold">À donner</span>
                              </div>
                              <div className="relative group">
                                  <input 
                                      type="number" value={impurePercent} onChange={(e) => setImpurePercent(Number(e.target.value))}
                                      className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl font-mono text-2xl font-bold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-black focus:border-brand-gold/50 focus:shadow-lg transition-all"
                                  />
                                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
                                  <Info size={12}/> Disponible dans le Screener Pro pour chaque action.
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Résultat Don */}
                  <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-10 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
                      
                      {/* Effet de fond */}
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                      <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-brand-gold/20 rounded-full blur-[60px]"></div>

                      <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-60 mb-4">Montant à purifier</p>
                      
                      <div className="relative mb-8">
                          <span className="text-6xl font-mono font-bold text-brand-gold tracking-tighter">
                            {formatMoney(purificationDue)}
                          </span>
                      </div>
                      
                      <button className="w-full py-4 bg-white/10 hover:bg-brand-gold hover:text-black rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm group">
                          Faire un don <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <p className="text-[10px] opacity-40 mt-6 max-w-xs mx-auto leading-normal">
                          Cet argent ne vous appartient pas religieusement. Donnez-le à n'importe quelle œuvre caritative (pauvres, hôpitaux, etc.).
                      </p>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

// --- SOUS-COMPOSANT INPUT ROW ---
function InputRow({ label, icon: Icon, value, onChange, isDeduction }) {
    return (
        <div className="group flex items-center gap-5 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isDeduction ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-brand-gold group-hover:bg-brand-gold/10'}`}>
                <Icon size={22} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDeduction ? 'text-rose-500' : 'text-gray-400'}`}>
                    {label}
                </p>
                <div className="relative">
                    <input 
                        type="number" 
                        value={value === 0 ? '' : value} 
                        onChange={(e) => onChange(Number(e.target.value))}
                        placeholder="0"
                        className={`w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-1 font-mono font-bold text-xl outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-white/10 ${isDeduction ? 'text-rose-500 focus:border-rose-500' : 'text-gray-900 dark:text-white focus:border-brand-gold'}`}
                    />
                    <span className="absolute right-0 bottom-2 text-sm text-gray-300 dark:text-gray-600 font-bold">€</span>
                </div>
            </div>
        </div>
    );
}