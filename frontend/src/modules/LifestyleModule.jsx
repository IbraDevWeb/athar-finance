import React, { useState } from 'react';
import { 
  Wifi, Music, Dumbbell, Smartphone, ShoppingBag, Car, 
  Home, Plane, Crown, Calculator, Lock, Unlock, Zap, CreditCard 
} from 'lucide-react';

export default function LifestyleModule() {
  const [investment, setInvestment] = useState(10000); 
  const [yieldRate, setYieldRate] = useState(5); 

  // Calculs
  const annualIncome = investment * (yieldRate / 100);
  const monthlyIncome = annualIncome / 12;

  const GOALS = [
    { id: 1, label: 'Spotify & Chill', cost: 15, icon: <Music size={20}/>, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 2, label: 'Salle de Sport', cost: 35, icon: <Dumbbell size={20}/>, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 3, label: 'Box Internet', cost: 60, icon: <Wifi size={20}/>, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 4, label: 'Shopping', cost: 150, icon: <ShoppingBag size={20}/>, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 5, label: 'Leasing Auto', cost: 400, icon: <Car size={20}/>, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 6, label: 'Loyer / Crédit', cost: 900, icon: <Home size={20}/>, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 7, label: 'Voyages', cost: 1500, icon: <Plane size={20}/>, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { id: 8, label: 'Liberté Totale', cost: 3000, icon: <Crown size={20}/>, color: 'text-brand-gold', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in space-y-10">
      
      {/* HEADER AVEC CARTE BANCAIRE VIRTUELLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight">
              Transformez votre capital en <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-300">Liberté</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Simulez combien vos investissements peuvent payer vos factures à votre place.
            </p>
        </div>
        
        {/* WIDGET CARTE BANCAIRE */}
        <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm h-56 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform duration-500">
                {/* Effet brillant */}
                <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                
                <div className="p-6 flex flex-col justify-between h-full relative z-10">
                    <div className="flex justify-between items-start">
                        <CreditCard className="text-brand-gold" size={32} />
                        <span className="text-xs font-mono text-gray-400">ATHAR INFINITY</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Rente Mensuelle</p>
                        <p className="text-4xl font-mono font-bold text-white tracking-wider">
                           {Math.floor(monthlyIncome)}<span className="text-lg text-brand-gold">.{(monthlyIncome % 1).toFixed(2).substring(2)}€</span>
                        </p>
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-xs text-gray-500 font-mono">**** **** **** 2024</p>
                        <Zap size={20} className={monthlyIncome > 0 ? "text-brand-gold fill-current" : "text-gray-700"} />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* ZONE DE CONTRÔLE (Sliding Panel) */}
      <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* INPUT CAPITAL */}
            <div className="space-y-4">
                <label className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                    Capital Investi
                    <span className="text-brand-gold">{investment.toLocaleString()} €</span>
                </label>
                <div className="relative">
                   <input 
                     type="range" min="0" max="500000" step="1000"
                     value={investment}
                     onChange={(e) => setInvestment(Number(e.target.value))}
                     className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-gold hover:accent-yellow-500 transition-all"
                   />
                </div>
                <div className="flex gap-2">
                    {[1000, 10000, 50000, 100000].map(val => (
                        <button key={val} onClick={() => setInvestment(val)} className="px-3 py-1 text-xs font-bold rounded-lg border border-gray-200 dark:border-white/10 hover:bg-brand-gold hover:text-white transition-colors">
                            {val/1000}k
                        </button>
                    ))}
                </div>
            </div>

            {/* INPUT RENDEMENT */}
            <div className="space-y-4">
                <label className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                    Rendement Annuel
                    <span className="text-brand-gold">{yieldRate}%</span>
                </label>
                <input 
                     type="range" min="1" max="15" step="0.5"
                     value={yieldRate}
                     onChange={(e) => setYieldRate(Number(e.target.value))}
                     className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-gold"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>Sécuritaire (2-4%)</span>
                    <span>Équilibré (5-7%)</span>
                    <span>Dynamique (8%+)</span>
                </div>
            </div>
         </div>
      </div>

      {/* GRILLE DES NIVEAUX (Gamified) */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pl-2 border-l-4 border-brand-gold">
           Objectifs Débloqués
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {GOALS.map((goal) => {
             const percent = Math.min(100, Math.round((monthlyIncome / goal.cost) * 100));
             const isUnlocked = percent >= 100;
             const requiredCapital = (goal.cost * 12) / (yieldRate / 100);

             return (
               <div key={goal.id} className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 overflow-hidden ${isUnlocked ? 'bg-white dark:bg-[#121212] border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-[1.02]' : 'bg-gray-50 dark:bg-white/5 border-transparent opacity-70 hover:opacity-100'}`}>
                 
                 {/* Fond progress bar en background pour effet de remplissage */}
                 <div className="absolute bottom-0 left-0 h-1.5 bg-gray-200 dark:bg-white/5 w-full">
                    <div className={`h-full transition-all duration-1000 ease-out ${isUnlocked ? 'bg-emerald-500' : 'bg-brand-gold'}`} style={{ width: `${percent}%` }}></div>
                 </div>

                 <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`p-3 rounded-xl transition-colors ${isUnlocked ? goal.bg + ' ' + goal.color : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                       {goal.icon}
                    </div>
                    <div className="text-right">
                       {isUnlocked 
                         ? <Unlock size={16} className="text-emerald-500 ml-auto mb-1" /> 
                         : <Lock size={16} className="text-gray-400 ml-auto mb-1" />
                       }
                       <p className="text-xl font-bold text-gray-900 dark:text-white">{goal.cost}€</p>
                    </div>
                 </div>

                 <div className="relative z-10">
                    <h4 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{goal.label}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        {isUnlocked 
                            ? <span className="text-emerald-500">Financé à 100%</span> 
                            : <span>Manque {Math.floor(requiredCapital - investment).toLocaleString()}€</span>
                        }
                    </p>
                 </div>

                 {/* Effet Lueur au survol */}
                 {isUnlocked && <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>}
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}