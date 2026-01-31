import React, { useState, useEffect } from 'react';
import { courses, glossary, quizData } from '../components/AcademyData'; // Assure-toi que le chemin est bon
import { 
  GraduationCap, Hourglass, Globe, Search, FileText, 
  BookOpen, ChevronRight, CheckCircle, XCircle, Trophy,
  BrainCircuit, Library, ArrowRight, Clock, Star
} from 'lucide-react';

export default function AcademyModule() {
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'glossary', 'quiz'

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* HEADER HERO */}
      <div className="relative bg-brand-dark rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl text-center md:text-left">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold blur-[120px] opacity-20 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 blur-[100px] opacity-10 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-widest border border-brand-gold/20">
                    <GraduationCap size={14} />
                    <span>Zone d'apprentissage</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                  Académie <span className="text-brand-gold">Athar</span>
                </h1>
                <p className="text-gray-400 text-lg font-serif italic">
                  "Le savoir précède la parole et l'action." — Imam Al-Bukhari
                </p>
            </div>

            {/* Stats Rapides */}
            <div className="flex gap-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                    <p className="text-2xl font-bold text-white">{courses.length}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Modules</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                    <p className="text-2xl font-bold text-brand-gold">{quizData.length}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Questions</p>
                </div>
            </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
            <TabButton 
                label="Cours Complets" 
                icon={Library} 
                active={activeTab === 'lessons'} 
                onClick={() => setActiveTab('lessons')} 
            />
            <TabButton 
                label="Glossaire Fiqh" 
                icon={BookOpen} 
                active={activeTab === 'glossary'} 
                onClick={() => setActiveTab('glossary')} 
            />
            <TabButton 
                label="Quiz Express" 
                icon={BrainCircuit} 
                active={activeTab === 'quiz'} 
                onClick={() => setActiveTab('quiz')} 
            />
        </div>
      </div>

      {/* --- CONTENU DYNAMIQUE --- */}
      <div className="animate-fade-in">
        {activeTab === 'lessons' && <LessonsView />}
        {activeTab === 'glossary' && <GlossaryView />}
        {activeTab === 'quiz' && <QuizView />}
      </div>

    </div>
  );
}

// --- VUE 1 : LES COURS ---
function LessonsView() {
    const [selectedLesson, setSelectedLesson] = useState(null);

    // Fonction pour assigner les icônes
    const getModuleIcon = (id) => {
        switch(id) {
            case 1: return <Hourglass size={24} />;
            case 2: return <Globe size={24} />;
            case 3: return <Search size={24} />;
            case 4: return <FileText size={24} />;
            default: return <BookOpen size={24} />;
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {courses.map((lesson) => {
                const isOpen = selectedLesson === lesson.id;
                return (
                    <div 
                        key={lesson.id} 
                        onClick={() => setSelectedLesson(isOpen ? null : lesson.id)}
                        className={`group cursor-pointer rounded-3xl border transition-all duration-300 overflow-hidden relative ${isOpen ? 'bg-white border-brand-gold shadow-2xl col-span-2 md:col-span-2 ring-1 ring-brand-gold/50' : 'bg-white border-gray-100 hover:border-brand-gold/30 hover:shadow-lg'}`}
                    >
                        {/* Header de la carte */}
                        <div className="p-6 md:p-8 flex items-start gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isOpen ? 'bg-brand-gold text-white rotate-6 scale-110' : 'bg-gray-50 text-brand-dark group-hover:bg-brand-gold/10 group-hover:text-brand-gold'}`}>
                                {getModuleIcon(lesson.id)}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold px-2 py-1 rounded bg-brand-gold/5 border border-brand-gold/10">
                                        Module {lesson.id}
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <Clock size={12} />
                                        <span>5 min</span>
                                    </div>
                                </div>
                                
                                <h3 className={`font-display font-bold text-xl mb-2 transition-colors ${isOpen ? 'text-brand-dark' : 'text-gray-800 group-hover:text-brand-gold'}`}>
                                    {lesson.title}
                                </h3>
                                
                                {!isOpen && (
                                    <p className="text-sm text-gray-500 font-serif line-clamp-2">
                                        {lesson.summary}
                                    </p>
                                )}

                                {/* Contenu Dépliable (Mode Lecture) */}
                                <div 
                                    className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden cursor-auto" onClick={(e) => e.stopPropagation()}>
                                        <div className="pt-8 border-t border-gray-100 prose prose-stone max-w-none font-serif text-gray-700 leading-relaxed">
                                            <p className="text-lg font-bold text-brand-dark mb-6 italic border-l-4 border-brand-gold pl-4">
                                                "{lesson.summary}"
                                            </p>
                                            {lesson.content}
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSelectedLesson(null); }}
                                                className="px-6 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold hover:bg-brand-dark hover:text-white transition-colors"
                                            >
                                                Fermer la leçon
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Flèche d'indication */}
                            <div className={`transition-transform duration-300 text-gray-300 ${isOpen ? 'rotate-90 text-brand-gold' : 'group-hover:translate-x-1'}`}>
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// --- VUE 2 : GLOSSAIRE (Avec Recherche) ---
function GlossaryView() {
    const [search, setSearch] = useState('');

    const filteredGlossary = glossary.filter(item => 
        item.term.toLowerCase().includes(search.toLowerCase()) || 
        item.def.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Barre de Recherche */}
            <div className="relative max-w-xl mx-auto mb-8">
                <input 
                    type="text" 
                    placeholder="Rechercher un terme (ex: Riba, Sukuk...)" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-brand-gold focus:outline-none shadow-sm text-lg font-medium transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Grille des définitions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGlossary.length > 0 ? (
                    filteredGlossary.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-brand-gold/50 hover:shadow-lg transition-all group h-full flex flex-col">
                            <h4 className="font-display font-bold text-xl text-brand-dark mb-3 group-hover:text-brand-gold transition-colors flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                                {item.term}
                            </h4>
                            <p className="text-sm text-gray-600 font-serif leading-relaxed flex-1">
                                {item.def}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Aucun terme trouvé pour "{search}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- VUE 3 : QUIZ (Gamifié) ---
function QuizView() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null); // null, true, false

    const handleAnswer = (index) => {
        if (selectedOption !== null) return; // Empêche le double clic

        setSelectedOption(index);
        const correct = index === quizData[currentQuestion].correct;
        setIsCorrect(correct);

        if (correct) setScore(score + 1);

        // Délai pour montrer le résultat avant de passer à la suite
        setTimeout(() => {
            const nextQ = currentQuestion + 1;
            if (nextQ < quizData.length) {
                setCurrentQuestion(nextQ);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setShowScore(true);
            }
        }, 1200);
    };

    const resetQuiz = () => {
        setScore(0);
        setCurrentQuestion(0);
        setShowScore(false);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    // Calcul du pourcentage de progression
    const progress = ((currentQuestion) / quizData.length) * 100;

    return (
        <div className="max-w-2xl mx-auto">
            {!showScore ? (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px]">
                    {/* Barre de Progression */}
                    <div className="h-1.5 w-full bg-gray-100">
                        <div 
                            className="h-full bg-brand-gold transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="p-8 md:p-10">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                Question {currentQuestion + 1} / {quizData.length}
                            </span>
                            <div className="flex gap-1">
                                {[...Array(3)].map((_,i) => (
                                    <Star key={i} size={16} className={i < Math.floor(score / 2) ? "text-brand-gold fill-brand-gold" : "text-gray-200"} />
                                ))}
                            </div>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-10 font-display leading-tight">
                            {quizData[currentQuestion].question}
                        </h3>

                        <div className="space-y-4">
                            {quizData[currentQuestion].options.map((option, idx) => {
                                // Logique de couleur des boutons
                                let btnClass = "border-gray-200 hover:border-brand-gold hover:bg-gray-50";
                                let icon = <ChevronRight size={20} className="text-gray-300" />;

                                if (selectedOption !== null) {
                                    if (idx === quizData[currentQuestion].correct) {
                                        btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500";
                                        icon = <CheckCircle size={20} className="text-emerald-500" />;
                                    } else if (idx === selectedOption) {
                                        btnClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                                        icon = <XCircle size={20} className="text-red-500" />;
                                    } else {
                                        btnClass = "border-gray-100 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={selectedOption !== null}
                                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-bold flex items-center justify-between group ${btnClass}`}
                                    >
                                        <span className="text-base">{option}</span>
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center bg-white rounded-3xl p-12 shadow-xl animate-fade-in border border-gray-100">
                    <div className="inline-flex justify-center items-center w-24 h-24 bg-brand-gold/10 rounded-full text-brand-gold mb-6 animate-bounce">
                        <Trophy size={48} />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-brand-dark mb-2">Quiz Terminé !</h3>
                    <p className="text-gray-500 mb-8 font-serif italic">
                        "La recherche du savoir est une obligation pour tout musulman."
                    </p>
                    
                    <div className="text-6xl font-black text-brand-dark mb-2">
                        {score} <span className="text-2xl text-gray-400 font-medium">/ {quizData.length}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full max-w-xs mx-auto mb-10 overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${(score / quizData.length) * 100}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <button onClick={resetQuiz} className="px-8 py-4 bg-brand-dark text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95">
                            Rejouer le Quiz
                        </button>
                        <button onClick={() => setActiveTab('lessons')} className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-2xl hover:border-brand-gold hover:text-brand-gold transition-colors">
                            Retour aux Cours
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- COMPOSANT BOUTON TAB ---
function TabButton({ label, icon: Icon, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${
                active 
                ? 'bg-brand-gold text-white border-brand-gold shadow-lg transform scale-105' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-brand-gold hover:text-brand-gold'
            }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}