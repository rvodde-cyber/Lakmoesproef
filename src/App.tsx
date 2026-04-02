import React, { useState } from 'react';
import { ClipboardCheck, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      {!started ? (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="text-blue-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Professional Moral Litmus Test</h1>
          <p className="text-gray-600 mb-8">
            Welkom bij de lakmoesproef. Deze tool helpt je bij het evalueren van professionele ethiek en besluitvorming.
          </p>
          <button 
            onClick={() => setStarted(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            Start de Test
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
           <div className="flex items-center gap-3 mb-6 border-b pb-4">
             <CheckCircle2 className="text-green-500 w-6 h-6" />
             <h2 className="text-xl font-semibold text-gray-800">Systeem Operationeel</h2>
           </div>
           <p className="text-gray-700">
             De technische lakmoesproef is geslaagd! De applicatie laadt nu correct via Vercel. 
             Je kunt nu beginnen met het toevoegen van je specifieke vragenlijsten in de code.
           </p>
           <button 
            onClick={() => setStarted(false)}
            className="mt-8 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Terug naar start
          </button>
        </div>
      )}
      
      <footer className="mt-8 text-gray-400 text-sm">
        Status: Verbinding met Vercel OK • React OK
      </footer>
    </div>
  );
}
