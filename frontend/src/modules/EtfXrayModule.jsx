import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Hammer, ArrowRight, Sparkles } from 'lucide-react';

export default function EtfXrayModule() {
  const navigate = useNavigate();

  // Fonction pour rediriger vers le screener (si tu utilises react-router)
  // Sinon, on peut juste changer l'état dans App.js via une props, 
  // mais pour une page statique "en construction", un simple lien suffit.
  const handleGoToScreener = () => {
    // Si ton système de navigation dans App.js est basé sur un état, 
    // ce bouton ne fera rien d'autre que de l'animation pour l'instant.
    // L'utilisateur utilisera le menu latéral pour changer de page.
    console.log("Redirection vers le screener..."); 
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in max-w-2xl mx-auto">
      
      {/* VISUEL CENTRAL */}
      <div className="relative mb-10 group">
        {/* Cercle de fond animé */}
        <div className="w-40 h-40 bg-brand-gold/10 rounded-full flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110">
           <Layers size={64} className="text-brand-gold opacity-80" />
        </div>
        
        {/* Icône "Travaux" superposée */}
        <div className="absolute -bottom-4 -right-4 bg-brand-dark p-4 rounded-full shadow-xl z-20 border-4 border-[#f8f9fa] dark:border-[#050505]">
            <Hammer size={24} className="text-brand-gold animate-pulse" />
        </div>

        {/* Effet "Particules" */}
        <div className="absolute top-0 right-0 text-brand-gold animate-bounce opacity-50" style={{ animationDuration: '3s' }}>
            <Sparkles size={20} />
        </div>
      </div>

      {/* TEXTES */}
      <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark dark:text-white mb-6">
        Construction en cours
      </h1>
      
      <div className="space-y-4 text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
          <p>
              Le module <strong className="text-brand-gold">ETF X-Ray 🩻</strong> est actuellement dans notre atelier.
          </p>
          <p className="text-sm">
              Nous développons un moteur de données exclusif pour vous garantir une analyse fiable de la composition des fonds islamiques. La qualité exige un peu de patience.
          </p>
      </div>

      {/* BARRE DE PROGRESSION FACTICE (Pour le style) */}
      <div className="w-full max-w-md h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-10 overflow-hidden relative">
          <div className="h-full bg-brand-gold w-3/4 rounded-full absolute top-0 left-0 animate-pulse"></div>
          <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-3">Progression : 75%</p>

      {/* BOUTON D'ACTION */}
      <div className="mt-12">
          <p className="text-sm text-gray-400 mb-4">En attendant, utilisez nos autres outils :</p>
          <button 
            // Idéalement, il faudrait passer une fonction de navigation depuis App.js
            // Pour l'instant, c'est visuel. L'utilisateur cliquera sur le menu.
            className="px-8 py-4 bg-brand-dark hover:bg-black text-brand-gold font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-3 mx-auto"
          >
              <Search size={20} />
              Aller vers le Screener Pro
              <ArrowRight size={20} />
          </button>
      </div>

    </div>
  );
}

// Nécessaire pour l'icône du bouton ci-dessus
import { Search } from 'lucide-react';