import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Home, Building, TrendingUp, AlertCircle, CheckCircle, Scale 
} from 'lucide-react';

export default function HouseModule() {
  // --- 1. PARAMÈTRES UTILISATEUR ---
  // Immobilier
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [downPayment, setDownPayment] = useState(30000); // Apport
  const [years, setYears] = useState(25);
  const [mortgageRate, setMortgageRate] = useState(3.8); // Taux crédit
  const [propertyAppreciation, setPropertyAppreciation] = useState(2); // +2% par an
  
  // Frais Propriétaire
  const [propertyTax, setPropertyTax] = useState(1200); // Taxe Foncière / an
  const [maintenanceCost, setMaintenanceCost] = useState(1); // % prix du bien / an (travaux)
  
  // Locataire / Investisseur
  const [rent, setRent] = useState(900);
  const [marketReturn, setMarketReturn] = useState(8); // Rendement Bourse (ETF)

  // --- 2. RÉSULTATS ---
  const [data, setData] = useState([]);
  const [winner, setWinner] = useState(null); // 'buy' or 'rent'
  const [diffAmount, setDiffAmount] = useState(0);

  useEffect(() => {
    calculateComparison();
  }, [propertyPrice, downPayment, years, mortgageRate, propertyAppreciation, propertyTax, maintenanceCost, rent, marketReturn]);

  const calculateComparison = () => {
    const chartData = [];
    const notaryFees = propertyPrice * 0.08; // ~8% ancien
    const loanAmount = propertyPrice + notaryFees - downPayment;
    
    // Calcul Mensualité Crédit (Formule standard)
    const monthlyRate = mortgageRate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyMortgage = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

    // État initial
    let ownerWealth = downPayment - notaryFees; // On perd les frais de notaire direct (patrimoine net)
    
    let renterWealth = downPayment; // Le locataire place tout son apport
    let currentPropertyPrice = propertyPrice;
    let remainingDebt = loanAmount;
    let currentRent = rent;

    for (let year = 1; year <= years; year++) {
      // --- SCÉNARIO PROPRIÉTAIRE ---
      // 1. La maison prend de la valeur
      currentPropertyPrice *= (1 + propertyAppreciation / 100);
      
      // 2. On rembourse la dette (Amortissement)
      for(let m=0; m<12; m++) {
          const interest = remainingDebt * monthlyRate;
          const capital = monthlyMortgage - interest;
          remainingDebt -= capital;
      }
      
      // Patrimoine Net Propriétaire = Valeur Maison - Dette Restante
      ownerWealth = currentPropertyPrice - remainingDebt;

      // --- SCÉNARIO LOCATAIRE ---
      // Coût mensuel Propriétaire = Crédit + (Taxe Foncière/12) + (Travaux/12)
      const monthlyOwnerCost = monthlyMortgage + (propertyTax / 12) + ((propertyPrice * (maintenanceCost/100)) / 12);
      
      // Capacité d'épargne du locataire = Ce que le propriétaire dépense - Loyer
      let monthlySavings = monthlyOwnerCost - currentRent;
      
      // Simulation investissement bourse (intérêts composés mensuels)
      for(let m=0; m<12; m++) {
         renterWealth *= (1 + (marketReturn/100/12)); // Croissance du mois précédent
         if (monthlySavings > 0) {
             renterWealth += monthlySavings; // Ajout de l'épargne
         } else {
             renterWealth += monthlySavings; // Soustraction si loyer > coût achat
         }
      }

      // Inflation du loyer (indexation IRL ~2%)
      currentRent *= 1.02; 

      chartData.push({
        year: `An ${year}`,
        Acheteur: Math.round(ownerWealth),
        Locataire: Math.round(renterWealth),
      });
    }

    setData(chartData);
    
    // Verdict
    const finalOwner = chartData[chartData.length - 1].Acheteur;
    const finalRenter = chartData[chartData.length - 1].Locataire;
    
    if (finalOwner > finalRenter) {
        setWinner('buy');
        setDiffAmount(finalOwner - finalRenter);
    } else {
        setWinner('rent');
        setDiffAmount(finalRenter - finalOwner);
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-2 text-brand-gold">
           <Scale size={32} />
        </div>
        <h1 className="font-display text-4xl font-bold text-brand-dark">Acheter ou Louer ?</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
            Le match mathématique ultime. Découvrez si vous devez devenir propriétaire ou rester locataire et investir la différence sur les marchés (ETF).
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* --- COLONNE GAUCHE : CONTRÔLES (4 cols) --- */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Hypothèses ACHAT */}
            <div className="glass p-6 rounded-2xl border-t-4 border-brand-dark">
                <div className="flex items-center gap-2 mb-6">
                    <Home size={20} className="text-brand-dark"/>
                    <h3 className="font-bold text-brand-dark uppercase tracking-widest text-sm">Hypothèses Achat</h3>
                </div>
                
                <div className="space-y-4">
                    <InputGroup label="Prix du Bien" value={propertyPrice} setValue={setPropertyPrice} min={50000} max={1000000} step={5000} unit="€" />
                    <InputGroup label="Apport Personnel" value={downPayment} setValue={setDownPayment} min={0} max={200000} step={1000} unit="€" />
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Frais de Notaire (est. 8%)</span>
                            <span>{formatMoney(propertyPrice * 0.08)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-red-500">
                            <span>Perte immédiate à l'achat</span>
                            <span>- {formatMoney(propertyPrice * 0.08)}</span>
                        </div>
                    </div>
                    <InputGroup label="Taux Crédit (Assurance incluse)" value={mortgageRate} setValue={setMortgageRate} min={1} max={7} step={0.1} unit="%" />
                    <InputGroup label="Taxe Foncière / an" value={propertyTax} setValue={setPropertyTax} min={0} max={5000} step={50} unit="€" />
                </div>
            </div>

            {/* Hypothèses LOCATION */}
            <div className="glass p-6 rounded-2xl border-t-4 border-brand-gold">
                <div className="flex items-center gap-2 mb-6">
                    <Building size={20} className="text-brand-gold"/>
                    <h3 className="font-bold text-brand-gold uppercase tracking-widest text-sm">Hypothèses Location</h3>
                </div>
                
                <div className="space-y-4">
                    <InputGroup label="Loyer Mensuel (Charges Comprises)" value={rent} setValue={setRent} min={300} max={5000} step={50} unit="€" />
                    <div className="bg-brand-gold/10 p-4 rounded-xl border border-brand-gold/20">
                        <label className="flex items-center gap-2 text-xs font-bold text-brand-gold uppercase mb-2">
                            <TrendingUp size={14}/>
                            Rendement Bourse
                        </label>
                        <input 
                            type="range" min="2" max="15" step="0.5"
                            value={marketReturn} onChange={(e) => setMarketReturn(Number(e.target.value))} 
                            className="w-full accent-brand-gold bg-white h-2 rounded-lg appearance-none cursor-pointer" 
                        />
                        <div className="text-right font-bold text-brand-dark mt-1">{marketReturn}% / an</div>
                        <p className="text-[10px] text-gray-500 mt-2 leading-tight">
                            C'est la clé : le locataire DOIT investir la différence d'argent chaque mois pour gagner.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        {/* --- COLONNE DROITE : GRAPHIQUE & VERDICT (8 cols) --- */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* VERDICT BANNER */}
            <div className={`p-8 rounded-3xl text-white shadow-xl transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${winner === 'buy' ? 'bg-brand-dark' : 'bg-gradient-to-r from-brand-gold to-yellow-600'}`}>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {winner === 'buy' ? <Home size={24} /> : <TrendingUp size={24} />}
                        <span className="font-bold uppercase tracking-widest text-sm opacity-80">Le Verdict Mathématique</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold">
                        {winner === 'buy' ? "L'Achat Immobilier gagne" : "La Stratégie Financière gagne"}
                    </h2>
                    <p className="text-white/80 mt-2 text-sm max-w-md">
                        {winner === 'buy' 
                            ? "Sur cette durée, la plus-value immobilière et l'épargne forcée du crédit battent les marchés financiers."
                            : "Surprenant ? En plaçant votre apport et la différence de budget en bourse, vous devenez plus riche qu'en achetant."
                        }
                    </p>
                </div>
                <div className="text-center bg-white/10 p-4 rounded-2xl backdrop-blur-sm min-w-[180px]">
                    <p className="text-xs uppercase font-bold opacity-70 mb-1">Gain final supplémentaire</p>
                    <p className="text-3xl font-mono font-bold">+{formatMoney(diffAmount)}</p>
                </div>
            </div>

            {/* GRAPHIQUE */}
            <div className="glass p-6 rounded-3xl h-[450px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1e293b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={(val) => `${val/1000}k€`} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            formatter={(value) => formatMoney(value)}
                            contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <Legend verticalAlign="top" height={36}/>
                        
                        <Area 
                            name="Patrimoine Propriétaire"
                            type="monotone" 
                            dataKey="Acheteur" 
                            stroke="#1e293b" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorBuy)" 
                        />
                        <Area 
                            name="Patrimoine Locataire (+ Bourse)"
                            type="monotone" 
                            dataKey="Locataire" 
                            stroke="#c5a059" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorRent)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* EXPLICATION DU CALCUL */}
            <div className="grid md:grid-cols-2 gap-4">
                 <InfoCard 
                    icon={<AlertCircle size={18} className="text-red-500"/>}
                    title="Le piège des frais"
                    text="L'acheteur commence avec un patrimoine négatif à cause des frais de notaire. Il lui faut souvent 5 à 7 ans juste pour revenir à zéro."
                 />
                 <InfoCard 
                    icon={<CheckCircle size={18} className="text-emerald-500"/>}
                    title="La puissance de l'ETF"
                    text={`Si le locataire investit rigoureusement à ${marketReturn}% par an, les intérêts composés peuvent dépasser la plus-value immobilière.`}
                 />
            </div>

        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function InputGroup({ label, value, setValue, min, max, step, unit }) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
                <span className="text-xs font-bold text-brand-dark">{value} {unit}</span>
            </div>
            <input 
                type="range" min={min} max={max} step={step}
                value={value} onChange={(e) => setValue(Number(e.target.value))} 
                className="w-full accent-brand-dark bg-gray-200 h-1.5 rounded-lg appearance-none cursor-pointer" 
            />
        </div>
    );
}

function InfoCard({ icon, title, text }) {
    return (
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex gap-3">
            <div className="mt-1">{icon}</div>
            <div>
                <h4 className="font-bold text-sm text-gray-800 mb-1">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{text}</p>
            </div>
        </div>
    );
}