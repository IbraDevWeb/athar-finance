import React, { useState } from 'react';
import { 
  Heart, Brain, Scale, Users, TrendingUp, Sparkles, 
  Infinity, Quote, Lock, Unlock 
} from 'lucide-react';

export default function IhsanModule() {
  const [activeConcept, setActiveConcept] = useState(0);

  const CONCEPTS = [
    {
      id: 'brotherhood',
      title: "L'Économie Fraternelle",
      icon: <Users size={24} />,
      color: "text-emerald-500",
      text: {
        arabic: "لا يُؤمِنُ أحدُكم حتى يُحِبَّ لأخيه ما يُحِبُّ لنَفْسِه",
        french: "« Aucun de vous ne sera véritablement croyant tant qu'il n'aimera pas pour son frère ce qu'il aime pour lui-même. »",
        source: "Al-Bukhari & Muslim"
      },
      science: {
        title: "La Théorie des Jeux (Win-Win)",
        desc: "En économie classique, on pense souvent en 'Jeu à Somme Nulle' (pour que je gagne, tu dois perdre). Ce Hadith introduit l'Equilibre de Nash Coopératif : maximiser le bien-être du groupe maximise la sécurité de l'individu. Une société où l'on protège le capital de son voisin est une société sans risque systémique, favorisant l'investissement long terme."
      }
    },
    {
      id: 'detachment',
      title: "La Psychologie de la Richesse",
      icon: <Brain size={24} />,
      color: "text-brand-gold",
      text: {
        arabic: "تَعِسَ عَبْدُ الدِّينَارِ، وَعَبْدُ الدِّرْهَمِ",
        french: "« Malheur à l'esclave du Dinar et au serviteur du Dirham... S'il reçoit, il est satisfait, mais s'il ne reçoit pas, il s'indigne. »",
        source: "Al-Bukhari"
      },
      science: {
        title: "Charge Cognitive & Bonheur",
        desc: "L'étude 'Easterlin Paradox' prouve qu'au-delà d'un seuil de confort, l'argent n'augmente plus le bonheur mais le stress (Cortisol). L'obsession matérialiste réduit la 'Bande Passante Mentale' (Sendhil Mullainathan), nous rendant moins capables de prendre de bonnes décisions. Le détachement est donc une optimisation de la performance cognitive."
      }
    },
    {
      id: 'generosity',
      title: "La Mathématique de l'Abondance",
      icon: <Infinity size={24} />,
      color: "text-blue-500",
      text: {
        arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
        french: "« Jamais une aumône n'a diminué une richesse. »",
        source: "Muslim"
      },
      science: {
        title: "Le Multiplicateur de Capital Social",
        desc: "Mathématiquement, 100 - 10 = 90. Mais économiquement, le don crée du 'Capital Social' (confiance, réputation, réseau). Ce capital intangible a un ROI (Retour sur Investissement) souvent supérieur au capital financier. La circulation de l'argent (Vitesse de circulation de la monnaie) dynamise l'écosystème dont l'investisseur dépend."
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-fade-in space-y-10">
      
      {/* HEADER */}
      <div className="text-center pt-8 space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-brand-gold/10 text-brand-gold mb-2 ring-1 ring-brand-gold/20">
            <Sparkles size={24} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">
           Module <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">Ihsan</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
           L'Excellence Spirituelle vue par le prisme de la science économique.
           <br/>Quand la foi valide la raison.
        </p>
      </div>

      {/* NAVIGATION DES CONCEPTS */}
      <div className="flex flex-wrap justify-center gap-4">
        {CONCEPTS.map((concept, index) => (
            <button
                key={concept.id}
                onClick={() => setActiveConcept(index)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${activeConcept === index ? 'bg-white dark:bg-[#1a1a1a] border-brand-gold shadow-xl scale-105' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5 grayscale hover:grayscale-0'}`}
            >
                <div className={`${activeConcept === index ? concept.color : 'text-gray-400'}`}>
                    {concept.icon}
                </div>
                <div className="text-left">
                    <p className={`text-sm font-bold uppercase tracking-wider ${activeConcept === index ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                        {concept.title}
                    </p>
                </div>
            </button>
        ))}
      </div>

      {/* CONTENU DU CONCEPT ACTIF (Split View) */}
      <div className="grid lg:grid-cols-2 gap-8 items-stretch animate-fade-in-up">
          
          {/* CÔTÉ GAUCHE : LA RÉVÉLATION (TEXTE) */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[400px]">
              <div className="absolute top-0 left-0 p-8 opacity-10 text-brand-gold">
                  <Quote size={80} />
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-gold blur-[100px] opacity-10 rounded-full"></div>
              
              <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-bold uppercase tracking-widest text-brand-gold">
                      <Heart size={12} /> Tradition Prophétique
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-serif leading-relaxed text-right" dir="rtl">
                      {CONCEPTS[activeConcept].text.arabic}
                  </h2>
                  
                  <div className="space-y-2">
                      <p className="text-xl md:text-2xl font-light text-gray-200 italic leading-normal">
                         {CONCEPTS[activeConcept].text.french}
                      </p>
                      <p className="text-sm font-bold text-brand-gold uppercase tracking-widest mt-4">
                         — {CONCEPTS[activeConcept].text.source}
                      </p>
                  </div>
              </div>
          </div>

          {/* CÔTÉ DROIT : LA RAISON (SCIENCE) */}
          <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col justify-center min-h-[400px]">
              <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-xs font-bold uppercase tracking-widest text-blue-500">
                      <Brain size={12} /> Analyse Scientifique
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {CONCEPTS[activeConcept].science.title}
                  </h3>
                  
                  <div className="w-12 h-1 bg-brand-gold rounded-full"></div>

                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {CONCEPTS[activeConcept].science.desc}
                  </p>

                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 mt-4">
                      <div className="flex items-start gap-3">
                          <TrendingUp className="text-emerald-500 mt-1 shrink-0" size={20} />
                          <div>
                              <p className="text-xs font-bold uppercase text-gray-400 mb-1">Verdict Athar</p>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                  Ce principe n'est pas seulement une obligation morale, c'est une <span className="text-emerald-500 font-bold">stratégie économique optimale</span> pour la durabilité.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

      </div>

      {/* FOOTER CITATION */}
      <div className="text-center pt-10 border-t border-gray-200 dark:border-white/5">
          <p className="text-sm font-serif italic text-gray-400">
              "L'Ihsan est d'adorer Allah comme si tu Le voyais."
          </p>
      </div>

    </div>
  );
}