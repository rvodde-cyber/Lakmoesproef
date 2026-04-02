import React, { useState } from 'react';
import { ClipboardCheck, ChevronRight, AlertCircle, RotateCcw, ShieldCheck, Scale } from 'lucide-react';
import questionsData from './data/questions.json';

export default function App() {
  const [step, setStep] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = questionsData.questions || [];

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const calculateTotal = () => answers.reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 10;
  const percentage = Math.round((calculateTotal() / maxScore) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-white">
        
        {/* PROGRESS BAR (Bovenaan) */}
        {step === 'quiz' && (
          <div className="h-1.5 w-full bg-slate-100">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}

        {/* START SCHERM */}
        {step === 'start' && (
          <div className="p-10 text-center">
            <div className="inline-flex p-4 bg-indigo-50 rounded-3xl mb-6">
              <Scale className="text-indigo-600 w-12 h-12" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Moral Litmus Test
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-md mx-auto">
              Een diepgaande analyse van uw professionele integriteit en ethische besluitvorming.
            </p>
            <button 
              onClick={() => setStep('quiz')}
              className="group w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
            >
              Start de volledige analyse
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* QUIZ SCHERM */}
        {step === 'quiz' && (
          <div className="p-10">
            <header className="flex justify-between items-center mb-10">
              <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase tracking-widest">
                Sectie {Math.floor(currentQuestion / 5) + 1} • Vraag {currentQuestion + 1}
              </span>
            </header>
            
            <h2 className="text-2xl font-bold mb-4 leading-tight text-slate-800">
              {questions[currentQuestion].text}
            </h2>

            {/* TOELICHTING (Verfraaiing) */}
            <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl mb-8 border border-amber-100">
              <AlertCircle className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Context:</strong> Deze vraag test uw vermogen om persoonlijke belangen te scheiden van professionele verantwoordelijkheid in complexe situaties.
              </p>
            </div>
            
            <div className="grid gap-4">
              {questions[currentQuestion].options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-6 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-700 group-hover:text-indigo-700 leading-snug">
                    {option.text}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTAAT SCHERM */}
        {step === 'result' && (
          <div className="p-10 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-green-600 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-2">Analyse Voltooid</h2>
            <p className="text-slate-500 mb-8 font-medium">Uw integriteitsscore:</p>
            
            <div className="relative inline-flex items-center justify-center mb-10">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * percentage) / 100} className="text-indigo-600 transition-all duration-1000" />
              </svg>
              <span className="absolute text-3xl font-black text-indigo-600">{percentage}%</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl mb-10 text-left border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">Interpretatie:</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Op basis van 21 scenario's toont u een {percentage > 80 ? 'zeer sterke' : 'stabiele'} morele kompas. Uw beslissingen neigen naar {percentage > 70 ? 'langetermijn integriteit boven kortetermijnwinst.' : 'een pragmatische aanpak.'}
              </p>
            </div>

            <button 
              onClick={resetTest}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Opnieuw Kalibreren
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
