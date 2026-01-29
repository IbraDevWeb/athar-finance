import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';

export default function SimulatorModule() {
  const [mode, setMode] = useState('classic'); // 'classic' ou 'montecarlo'

  // --- ÉTATS CLASSIQUES ---
  const [initialAmount, setInitialAmount] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8); 
  const [inflationRate, setInflationRate] = useState(2);
  
  // --- ÉTATS MONTE CARLO ---
  const [volatility, setVolatility] = useState(15); // Volatilité du marché (15% standard S&P)
  const [simulations, setSimulations] = useState([]);
  const [mcStats, setMcStats] = useState({ min: 0, median: 0, max: 0 });

  const [data, setData] = useState([]);
  const [finalResult, setFinalResult] = useState({ totalInvested: 0, totalInterest: 0, totalValue: 0, realValue: 0 });

  // --- CALCULATEUR CLASSIQUE ---
  useEffect(() => {
    calculateCompoundInterest();
    if (mode === 'montecarlo') runMonteCarlo();
  }, [initialAmount, monthlyContribution, years, interestRate, inflationRate, volatility, mode]);

  const calculateCompoundInterest = () => {
    let currentBalance = initialAmount;
    let totalInvested = initialAmount;
    let currentRealBalance = initialAmount;
    const chartData = [];
    
    const monthlyRate = interestRate / 100 / 12;
    const monthlyInflation = inflationRate / 100 / 12;

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        currentBalance = currentBalance * (1 + monthlyRate);
        currentBalance += monthlyContribution;
        totalInvested += monthlyContribution;
        currentRealBalance = currentBalance / Math.pow(1 + monthlyInflation, (year * 12) + month);
      }
      chartData.push({
        name: `An ${year}`,
        Investi: Math.round(totalInvested),
        Total: Math.round(currentBalance),
        Réel: Math.round(currentRealBalance)
      });
    }
    setData(chartData);
    setFinalResult({
      totalInvested: Math.round(totalInvested),
      totalValue: Math.round(currentBalance),
      totalInterest: Math.round(currentBalance - totalInvested),
      realValue: Math.round(currentRealBalance)
    });
  };

  // --- MOTEUR MONTE CARLO 🎲 ---
  const runMonteCarlo = () => {
    const numSims = 50; // On affiche 50 lignes pour pas surcharger le graph
    const allFinalValues = [];
    const simData = [];

    // On prépare la structure des données pour Recharts
    // Array d'objets : { name: "An 1", sim1: 1000, sim2: 1020... }
    for(let y=0; y<=years; y++) {
        simData.push({ name: `An ${y}` });
    }

    for (let i = 0; i < numSims; i++) {
        let balance = initialAmount;
        let monthlyInvest = monthlyContribution;
        
        // On remplit l'année 0
        simData[0][`sim${i}`] = balance;

        for (let year = 1; year <= years; year++) {
            // Rendement annuel aléatoire basé sur Loi Normale (Gaussian)
            // Rendement = Moyenne + (Volatilité * RandomGaussian)
            // Box-Muller transform pour nombre aléatoire normal
            const u = 1 - Math.random(); 
            const v = Math.random();
            const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
            
            const randomAnnualReturn = (interestRate/100) + ((volatility/100) * z);
            
            // Application du rendement
            balance = balance * (1 + randomAnnualReturn);
            // Ajout des dépôts de l'année
            balance += (monthlyInvest * 12);

            simData[year][`sim${i}`] = Math.round(balance);
        }
        allFinalValues.push(balance);
    }

    // Calcul Stats
    allFinalValues.sort((a, b) => a - b);
    setMcStats({
        min: Math.round(allFinalValues[4]), // 10th percentile (Pessimiste)
        median: Math.round(allFinalValues[Math.floor(numSims/2)]),
        max: Math.round(allFinalValues[numSims-5]) // 90th percentile (Optimiste)
    });
    setSimulations(simData);
  };

  const formatMoney = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-2">
           <span className="text-3xl">🚀</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-brand-dark">Projection Patrimoine</h1>
        
        {/* TABS MODE */}
        <div className="flex justify-center mt-4">
            <div className="bg-white p-1 rounded-xl border border-gray-200 inline-flex">
                <button 
                    onClick={() => setMode('classic')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition ${mode === 'classic' ? 'bg-brand-dark text-brand-gold shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    Classique
                </button>
                <button 
                    onClick={() => setMode('montecarlo')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition ${mode === 'montecarlo' ? 'bg-brand-dark text-brand-gold shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    Monte Carlo 🎲
                </button>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* PARAMÈTRES */}
        <div className="glass rounded-2xl p-6 h-fit border-t-4 border-brand-gold">
          <h3 className="font-bold text-brand-dark mb-6 text-sm uppercase tracking-widest">Paramètres</h3>
          
          <div className="space-y-5">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Capital Départ</label>
                <input type="number" value={initialAmount} onChange={(e) => setInitialAmount(Number(e.target.value))} className="w-full mt-1 p-3 bg-brand-paper border border-gray-200 rounded-xl font-bold text-brand-dark outline-none focus:border-brand-gold" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Ajout Mensuel</label>
                <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full mt-1 p-3 bg-brand-paper border border-gray-200 rounded-xl font-bold text-brand-dark outline-none focus:border-brand-gold" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Durée (Ans): <span className="text-brand-gold">{years}</span></label>
                <input type="range" min="5" max="40" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full mt-2 accent-brand-gold bg-gray-200 h-1 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Rendement Moyen (%): <span className="text-brand-gold">{interestRate}%</span></label>
                <input type="range" min="1" max="15" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full mt-2 accent-brand-gold bg-gray-200 h-1 rounded-lg appearance-none cursor-pointer" />
            </div>
            
            {mode === 'montecarlo' && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <label className="text-xs font-bold text-orange-800 uppercase">Volatilité (Risque)</label>
                    <p className="text-[10px] text-orange-600 mb-2 leading-tight">Plus elle est haute, plus le résultat est incertain.</p>
                    <input type="range" min="5" max="30" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} className="w-full accent-orange-500 bg-gray-200 h-1 rounded-lg appearance-none cursor-pointer" />
                    <div className="text-right text-xs font-bold text-orange-600 mt-1">{volatility}%</div>
                </div>
            )}
          </div>
        </div>

        {/* GRAPHIQUE & RÉSULTATS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CARTES RÉSULTATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {mode === 'classic' ? (
                 <>
                    <ResultCard title="Total Investi" value={formatMoney(finalResult.totalInvested)} color="text-blue-600" bg="bg-blue-50" />
                    <ResultCard title="Intérêts Composés" value={"+" + formatMoney(finalResult.totalInterest)} color="text-emerald-600" bg="bg-emerald-50" />
                    <ResultCard title="Patrimoine Final" value={formatMoney(finalResult.totalValue)} color="text-brand-gold" bg="bg-brand-dark" dark />
                 </>
             ) : (
                 <>
                    <ResultCard title="Scénario Pessimiste" value={formatMoney(mcStats.min)} color="text-red-500" bg="bg-red-50" label="Marché difficile" />
                    <ResultCard title="Scénario Médian" value={formatMoney(mcStats.median)} color="text-blue-600" bg="bg-blue-50" label="Le plus probable" />
                    <ResultCard title="Scénario Optimiste" value={formatMoney(mcStats.max)} color="text-emerald-600" bg="bg-emerald-50" label="Marché haussier" />
                 </>
             )}
          </div>

          {/* CHART AREA */}
          <div className="glass p-6 rounded-2xl h-[400px] relative">
            <h3 className="font-bold text-brand-dark mb-4 text-center text-sm uppercase tracking-widest">
                {mode === 'classic' ? 'Croissance Exponentielle' : `Projection de 50 Futurs Possibles`}
            </h3>
            
            <ResponsiveContainer width="100%" height="100%">
              {mode === 'classic' ? (
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{fontSize: 10}} minTickGap={30} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(val) => `${val/1000}k`} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => formatMoney(value)} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <Area type="monotone" dataKey="Total" stroke="#c5a059" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                    <Area type="monotone" dataKey="Investi" stroke="#94a3b8" strokeWidth={2} fillOpacity={0.1} fill="#94a3b8" />
                  </AreaChart>
              ) : (
                  <LineChart data={simulations} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fontSize: 10}} minTickGap={30} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(val) => `${val/1000}k`} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => formatMoney(value)} labelStyle={{color: 'black'}} contentStyle={{borderRadius: '12px'}} />
                    {/* Génération dynamique des 50 lignes */}
                    {Array.from({ length: 50 }).map((_, i) => (
                        <Line 
                            key={i} 
                            type="monotone" 
                            dataKey={`sim${i}`} 
                            stroke="#c5a059" 
                            strokeWidth={1} 
                            strokeOpacity={0.2} 
                            dot={false} 
                        />
                    ))}
                  </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-500 italic text-center">
              {mode === 'classic' 
                ? "* Ce graphique suppose un rendement constant chaque année (ce qui n'arrive jamais en réalité)." 
                : "* Monte Carlo simule la volatilité réelle des marchés. Notez l'écart énorme entre le scénario pessimiste et optimiste sur le long terme."}
          </div>

        </div>
      </div>
    </div>
  );
}

function ResultCard({ title, value, color, bg, label, dark }) {
    return (
        <div className={`p-4 rounded-xl border ${dark ? 'border-brand-gold/30 bg-brand-dark' : `border-gray-100 ${bg}`}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
            <p className={`text-xl md:text-2xl font-serif font-bold ${color}`}>{value}</p>
            {label && <p className="text-[10px] text-gray-400 mt-1">{label}</p>}
        </div>
    );
}