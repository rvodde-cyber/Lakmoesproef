import React, { useState } from 'react';
import { Beaker, ChevronRight, RotateCcw, AlertCircle, Info } from 'lucide-react';
import questionsData from './data/questions.json';

export default function App() {
  const [step, setStep] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = questionsData.questions || [];

  const handleAnswer = (score: number) => {
    setAnswers([...answers, score]);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const calculateScore = () => {
    const total = answers.reduce((a, b) => a + b, 0);
    return Math.round((total / (questions.length * 10)) * 100);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* LAKMOES INDICATOR LINE */}
        <div className="h-2 w-full flex">
          <div className="h-full bg-red-500 w-1/3 opacity-20"></div>
          <div className="h-full bg-purple-500 w-1/3 opacity-20"></div>
          <div className="h-full bg-blue-500 w-1/3 opacity-20"></div>
        </div>

        {step === 'start' && (
          <div className="p-10 text-center">
            {/* DE LAKMOES AFBEELDING/ICON */}
            <div className="mb-8 relative inline-block">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-slate-100">
                <Beaker className="text-indigo-600 w-12 h-12" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">pH</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-3 uppercase tracking-tight text-slate-900">
              Professional Moral Litmus Test
            </h1>
            <p className="text-slate-500 mb-8 leading-relaxed italic">
              "Ethische integriteit is niet wat je doet als iedereen kijkt, maar wat je doet als niemand kijkt."
            </p>
            
            <div className="bg-slate-50 p-6 rounded-lg mb-8 text-left border-l-4 border-indigo-600">
              <p className="text-sm text-slate-600 leading-relaxed">
                Deze test fungeert als een <strong>lakmoesproef</strong> voor uw professionele handelen. Uw keuzes bepalen de kleur van uw resultaat: van reactief naar proactief integer.
              </p>
            </div>

            <button 
              onClick={() => setStep('quiz')}
              className="w-full bg-slate-900 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              START ANALYSE
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 'quiz' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Vraag {currentQuestion + 1} / {questions.length}</span>
              <div className="h-1 w-24 bg-slate-100 rounded-full">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-6 text-slate-800 leading-snug">
              {questions[currentQuestion].text}
            </h2>

            {/* TOELICHTING/CONTEXT */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
              <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-blue-800 leading-tight">
                <em>Toelichting:</em> Deze casus analyseert de balans tussen collegialiteit en de onafhankelijke integriteit van uw professie.
              </p>
            </div>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-4 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-indigo-400 transition-all flex items-center justify-between group"
                >
                  <span className="text-[15px] font-medium text-slate-700">{option.text}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="p-10 text-center">
             <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${calculateScore() > 70 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                <Beaker className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black mb-2">Testuitslag</h2>
             <div className="text-5xl font-black mb-6" style={{ color: calculateScore() > 70 ? '#2563eb' : '#dc2626' }}>
               {calculateScore()}%
             </div>
             <p className="text-slate-600 mb-8 px-4">
               Uw professionele lakmoespapiertje kleurt <strong>{calculateScore() > 70 ? 'Blauw (Basisch)' : 'Rood (Zuur)'}</strong>. Dit wijst op een {calculateScore() > 70 ? 'sterke' : 'kritieke'} mate van ethische weerbaarheid.
             </p>
             <button onClick={() => setStep('start')} className="flex items-center gap-2 mx-auto text-slate-400 font-bold hover:text-slate-900 transition-colors">
               <RotateCcw className="w-4 h-4" /> OPNIEUW TESTEN
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
      </div>
    </div>
  </div>
</div>
