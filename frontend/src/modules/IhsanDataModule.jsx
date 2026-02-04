import React, { useState, useMemo } from 'react';
import { 
  Quote, Search, BookOpen, Feather, 
  Heart, Sparkles, MessageCircle, Filter 
} from 'lucide-react';

// Import des données locales
import { WISDOMS } from './ihsanData'; 

export default function IhsanDataModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tout');

  // --- OPTIMISATION : Mémoïsation des données ---
  // On ne recalcule les catégories que si les données changent (rare)
  const categories = useMemo(() => {
      return ['Tout', ...new Set(WISDOMS.map(w => w.category))];
  }, []);

  // On ne refiltre que si le terme de recherche ou la catégorie change
  const filtered = useMemo(() => {
      return WISDOMS.filter(item => {
        const matchesSearch = item.french.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.arabic.includes(searchTerm); // Ajout recherche en arabe
        const matchesCategory = activeCategory === 'Tout' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
  }, [searchTerm, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-12">
      
      {/* --- HEADER SPIRITUEL --- */}
      <div className="text-center pt-10 space-y-5 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/5 border border-brand-gold/20 text-brand-gold shadow-sm">
            <Feather size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
           Le Jardin des <span className="text-brand-gold italic">Vertus</span>
        </h1>
        <div className="w-16 h-px bg-brand-gold/30 mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-serif italic text-xl leading-relaxed">
           "La beauté de l'âme l'emporte sur toute autre beauté."
        </p>
      </div>

      {/* --- BARRE DE CONTRÔLE STICKY PREMIUM --- */}
      <div className="sticky top-4 z-30 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-100/50 dark:border-white/10 py-4 px-4 md:px-6 rounded-2xl shadow-sm transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Filtres (Onglets défilants) */}
          <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar mask-gradient-right">
              {categories.map(cat => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                            isActive 
                            ? 'bg-brand-gold text-white border-brand-gold shadow-md shadow-brand-gold/20 scale-105' 
                            : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-brand-gold/50 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {cat}
                    </button>
                  );
              })}
          </div>

          {/* Recherche */}
          <div className="relative w-full md:w-72 group">
              <input 
                  type="text" 
                  placeholder="Rechercher un auteur, un mot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-brand-gold/10 text-sm transition-all shadow-sm group-hover:border-gray-300 dark:group-hover:border-white/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-gold transition-colors duration-300" size={18} />
          </div>
        </div>
      </div>

      {/* --- GRILLE DES CARTES --- */}
      <div className="grid md:grid-cols-2 gap-8 items-start min-h-[400px]">
          {filtered.map((item, index) => (
              // Ajout d'un léger délai d'animation par carte pour un effet "cascade" fluide
              <div key={item.id} className="animate-fade-in-up" style={{animationDelay: `${index * 50}ms`}}>
                 <WisdomCard data={item} />
              </div>
          ))}
          
          {/* État Vide Amélioré */}
          {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2rem]">
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-full mb-4">
                    <BookOpen size={48} className="opacity-30" strokeWidth={1} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-sm text-gray-500">Essayez d'autres mots-clés ou changez de catégorie.</p>
              </div>
          )}
      </div>

      {/* FOOTER DISCRET */}
      <div className="text-center pt-12 border-t border-gray-100/50 dark:border-white/5">
           <p className="text-[10px] font-bold text-gray-400/80 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
               <Feather size={12} /> Compilé avec soin pour l'apaisement des cœurs
           </p>
      </div>

    </div>
  );
}

// --- SOUS-COMPOSANT : CARTE DE SAGESSE PREMIUM ---
function WisdomCard({ data }) {
    // Détermination dynamique de l'icône et de la couleur
    let Icon = Sparkles;
    let colorClass = "text-brand-gold";
    let bgClass = "bg-brand-gold/10";

    if (data.category.includes('Cœur')) { Icon = Heart; colorClass = "text-rose-400"; bgClass = "bg-rose-400/10"; }
    else if (data.category.includes('Langue')) { Icon = MessageCircle; colorClass = "text-blue-400"; bgClass = "bg-blue-400/10"; }
    else if (data.category.includes('Relations')) { Icon = Filter; colorClass = "text-emerald-400"; bgClass = "bg-emerald-400/10"; }

    return (
        <div className="group bg-white dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-none hover:-translate-y-1 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
            
            {/* Décoration d'arrière-plan */}
            <div className="absolute -top-10 -right-10 text-[10rem] opacity-[0.02] dark:opacity-[0.03] text-brand-gold pointer-events-none select-none font-serif transition-transform group-hover:scale-110 duration-700">
                ”
            </div>
            <div className="absolute top-8 right-8 opacity-5 text-brand-gold group-hover:opacity-10 transition-opacity duration-500">
                <Quote size={48} />
            </div>

            {/* Badge Catégorie */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${bgClass} text-[10px] font-bold uppercase tracking-widest ${colorClass} mb-8 w-fit`}>
                <Icon size={12} strokeWidth={2.5} />
                {data.category}
            </div>

            {/* Contenu Principal (Flexible pour aligner le bas) */}
            <div className="flex-1 flex flex-col">
                {/* Texte Arabe */}
                <h2 className="text-3xl md:text-3xl font-serif text-right text-gray-800 dark:text-gray-100 mb-6 leading-[1.6] font-medium" dir="rtl">
                    {data.arabic}
                </h2>

                {/* Séparateur ornemental */}
                <div className="flex items-center gap-2 mb-6 opacity-50">
                    <div className="h-px w-12 bg-brand-gold/40"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60"></div>
                </div>

                {/* Traduction */}
                <p className="text-gray-600 dark:text-gray-300 font-serif italic text-lg leading-relaxed mb-8">
                    « {data.french} »
                </p>
            </div>

            {/* Footer de la carte (Auteur & Source) */}
            <div className="flex justify-between items-end border-t border-gray-100 dark:border-white/5 pt-5 mt-auto">
                <div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{data.author}</p>
                    <p className="text-xs font-medium text-brand-gold/80 uppercase tracking-wider mt-1 flex items-center gap-1">
                        <BookOpen size={10} /> {data.source}
                    </p>
                </div>
                <div className="text-gray-300 dark:text-gray-700 group-hover:text-brand-gold transition-colors duration-300 p-2 bg-gray-50 dark:bg-white/5 rounded-full group-hover:bg-brand-gold/10">
                    <Feather size={18} strokeWidth={1.5} />
                </div>
            </div>
        </div>
    );
}