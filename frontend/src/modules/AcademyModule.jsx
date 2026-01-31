import React, { useState } from 'react';
import { courses, glossary, quizData } from './AcademyData';
// Ajout des icônes Lucide pour un rendu professionnel
import { 
  GraduationCap, Hourglass, Globe, Search, FileText, 
  BookOpen, ChevronRight, ArrowRight 
} from 'lucide-react';

export default function AcademyModule() {
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'glossary', 'quiz'
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  // États Quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // --- FONCTION POUR ASSIGNER LES ICÔNES PROS ---
  // Cela remplace les émojis de ton fichier de données
  const getModuleIcon = (id) => {
      switch(id) {
          case 1: return <Hourglass size={24} />;      // Valeur temps
          case 2: return <Globe size={24} />;          // Macroéconomie
          case 3: return <Search size={24} />;         // Screening
          case 4: return <FileText size={24} />;       // Bilan Comptable
          default: return <BookOpen size={24} />;
      }
  };

  // Gestion Quiz
  const handleAnswer = (index) => {
    if (index === quizData[currentQuestion].correct) {
        setScore(score + 1);
    }
    const nextQ = currentQuestion + 1;
    if (nextQ < quizData.length) {
        setCurrentQuestion(nextQ);
    } else {
        setShowScore(true);
    }
  };

  const resetQuiz = () => {
      setScore(0);
      setCurrentQuestion(0);
      setShowScore(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-2 text-brand-gold">
           {/* Remplacement de l'emoji par une icône pro */}
           <GraduationCap size={32} />
        </div>
        <h1 className="font-display text-4xl font-bold text-brand-dark">Académie Athar</h1>
        <p className="font-serif italic text-gray-500">
          "Le savoir précède la parole et l'action." — Imam Al-Bukhari
        </p>

        {/* NAVIGATION TABS */}
        <div className="flex justify-center gap-4 mt-6">
            <TabButton label="Cours Complets" active={activeTab === 'lessons'} onClick={() => setActiveTab('lessons')} />
            <TabButton label="Glossaire Fiqh" active={activeTab === 'glossary'} onClick={() => setActiveTab('glossary')} />
            <TabButton label="Quiz Express" active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
        </div>
      </div>

      {/* --- ONGLET 1 : LEÇONS (Design Dépliable) --- */}
      {activeTab === 'lessons' && (
          <div className="grid md:grid-cols-2 gap-6">
              {courses.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    onClick={() => setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)}
                    className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${selectedLesson === lesson.id ? 'border-brand-gold bg-brand-paper shadow-lg ring-1 ring-brand-gold col-span-2 md:col-span-2' : 'border-gray-200 bg-white hover:border-brand-gold/50'}`}
                  >
                      <div className="p-6 flex items-start gap-4">
                          {/* Icône dynamique basée sur l'ID */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 ${selectedLesson === lesson.id ? 'bg-brand-gold text-white' : 'bg-gray-900 text-brand-gold group-hover:scale-110'}`}>
                              {getModuleIcon(lesson.id)}
                          </div>
                          
                          <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold px-2 py-1 rounded bg-brand-gold/10">
                                      Module {lesson.id}
                                  </span>
                              </div>
                              <h3 className="font-display font-bold text-lg text-brand-dark mb-2">{lesson.title}</h3>
                              <p className="text-sm text-gray-500 font-serif italic mb-4">{lesson.summary}</p>
                              
                              {/* Contenu Dépliable */}
                              <div 
                                className={`text-sm text-gray-800 leading-relaxed font-sans overflow-hidden transition-all duration-500 ease-in-out ${selectedLesson === lesson.id ? 'max-h-[3000px] opacity-100 mt-6 border-t border-brand-gold/20 pt-6' : 'max-h-0 opacity-0'}`}
                              >
                                  {/* On empêche la propagation du clic sur le contenu pour éviter de fermer en lisant */}
                                  <div onClick={(e) => e.stopPropagation()}>
                                    {lesson.content}
                                  </div>
                              </div>
                              
                              {selectedLesson !== lesson.id && (
                                  <p className="text-xs text-brand-gold font-bold mt-2 uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Lire le cours <ArrowRight size={12} />
                                  </p>
                              )}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* --- ONGLET 2 : GLOSSAIRE --- */}
      {activeTab === 'glossary' && (
          <div className="glass rounded-3xl p-8">
              <h3 className="font-display font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-gold rounded-full"></span>
                  Dictionnaire de la Finance Islamique
              </h3>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                  {glossary.map((item, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-gray-100 hover:border-brand-gold transition-colors group">
                          <h4 className="font-bold text-lg text-brand-dark mb-1 group-hover:text-brand-gold transition-colors">{item.term}</h4>
                          <p className="text-sm text-gray-600 font-serif leading-relaxed italic">"{item.def}"</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- ONGLET 3 : QUIZ --- */}
      {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto">
              {!showScore ? (
                  <div className="glass rounded-3xl p-8 border-t-4 border-brand-gold relative overflow-hidden">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                          <span>Question {currentQuestion + 1}/{quizData.length}</span>
                          <span>Score: {score}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-brand-dark mb-8 text-center font-serif leading-relaxed">
                          {quizData[currentQuestion].question}
                      </h3>

                      <div className="space-y-3">
                          {quizData[currentQuestion].options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-brand-gold hover:bg-brand-gold/5 transition-all font-medium text-gray-700 flex items-center justify-between group"
                              >
                                  <span>{option}</span>
                                  <span className="opacity-0 group-hover:opacity-100 text-brand-gold">
                                      <ChevronRight size={16} />
                                  </span>
                              </button>
                          ))}
                      </div>
                  </div>
              ) : (
                  <div className="text-center glass rounded-3xl p-10 animate-fade-in">
                      <div className="inline-flex justify-center items-center w-20 h-20 bg-brand-gold/10 rounded-full text-brand-gold mb-4">
                          <GraduationCap size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-brand-dark mb-2">Quiz Terminé !</h3>
                      <p className="text-gray-500 mb-6">Votre score final</p>
                      <div className="text-5xl font-black text-brand-gold mb-8">{score} / {quizData.length}</div>
                      
                      <div className="flex justify-center gap-4">
                        <button onClick={resetQuiz} className="px-6 py-3 bg-brand-gold text-white font-bold rounded-xl shadow-lg hover:bg-yellow-600 transition-colors">
                            Recommencer
                        </button>
                        <button onClick={() => setActiveTab('lessons')} className="px-6 py-3 border-2 border-gray-200 text-gray-500 font-bold rounded-xl hover:border-brand-gold hover:text-brand-gold transition-colors">
                            Relire les cours
                        </button>
                      </div>
                  </div>
              )}
          </div>
      )}

    </div>
  );
}

// Composant Bouton Tab
function TabButton({ label, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                active 
                ? 'bg-brand-dark text-white shadow-xl scale-105' 
                : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-brand-gold border border-gray-100'
            }`}
        >
            {label}
        </button>
    );
}