import React, { useState, useEffect } from 'react';
import { 
  Search, ArrowRight, X, TrendingUp, AlertTriangle, 
  CheckCircle, Activity, DollarSign, BarChart3, ShieldCheck 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com';

export default function ScreenerModule({ autoSearch }) {
  const [ticker, setTicker] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. LISTE DES PRESETS (Boutons rapides) ---
  const PRESETS = [
    { label: "US Tech", icon: "🇺🇸", tickers: ["AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "META", "AMZN"] },
    { label: "CAC 40", icon: "🇫🇷", tickers: ["MC.PA", "OR.PA", "AIR.PA", "RMS.PA", "SAN.PA", "TTE.PA"] },
    { label: "Halal & Golfe", icon: "☪️", tickers: ["2222.SR", "1120.SR", "SPUS", "HLAL", "ISDW.L"] },
    { label: "Cryptos", icon: "🪙", tickers: ["BTC-USD", "ETH-USD", "SOL-USD", "AVAX-USD"] },
    { label: "Or & Divers", icon: "🥇", tickers: ["GC=F", "SI=F", "CL=F"] },
  ];

  const [activePreset, setActivePreset] = useState(PRESETS[0]);

  // --- 2. GESTION AUTOMATIQUE (Si on vient de la Watchlist) ---
  useEffect(() => {
    if (autoSearch) {
      setTicker(autoSearch);
      fetchAnalysis(autoSearch);
    }
  }, [autoSearch]);

  // --- 3. FONCTION DE RECHERCHE (API) ---
  const fetchAnalysis = async (searchTicker) => {
    if (!searchTicker) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/screening/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers: searchTicker })
      });

      if (!response.ok) throw new Error("Erreur serveur");
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setResult(data.results[0]);
      } else {
        setError("Aucun résultat trouvé pour ce ticker.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchAnalysis(ticker);

  // --- 4. AFFICHAGE (RENDER) ---
  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-glow mb-4">
            <Search size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Moteur de Recherche Islamique</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
          Screener Pro <span className="text-brand-gold">&</span> Multi-Actifs
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Analysez instantanément la conformité charia de plus de 5000 actions, ETFs et Cryptomonnaies selon les normes AAOIFI.
        </p>
      </div>

      {/* --- BARRE DE RECHERCHE RESPONSIVE (CORRIGÉE) --- */}
      <div className="bg-white dark:bg-[#121212] p-2 md:p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 mb-8 max-w-3xl mx-auto transition-colors">
          <div className="flex flex-col md:flex-row gap-3">
              {/* INPUT */}
              <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search size={20} className="text-gray-400 group-focus-within:text-brand-gold transition-colors" />
                  </div>
                  <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Entrez un ticker (ex: AAPL, BTC...)"
                      className="block w-full pl-12 pr-10 py-4 border-2 border-transparent bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-[#0a0a0a] focus:border-brand-gold transition-all font-bold text-lg"
                  />
                  {ticker && (
                      <button 
                          onClick={() => setTicker('')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                          <X size={20} />
                      </button>
                  )}
              </div>

              {/* BOUTON (Plein écran sur mobile) */}
              <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-brand-gold hover:bg-yellow-600 text-white dark:text-brand-dark font-bold rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                  {loading ? (
                      <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                          <span>Analyse...</span>
                      </>
                  ) : (
                      <>
                          <span>SCANNER</span>
                          <ArrowRight size={20} />
                      </>
                  )}
              </button>
          </div>
      </div>

      {/* --- PRESETS (BOUTONS RAPIDES) --- */}
      <div className="mb-12 overflow-x-auto pb-4 custom-scrollbar">
          {/* Onglets Catégories */}
          <div className="flex justify-center gap-4 mb-6 min-w-max px-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setActivePreset(preset)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  activePreset.label === preset.label
                    ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-lg'
                    : 'bg-white dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10 hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                <span className="mr-2">{preset.icon}</span>
                {preset.label}
              </button>
            ))}
          </div>

          {/* Grille des Tickers du Preset */}
          <div className="flex flex-wrap justify-center gap-3 px-4">
              {activePreset.tickers.map((t) => (
                  <button
                      key={t}
                      onClick={() => { setTicker(t); fetchAnalysis(t); }}
                      className="px-6 py-3 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-xl hover:border-brand-gold hover:shadow-glow transition-all group"
                  >
                      <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-gold">{t}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* --- AFFICHAGE DES RÉSULTATS --- */}
      
      {/* 1. ERREUR */}
      {error && (
        <div className="max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-center gap-4 text-red-600 dark:text-red-400 animate-fade-in">
          <AlertTriangle size={24} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* 2. RÉSULTAT */}
      {result && !loading && (
        <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
            
            {/* EN-TÊTE RÉSULTAT */}
            <div className="p-6 md:p-10 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/50 dark:bg-white/[0.02]">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-gray-200 dark:bg-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                            {result.ticker}
                        </span>
                        <span className="text-xs text-gray-400">{result.sector || "Secteur Inconnu"}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-1">
                        {result.name || result.ticker}
                    </h2>
                    <p className="text-2xl font-mono font-bold text-brand-gold">
                        {result.price?.toLocaleString()} <span className="text-sm text-gray-400">$</span>
                    </p>
                </div>

                {/* BADGE HALAL / HARAM */}
                <div className={`px-8 py-4 rounded-2xl border-2 flex items-center gap-3 shadow-lg ${
                    result.compliance?.is_halal
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-900/10 border-red-500 text-red-600 dark:text-red-400'
                }`}>
                    {result.compliance?.is_halal ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Verdict Charia</p>
                        <p className="text-2xl font-bold">{result.compliance?.is_halal ? "HALAL" : "HARAM"}</p>
                    </div>
                </div>
            </div>

            {/* CONTENU DÉTAILLÉ */}
            <div className="p-6 md:p-10">
                
                {/* 3 JAUGES (Ratio Financiers) */}
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <BarChart3 size={16} /> Analyse Financière (AAOIFI)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    
                    {/* JAUGE 1 : DETTE (< 33%) */}
                    <GaugeCard 
                        label="Dette / Market Cap"
                        value={result.ratios?.debt_ratio}
                        limit={33}
                        isGood={result.ratios?.debt_ratio < 33}
                    />

                    {/* JAUGE 2 : CASH (< 33%) */}
                    <GaugeCard 
                        label="Cash / Market Cap"
                        value={result.ratios?.cash_ratio}
                        limit={33}
                        isGood={result.ratios?.cash_ratio < 33}
                    />

                    {/* JAUGE 3 : REVENUS IMPURS (< 5%) */}
                    <GaugeCard 
                        label="Revenus Impurs (Intérêts)"
                        value={result.ratios?.impure_ratio || 0}
                        limit={5}
                        isGood={(result.ratios?.impure_ratio || 0) < 5}
                    />
                </div>

                {/* ANALYSE BUSINESS (Activité) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Colonne Gauche : Activité */}
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <Activity size={16} /> Activité Commerciale
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between p-3 bg-white dark:bg-black/20 rounded-lg">
                                <span className="text-sm text-gray-500">Secteur</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">{result.sector}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white dark:bg-black/20 rounded-lg">
                                <span className="text-sm text-gray-500">Industrie</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[200px]">{result.industry}</span>
                            </div>
                            <div className={`p-4 rounded-xl border ${result.compliance?.business_check?.failed ? 'bg-red-100 border-red-200 text-red-800' : 'bg-emerald-100 border-emerald-200 text-emerald-800'}`}>
                                <p className="text-xs font-bold uppercase mb-1">Analyse Mots-Clés</p>
                                <p className="text-sm">
                                    {result.compliance?.business_check?.failed 
                                        ? `⚠️ Détecté : ${result.compliance.business_check.found_keywords.join(', ')}`
                                        : "✅ Aucune activité illicite majeure détectée (Alcool, Porc, Jeux, Banques...)"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Colonne Droite : Fondamentaux */}
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <DollarSign size={16} /> Fondamentaux
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           <MetricBox label="PER (Price Earning)" value={result.technicals?.per || "N/A"} />
                           <MetricBox label="ROE (Rentabilité)" value={result.technicals?.roe ? `${result.technicals.roe}%` : "N/A"} />
                           <MetricBox label="Dividende" value={result.technicals?.dividend_yield ? `${result.technicals.dividend_yield}%` : "0%"} />
                           <div className="p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                               <p className="text-[10px] text-gray-400 uppercase font-bold">Qualité Bilan</p>
                               <div className="flex text-brand-gold mt-1">
                                   {'★'.repeat(4)}{'☆'}
                               </div>
                           </div>
                        </div>
                    </div>

                </div>

                {/* DISCLAIMER */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 text-center">
                    <p className="text-xs text-gray-400 italic">
                        <ShieldCheck size={12} className="inline mr-1" />
                        Les données financières sont fournies à titre indicatif via Yahoo Finance. Toujours vérifier le rapport annuel pour une précision à 100%.
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function GaugeCard({ label, value, limit, isGood }) {
    // Calcul de la largeur de la barre (max 100%)
    // On met à l'échelle : si la limite est 33%, on veut que 33% remplisse une bonne partie visuelle
    // Ici on fait simple : width = (value / limit) * 70. Si value > limit, ça dépasse.
    const percent = Math.min((value / (limit * 1.5)) * 100, 100); 
    
    return (
        <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-end mb-2 relative z-10">
                <span className="text-[10px] font-bold uppercase text-gray-500">{label}</span>
                <span className={`text-lg font-mono font-bold ${isGood ? 'text-emerald-500' : 'text-red-500'}`}>
                    {value}%
                </span>
            </div>
            
            {/* Barre de fond */}
            <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative z-10">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isGood ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
            
            {/* Seuil marker */}
            <div className="mt-1 flex justify-between text-[9px] text-gray-400 relative z-10">
                <span>0%</span>
                <span className="font-bold text-brand-gold">Seuil: {limit}%</span>
            </div>

            {/* Effet Glow au survol */}
            <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
}

function MetricBox({ label, value }) {
    return (
        <div className="p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{label}</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
    );
}