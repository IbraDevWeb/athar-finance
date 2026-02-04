import React, { useState } from 'react';
import { 
  Quote, Search, Filter, BookOpen, Feather, 
  Heart, Sparkles, MessageCircle, Moon 
} from 'lucide-react';

export default function IhsanDataModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tout');

  // --- BASE DE DONNÉES DES ATHARS ---
  const WISDOMS = [
    {
      id: 1,
      category: "Comportement (Adab)",
      author: "Prophète Muhammad ﷺ",
      source: "Al-Muwatta",
      arabic: "إِنَّمَا بُعِثْتُ لأُتَمِّمَ مَكَارِمَ الأَخْلاقِ",
      french: "Je n'ai été envoyé que pour parfaire les nobles comportements."
    },
    {
      id: 2,
      category: "Cœur (Qalb)",
      author: "Hasan Al-Basri",
      source: "Sagesse",
      arabic: "لَيْسَ الْإِيمَانُ بِالتَّمَنِّي وَلَا بِالتَّحَلِّي، وَلَكِنْ هُوَ مَا وَقَرَ فِي الْقَلْبِ وَصَدَّقَهُ الْعَمَلُ",
      french: "La foi ne consiste ni en vœux pieux ni en parures, mais c'est ce qui s'ancré dans le cœur et que les actes confirment."
    },
    {
      id: 3,
      category: "Relations (Mu'amalat)",
      author: "Ibn Al-Qayyim",
      source: "Madarij as-Salikin",
      arabic: "الدين كله خلق، فمن زاد عليك في الخلق زاد عليك في الدين",
      french: "La religion tout entière est bon comportement. Celui qui te surpasse en bon comportement te surpasse en religion."
    },
    {
      id: 4,
      category: "Langue (Lisan)",
      author: "Umar ibn al-Khattab",
      source: "Athar",
      arabic: "مَنْ كَثُرَ كَلَامُهُ كَثُرَ سَقَطُهُ",
      french: "Celui qui parle trop commet beaucoup d'erreurs, et celui qui commet beaucoup d'erreurs perd sa pudeur."
    },
    {
      id: 5,
      category: "Comportement (Adab)",
      author: "Fudayl ibn Iyad",
      source: "Sagesse",
      arabic: "لأَنْ يَصْحَبَنِي فَاجِرٌ حَسَنُ الْخُلُقِ، أَحَبُّ إِلَيَّ مِنْ أَنْ يَصْحَبَنِي عَابِدٌ سَيِّئُ الْخُلُقِ",
      french: "Je préfère la compagnie d'un pécheur au bon comportement à celle d'un dévot au mauvais caractère."
    },
    {
      id: 6,
      category: "Cœur (Qalb)",
      author: "Ibn Rajab",
      source: "Jami' al-Ulum",
      arabic: "الذل للانكسار والعجز والافتقار هو روح العبودية ولبها",
      french: "L'humilité, le brisement du cœur et le sentiment de pauvreté (envers Allah) sont l'âme et l'essence de la servitude."
    },
    {
      id: 7,
      category: "Douceur (Rifq)",
      author: "Prophète Muhammad ﷺ",
      source: "Sahih Muslim",
      arabic: "إِنَّ الرِّفْقَ لاَ يَكُونُ فِي شَيْءٍ إِلاَّ زَانَهُ وَلاَ يُنْزَعُ مِنْ شَيْءٍ إِلاَّ شَانَهُ",
      french: "La douceur n'est jamais présente dans une chose sans l'embellir, et elle n'est jamais retirée d'une chose sans l'enlaidir."
    },
    {
      id: 8,
      category: "Relations (Mu'amalat)",
      author: "Sufyan Al-Thawri",
      source: "Hilyat al-Awliya",
      arabic: "إصلاح ما بينك وبين الله، يصلح الله ما بينك وبين الناس",
      french: "Corrige ta relation avec Allah, et Allah corrigera ta relation avec les gens."
    }
  ];

  // Catégories uniques
  const categories = ['Tout', ...new Set(WISDOMS.map(w => w.category))];

  // Filtrage
  const filtered = WISDOMS.filter(item => {
    const matchesSearch = item.french.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Tout' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in space-y-10">
      
      {/* HEADER SPIRITUEL */}
      <div className="text-center pt-8 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/5 border border-brand-gold/20 text-brand-gold mb-2">
            <Feather size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">
           Le Jardin des <span className="text-brand-gold italic">Vertus</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-serif italic text-lg">
           "La beauté de l'âme l'emporte sur toute autre beauté."
        </p>
      </div>

      {/* BARRE DE RECHERCHE & FILTRES */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-20 bg-[#f8f9fa]/80 dark:bg-[#050505]/80 backdrop-blur-md py-4 rounded-xl">
          
          {/* Filtres (Onglets) */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                        activeCategory === cat 
                        ? 'bg-brand-gold text-white border-brand-gold' 
                        : 'bg-white dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/10 hover:border-brand-gold'
                    }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>

          {/* Recherche */}
          <div className="relative w-full md:w-64">
              <input 
                  type="text" 
                  placeholder="Rechercher un terme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-brand-gold text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
      </div>

      {/* GRILLE DES CARTES */}
      <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((item) => (
              <WisdomCard key={item.id} data={item} />
          ))}
          
          {filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-400">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Aucune sagesse trouvée pour cette recherche.</p>
              </div>
          )}
      </div>

      <div className="text-center pt-10 border-t border-gray-200 dark:border-white/5">
           <p className="text-xs text-gray-400 uppercase tracking-widest">
               Compilé avec amour pour les gens doués d'intelligence.
           </p>
      </div>

    </div>
  );
}

// --- SOUS-COMPOSANT : CARTE DE SAGESSE ---
function WisdomCard({ data }) {
    return (
        <div className="group bg-white dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
            
            {/* Décoration Arabesque subtile */}
            <div className="absolute top-0 right-0 p-6 opacity-5 text-brand-gold group-hover:opacity-10 transition-opacity">
                <Quote size={64} />
            </div>

            {/* Catégorie */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">
                {data.category === 'Cœur (Qalb)' && <Heart size={12} className="text-rose-400"/>}
                {data.category === 'Comportement (Adab)' && <Sparkles size={12} className="text-brand-gold"/>}
                {data.category === 'Langue (Lisan)' && <MessageCircle size={12} className="text-blue-400"/>}
                {data.category === 'Relations (Mu\'amalat)' && <Filter size={12} className="text-emerald-400"/>}
                {data.category}
            </div>

            {/* Texte Arabe */}
            <h2 className="text-2xl md:text-3xl font-serif text-right text-gray-800 dark:text-gray-200 mb-6 leading-loose font-medium" dir="rtl">
                {data.arabic}
            </h2>

            {/* Séparateur */}
            <div className="w-12 h-0.5 bg-brand-gold/30 mb-6"></div>

            {/* Traduction */}
            <p className="text-gray-600 dark:text-gray-400 font-serif italic text-lg leading-relaxed mb-6">
                « {data.french} »
            </p>

            {/* Auteur & Source */}
            <div className="flex justify-between items-end border-t border-gray-100 dark:border-white/5 pt-4">
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{data.author}</p>
                    <p className="text-xs text-brand-gold uppercase tracking-wider mt-0.5">{data.source}</p>
                </div>
                <div className="text-gray-300 dark:text-gray-700 group-hover:text-brand-gold transition-colors">
                    <Feather size={16} />
                </div>
            </div>
        </div>
    );
}