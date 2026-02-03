import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  Search, Scale, CheckCircle, XCircle, Trophy, TrendingUp, Shield, Wallet, Zap, ArrowRightLeft 
} from 'lucide-react';

const API_URL = 'https://athar-api.onrender.com/api';

export default function ComparatorModule() {
  const [tickerA, setTickerA] = useState('');
  const [tickerB, setTickerB] = useState('');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [radarData, setRadarData] = useState([]);
  const [scores, setScores] = useState({ A: 0, B: 0 });

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!tickerA || !tickerB) return;
    setLoading(true);
    
    try {
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
          const A = resA.results[0];
          const B = resB.results[0];
          
          setDataA(A);
          setDataB(B);

          // Normalisation des scores (0-100) pour le graphique
          const sA = {
             roe: Math.min(Math.max(A.technicals.roe * 2, 0), 100),
             safe: Math.min(Math.max((100 - A.ratios.debt_ratio), 0), 100),
             div: Math.min(A.technicals.dividend_yield * 15, 100),
             value: Math.min(Math.max(100 - (A.technicals.per * 1.5), 0), 100),
             halal: A.compliance.is_halal ? 100 : 0
          };

          const sB = {
             roe: Math.min(Math.max(B.technicals.roe * 2, 0), 100),
             safe: Math.min(Math.max((100 - B.ratios.debt_ratio), 0), 100),
             div: Math.min(B.technicals.dividend_yield * 15, 100),
             value: Math.min(Math.max(100 - (B.technicals.per * 1.5), 0), 100),
             halal: B.compliance.is_halal ? 100 : 0
          };

          setRadarData([
            { subject: 'Rentabilité', A: sA.roe, B: sB.roe, fullMark: 100 },
            { subject: 'Sûreté', A: sA.safe, B: sB.safe, fullMark: 100 },
            { subject: 'Dividende', A: sA.div, B: sB.div, fullMark: 100 },
            { subject: 'Prix (Value)', A: sA.value, B: sB.value, fullMark: 100 },
            { subject: 'Conformité', A: sA.halal, B: sB.halal, fullMark: 100 },
          ]);

          // Calcul du Score Global
          setScores({
             A: Math.round((sA.roe + sA.safe + sA.div + sA.value + sA.halal) / 5),
             B: Math.round((sB.roe + sB.safe + sB.div + sB.value + sB.halal) / 5)
          });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-8">
      
      {/* HEADER */}
      <div className="text-center pt-6 space-y-2">
         <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
            Stock <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-300">Battle</span>
         </h1>
         <p className="text-gray-500 dark:text-gray-400">Le comparateur ultime pour trancher vos hésitations.</p>
      </div>

      {/* ZONE DE COMBAT (INPUTS) */}
      <form onSubmit={handleCompare} className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-[#121212] p-2 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10">
            
            {/* Input A */}
            <div className="flex-1 w-full relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-brand-dark dark:text-white font-bold text-xs">A</div>
                <input 
                    value={tickerA} onChange={(e) => setTickerA(e.target.value)}
                    placeholder="TICKER (ex: KO)" 
                    className="w-full pl-14 pr-4 py-4 bg-transparent font-display font-bold text-xl uppercase placeholder:text-gray-300 text-center focus:outline-none text-gray-900 dark:text-white"
                />
            </div>

            {/* VS BADGE */}
            <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center text-white font-black italic shadow-lg shadow-brand-gold/30 z-20 transform md:scale-125 border-4 border-white dark:border-[#121212]">
                VS
            </div>

            {/* Input B */}
            <div className="flex-1 w-full relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-brand-dark dark:text-white font-bold text-xs">B</div>
                <input 
                    value={tickerB} onChange={(e) => setTickerB(e.target.value)}
                    placeholder="TICKER (ex: PEP)" 
                    className="w-full pr-14 pl-4 py-4 bg-transparent font-display font-bold text-xl uppercase placeholder:text-gray-300 text-center focus:outline-none text-gray-900 dark:text-white"
                />
            </div>

            {/* BOUTON FIGHT */}
            <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95 shadow-xl disabled:opacity-50 disabled:scale-100"
            >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"/> : "FIGHT"}
            </button>
        </div>
      </form>

      {/* RÉSULTATS DUEL */}
      {dataA && dataB && (
          <div className="grid lg:grid-cols-12 gap-6 animate-fade-in-up">
              
              {/* CARTES JOUEURS (Gauche & Droite sur Desktop, Haut & Bas sur Mobile) */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                  <PlayerCard data={dataA} score={scores.A} color="text-emerald-500" borderColor="border-emerald-500" isWinner={scores.A >= scores.B} />
              </div>

              {/* ARENE CENTRALE (Radar) */}
              <div className="lg:col-span-6 order-1 lg:order-2 bg-white dark:bg-[#121212] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 p-6 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-transparent to-blue-500 opacity-50"></div>
                  
                  <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Analyse Comparative</h3>
                  
                  <div className="flex-1 min-h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" strokeOpacity={0.5} />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold', textAnchor: 'middle' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          
                          {/* Radar A (Emerald) */}
                          <Radar name={dataA.ticker} dataKey="A" stroke="#10b981" strokeWidth={3} fill="#10b981" fillOpacity={0.3} />
                          
                          {/* Radar B (Blue) */}
                          <Radar name={dataB.ticker} dataKey="B" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.3} />
                          
                          <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                      </ResponsiveContainer>
                  </div>

                  {/* LÉGENDE */}
                  <div className="flex justify-center gap-8 mt-4">
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{dataA.ticker}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{dataB.ticker}</span>
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-3 order-3">
                  <PlayerCard data={dataB} score={scores.B} color="text-blue-500" borderColor="border-blue-500" isWinner={scores.B > scores.A} />
              </div>

              {/* TABLEAU DES SCORES DÉTAILLÉ (Largeur Pleine en bas) */}
              <div className="lg:col-span-12 order-4 bg-white dark:bg-[#121212] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                  <div className="grid grid-cols-3 bg-gray-50 dark:bg-white/5 p-4 text-[10px] uppercase font-bold text-gray-500 tracking-widest text-center">
                      <div>{dataA.ticker}</div>
                      <div>Critère</div>
                      <div>{dataB.ticker}</div>
                  </div>
                  
                  <ComparisonRow 
                      label="Prix" 
                      valA={dataA.price + ' $'} 
                      valB={dataB.price + ' $'} 
                  />
                  <ComparisonRow 
                      label="Conformité" 
                      valA={dataA.compliance.is_halal ? 'HALAL' : 'HARAM'} 
                      valB={dataB.compliance.is_halal ? 'HALAL' : 'HARAM'} 
                      winner={dataA.compliance.is_halal === dataB.compliance.is_halal ? 'draw' : (dataA.compliance.is_halal ? 'A' : 'B')}
                  />
                  <ComparisonRow 
                      label="Rentabilité (ROE)" 
                      valA={dataA.technicals.roe + '%'} 
                      valB={dataB.technicals.roe + '%'} 
                      winner={dataA.technicals.roe > dataB.technicals.roe ? 'A' : 'B'}
                  />
                  <ComparisonRow 
                      label="Dette (Safe)" 
                      valA={dataA.ratios.debt_ratio + '%'} 
                      valB={dataB.ratios.debt_ratio + '%'} 
                      winner={dataA.ratios.debt_ratio < dataB.ratios.debt_ratio ? 'A' : 'B'}
                  />
                  <ComparisonRow 
                      label="Dividende" 
                      valA={dataA.technicals.dividend_yield + '%'} 
                      valB={dataB.technicals.dividend_yield + '%'} 
                      winner={dataA.technicals.dividend_yield > dataB.technicals.dividend_yield ? 'A' : 'B'}
                  />
              </div>

          </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function PlayerCard({ data, score, color, borderColor, isWinner }) {
    return (
        <div className={`relative p-6 rounded-[2rem] bg-white dark:bg-[#121212] border-2 transition-all duration-500 ${isWinner ? borderColor + ' shadow-2xl scale-105 z-10' : 'border-transparent opacity-80 scale-95 grayscale'}`}>
            {isWinner && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-brand-gold text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Trophy size={12} /> Winner
                </div>
            )}
            
            <div className="text-center mb-6 mt-2">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{data.ticker}</h2>
                <p className="text-xs text-gray-500 font-medium truncate px-4">{data.name}</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 rounded-full border-4 ${isWinner ? borderColor : 'border-gray-200 dark:border-white/10'} flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5`}>
                    <span className={`text-3xl font-black ${color}`}>{score}</span>
                    <span className="text-[9px] text-gray-400 uppercase font-bold">Score</span>
                </div>
            </div>

            <div className="space-y-3">
                <Badge icon={<Shield size={14}/>} label="Dette" value={data.ratios.debt_ratio + '%'} isGood={data.ratios.debt_ratio < 30} />
                <Badge icon={<TrendingUp size={14}/>} label="Rentab." value={data.technicals.roe + '%'} isGood={data.technicals.roe > 10} />
                <Badge icon={<Wallet size={14}/>} label="Divid." value={data.technicals.dividend_yield + '%'} isGood={data.technicals.dividend_yield > 2} />
            </div>
        </div>
    );
}

function Badge({ icon, label, value, isGood }) {
    return (
        <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5">
            <div className="flex items-center gap-2 text-gray-500">
                {icon} <span className="text-xs font-bold">{label}</span>
            </div>
            <span className={`text-xs font-mono font-bold ${isGood ? 'text-emerald-500' : 'text-gray-400'}`}>
                {value}
            </span>
        </div>
    );
}

function ComparisonRow({ label, valA, valB, winner }) {
    // winner: 'A', 'B', 'draw' or undefined
    const classA = winner === 'A' ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 rounded-lg' : 'text-gray-500';
    const classB = winner === 'B' ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10 rounded-lg' : 'text-gray-500';

    return (
        <div className="grid grid-cols-3 p-3 items-center text-center border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className={`py-2 text-sm transition-all ${classA}`}>{valA}</div>
            <div className="text-[10px] uppercase font-bold text-gray-400">{label}</div>
            <div className={`py-2 text-sm transition-all ${classB}`}>{valB}</div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-black p-3 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 text-xs">
          <p className="font-bold mb-2 uppercase text-gray-400">{label}</p>
          {payload.map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: p.stroke}}></div>
                  <span className="font-bold dark:text-white">{p.name}:</span>
                  <span className="font-mono">{p.value}/100</span>
              </div>
          ))}
        </div>
      );
    }
    return null;
};