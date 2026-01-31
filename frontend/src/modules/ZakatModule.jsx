import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Calculator, Heart, Info, Coins, Banknote, Landmark, 
  TrendingUp, AlertCircle, CheckCircle, ArrowRight 
} from 'lucide-react';

export default function ZakatModule() {
  const [activeTab, setActiveTab] = useState('maal'); // 'maal' (épargne) ou 'purification' (dividendes)

  // --- ÉTATS ZAKAT AL MAAL ---
  // Valeurs par défaut (Prix de l'or au gramme ~70€, Nissab ~5950€)
  const [goldPrice, setGoldPrice] = useState(70); 
  const [assets, setAssets] = useState({
    cash: 0,        // Comptes courants + Espèces
    savings: 0,     // Livrets (A, LDD...)
    gold: 0,        // Valeur Or/Argent physique
    shares: 0,      // Actions / ETF / Crypto (Valeur marché)
    business: 0,    // Marchandises pour commerce
    debts: 0        // Dettes à court terme (à déduire)
  });

  // --- ÉTATS PURIFICATION ---
  const [dividendAmount, setDividendAmount] = useState(100);
  const [impurePercent, setImpurePercent] = useState(3); // Ex: 3% de revenus illicites dans l'entreprise

  // --- CALCULS ---
  const nissab = goldPrice * 85; // Seuil légal (85g d'or)
  const totalAssets = (assets.cash + assets.savings + assets.gold + assets.shares + assets.business);
  const netWealth = totalAssets - assets.debts;
  const zakatDue = Math.max(0, netWealth * 0.025); // 2.5%
  const isEligible = netWealth >= nissab;

  const purificationDue = dividendAmount * (impurePercent / 100);

  // Données Graphique
  const chartData = [
    { name: 'Liquidités', value: assets.cash + assets.savings },
    { name: 'Investissements', value: assets.shares + assets.business },
    { name: 'Or & Bijoux', value: assets.gold },
  ].filter(d => d.value > 0);

  const COLORS = ['#1e293b', '#c5a059', '#64748b'];
  const formatMoney = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-2 text-brand-gold">
           <Heart size={32} />
        </div>
        <h1 className="font-display text-4xl font-bold text-brand-dark">Purification & Partage</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          "Prélève de leurs biens une aumône par laquelle tu les purifies et les bénis." (Coran 9:103)
        </p>

        {/* TABS NAVIGATION */}
        <div className="flex justify-center mt-6 gap-4">
             <button 
                onClick={() => setActiveTab('maal')}
                className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'maal' ? 'bg-brand-dark text-brand-gold shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'}`}
             >
                 Zakat Al-Maal (Épargne)
             </button>
             <button 
                onClick={() => setActiveTab('purification')}
                className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'purification' ? 'bg-brand-dark text-brand-gold shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'}`}
             >
                 Purification (Dividendes)
             </button>
        </div>
      </div>

      {/* --- ONGLET 1 : ZAKAT AL MAAL --- */}
      {activeTab === 'maal' && (
          <div className="grid lg:grid-cols-12 gap-8">
              
              {/* GAUCHE : FORMULAIRE */}
              <div className="lg:col-span-7 space-y-6">
                  
                  {/* Carte Nissab */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Seuil d'imposition (Nissab)</p>
                          <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-brand-dark">{formatMoney(nissab)}</span>
                              <span className="text-xs text-gray-500 mb-1">(Basé sur 85g d'or)</span>
                          </div>
                      </div>
                      <div className="text-right">
                           <label className="text-[10px] font-bold text-brand-gold uppercase block mb-1">Prix Or / Gramme</label>
                           <div className="relative w-24 ml-auto">
                               <input 
                                  type="number" 
                                  value={goldPrice} 
                                  onChange={(e) => setGoldPrice(Number(e.target.value))}
                                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-right font-mono font-bold outline-none focus:border-brand-gold"
                               />
                               <span className="absolute right-8 top-2 text-gray-400 text-xs">€</span>
                           </div>
                      </div>
                  </div>

                  {/* Inputs Actifs */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                      <h3 className="font-bold text-brand-dark flex items-center gap-2 mb-4">
                          <Calculator size={20}/> Vos Avoirs (détenus depuis 1 an)
                      </h3>
                      
                      <InputRow 
                        label="Comptes Bancaires & Espèces" 
                        icon={Banknote} 
                        value={assets.cash} 
                        onChange={(v) => setAssets({...assets, cash: v})} 
                      />
                      <InputRow 
                        label="Épargne Disponible (Livret A, LDD...)" 
                        icon={Landmark} 
                        value={assets.savings} 
                        onChange={(v) => setAssets({...assets, savings: v})} 
                      />
                      <InputRow 
                        label="Investissements (Actions, Crypto)" 
                        icon={TrendingUp} 
                        tooltip="Valeur totale du portefeuille à ce jour."
                        value={assets.shares} 
                        onChange={(v) => setAssets({...assets, shares: v})} 
                      />
                      <InputRow 
                        label="Or & Argent (Valeur poids)" 
                        icon={Coins} 
                        value={assets.gold} 
                        onChange={(v) => setAssets({...assets, gold: v})} 
                      />
                      
                      <div className="pt-4 border-t border-gray-100">
                          <InputRow 
                            label="Dettes à court terme (À déduire)" 
                            icon={AlertCircle} 
                            isDeduction
                            value={assets.debts} 
                            onChange={(v) => setAssets({...assets, debts: v})} 
                          />
                      </div>
                  </div>
              </div>

              {/* DROITE : RÉSULTATS */}
              <div className="lg:col-span-5 space-y-6">
                  
                  {/* Carte Résultat Principal */}
                  <div className={`p-8 rounded-3xl text-center transition-all duration-500 shadow-xl ${isEligible ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <p className="font-bold uppercase tracking-widest text-xs mb-2 opacity-70">
                          {isEligible ? "Montant à payer" : "Vous n'êtes pas imposable"}
                      </p>
                      <div className="text-5xl font-display font-bold mb-4">
                          {isEligible ? formatMoney(zakatDue) : "0 €"}
                      </div>
                      
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${isEligible ? 'bg-brand-gold text-brand-dark' : 'bg-gray-200 text-gray-500'}`}>
                          {isEligible ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                          <span>{isEligible ? "Éligible au paiement" : `Patrimoine < ${formatMoney(nissab)}`}</span>
                      </div>
                  </div>

                  {/* Jauge Nissab */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between text-xs font-bold uppercase text-gray-400 mb-2">
                          <span>0 €</span>
                          <span>Nissab: {formatMoney(nissab)}</span>
                      </div>
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden relative">
                          {/* Marqueur Nissab */}
                          <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${Math.min((nissab / (nissab * 1.5)) * 100, 100)}%` }}></div>
                          
                          {/* Barre Progression */}
                          <div 
                             className={`h-full transition-all duration-1000 ${isEligible ? 'bg-brand-gold' : 'bg-gray-400'}`}
                             style={{ width: `${Math.min((netWealth / (nissab * 1.5)) * 100, 100)}%` }}
                          ></div>
                      </div>
                      <p className="text-center text-xs mt-3 text-gray-500">
                          Votre patrimoine net : <strong>{formatMoney(netWealth)}</strong>
                      </p>
                  </div>

                  {/* Graphique Répartition */}
                  {netWealth > 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[250px] flex flex-col">
                          <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 text-center">Composition Patrimoine</h4>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => formatMoney(val)} />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                      </div>
                  )}

              </div>
          </div>
      )}

      {/* --- ONGLET 2 : PURIFICATION --- */}
      {activeTab === 'purification' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg text-center mb-8">
                  <div className="inline-flex justify-center items-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                      <Info size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Pourquoi purifier ?</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                      Même une action "Halal" peut générer une petite part de revenus illicites (ex: intérêts de trésorerie). 
                      Il est recommandé de donner cette part en charité (sans attendre de récompense) pour nettoyer votre argent.
                  </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-brand-dark mb-6 uppercase text-sm tracking-widest">Calculateur</h4>
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase">Dividendes Reçus</label>
                              <div className="relative mt-1">
                                  <input 
                                      type="number" value={dividendAmount} onChange={(e) => setDividendAmount(Number(e.target.value))}
                                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-brand-dark outline-none focus:border-brand-gold"
                                  />
                                  <span className="absolute right-4 top-3 text-gray-400 font-bold">€</span>
                              </div>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase">Part Impure (%)</label>
                              <div className="relative mt-1">
                                  <input 
                                      type="number" value={impurePercent} onChange={(e) => setImpurePercent(Number(e.target.value))}
                                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-brand-dark outline-none focus:border-brand-gold"
                                  />
                                  <span className="absolute right-4 top-3 text-gray-400 font-bold">%</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2">
                                  * Indiqué dans les rapports annuels ou via le Screener Pro.
                              </p>
                          </div>
                      </div>
                  </div>

                  <div className="bg-brand-dark p-8 rounded-2xl text-white flex flex-col justify-center items-center text-center shadow-xl">
                      <p className="font-bold uppercase tracking-widest text-xs opacity-60 mb-2">Montant à donner</p>
                      <p className="text-5xl font-display font-bold text-brand-gold mb-6">{formatMoney(purificationDue)}</p>
                      <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                          Trouver une association <ArrowRight size={16} />
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

// --- SOUS-COMPOSANT LIGNE INPUT ---
function InputRow({ label, icon: Icon, value, onChange, isDeduction, tooltip }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDeduction ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-brand-dark'}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <p className={`text-xs font-bold uppercase ${isDeduction ? 'text-red-500' : 'text-gray-500'} flex items-center gap-1`}>
                    {label}
                    {tooltip && <Info size={12} className="cursor-help text-gray-300"/>}
                </p>
                <div className="relative mt-1">
                    <input 
                        type="number" 
                        value={value === 0 ? '' : value} 
                        onChange={(e) => onChange(Number(e.target.value))}
                        placeholder="0"
                        className={`w-full p-2 bg-transparent border-b-2 font-mono font-bold text-lg outline-none transition-colors ${isDeduction ? 'border-red-100 focus:border-red-500 text-red-600' : 'border-gray-100 focus:border-brand-gold text-brand-dark'}`}
                    />
                    <span className="absolute right-0 bottom-2 text-gray-300 font-bold">€</span>
                </div>
            </div>
        </div>
    );
}