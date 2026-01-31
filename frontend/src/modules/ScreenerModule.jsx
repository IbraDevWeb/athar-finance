import React, { useState, useEffect } from 'react';
import { 
  Search, ArrowRight, X, TrendingUp, AlertTriangle, 
  CheckCircle, Activity, DollarSign, BarChart3, ShieldCheck, FileText, Info 
} from 'lucide-center';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ScreenerModule({ autoSearch }) {
  const [ticker, setTicker] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PRESETS = [
    { 
      label: "US Tech", 
      icon: "🇺🇸", 
      assets: [
        { t: "AAPL", n: "Apple" }, { t: "MSFT", n: "Microsoft" }, { t: "GOOGL", n: "Google" }, 
        { t: "TSLA", n: "Tesla" }, { t: "NVDA", n: "NVIDIA" }, { t: "META", n: "Meta (FB)" }, 
        { t: "AMZN", n: "Amazon" }, { t: "NFLX", n: "Netflix" }, { t: "ADBE", n: "Adobe" }
      ] 
    },
    { 
      label: "France (CAC)", 
      icon: "🇫🇷", 
      assets: [
        { t: "MC.PA", n: "LVMH" }, { t: "OR.PA", n: "L'Oréal" }, { t: "TTE.PA", n: "TotalEnergies" }, 
        { t: "SAN.PA", n: "Sanofi" }, { t: "AIR.PA", n: "Airbus" }, { t: "RMS.PA", n: "Hermès" }
      ] 
    },
    { 
      label: "Halal & Golfe", 
      icon: "☪️", 
      assets: [
        { t: "SPUS", n: "S&P 500 Sharia" }, { t: "HLAL", n: "Wahed FTSE" }, { t: "ISDW.L", n: "World Islamic" },
        { t: "2222.SR", n: "Saudi Aramco" }, { t: "1120.SR", n: "Al Rajhi Bank" }
      ] 
    },
    { 
      label: "Métaux & Énergie", 
      icon: "🛡️", 
      assets: [
        { t: "SGLD.L", n: "Or Physique" }, { t: "SSLV.L", n: "Argent Physique" }, 
        { t: "PHPT.L", n: "Platine Physique" }, { t: "PHPD.L", n: "Palladium Physique" }
      ] 
    }
  ];

  const [activePreset, setActivePreset] = useState(PRESETS[0]);

  useEffect(() => {
    if (autoSearch) {
      setTicker(autoSearch);
      fetchAnalysis(autoSearch);
    }
  }, [autoSearch]);

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
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setResult(data.results[0]);
      } else {
        setError("Aucun résultat trouvé.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE DE NOTATION DYNAMIQUE ---
  const renderStars = (res) => {
    let score = 0;
    if (res.compliance?.is_halal) score += 3;
    if (parseFloat(res.technicals?.roe) > 15) score += 1;
    if (parseFloat(res.technicals?.dividend_yield) > 0) score += 1;
    return (
      <div className="flex text-brand-gold" title="Note basée sur la conformité et la performance">
        {'★'.repeat(score)}{'☆'.repeat(5 - score)}
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      {/* HEADER & SEARCH (Identique à ton design) */}
      <div className="text-center mb-10 space-y-4 pt-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
          Screener Pro <span className="text-brand-gold">&</span> Multi-Actifs
        </h1>
      </div>

      <div className="bg-white dark:bg-[#121212] p-4 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 mb-10 max-w-3xl mx-auto">
          <div className="flex gap-3">
              <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="Ticker (ex: LVMH, AAPL...)"
                  className="block w-full px-6 py-4 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:border-brand-gold border-2 border-transparent transition-all font-bold"
              />
              <button onClick={() => fetchAnalysis(ticker)} className="px-8 bg-brand-gold text-white font-bold rounded-2xl">SCANNER</button>
          </div>
      </div>

      {/* RÉSULTATS */}
      {result && (
        <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 md:p-10 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">{result.name}</h2>
                    <p className="text-2xl font-mono font-bold text-brand-gold">{result.price} $</p>
                </div>

                <div className={`px-8 py-4 rounded-2xl border-2 ${result.compliance?.is_halal ? 'border-emerald-500 text-emerald-600' : 'border-red-500 text-red-600'}`}>
                    <p className="text-3xl font-bold">{result.compliance?.is_halal ? "HALAL" : "HARAM"}</p>
                </div>
            </div>

            <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <GaugeCard label="Dette / Market Cap" value={result.ratios?.debt_ratio} limit={33} isGood={result.ratios?.debt_ratio < 33} />
                    <GaugeCard label="Cash / Market Cap" value={result.ratios?.cash_ratio} limit={33} isGood={result.ratios?.cash_ratio < 33} />
                    <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200">
                        <span className="text-[10px] font-bold uppercase text-amber-700">Revenus Impurs</span>
                        <p className="text-xs mt-2 italic">Cible AAOIFI : &lt; 5%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* INFOS SECTEUR */}
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Activité</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm"><span>Secteur</span><span className="font-bold">{result.sector}</span></div>
                            <div className="flex justify-between text-sm"><span>Industrie</span><span className="font-bold">{result.industry}</span></div>
                        </div>
                    </div>

                    {/* FONDAMENTAUX COLORÉS & ÉTOILES */}
                    <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">Fondamentaux</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <MetricBox 
                              label="PER" 
                              value={result.technicals?.per} 
                              tooltip="Price Earning Ratio : Valorisation de l'action. Si négatif = l'entreprise perd de l'argent."
                           />
                           <MetricBox 
                              label="ROE" 
                              value={result.technicals?.roe} 
                              suffix="%" 
                              tooltip="Return on Equity : Rentabilité de l'argent des actionnaires. Cible > 15%."
                           />
                           <MetricBox 
                              label="Dividende" 
                              value={result.technicals?.dividend_yield} 
                              suffix="%" 
                              tooltip="Rendement annuel versé aux actionnaires."
                           />
                           <div className="p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                               <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Score Global</p>
                               {renderStars(result)}
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function GaugeCard({ label, value, limit, isGood }) {
    const percent = Math.min((value / (limit * 1.5)) * 100, 100); 
    return (
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-end mb-3">
                <span className="text-[10px] font-bold uppercase text-gray-500">{label}</span>
                <span className={`text-xl font-mono font-bold ${isGood ? 'text-emerald-500' : 'text-red-500'}`}>{value}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${isGood ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}

function MetricBox({ label, value, suffix = "", tooltip }) {
    const numValue = parseFloat(value);
    const isNegative = numValue < 0;
    const colorClass = isNegative ? 'text-red-500' : numValue > 0 ? 'text-emerald-500' : 'text-gray-800 dark:text-white';

    return (
        <div className="p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 group relative cursor-help" title={tooltip}>
            <p className="text-[10px] text-gray-400 uppercase font-bold">{label}</p>
            <p className={`text-sm font-bold mt-1 ${colorClass}`}>
                {value}{suffix}
            </p>
        </div>
    );
}