import React from 'react';
import { Layers, Hammer, Sparkles, ArrowRight, Search } from 'lucide-react';

export default function EtfXrayModule() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in max-w-2xl mx-auto">
      
      {/* VISUEL CENTRAL */}
      <div className="relative mb-10 group">
        <div className="w-40 h-40 bg-brand-gold/10 rounded-full flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110">
           <Layers size={64} className="text-brand-gold opacity-80" />
        </div>
        
        <div className="absolute -bottom-4 -right-4 bg-brand-dark p-4 rounded-full shadow-xl z-20 border-4 border-[#f8f9fa] dark:border-[#050505]">
            <Hammer size={24} className="text-brand-gold animate-pulse" />
        </div>

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
              Nous développons un moteur de données exclusif pour vous garantir une analyse fiable. La qualité exige un peu de patience.
          </p>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div className="w-full max-w-md h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-10 overflow-hidden relative">
          <div className="h-full bg-brand-gold w-3/4 rounded-full absolute top-0 left-0 animate-pulse"></div>
          <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
      <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mt-3">Progression : 75%</p>
    </div>
  );
}