import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, TrendingUp, BookOpen } from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com';

export default function Home({ onNavigate }) {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Citations plus courtes et percutantes
  const QUOTE = "La richesse de l'âme est la seule vraie richesse.";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
        const indices = ["BTC-USD", "GC=F", "SPUS"]; 
        const response = await fetch(`${API_URL}/screening/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: indices.join(',') })
        });
        const data = await response.json();
        if (data.success) setMarketData(data.results);
    } catch (e) {
        console.error("Erreur marché", e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10 font-sans">
      
      {/* 1. HERO BANNER "LUXE" */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-brand-surface shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 to-transparent opacity-50"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-gold/5 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-6 text-center md:text-left">
                <div>
                  <span className="inline-block py-1 px-3 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-4 shadow-glow">
                      Tableau de Bord
                  </span>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                      L'Éthique rencontre <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-gold">la Performance.</span>
                  </h1>
                </div>
                <p className="text-gray-400 text-sm md:text-base border-l-2 border-brand-gold/50 pl-4 italic">
                    "{QUOTE}"
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                    <button onClick={() => onNavigate('screener')} className="px-8 py-3 bg-gradient-gold text-brand-dark font-bold rounded-xl shadow-glow hover:scale-105 transition-transform">
                        Scanner
                    </button>
                    <button onClick={() => onNavigate('portfolio')} className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                        Portfolio
                    </button>
                </div>
            </div>
            
            {/* Widget Météo Minimaliste */}
            <div className="w-full md:w-auto min-w-[280px] bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 p-4 space-y-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Marchés en Direct</p>
                {loading ? (
                   <div className="h-20 animate-pulse bg-white/5 rounded-xl"></div>
                ) : (
                   marketData.map(asset => <MiniTicker key={asset.ticker} asset={asset} />)
                )}
            </div>
        </div>
      </div>

      {/* 2. GRID OUTILS (GLASSMORPHISM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ToolCard 
            title="Screener" 
            sub="Analyse 5000+ actifs" 
            icon={TrendingUp} 
            onClick={() => onNavigate('screener')} 
        />
        <ToolCard 
            title="Comparateur" 
            sub="Duel de pureté" 
            icon={ShieldCheck} 
            onClick={() => onNavigate('comparator')} 
        />
        <ToolCard 
            title="Projection" 
            sub="Futur financier" 
            icon={ArrowUpRight} 
            onClick={() => onNavigate('simulator')} 
        />
        <ToolCard 
            title="Académie" 
            sub="Apprendre l'éthique" 
            icon={BookOpen} 
            onClick={() => onNavigate('academy')} 
        />
      </div>
    </div>
  );
}

// Composants Internes
function ToolCard({ title, sub, icon: Icon, onClick }) {
    return (
        <div onClick={onClick} className="group p-6 rounded-2xl bg-brand-surface border border-white/5 hover:border-brand-gold/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/10 transition-all -mr-8 -mt-8"></div>
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-brand-gold mb-4 group-hover:text-white group-hover:bg-brand-gold transition-colors">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
        </div>
    )
}

function MiniTicker({ asset }) {
    const price = asset.technicals?.current_price || 0;
    const nameMap = { 'BTC-USD': 'Bitcoin', 'GC=F': 'Or (Gold)', 'SPUS': 'S&P 500' };
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-xs font-bold text-gray-300">{nameMap[asset.ticker] || asset.ticker}</span>
            <span className="text-xs font-mono text-brand-gold">{asset.ticker === 'GC=F' ? price.toFixed(1) : price.toLocaleString()} $</span>
        </div>
    )
}