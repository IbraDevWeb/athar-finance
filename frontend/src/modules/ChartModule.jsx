import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Search, TrendingUp, TrendingDown, Activity, Clock, 
  BarChart2, ArrowUpRight, ArrowDownRight, Maximize2, RefreshCw 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ChartModule() {
  const [ticker, setTicker] = useState('NVDA');
  const [inputTicker, setInputTicker] = useState('');
  const [period, setPeriod] = useState('1y');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Périodes disponibles
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

  // --- DESIGN SYSTEM ---
  const isPositive = data?.change_p >= 0;
  // Vert Émeraude pour la hausse, Rouge Rose pour la baisse (plus moderne)
  const mainColor = isPositive ? '#10b981' : '#f43f5e'; 
  const gradientId = "colorPrice";
  const glowId = "glowShadow";

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-6">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-brand-gold/10 rounded-lg text-brand-gold"><Activity size={24} /></span>
            Market Terminal
          </h1>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
          <input
            type="text"
            value={inputTicker}
            onChange={(e) => setInputTicker(e.target.value)}
            placeholder="Rechercher (ex: BTC-USD)..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold font-bold uppercase transition-all shadow-sm group-hover:shadow-md text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-gold transition-colors" size={18} />
        </form>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden relative min-h-[550px] flex flex-col">
        
        {/* LOADING SKELETON */}
        {loading && (
           <div className="absolute inset-0 z-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col items-center justify-center">
             <RefreshCw className="animate-spin text-brand-gold mb-4" size={32} />
             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 animate-pulse">Synchronisation...</p>
           </div>
        )}

        {data ? (
          <div className="p-6 md:p-8 flex flex-col h-full">
            
            {/* 1. TICKER INFO ROW */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-100 dark:bg-white/5 text-gray-500 uppercase tracking-wider border border-gray-200 dark:border-white/5">
                      ASSET
                   </span>
                   <h2 className="text-sm font-medium text-gray-400">{data.name}</h2>
                </div>
                
                <div className="flex items-center gap-4">
                  <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white tracking-tighter">
                    {data.ticker}
                  </h1>
                  <div className="flex flex-col">
                      <span className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-100 leading-none">
                        {data.current_price?.toLocaleString()}
                      </span>
                      <div className={`flex items-center gap-1 text-sm font-bold mt-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPositive ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                        {data.change_p > 0 ? '+' : ''}{data.change_p}%
                      </div>
                  </div>
                </div>
              </div>

              {/* IOS STYLE PERIOD SELECTOR */}
              <div className="flex p-1 bg-gray-100 dark:bg-black/40 rounded-lg border border-gray-200 dark:border-white/5">
                {periods.map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPeriod(p.val)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-300 ${period === p.val ? 'bg-white dark:bg-[#1a1a1a] text-brand-dark dark:text-white shadow-sm border border-gray-100 dark:border-white/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. ADVANCED CHART */}
            <div className="flex-1 w-full relative min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={mainColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
                    </linearGradient>
                    {/* Filtre pour l'effet Glow/Néon sous la ligne */}
                    <filter id={glowId} height="300%" width="300%" x="-75%" y="-75%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                        <feOffset dx="0" dy="0" result="offsetblur"/>
                        <feFlood floodColor={mainColor} floodOpacity="0.5"/>
                        <feComposite in2="offsetblur" operator="in"/>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" strokeOpacity={0.05} />
                  
                  <XAxis dataKey="date" hide={true} />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    orientation="right" 
                    tick={{fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace'}} 
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  
                  <Tooltip content={<CustomTooltip currency={data.currency} />} cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={mainColor} 
                    strokeWidth={2}
                    filter={`url(#${glowId})`}
                    fillOpacity={1} 
                    fill={`url(#${gradientId})`} 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 3. VOLUME BAR (Miniature) */}
            <div className="h-[40px] w-full mt-2 opacity-30">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.history}>
                   <Bar dataKey="volume" fill={mainColor} radius={[2, 2, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
             <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-full mb-4 animate-pulse">
                <Activity size={32} className="text-gray-300 dark:text-white/20" />
             </div>
             <p className="text-sm font-medium">Entrez un ticker pour lancer l'analyse.</p>
          </div>
        )}
      </div>

      {/* --- STATS FOOTER --- */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           <StatCard label="Ouverture" value={data.history[data.history.length-1].open} icon={<Clock size={14}/>} />
           <StatCard label="Plus Haut" value={data.history[data.history.length-1].high} icon={<TrendingUp size={14}/>} color="text-emerald-500" />
           <StatCard label="Plus Bas" value={data.history[data.history.length-1].low} icon={<TrendingDown size={14}/>} color="text-rose-500" />
           <StatCard label="Volume" value={(data.history[data.history.length-1].volume / 1000000).toFixed(2) + ' M'} icon={<BarChart2 size={14}/>} />
        </div>
      )}
    </div>
  );
}

// --- HUD TOOLTIP (Design Futuriste) ---
const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-[#000000]/80 backdrop-blur-md border border-gray-100 dark:border-white/10 p-3 rounded-xl shadow-xl text-gray-900 dark:text-white min-w-[140px]">
        <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">{label}</p>
        <p className="text-xl font-mono font-bold tracking-tight">
          {payload[0].value.toFixed(2)} <span className="text-[10px] text-gray-400">$</span>
        </p>
      </div>
    );
  }
  return null;
};

function StatCard({ icon, label, value, color = "text-gray-900 dark:text-white" }) {
    return (
        <div className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
            <div>
                <p className="text-[9px] uppercase font-bold text-gray-400 mb-0.5">{label}</p>
                <p className={`text-base font-mono font-bold ${color}`}>{value}</p>
            </div>
            <div className="text-gray-300 dark:text-gray-600">{icon}</div>
        </div>
    );
}