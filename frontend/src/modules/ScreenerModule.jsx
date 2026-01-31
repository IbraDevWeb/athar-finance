import React, { useState, useEffect } from 'react';
import { 
  Search, ArrowRight, X, TrendingUp, AlertTriangle, 
  CheckCircle, Activity, DollarSign, BarChart3, ShieldCheck, FileText, Info 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ScreenerModule({ autoSearch }) {
  const [ticker, setTicker] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 1. LISTE DES PRESETS (MISE À JOUR : MÉTAUX AU LIEU DE CRYPTOS) ---
  const PRESETS = [
    { 
      label: "US Tech", 
      icon: "🇺🇸", 
      assets: [
        { t: "AAPL", n: "Apple" }, { t: "MSFT", n: "Microsoft" }, { t: "GOOGL", n: "Google" }, 
        { t: "TSLA", n: "Tesla" }, { t: "NVDA", n: "NVIDIA" }, { t: "META", n: "Meta (FB)" }, 
        { t: "AMZN", n: "Amazon" }, { t: "NFLX", n: "Netflix" }, { t: "ADBE", n: "Adobe" },
        { t: "CRM", n: "Salesforce" }, { t: "AMD", n: "AMD" }, { t: "INTC", n: "Intel" }
      ] 
    },
    { 
      label: "France (CAC)", 
      icon: "🇫🇷", 
      assets: [
        { t: "MC.PA", n: "LVMH" }, { t: "OR.PA", n: "L'Oréal" }, { t: "TTE.PA", n: "TotalEnergies" }, 
        { t: "SAN.PA", n: "Sanofi" }, { t: "AIR.PA", n: "Airbus" }, { t: "RMS.PA", n: "Hermès" }, 
        { t: "AI.PA", n: "Air Liquide" }, { t: "SU.PA", n: "Schneider" }, { t: "BNP.PA", n: "BNP Paribas" },
        { t: "GLE.PA", n: "Soc. Générale" }, { t: "BN.PA", n: "Danone" }, { t: "HO.PA", n: "Thales" }
      ] 
    },
    { 
      label: "Halal & Golfe", 
      icon: "☪️", 
      assets: [
        { t: "SPUS", n: "S&P 500 Sharia" }, { t: "HLAL", n: "Wahed FTSE" }, { t: "ISDW.L", n: "World Islamic" },
        { t: "2222.SR", n: "Saudi Aramco" }, { t: "1120.SR", n: "Al Rajhi Bank" }, { t: "SPSK", n: "Sukuk Global" },
        { t: "GLDM", n: "Gold Mini" }, { t: "UMRA", n: "Wahed Dow Jones" }
      ] 
    },
    { 
      label: "Métaux & Énergie", 
      icon: "🛡️", 
      assets: [
        { t: "SGLD.L", n: "Or Physique (iShares)" }, 
        { t: "SSLV.L", n: "Argent Physique" }, 
        { t: "PHPT.L", n: "Platine Physique" }, 
        { t: "PHPD.L", n: "Palladium Physique" },
        { t: "GBS.L", n: "Gold Bullion" },
        { t: "PHAG.L", n: "WisdomTree Silver" },
        { t: "IGLN.L", n: "iShares Physical Gold" },
        { t: "SRET.SR", n: "Saudi REITS" }
      ] 
    }
  ];

  const [activePreset, setActivePreset] = useState(PRESETS[0]);

  // --- 2. GESTION AUTOMATIQUE ---
  useEffect(() => {
    if (autoSearch) {
      setTicker(autoSearch);
      fetchAnalysis(autoSearch);
    }
  }, [autoSearch]);

  // --- 3. RECHERCHE API ---
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
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchAnalysis(ticker);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="text-center mb-10 space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-glow mb-2">
            <Search size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Moteur de Recherche Islamique</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
          Screener Pro <span className="text-brand-gold">&</span> Multi-Actifs
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Analysez la conformité charia de 5000+ actifs. 
          <span className="hidden md:inline"> Actions, ETFs et Matières Premières Physiques.</span>
        </p>
      </div>

      {/* --- BARRE DE RECHERCHE --- */}
      <div className="bg-white dark:bg-[#121212] p-2 md:p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 mb-10 max-w-3xl mx-auto transition-colors">
          <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search size={20} className="text-gray-400 group-focus-within:text-brand-gold transition-colors" />
                  </div>
                  <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Rechercher (ex: LVMH, AAPL, SGLD...)"
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

              <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-brand-gold hover:bg-yellow-600 text-white dark:text-brand-dark font-bold rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                  {loading ? (
                      <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                          <span>...</span>
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

      {/* --- PRESETS --- */}
      <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setActivePreset(preset)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  activePreset.label === preset.label
                    ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-md transform scale-105'
                    : 'bg-white dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10 hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                <span className="mr-2">{preset.icon}</span>
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 px-4 max-w-6xl mx-auto">
              {activePreset.assets.map((asset) => (
                  <button
                      key={asset.t}
                      onClick={() => { setTicker(asset.t); fetchAnalysis(asset.t); }}
                      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-2xl hover:border-brand-gold hover:shadow-glow hover:-translate-y-1 transition-all group h-full"
                  >
                      <span className="text-sm font-bold text-gray-800 dark:text-white text-center leading-tight mb-1 group-hover:text-brand-gold transition-colors">
                        {asset.n}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">
                        {asset.t}
                      </span>
                  </button>
              ))}
          </div>
      </div>

      {/* --- RÉSULTATS --- */}
      
      {error && (
        <div className="max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 rounded-2xl flex items-center gap-4 text-red-600 dark:text-red-400 animate-fade-in mb-10">
          <AlertTriangle size={24} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in transition-colors">
            
            {/* EN-TÊTE */}
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

                {/* VERDICT */}
                <div className={`px-8 py-4 rounded-2xl border-2 flex items-center gap-4 shadow-lg ${
                    result.compliance?.is_halal
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-900/10 border-red-500 text-red-600 dark:text-red-400'
                }`}>
                    {result.compliance?.is_halal ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Verdict Charia</p>
                        <p className="text-3xl font-bold font-display">{result.compliance?.is_halal ? "HALAL" : "HARAM"}</p>
                    </div>
                </div>
            </div>

            {/* CONTENU ANALYSE */}
            <div className="p-6 md:p-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                    <BarChart3 size={16} /> Analyse Financière (AAOIFI)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <GaugeCard 
                        label="Dette / Market Cap"
                        value={result.ratios?.debt_ratio}
                        limit={33}
                        isGood={result.ratios?.debt_ratio < 33}
                    />
                    <GaugeCard 
                        label="Cash / Market Cap"
                        value={result.ratios?.cash_ratio}
                        limit={33}
                        isGood={result.ratios?.cash_ratio < 33}
                    />
                    <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-500/30 relative overflow-hidden flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-500">
                                Revenus Impurs
                            </span>
                            <Info size={16} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium leading-relaxed mb-3">
                                ⚠️ Donnée non disponible automatiquement. Vérifiez le rapport annuel.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                                <FileText size={12} />
                                <span>Cible : Intérêts &lt; 5%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <Activity size={16} /> Activité Commerciale
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between p-3 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5">
                                <span className="text-sm text-gray-500">Secteur</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">{result.sector}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5">
                                <span className="text-sm text-gray-500">Industrie</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[200px]">{result.industry}</span>
                            </div>
                            <div className={`p-4 rounded-xl border ${result.compliance?.business_check?.failed ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'}`}>
                                <p className="text-xs font-bold uppercase mb-1 flex items-center gap-2">
                                    {result.compliance?.business_check?.failed ? <AlertTriangle size={12}/> : <ShieldCheck size={12}/>}
                                    Screener Sectoriel
                                </p>
                                <p className="text-sm">
                                    {result.compliance?.business_check?.failed 
                                        ? `Activité illicite détectée : ${result.compliance.business_check.found_keywords.join(', ')}`
                                        : "Aucune activité illicite majeure détectée."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <DollarSign size={16} /> Fondamentaux
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           <MetricBox label="PER (Price Earning)" value={result.technicals?.per || "N/A"} />
                           <MetricBox label="ROE (Rentabilité)" value={result.technicals?.roe ? `${result.technicals.roe}%` : "N/A"} />
                           <MetricBox label="Dividende" value={result.technicals?.dividend_yield ? `${result.technicals.dividend_yield}%` : "0%"} />
                           <div className="p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col justify-center">
                               <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Qualité Bilan</p>
                               <div className="flex text-brand-gold">
                                   {'★'.repeat(4)}{'☆'}
                               </div>
                           </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 text-center">
                    <p className="text-xs text-gray-400 italic">
                        Les données sont fournies à titre indicatif. L'investisseur est responsable de sa purification finale.
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
    const percent = Math.min((value / (limit * 1.5)) * 100, 100); 
    return (
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 relative overflow-hidden group flex flex-col justify-between h-full">
            <div className="flex justify-between items-end mb-3 relative z-10">
                <span className="text-[10px] font-bold uppercase text-gray-500">{label}</span>
                <span className={`text-xl font-mono font-bold ${isGood ? 'text-emerald-500' : 'text-red-500'}`}>
                    {value}%
                </span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative z-10 mb-2">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isGood ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 relative z-10">
                <span>0%</span>
                <span className="font-bold text-brand-gold">Max: {limit}%</span>
            </div>
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