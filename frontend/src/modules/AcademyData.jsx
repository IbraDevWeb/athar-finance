import React from 'react';

// --- 1. LES COURS (Ta base existante) ---
export const courses = [
  {
    id: 1,
    title: "1. La Valeur Temps de l'Argent",
    icon: "⏳",
    summary: "Comprendre pourquoi 1€ aujourd'hui vaut plus que 1€ demain, et la vision islamique.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <p className="text-lg">Le principe fondamental de la finance : <strong>1 € aujourd'hui vaut plus que 1 € demain.</strong></p>

        <div className="bg-amber-50 border border-brand-gold/30 p-6 rounded-xl">
          <h3 className="text-brand-dark font-bold flex items-center gap-2 mb-2 font-display">🕋 Perspective Finance Islamique</h3>
          <p>Contrairement à la finance conventionnelle, l'argent ne génère pas d'argent par le simple passage du temps (Riba/Intérêt interdit).<br/>
          Le gain provient de <strong>l'investissement dans l'économie réelle</strong> (commerce, actifs tangibles). Le "taux" n'est pas un loyer de l'argent, mais une espérance de profit (ROI).</p>
        </div>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">1. La Capitalisation (Vers le futur)</h3>
        <p>Calculer combien vaudra une somme actuelle si elle est investie (Intérêts composés ou profits réinvestis).</p>
        <div className="bg-brand-dark text-white p-4 rounded-lg font-mono text-center my-4 shadow-inner">
          Valeur Future = C₀ × (1 + r)ⁿ
        </div>
        <p className="text-sm text-gray-500 italic text-center">C₀ : Capital initial | r : Rendement | n : Années</p>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">2. L'Actualisation (Vers le présent)</h3>
        <p>Calculer combien vaut aujourd'hui une somme que l'on recevra dans le futur.</p>
        <div className="bg-brand-dark text-white p-4 rounded-lg font-mono text-center my-4 shadow-inner">
          Valeur Actuelle = Valeur Future / (1 + r)ⁿ
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "2. Macroéconomie & Marchés",
    icon: "🌍",
    summary: "Inflation, Banques Centrales et Cycles économiques : la météo de l'investisseur.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <p>Pour investir, il faut connaître la "météo" économique. Les marchés sont cycliques et pilotés par la monnaie.</p>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">1. L'Inflation et la Monnaie</h3>
        <p>L'inflation résulte souvent d'un déséquilibre entre la masse monétaire et la production.</p>
        <div className="bg-brand-dark text-white p-4 rounded-lg font-mono text-center my-4 shadow-inner">
          M × V = P × Q
        </div>
        <p>Si la Banque Centrale imprime trop de monnaie (M) sans hausse de production (Q), les prix (P) montent.</p>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">2. Les Taux Directeurs</h3>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Taux en hausse 📈 :</strong> L'argent coûte cher. L'économie ralentit. Les actifs baissent.</li>
            <li><strong>Taux en baisse 📉 :</strong> L'argent est gratuit. L'économie accélère. Les actifs montent.</li>
        </ul>
      </div>
    )
  },
  {
    id: 3,
    title: "3. Classes d'Actifs & Screening",
    icon: "🔍",
    summary: "Actions, Sukuks et la méthode AAOIFI pour filtrer le Halal.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <h3 className="text-xl font-bold text-brand-gold font-display">1. Le Screening Halal (Norme AAOIFI)</h3>
        <div className="bg-white border-2 border-brand-gold/20 p-6 rounded-xl">
            <h4 className="text-brand-dark font-bold mb-4 uppercase text-sm tracking-wide">Les 2 Filtres Obligatoires</h4>
            <div className="mb-4">
                <strong>1. Filtre Sectoriel (Activité) 🚫</strong>
                <p>Exclusion : Banques (Intérêts), Assurance, Alcool, Porc, Armement, Jeux, Tabac, Pornographie.</p>
            </div>
            <div>
                <strong>2. Filtre Financier (Ratios) 📊</strong>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-brand-paper p-3 border border-gray-200 rounded text-center">
                        Dette avec intérêts
                        <span className="block text-2xl font-bold text-red-500">&lt; 33%</span>
                        de la Capitalisation
                    </div>
                    <div className="bg-brand-paper p-3 border border-gray-200 rounded text-center">
                        Cash placé (Trésorerie)
                        <span className="block text-2xl font-bold text-red-500">&lt; 33%</span>
                        de la Capitalisation
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "4. Lire un Bilan Comptable",
    icon: "📑",
    summary: "Apprenez à lire les états financiers pour trouver les pépites solides.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">1. Le Bilan (Photo à l'instant T)</h3>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 border border-brand-gold/20 rounded-lg overflow-hidden">
                <div className="bg-emerald-600 text-white font-bold p-2 text-center">ACTIF (Ce qu'elle a)</div>
                <div className="p-4 bg-emerald-50 h-full text-sm">
                    <ul className="list-disc pl-4 space-y-2">
                        <li>Immobilisations</li>
                        <li>Stocks</li>
                        <li><strong>Trésorerie (Cash)</strong> ⚠️</li>
                    </ul>
                </div>
            </div>
            <div className="flex-1 border border-brand-gold/20 rounded-lg overflow-hidden">
                <div className="bg-red-500 text-white font-bold p-2 text-center">PASSIF (D'où vient l'argent)</div>
                <div className="p-4 bg-red-50 h-full text-sm">
                    <ul className="list-disc pl-4 space-y-2">
                        <li>Capitaux Propres</li>
                        <li><strong>Dettes</strong> ⚠️</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "5. Fiscalité (PEA vs CTO)",
    icon: "🇫🇷",
    summary: "Optimiser ses impôts en France : le match entre les deux enveloppes.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <h3 className="text-xl font-bold text-brand-gold font-display">Le Duel Fiscal Français</h3>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h4 className="text-brand-dark font-bold text-lg mb-2">PEA (Plan Épargne Actions)</h4>
                <ul className="space-y-3 text-sm">
                    <li>✅ <strong>0% d'impôt</strong> après 5 ans (juste 17.2% PS).</li>
                    <li>❌ Limité aux actions <strong>Européennes</strong>.</li>
                    <li>❌ Très peu d'ETF Islamiques éligibles.</li>
                </ul>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h4 className="text-brand-dark font-bold text-lg mb-2">CTO (Compte-Titres)</h4>
                <ul className="space-y-3 text-sm">
                    <li>❌ <strong>30% Flat Tax</strong> sur les gains.</li>
                    <li>✅ Accès au <strong>Monde entier</strong> (USA, Asie...).</li>
                    <li>✅ Accès aux <strong>ETF Islamiques</strong> majeurs (SPUS, HLAL).</li>
                </ul>
            </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "6. Stratégie de Portefeuille",
    icon: "🍰",
    summary: "Stock Picking vs ETF et comment découper son gâteau d'investissement.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <h3 className="text-xl font-bold text-brand-gold font-display">1. Stock Picking vs ETF</h3>
        <div className="bg-amber-50 border border-brand-gold/30 p-6 rounded-xl mt-6">
            <h3 className="text-brand-dark font-bold flex items-center gap-2 mb-2 font-display">🕋 L'ETF Islamique</h3>
            <p>Il suit un indice mondial mais retire automatiquement : 1. Les secteurs haram. 2. Les sociétés endettées. <br/>
            <em>C'est l'outil de la tranquillité pour l'investisseur musulman.</em></p>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "7. Fiqh Al Mu'amalat (Les Fondations)",
    icon: "📜",
    summary: "Riba, Gharar, Maysir : Comprendre les 3 grands interdits.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <div className="bg-brand-paper border-l-4 border-brand-gold p-4 my-4">
          <h4 className="text-brand-dark font-bold mb-1 font-display">La Règle d'Or (Al-Asl)</h4>
          <p className="italic">"L'origine dans les transactions est la permission (Halal), sauf preuve du contraire."</p>
        </div>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">1. Riba (L'Usure / Intérêt)</h3>
        <p>Tout accroissement injustifié dans un échange ou un prêt. C'est l'interdit le plus sévère.</p>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">2. Gharar (L'Incertitude Majeure)</h3>
        <p>Vendre quelque chose que l'on ne possède pas, ou dont l'existence/caractéristiques sont inconnues.</p>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">3. Maysir (La Spéculation / Jeu de hasard)</h3>
        <p>Obtenir un gain basé sur la chance pure et non sur l'effort ou le commerce.</p>
      </div>
    )
  },
  {
    id: 8,
    title: "8. Applications à l'Investissement",
    icon: "⚖️",
    summary: "Comment les savants appliquent les règles du Fiqh à la Bourse moderne.",
    content: (
      <div className="space-y-6 text-gray-700 font-serif">
        <h3 className="text-xl font-bold text-brand-gold font-display">1. La Règle de la Majorité</h3>
        <p>Les savants contemporains (AAOIFI) ont établi que si l'activité principale est licite, une contamination mineure (intérêts perçus/payés) est tolérée si elle reste <strong>minoritaire</strong>.</p>

        <h3 className="text-xl font-bold text-brand-gold mt-6 font-display">2. La Purification (Tathir)</h3>
        <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100 mt-2">
            <div className="text-3xl">🧼</div>
            <div>
                <strong>Le Mécanisme :</strong>
                <p className="text-sm">Vous ne pouvez pas profiter de cette part impure. Vous devez la calculer et la donner en charité sans attendre de récompense divine (Sadaqah).</p>
            </div>
        </div>
      </div>
    )
  }
];

// --- 2. LE GLOSSAIRE (Nouveau) ---
export const glossary = [
    { term: "Riba", def: "L'intérêt ou l'usure. Tout surplus perçu lors d'un prêt d'argent. Strictement interdit." },
    { term: "Gharar", def: "L'incertitude excessive dans un contrat (ex: vendre le poisson dans la mer)." },
    { term: "Maysir", def: "Jeu de hasard ou spéculation pure. Gain basé sur la chance sans effort productif." },
    { term: "Sukuk", def: "Certificats d'investissement islamiques, adossés à des actifs tangibles (pas de la dette)." },
    { term: "Halal", def: "Licite, permis par la Sharia." },
    { term: "Haram", def: "Illicite, interdit par la Sharia." },
    { term: "Nisab", def: "Seuil de richesse minimum (85g d'or) déclenchant la Zakat." },
    { term: "Purification", def: "Donner aux pauvres la part des dividendes issue d'intérêts impurs." },
    { term: "Musharakah", def: "Partenariat où l'on partage profits et pertes (Base de l'actionnariat)." },
    { term: "Takaful", def: "Assurance islamique coopérative." }
];

// --- 3. LE QUIZ (Nouveau) ---
export const quizData = [
    {
        question: "Quel est le seuil maximum de dette toléré par l'AAOIFI ?",
        options: ["0%", "33% de la Capitalisation", "50% des Actifs", "10% du Chiffre d'Affaires"],
        correct: 1
    },
    {
        question: "Pourquoi l'obligation classique est-elle Haram ?",
        options: ["Elle est trop risquée", "C'est un prêt à intérêt (Riba)", "Elle n'est pas cotée", "Elle finance l'armée"],
        correct: 1
    },
    {
        question: "Que signifie 'Gharar' ?",
        options: ["Incertitude excessive", "Intérêt bancaire", "Charité", "Profit"],
        correct: 0
    },
    {
        question: "Si une entreprise a 2% de revenus illicites, que faire ?",
        options: ["Vendre l'action", "Rien", "Purifier ces 2% (Sadaqah)", "Payer la Zakat"],
        correct: 2
    },
    {
        question: "Quelle enveloppe fiscale française permet 0% d'impôt après 5 ans ?",
        options: ["CTO", "PEA", "Livret A", "Assurance Vie"],
        correct: 1
    }
];