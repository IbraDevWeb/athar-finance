import React, { useState } from 'react';
import { 
  Search, PieChart as PieIcon, Layers, Info, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const API_URL = 'https://athar-api.onrender.com/api';

export default function EtfXrayModule() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Couleurs pour le Pie Chart
  const COLORS = ['#c5a059', '#1e293b', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

  const handleScan = async () => {
    if (!ticker) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${API_URL}/screening/etf-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: ticker })
      });

      if (!response.ok) throw new Error("Erreur lors de l'analyse");
      const result = await response.json();
      
      if (!result.holdings || result.holdings.length === 0) {
         setError("Données détaillées non disponibles pour cet ETF (Essayez SPUS, HLAL, GLDM).");
      } else {
         setData(result);
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-2 text-brand-gold">
           <Layers size={32} />
        </div>
        <h1 className="font-display text-4xl font-bold text-brand-dark">ETF X-Ray 🩻</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Regardez à travers la boîte. Découvrez exactement quelles entreprises vous possédez quand vous achetez un ETF.
        </p>
      </div>

      {/* RECHERCHE */}
      <div className="max-w-xl mx-auto relative group">
          <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Ex: SPUS, HLAL, GLDM..."
              className="block w-full pl-6 pr-14 py-4 border-2 border-gray-100 bg-white text-brand-dark rounded-2xl focus:outline-none focus:border-brand-gold transition-all font-bold text-lg shadow-lg"
          />
          <button
              onClick={handleScan}
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-brand-dark text-brand-gold rounded-xl px-4 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
              {loading ? <div className="animate-spin h-5 w-5 border-2 border-current rounded-full border-t-transparent"></div> : <Search size={20} />}
          </button>
      </div>

      {error && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-bold border border-red-100">
            {error}
        </div>
      )}

      {/* RÉSULTATS */}
      {data && (
        <div className="animate-fade-in space-y-6">
            
            {/* 1. Carte Identité */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">{data.ticker}</span>
                        <span className="text-xs text-gray-400 uppercase font-bold">ETF Certifié</span>
                    </div>
                    <h2 className="text-2xl font-display font-bold text-brand-dark">{data.name}</h2>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 mb-1">Diversification</p>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                        <ShieldCheck size={16} />
                        <span>Haute</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                
                {/* 2. Top 10 Holdings */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-brand-dark mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-brand-gold rounded-full"></span>
                        Ce que vous possédez réellement
                    </h3>
                    <div className="space-y-3">
                        {data.holdings.map((company, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] font-bold">
                                        {idx + 1}
                                    </span>
                                    <span className="font-bold text-gray-700 group-hover:text-brand-dark">{company.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-gold" style={{ width: `${company.percent * 2}%` }}></div>
                                    </div>
                                    <span className="text-sm font-mono font-bold text-brand-gold w-12 text-right">{company.percent}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-brand-gold/5 rounded-xl border border-brand-gold/10 text-center">
                        <p className="text-xs text-gray-500 italic">
                            En achetant 1 part de <strong>{data.ticker}</strong>, vous investissez automatiquement dans toutes ces sociétés.
                        </p>
                    </div>
                </div>

                {/* 3. Répartition Sectorielle */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-brand-dark mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-brand-dark rounded-full"></span>
                        Répartition par Secteur
                    </h3>
                    
                    <div className="flex-1 min-h-[300px] relative">
                        {data.sectors.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.sectors}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.sectors.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(val) => `${val}%`}
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <PieIcon size={48} className="mb-2 opacity-20" />
                                <span className="text-xs">Données sectorielles indisponibles</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4 flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <Info size={16} className="text-brand-dark mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-500 leading-relaxed">
                            <strong>Pourquoi c'est important ?</strong> Une bonne diversification sectorielle protège votre portefeuille. Si la "Tech" chute, la "Santé" ou l'"Énergie" peuvent compenser.
                        </p>
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
}