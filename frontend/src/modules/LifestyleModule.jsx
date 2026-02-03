import React, { useState } from 'react';
import { 
  Wifi, Music, Dumbbell, Smartphone, ShoppingBag, Car, 
  Home, Plane, Crown, Calculator, TrendingUp, Lock, Unlock 
} from 'lucide-react';

export default function LifestyleModule() {
  const [investment, setInvestment] = useState(10000); // Capital investi
  const [yieldRate, setYieldRate] = useState(4); // Rendement annuel moyen (ex: 4% pour dividendes)

  // Calculs financiers
  const annualIncome = investment * (yieldRate / 100);
  const monthlyIncome = annualIncome / 12;

  // Liste des Objectifs de Vie (Niveaux)
  const GOALS = [
    { id: 1, label: 'Spotify / Netflix', cost: 15, icon: <Music size={24}/>, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { id: 2, label: 'Salle de Sport', cost: 35, icon: <Dumbbell size={24}/>, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 3, label: 'Internet & Mobile', cost: 60, icon: <Wifi size={24}/>, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
    { id: 4, label: 'Restos & Sorties', cost: 150, icon: <ShoppingBag size={24}/>, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/20' },
    { id: 5, label: 'Crédit Auto / LLD', cost: 400, icon: <Car size={24}/>, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { id: 6, label: 'Loyer / Crédit Immo', cost: 900, icon: <Home size={24}/>, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { id: 7, label: 'Voyages & Kiff', cost: 1500, icon: <Plane size={24}/>, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/20' },
    { id: 8, label: 'Indépendance Totale', cost: 3000, icon: <Crown size={24}/>, color: 'text-brand-gold', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in space-y-10">
      
      {/* HEADER */}
      <div className="text-center space-y-4 pt-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
          Lifestyle <span className="text-brand-gold">Converter</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Ne comptez plus en euros, comptez en liberté. Découvrez ce que votre argent peut payer à votre place.
        </p>
      </div>

      {/* PANNEAU DE CONTRÔLE (SIMULATEUR) */}
      <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* 1. INPUT CAPITAL */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Capital Investi</label>
            <div className="relative group">
              <input 
                type="number" 
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full text-3xl font-mono font-bold bg-transparent border-b-2 border-gray-200 dark:border-white/10 focus:border-brand-gold outline-none py-2 text-gray-900 dark:text-white transition-colors"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 font-light text-xl">€</span>
            </div>
          </div>

          {/* 2. SLIDER RENDEMENT */}
          <div className="space-y-3">
             <div className="flex justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Rendement Moyen</label>
                <span className="text-brand-gold font-bold">{yieldRate}% / an</span>
             </div>
             <input 
               type="range" 
               min="1" max="12" step="0.5"
               value={yieldRate}
               onChange={(e) => setYieldRate(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold"
             />
             <div className="flex justify-between text-[10px] text-gray-400">
                <span>Livret A (3%)</span>
                <span>Actions (5-8%)</span>
                <span>Immo (10%+)</span>
             </div>
          </div>

          {/* 3. RÉSULTAT (RENTE) */}
          <div className="bg-brand-gold/10 rounded-2xl p-6 text-center border border-brand-gold/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Calculator size={64} className="text-brand-gold"/></div>
             <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-1">Votre Rente Mensuelle</p>
             <p className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
               {Math.floor(monthlyIncome)} <span className="text-lg text-gray-400">€/mois</span>
             </p>
          </div>

        </div>
      </div>

      {/* GRILLE DES OBJECTIFS */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <TrendingUp className="text-brand-gold"/> Vos Niveaux de Liberté
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {GOALS.map((goal) => {
             // Calcul du % atteint
             const percent = Math.min(100, Math.round((monthlyIncome / goal.cost) * 100));
             const isUnlocked = percent >= 100;
             // Capital nécessaire pour débloquer ce palier
             const requiredCapital = (goal.cost * 12) / (yieldRate / 100);

             return (
               <div key={goal.id} className={`relative p-6 rounded-2xl border transition-all duration-500 ${isUnlocked ? 'bg-white dark:bg-[#121212] border-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-gray-50 dark:bg-white/5 border-transparent opacity-90'}`}>
                 
                 {/* Header Carte */}
                 <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${goal.bg} ${goal.color}`}>
                       {goal.icon}
                    </div>
                    <div className="text-right">
                       {isUnlocked ? <Unlock size={18} className="text-emerald-500 inline-block"/> : <Lock size={18} className="text-gray-300 inline-block"/>}
                       <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{goal.cost}€</p>
                    </div>
                 </div>

                 <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-4">{goal.label}</h4>

                 {/* Barre de Progression */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className={isUnlocked ? 'text-emerald-500' : 'text-gray-400'}>{percent}% Payé</span>
                       {!isUnlocked && <span className="text-gray-400">Cible: {Math.floor(requiredCapital/1000)}k€</span>}
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500' : 'bg-brand-gold'}`} 
                         style={{ width: `${percent}%` }}
                       ></div>
                    </div>
                 </div>

                 {/* Message de Félicitation */}
                 {isUnlocked && (
                    <div className="absolute inset-x-0 bottom-0 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase text-center rounded-b-xl">
                       Objectif Atteint ! 
                    </div>
                 )}
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}