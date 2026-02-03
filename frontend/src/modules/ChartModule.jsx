import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Search, TrendingUp, TrendingDown, Activity, Clock, 
  BarChart2, ArrowUpRight, ArrowDownRight, RefreshCcw 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ChartModule() {
  const [ticker, setTicker] = useState('NVDA');
  const [inputTicker, setInputTicker] = useState('');
  const [period, setPeriod] = useState('1y');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Délais pour les boutons de période
  const periods = [
    { label: '1J', val: '1d' },
    { label: '1S', val: '5d' },
    { label: '1M', val: '1mo' },
    { label: '6M', val: '6mo' },
    { label: '1A', val: '1y' },
    { label: '5A', val: '5y' }
  ];

  useEffect(() => {
    fetchChartData(ticker, period);
  }, [ticker, period]);

  const fetchChartData = async (sym, time) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chart/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: sym, period: time })
      });
      const json = await res.json();
      if (json.history) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputTicker) {
      setTicker(inputTicker.toUpperCase());
      setInputTicker('');
    }
  };

  // --- LOGIQUE COULEURS & DESIGN ---
  const isPositive = data?.change_p >= 0;
  const mainColor = isPositive ? '#10b981' : '#ef4444'; // Emerald vs Red
  const gradientId = "colorPrice";

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-8">
      
      {/* --- EN-TÊTE DE COMMANDE --- */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 pt-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="text-brand-gold" /> Terminal de Marché
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Données temps réel & Analyse technique</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
          <input
            type="text"
            value={inputTicker}
            onChange={(e) => setInputTicker(e.target.value)}
            placeholder="Rechercher (ex: TSLA)..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 font-bold uppercase transition-all shadow-sm group-hover:shadow-md"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-gold transition-colors" size={20} />
        </form>
      </div>

      {/* --- ZONE PRINCIPALE (GRAPHIQUE) --- */}
      <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px]">
        
        {/* LOADING SKELETON (Effet visuel pendant le chargement) */}
        {loading && (
           <div className="absolute inset-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-gold border-t-transparent mb-4"></div>
             <p className="text-xs font-bold uppercase tracking-widest text-brand-gold animate-pulse">Récupération des données...</p>
           </div>
        )}

        {data ? (
          <div className="p-6 md:p-8 flex flex-col h-full">
            
            {/* 1. INFO HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      NASDAQ
                   </span>
                   <h2 className="text-sm font-bold text-gray-400">{data.name}</h2>
                </div>
                <div className="flex items-baseline gap-4">
                  <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                    {data.ticker}
                  </h1>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-4xl font-mono font-bold text-gray-800 dark:text-gray-100">
                    {data.current_price?.toLocaleString()} <span className="text-lg text-gray-400">$</span>
                  </span>
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border ${isPositive ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'}`}>
                    {isPositive ? <ArrowUpRight size={18}/> : <ArrowDownRight size={18}/>}
                    {data.change_p > 0 ? '+' : ''}{data.change_p}%
                  </div>
                </div>
              </div>

              {/* SÉLECTEUR DE PÉRIODE (Style "Pills") */}
              <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                {periods.map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPeriod(p.val)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${period === p.val ? 'bg-white dark:bg-[#1a1a1a] text-brand-dark dark:text-white shadow-sm scale-105 border border-gray-100 dark:border-white/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. LE CHART (Graphique Principal) */}
            <div className="flex-1 min-h-[350px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={mainColor} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" strokeOpacity={0.1} />
                  
                  <XAxis dataKey="date" hide={true} />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    orientation="right" 
                    tick={{fill: '#6b7280', fontSize: 10, fontFamily: 'monospace'}} 
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  
                  <Tooltip content={<CustomTooltip currency={data.currency} />} cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={mainColor} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill={`url(#${gradientId})`} 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 3. CHART VOLUME (Miniature) */}
            <div className="h-[60px] w-full mt-2 opacity-50 hover:opacity-100 transition-opacity">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.history}>
                   <Tooltip cursor={{fill: 'transparent'}} content={<></>} />
                   <Bar dataKey="volume" fill={mainColor} radius={[2, 2, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>

          </div>
        ) : (
          /* ÉTAT INITIAL (Vide) */
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
             <Activity size={48} className="mb-4 text-gray-300 dark:text-white/10" />
             <p className="text-sm font-medium">Recherchez un actif pour afficher le graphique.</p>
          </div>
        )}
      </div>

      {/* --- STATISTIQUES CLÉS (CARDS) --- */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           <StatCard 
              label="Ouverture" 
              value={data.history[data.history.length-1].open} 
              icon={<Clock size={16}/>} 
              subtext="Début de séance"
           />
           <StatCard 
              label="Plus Haut" 
              value={data.history[data.history.length-1].high} 
              icon={<TrendingUp size={16}/>} 
              color="text-emerald-500"
           />
           <StatCard 
              label="Plus Bas" 
              value={data.history[data.history.length-1].low} 
              icon={<TrendingDown size={16}/>} 
              color="text-red-500"
           />
           <StatCard 
              label="Volume" 
              value={(data.history[data.history.length-1].volume / 1000000).toFixed(2) + ' M'} 
              icon={<BarChart2 size={16}/>} 
              subtext="Titres échangés"
           />
        </div>
      )}

    </div>
  );
}

// --- SOUS-COMPOSANT : TOOLTIP PERSONNALISÉ (HUD STYLE) ---
const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 dark:bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl text-white min-w-[150px]">
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-mono font-bold mb-1">
          {payload[0].value.toFixed(2)} <span className="text-xs text-brand-gold">$</span>
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-300 mt-2 pt-2 border-t border-white/10">
          <BarChart2 size={10} />
          <span>Vol: {(payload[0].payload.volume / 1000000).toFixed(2)}M</span>
        </div>
      </div>
    );
  }
  return null;
};

// --- SOUS-COMPOSANT : CARTE STATISTIQUE ---
function StatCard({ icon, label, value, subtext, color = "text-gray-900 dark:text-white" }) {
    return (
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-white/10 hover:border-brand-gold/50 transition-colors group shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-brand-gold group-hover:bg-brand-gold/10 transition-colors">
                    {icon}
                </div>
                {subtext && <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{subtext}</span>}
            </div>
            <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</p>
                <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
            </div>
        </div>
    );
}