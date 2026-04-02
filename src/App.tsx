import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';
// We importeren hier jouw eigen vragenbestand
import questionsData from './data/questions.json';

export default function App() {
  const [step, setStep] = useState('start'); // 'start', 'quiz', 'result'
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

  const resetTest = () => {
    setStep('start');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* START SCHERM */}
        {step === 'start' && (
          <div className="p-8 text-center">
            <div className="bg-blue-600 w-20 h-20 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-8 shadow-lg">
              <ClipboardCheck className="text-white w-10 h-10 -rotate-3" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Professional Moral Litmus Test</h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Beantwoord de volgende vragen eerlijk om inzicht te krijgen in de morele en ethische aspecten van jouw professionele keuzes.
            </p>
            <button 
              onClick={() => setStep('quiz')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-blue-200 shadow-xl"
            >
              Start de test
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* QUIZ SCHERM */}
        {step === 'quiz' && questions.length > 0 && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vraag {currentQuestion + 1} van {questions.length}
              </span>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-8 leading-snug">
              {questions[currentQuestion].text}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center justify-between"
                >
                  <span className="font-medium group-hover:text-blue-700">{option.text}</span>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTAAT SCHERM */}
        {step === 'result' && (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Resultaat Voltooid</h2>
            <div className="p-6 bg-slate-50 rounded-2xl mb-8">
              <p className="text-slate-600 italic">
                Je morele profiel wordt gegenereerd op basis van jouw {answers.length} antwoorden.
              </p>
            </div>
            <button 
              onClick={resetTest}
              className="flex items-center gap-2 text-blue-600 font-bold mx-auto hover:underline"
            >
              <RotateCcw className="w-4 h-4" />
              Opnieuw beginnen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
