import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, TrendingUp, BookOpen, RefreshCw } from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api'; 

export default function Home({ onNavigate }) {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const QUOTE = "La richesse de l'âme est la seule vraie richesse.";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
        const indices = ["BTC-USD", "GC=F", "SPUS"]; 
        const response = await fetch(`${API_URL}/screening/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: indices.join(',') })
        });
        const data = await response.json();
        if (data.results && data.results.length > 0) {
           setMarketData(data.results);
           setError(false);
        } else {
           setError(true);
        }
    } catch (e) {
        console.error("Erreur marché", e);
        setError(true);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-10 font-sans pb-20">
      
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-xl dark:shadow-2xl transition-colors duration-300">
        
        {/* Fond décoratif (invisible en mode clair pour garder le blanc pur) */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 to-transparent opacity-0 dark:opacity-50"></div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-6 text-center md:text-left">
                <div>
                  <span className="inline-block py-1 px-3 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                      Tableau de Bord
                  </span>
                  {/* CORRECTION : Texte noir en jour, blanc en nuit */}
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                      L'Éthique rencontre <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-600 dark:to-yellow-300">la Performance.</span>
                  </h1>
                </div>
                {/* CORRECTION : Gris foncé en jour, gris clair en nuit */}
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base border-l-2 border-brand-gold pl-4 italic font-medium">
                    "{QUOTE}"
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                    <button onClick={() => onNavigate('screener')} className="px-8 py-3 bg-brand-gold hover:bg-yellow-600 text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-all">
                        Scanner
                    </button>
                    {/* CORRECTION : Bouton secondaire visible sur fond blanc */}
                    <button onClick={() => onNavigate('portfolio')} className="px-8 py-3 bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 font-bold rounded-xl transition-colors">
                        Portfolio
                    </button>
                </div>
            </div>
            
            {/* WIDGET MARCHÉS */}
            {/* CORRECTION : Fond sombre forcé en mode jour pour le contraste, ou clair avec bordure. Ici on garde le style "Carte sombre" même en jour pour l'effet widget, ou on l'adapte. 
               Option choisie : Adaptatif (Gris très clair jour / Noir nuit) */}
            <div className="w-full md:w-auto min-w-[280px] bg-gray-50 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 p-5 space-y-3 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] text-brand-gold uppercase tracking-widest font-bold">Marchés en Direct</p>
                    <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                </div>

                {loading ? (
                   <div className="space-y-3">
                       <div className="h-8 bg-gray-200 dark:bg-white/5 rounded animate-pulse"></div>
                       <div className="h-8 bg-gray-200 dark:bg-white/5 rounded animate-pulse delay-75"></div>
                   </div>
                ) : error ? (
                    <div className="text-center py-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Indisponible.</p>
                        <button onClick={loadDashboardData} className="text-[10px] flex items-center justify-center gap-1 mx-auto text-brand-gold mt-2"><RefreshCw size={10}/> Relancer</button>
                    </div>
                ) : (
                   marketData.map(asset => <MiniTicker key={asset.ticker} asset={asset} />)
                )}
            </div>
        </div>
      </div>

      {/* 2. GRID OUTILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ToolCard title="Screener" sub="Analyse 5000+ actifs" icon={TrendingUp} onClick={() => onNavigate('screener')} />
        <ToolCard title="Comparateur" sub="Duel de pureté" icon={ShieldCheck} onClick={() => onNavigate('comparator')} />
        <ToolCard title="Projection" sub="Futur financier" icon={ArrowUpRight} onClick={() => onNavigate('simulator')} />
        <ToolCard title="Académie" sub="Apprendre l'éthique" icon={BookOpen} onClick={() => onNavigate('academy')} />
      </div>
    </div>
  );
}

function ToolCard({ title, sub, icon: Icon, onClick }) {
    return (
        <div onClick={onClick} className="group p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 hover:border-brand-gold/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden shadow-sm hover:shadow-md">
            {/* CORRECTION : Icône visible sur fond clair */}
            <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                <Icon size={20} />
            </div>
            {/* CORRECTION : Titres noirs en jour */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
        </div>
    )
}

function MiniTicker({ asset }) {
    const price = asset.technicals?.current_price || 0;
    const nameMap = { 'BTC-USD': 'Bitcoin', 'GC=F': 'Or (Gold)', 'SPUS': 'S&P 500' };
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-white/5 last:border-0 group hover:bg-gray-100 dark:hover:bg-white/5 px-2 rounded transition-colors -mx-2">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{nameMap[asset.ticker] || asset.ticker}</span>
            <span className="text-sm font-mono text-brand-gold font-bold">{asset.ticker === 'GC=F' ? price.toFixed(1) : price.toLocaleString()} $</span>
        </div>
    )
}