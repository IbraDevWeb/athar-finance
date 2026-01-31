import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Search, ArrowRight, Scale, CheckCircle, XCircle, AlertTriangle, TrendingUp, Shield 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ComparatorModule() {
  const [tickerA, setTickerA] = useState('');
  const [tickerB, setTickerB] = useState('');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [radarData, setRadarData] = useState([]);

  const handleCompare = async () => {
    if (!tickerA || !tickerB) return;
    setLoading(true);
    
    try {
      // On lance les deux analyses en parallèle
      const [resA, resB] = await Promise.all([
        fetch(`${API_URL}/screening/analyze`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: tickerA })
        }).then(r => r.json()),
        fetch(`${API_URL}/screening/analyze`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: tickerB })
        }).then(r => r.json())
      ]);

      if (resA.results?.[0] && resB.results?.[0]) {
          const assetA = resA.results[0];
          const assetB = resB.results[0];
          
          setDataA(assetA);
          setDataB(assetB);

          // Normalisation des données pour le Graphique Radar (Score sur 100)
          // C'est une approximation pour l'aspect visuel ludique
          setRadarData([
            { subject: 'Rentabilité (ROE)', A: Math.min(assetA.technicals.roe * 2, 100), B: Math.min(assetB.technicals.roe * 2, 100), fullMark: 100 },
            { subject: 'Sûreté (Cash)', A: Math.min(assetA.ratios.cash_ratio * 3, 100), B: Math.min(assetB.ratios.cash_ratio * 3, 100), fullMark: 100 },
            { subject: 'Dividende', A: Math.min(assetA.technicals.dividend_yield * 20, 100), B: Math.min(assetB.technicals.dividend_yield * 20, 100), fullMark: 100 },
            { subject: 'Prix (Cheap)', A: Math.max(100 - (assetA.technicals.per * 2), 0), B: Math.max(100 - (assetB.technicals.per * 2), 0), fullMark: 100 },
            { subject: 'Éthique (Dette Faible)', A: Math.max(100 - (assetA.ratios.debt_ratio * 2), 0), B: Math.max(100 - (assetB.ratios.debt_ratio * 2), 0), fullMark: 100 },
          ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-2 text-brand-gold">
           <Scale size={32} />
        </div>
        <h1 className="font-display text-4xl font-bold text-brand-dark">Le Duel Boursier</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Ne choisissez plus au hasard. Comparez la rentabilité, la sûreté et la conformité de deux actifs côte à côte.
        </p>
      </div>

      {/* BARRE DE RECHERCHE DUEL */}
      <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
              <span className="absolute left-4 top-3.5 text-gray-400 font-bold text-xs uppercase">Actif A</span>
              <input 
                  value={tickerA} onChange={(e) => setTickerA(e.target.value.toUpperCase())}
                  placeholder="ex: AAPL" className="w-full pl-4 pt-6 pb-2 bg-gray-50 rounded-xl border border-gray-200 font-bold text-brand-dark focus:border-brand-gold outline-none text-center uppercase"
              />
          </div>
          <div className="bg-brand-gold text-white font-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg z-10 shrink-0">
              VS
          </div>
          <div className="flex-1 relative w-full">
              <span className="absolute left-4 top-3.5 text-gray-400 font-bold text-xs uppercase">Actif B</span>
              <input 
                  value={tickerB} onChange={(e) => setTickerB(e.target.value.toUpperCase())}
                  placeholder="ex: MSFT" className="w-full pl-4 pt-6 pb-2 bg-gray-50 rounded-xl border border-gray-200 font-bold text-brand-dark focus:border-brand-gold outline-none text-center uppercase"
              />
          </div>
          <button onClick={handleCompare} disabled={loading} className="w-full md:w-auto px-8 py-4 bg-brand-dark text-brand-gold font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50">
              {loading ? "..." : "COMPARER"}
          </button>
      </div>

      {dataA && dataB && (
          <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
              
              {/* COLONNE GAUCHE : Actif A */}
              <div className="lg:col-span-3 space-y-4">
                  <AssetCard data={dataA} color="text-brand-dark" bg="bg-gray-100" />
              </div>

              {/* COLONNE CENTRALE : Radar & Comparaison */}
              <div className="lg:col-span-6 space-y-6">
                  
                  {/* GRAPHIQUE RADAR */}
                  <div className="glass p-4 rounded-3xl h-[350px] relative">
                      <h3 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Profil de Performance</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name={dataA.ticker} dataKey="A" stroke="#1e293b" strokeWidth={3} fill="#1e293b" fillOpacity={0.1} />
                          <Radar name={dataB.ticker} dataKey="B" stroke="#c5a059" strokeWidth={3} fill="#c5a059" fillOpacity={0.4} />
                          <Legend wrapperStyle={{fontSize: '12px', fontWeight: 'bold', paddingTop: '10px'}}/>
                        </RadarChart>
                      </ResponsiveContainer>
                  </div>

                  {/* TABLEAU COMPARATIF */}
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <Row label="Prix Actuel" valA={dataA.price + ' $'} valB={dataB.price + ' $'} highlight />
                      <Row label="Conformité" 
                           valA={dataA.compliance.is_halal ? 'HALAL' : 'HARAM'} 
                           valB={dataB.compliance.is_halal ? 'HALAL' : 'HARAM'} 
                           goodA={dataA.compliance.is_halal} goodB={dataB.compliance.is_halal}
                      />
                      <Row label="Dette (Moins c'est mieux)" 
                           valA={dataA.ratios.debt_ratio + '%'} 
                           valB={dataB.ratios.debt_ratio + '%'} 
                           goodA={dataA.ratios.debt_ratio < dataB.ratios.debt_ratio} 
                           goodB={dataB.ratios.debt_ratio < dataA.ratios.debt_ratio}
                      />
                      <Row label="Rentabilité (ROE)" 
                           valA={dataA.technicals.roe + '%'} 
                           valB={dataB.technicals.roe + '%'} 
                           goodA={dataA.technicals.roe > dataB.technicals.roe} 
                           goodB={dataB.technicals.roe > dataA.technicals.roe}
                      />
                      <Row label="Dividende" 
                           valA={dataA.technicals.dividend_yield + '%'} 
                           valB={dataB.technicals.dividend_yield + '%'} 
                           goodA={dataA.technicals.dividend_yield > dataB.technicals.dividend_yield} 
                           goodB={dataB.technicals.dividend_yield > dataA.technicals.dividend_yield}
                      />
                  </div>
              </div>

              {/* COLONNE DROITE : Actif B */}
              <div className="lg:col-span-3 space-y-4">
                  <AssetCard data={dataB} color="text-brand-gold" bg="bg-brand-gold/10" />
              </div>

          </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function AssetCard({ data, color, bg }) {
    return (
        <div className={`p-6 rounded-3xl border-2 border-transparent ${bg} transition-all hover:scale-105 duration-300`}>
            <div className="flex justify-between items-start mb-4">
                <span className={`text-xl font-black ${color}`}>{data.ticker}</span>
                {data.compliance.is_halal 
                    ? <CheckCircle size={24} className="text-emerald-500" />
                    : <XCircle size={24} className="text-red-500" />
                }
            </div>
            <h3 className="font-bold text-gray-800 leading-tight mb-2 h-12 overflow-hidden">{data.name}</h3>
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Secteur</span>
                    <span className="font-bold text-gray-700 truncate max-w-[100px]">{data.sector}</span>
                </div>
            </div>
        </div>
    );
}

function Row({ label, valA, valB, highlight, goodA, goodB }) {
    return (
        <div className={`grid grid-cols-3 p-4 border-b border-gray-100 last:border-0 items-center ${highlight ? 'bg-gray-50 font-bold' : ''}`}>
            <div className={`text-center text-sm ${goodA ? 'text-emerald-600 font-bold' : (goodA === false ? 'text-red-500' : 'text-gray-700')}`}>
                {valA}
            </div>
            <div className="text-center text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                {label}
            </div>
            <div className={`text-center text-sm ${goodB ? 'text-emerald-600 font-bold' : (goodB === false ? 'text-red-500' : 'text-gray-700')}`}>
                {valB}
            </div>
        </div>
    );
}