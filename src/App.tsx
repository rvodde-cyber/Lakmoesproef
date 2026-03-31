import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Shield, Target, Heart, Users, TrendingUp, Sparkles, Brain, DollarSign, UserCheck, CheckCircle2, ChevronRight, Database, ArrowLeft } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { saveResult } from './lib/supabase';
import { AdminPanel } from './components/AdminPanel';

interface Filter {
  id: string;
  name: string;
  icon: any;
  questions?: string[];
  description?: string;
  color: string;
}

interface Response {
  filterId: string;
  scores: number[];
}

interface ActionPlanAnswer {
  question: string;
  answer: string;
}

const filters: Filter[] = [
  { id: 'wet1', name: 'De Wet (1)', icon: Scale, description: 'Ons handelen is conform wet- en regelgeving', color: '#ef4444' },
  { id: 'wet2', name: 'De Wet (2)', icon: Scale, description: 'We houden ons aan alle juridische verplichtingen', color: '#f87171' },
  { id: 'beroepscode', name: 'De Beroepscode', icon: Shield, description: 'Ons handelen voldoet aan de eisen van onze beroepscode', color: '#f59e0b' },
  { id: 'visie', name: 'Visie', icon: Target, description: 'Onze organisatie heeft een duidelijke visie en leeft deze na', color: '#eab308' },
  { id: 'samenleving', name: 'De Samenleving', icon: Sparkles, description: 'De organisatie handelt integer naar de samenleving', color: '#84cc16' },
  { id: 'standaard', name: 'Standaard', icon: CheckCircle2, description: 'We hanteren hoge ethische standaarden', color: '#22c55e' },
  { id: 'integriteit', name: 'Integriteit', icon: Heart, description: 'Integriteit staat centraal in ons handelen', color: '#10b981' },
  { id: 'langetermijn', name: 'Lange Termijn', icon: TrendingUp, description: 'We denken en handelen op de lange termijn', color: '#14b8a6' },
  { id: 'economie', name: 'Economie', icon: DollarSign, description: 'We balanceren economische belangen met ethische waarden', color: '#06b6d4' },
  { id: 'naasten', name: 'Naasten', icon: Users, description: 'We behandelen anderen met respect en waardigheid', color: '#0ea5e9' },
  {
    id: 'diversiteit',
    name: 'Diversiteit & Inclusie',
    icon: UserCheck,
    questions: [
      'We creëren een inclusieve omgeving',
      'We hebben concreet diversiteitsbeleid',
      'Dit is herkenbaar in de hogere lagen en de top'
    ],
    color: '#3b82f6'
  },
  {
    id: 'leidinggevende',
    name: 'De Leidinggevende',
    icon: Brain,
    questions: [
      'De leidinggevende geeft het goede morele voorbeeld (voorbeeldrol)',
      'De leidinggevende spreekt medewerkers aan op gedrag',
      'Er is ruimte voor tegenspraak richting de top'
    ],
    color: '#6366f1'
  },
  {
    id: 'kritisch',
    name: 'Kritische geluiden',
    icon: Sparkles,
    questions: [
      'We gaan constructief om met kritiek',
      'We hebben een veilige klokkenluidersprocedure',
      'Lastige collega\'s worden gewaardeerd, niet geïsoleerd'
    ],
    color: '#8b5cf6'
  }
];

const getActionPlanQuestions = (lowestFilters: Array<{filter: Filter, avgScore: number}>) => {
  const filter1 = lowestFilters[0]?.filter.name || 'deze filters';
  const filter2 = lowestFilters[1]?.filter.name || 'deze filters';

  return [
    `Je scoort het laagst op '${filter1}' en '${filter2}'. Wat is volgens jou de belangrijkste reden voor deze lage scores?`,
    "Wat zou je hier in de ideale situatie aan moeten doen?",
    "Wat houdt je tegen om die ideale situatie te bereiken?",
    "Welke stappen, hoe klein ook, kun je vanaf morgen zetten?"
  ];
};

const sectors = [
  'Gezondheidszorg',
  'Onderwijs',
  'Overheid',
  'Financiële dienstverlening',
  'Technologie',
  'Productie/Industrie',
  'Retail',
  'Transport & Logistiek',
  'Bouw',
  'Horeca',
  'Non-profit',
  'Anders'
];

const organizationSizes = [
  '1-10 medewerkers',
  '11-50 medewerkers',
  '51-250 medewerkers',
  '251-1000 medewerkers',
  '1000+ medewerkers'
];

export default function App() {
  const [step, setStep] = useState<number>(-2);
  const [sector, setSector] = useState('');
  const [organizationSize, setOrganizationSize] = useState('');
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [currentSubQuestionIndex, setCurrentSubQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [actionPlanAnswers, setActionPlanAnswers] = useState<ActionPlanAnswer[]>([]);
  const [currentActionAnswer, setCurrentActionAnswer] = useState('');
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [savedToDatabase, setSavedToDatabase] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAdminMode = new URLSearchParams(window.location.search).get('view') === 'admin';

  const handleScoreSelect = (score: number) => {
    const currentFilter = filters[currentFilterIndex];
    const existingResponse = responses.find(r => r.filterId === currentFilter.id);

    let newResponses: Response[];
    if (existingResponse) {
      newResponses = responses.map(r =>
        r.filterId === currentFilter.id
          ? { ...r, scores: [...r.scores, score] }
          : r
      );
    } else {
      newResponses = [...responses, { filterId: currentFilter.id, scores: [score] }];
    }
    setResponses(newResponses);

    if (currentFilter.questions && currentSubQuestionIndex < currentFilter.questions.length - 1) {
      setCurrentSubQuestionIndex(currentSubQuestionIndex + 1);
    } else {
      if (currentFilterIndex < filters.length - 1) {
        setCurrentFilterIndex(currentFilterIndex + 1);
        setCurrentSubQuestionIndex(0);
      } else {
        setStep(1);
      }
    }
  };

  const handlePrevious = () => {
    const currentFilter = filters[currentFilterIndex];
    const existingResponse = responses.find(r => r.filterId === currentFilter.id);

    if (existingResponse && existingResponse.scores.length > 0) {
      const newResponses = responses.map(r =>
        r.filterId === currentFilter.id
          ? { ...r, scores: r.scores.slice(0, -1) }
          : r
      );
      setResponses(newResponses);
    }

    if (currentSubQuestionIndex > 0) {
      setCurrentSubQuestionIndex(currentSubQuestionIndex - 1);
    } else if (currentFilterIndex > 0) {
      const previousFilter = filters[currentFilterIndex - 1];
      setCurrentFilterIndex(currentFilterIndex - 1);
      const previousQuestionCount = previousFilter.questions?.length || 1;
      setCurrentSubQuestionIndex(previousQuestionCount - 1);
    }
  };

  const canGoPrevious = currentFilterIndex > 0 || currentSubQuestionIndex > 0;

  const handleActionPlanSubmit = () => {
    const lowestFilters = getLowestScoringFilters();
    const actionPlanQuestions = getActionPlanQuestions(lowestFilters);

    if (currentActionAnswer.trim()) {
      const newAnswers = [...actionPlanAnswers, {
        question: actionPlanQuestions[currentActionIndex],
        answer: currentActionAnswer
      }];
      setActionPlanAnswers(newAnswers);
      setCurrentActionAnswer('');

      if (currentActionIndex < actionPlanQuestions.length - 1) {
        setCurrentActionIndex(currentActionIndex + 1);
      } else {
        setShowActionPlan(false);
      }
    }
  };

  const getChartData = () => {
    return filters.map(filter => {
      const response = responses.find(r => r.filterId === filter.id);
      const avgScore = response
        ? response.scores.reduce((a, b) => a + b, 0) / response.scores.length
        : 0;
      return {
        filter: filter.name,
        score: avgScore,
        fullMark: 10
      };
    });
  };

  const getOverallScore = () => {
    const allScores = responses.flatMap(r => r.scores);
    const total = allScores.reduce((sum, score) => sum + score, 0);
    return (total / (allScores.length * 10) * 100).toFixed(0);
  };

  const getRecommendation = () => {
    const score = parseInt(getOverallScore());
    if (score >= 80) return { text: 'Basisch', color: 'text-green-500', desc: 'De organisatie toont sterke ethische integriteit en handelt in lijn met morele principes.' };
    if (score >= 60) return { text: 'Neutraal', color: 'text-blue-400', desc: 'De organisatie heeft een solide ethische basis met enkele verbeterpunten.' };
    if (score >= 40) return { text: 'Licht Zuur', color: 'text-yellow-500', desc: 'Er zijn ethische aandachtspunten die verdere verdieping en verbetering vereisen.' };
    return { text: 'Zuur', color: 'text-red-500', desc: 'Er zijn significante ethische zorgen die directe aandacht en actie vereisen.' };
  };

  const getLowestScoringFilters = () => {
    const filterScores = filters.map(filter => {
      const response = responses.find(r => r.filterId === filter.id);
      const avgScore = response
        ? response.scores.reduce((a, b) => a + b, 0) / response.scores.length
        : 0;
      return {
        filter,
        avgScore
      };
    });

    return filterScores
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 2);
  };

  const getTotalQuestions = () => {
    return filters.reduce((sum, filter) => {
      return sum + (filter.questions ? filter.questions.length : 1);
    }, 0);
  };

  const getCurrentQuestionNumber = () => {
    let count = 0;
    for (let i = 0; i < currentFilterIndex; i++) {
      count += filters[i].questions ? filters[i].questions!.length : 1;
    }
    return count + currentSubQuestionIndex + 1;
  };

  useEffect(() => {
    if (step === 1 && responses.length > 0 && !savedToDatabase) {
      const saveData = async () => {
        try {
          const filterScores = filters.map(filter => {
            const response = responses.find(r => r.filterId === filter.id);
            const avgScore = response
              ? response.scores.reduce((a, b) => a + b, 0) / response.scores.length
              : 0;
            return {
              filter_id: filter.id,
              filter_name: filter.name,
              avg_score: parseFloat(avgScore.toFixed(2))
            };
          });

          await saveResult({
            sector,
            organization_size: organizationSize,
            filter_scores: filterScores,
            overall_score: parseFloat(getOverallScore())
          });

          setSavedToDatabase(true);
        } catch (error) {
          console.error('Error saving result:', error);
        }
      };

      saveData();
    }
  }, [step, responses, savedToDatabase]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <AnimatePresence mode="wait">
          {step === -2 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12"
            >
              <div className="space-y-8">
                <div className="flex justify-center items-center">
                  <img
                    src="/Gemini_Generated_Image_r3q3k0r3q3k0r3q3.png"
                    alt="Lakmoesproef testbuisje"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-slate-900">
                    De Morele Lakmoesproef
                  </h1>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Scan uw organisatie en leg de basis voor een verbeterplan.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 my-16">
                <div className="space-y-3">
                  <Scale className="w-12 h-12 text-purple-600 mx-auto" />
                  <h3 className="font-semibold text-lg text-slate-900">12 Filters</h3>
                  <p className="text-sm text-slate-600">Volledige analyse vanuit meerdere perspectieven</p>
                </div>
                <div className="space-y-3">
                  <Brain className="w-12 h-12 text-purple-600 mx-auto" />
                  <h3 className="font-semibold text-lg text-slate-900">Actieplan</h3>
                  <p className="text-sm text-slate-600">Van inzicht naar concrete verbeterstappen</p>
                </div>
                <div className="space-y-3">
                  <TrendingUp className="w-12 h-12 text-purple-600 mx-auto" />
                  <h3 className="font-semibold text-lg text-slate-900">Visueel Inzicht</h3>
                  <p className="text-sm text-slate-600">Heldere visualisatie van uw ethische landschap</p>
                </div>
              </div>

              <button
                onClick={() => setStep(-1)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-4 rounded-full transition-all transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg"
              >
                Start Inschatting <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === -1 && (
            <motion.div
              key="intake"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-slate-900">Algemene Informatie</h1>
                <p className="text-slate-600">Geef wat context over uw organisatie</p>
              </div>

              <div className="bg-white rounded-2xl p-8 space-y-6 border border-slate-200 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      In welke sector is uw organisatie actief?
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecteer een sector</option>
                      {sectors.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Wat is de grootte van uw organisatie?
                    </label>
                    <select
                      value={organizationSize}
                      onChange={(e) => setOrganizationSize(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecteer een grootte</option>
                      {organizationSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep(0)}
                  disabled={!sector || !organizationSize}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Naar de Filters <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 0 && (
            <motion.div
              key="filters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Vraag {getCurrentQuestionNumber()} van {getTotalQuestions()}</span>
                  <span className="text-sm text-slate-600">{Math.round((getCurrentQuestionNumber() / getTotalQuestions()) * 100)}% Voltooid</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-700"
                    initial={{ width: 0 }}
                    animate={{ width: `${(getCurrentQuestionNumber() / getTotalQuestions()) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 space-y-6 border border-slate-200 shadow-sm">
                {(() => {
                  const currentFilter = filters[currentFilterIndex];
                  const Icon = currentFilter.icon;
                  const questionText = currentFilter.questions
                    ? currentFilter.questions[currentSubQuestionIndex]
                    : currentFilter.description;

                  return (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <Icon className="w-8 h-8" style={{ color: currentFilter.color }} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">{currentFilter.name}</h2>
                          {currentFilter.questions && (
                            <p className="text-sm text-slate-500">Vraag {currentSubQuestionIndex + 1} van {currentFilter.questions.length}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-6">
                        <p className="text-lg text-slate-800 mb-6">{questionText}</p>

                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-slate-700">
                            Beoordeel van 1 (Helemaal mee oneens) tot 10 (Helemaal mee eens)
                          </label>
                          <div className="grid grid-cols-10 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                              <button
                                key={score}
                                onClick={() => handleScoreSelect(score)}
                                className="aspect-square bg-white hover:bg-purple-100 border-2 border-slate-300 hover:border-purple-500 text-slate-900 rounded-lg font-semibold transition-all transform hover:scale-110 shadow-sm"
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {canGoPrevious && (
                        <button
                          onClick={handlePrevious}
                          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Vorige Vraag
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {step === 1 && !showActionPlan && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                <h1 className="text-4xl font-bold text-slate-900">Uw Ethische Analyse</h1>
                <p className="text-slate-600">Een volledig overzicht van de morele evaluatie van uw organisatie</p>
              </div>

              <div className="bg-white rounded-2xl p-8 space-y-8 border border-slate-200 shadow-sm">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold text-purple-600">
                    {getOverallScore()}%
                  </div>
                  <div className={`text-2xl font-semibold ${getRecommendation().color}`}>
                    {getRecommendation().text}
                  </div>
                  <p className="text-slate-600">{getRecommendation().desc}</p>
                  {(sector || organizationSize) && (
                    <div className="pt-4 mt-4 border-t border-slate-200">
                      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                        {sector && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Sector:</span>
                            <span>{sector}</span>
                          </div>
                        )}
                        {organizationSize && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Grootte:</span>
                            <span>{organizationSize}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-[500px] w-full bg-slate-50 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getChartData()}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="filter" tick={{ fill: '#475569', fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#475569' }} />
                      <Radar name="Uw Scores" dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {actionPlanAnswers.length === 0 && (
                  <div className="space-y-4 bg-slate-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-slate-900">Aanzet tot Verbeterplan</h3>

                    <div className="bg-white rounded-lg p-4 mb-4 border-2 border-purple-200">
                      <h4 className="text-lg font-semibold text-purple-900 mb-3">Uw Zwakste Filters</h4>
                      <div className="space-y-2">
                        {(() => {
                          const lowestFilters = getLowestScoringFilters();
                          return lowestFilters.map((item) => {
                            const Icon = item.filter.icon;
                            return (
                              <div key={item.filter.id} className="flex items-center gap-3 bg-purple-50 rounded-lg p-3">
                                <Icon className="w-5 h-5" style={{ color: item.filter.color }} />
                                <div className="flex-1">
                                  <span className="font-medium text-slate-900">{item.filter.name}</span>
                                </div>
                                <span className="font-bold text-purple-700">{item.avgScore.toFixed(1)}/10</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(() => {
                        const lowestFilters = getLowestScoringFilters();
                        const actionPlanQuestions = getActionPlanQuestions(lowestFilters);
                        return actionPlanQuestions.map((question, index) => (
                          <div key={index} className="flex items-start gap-3 text-slate-700">
                            <span className="font-semibold text-purple-600">{index + 1}.</span>
                            <p>{question}</p>
                          </div>
                        ));
                      })()}
                    </div>
                    <button
                      onClick={() => setShowActionPlan(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      Start Actieplan <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {actionPlanAnswers.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900">Uw Actieplan</h3>
                    <div className="space-y-3">
                      {actionPlanAnswers.map((item, index) => (
                        <div key={index} className="bg-slate-50 rounded-lg p-4 space-y-2">
                          <p className="font-medium text-sm text-purple-700">{item.question}</p>
                          <p className="text-slate-700">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900">Gedetailleerde Scores</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {filters.map(filter => {
                      const response = responses.find(r => r.filterId === filter.id);
                      const avgScore = response
                        ? (response.scores.reduce((a, b) => a + b, 0) / response.scores.length).toFixed(1)
                        : '0';
                      const Icon = filter.icon;
                      return (
                        <div key={filter.id} className="bg-slate-50 rounded-lg p-4 flex items-center gap-3">
                          <Icon className="w-6 h-6" style={{ color: filter.color }} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm text-slate-900">{filter.name}</span>
                              <span className="font-bold text-slate-900">{avgScore}/10</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all"
                                style={{
                                  width: `${(parseFloat(avgScore) / 10) * 100}%`,
                                  backgroundColor: filter.color
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setStep(-2);
                      setSector('');
                      setOrganizationSize('');
                      setCurrentFilterIndex(0);
                      setCurrentSubQuestionIndex(0);
                      setResponses([]);
                      setActionPlanAnswers([]);
                      setCurrentActionAnswer('');
                      setCurrentActionIndex(0);
                      setShowActionPlan(false);
                      setSavedToDatabase(false);
                    }}
                    className={`${isAdminMode ? 'flex-1' : 'w-full'} bg-slate-700 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-all`}
                  >
                    Nieuwe Inschatting Starten
                  </button>

                  {isAdminMode && (
                    <button
                      onClick={() => setShowAdminPanel(!showAdminPanel)}
                      className="px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition-all flex items-center gap-2"
                    >
                      <Database className="w-5 h-5" />
                      Admin
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && showActionPlan && (() => {
            const lowestFilters = getLowestScoringFilters();
            const actionPlanQuestions = getActionPlanQuestions(lowestFilters);

            return (
              <motion.div
                key="action-plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Vraag {currentActionIndex + 1} van {actionPlanQuestions.length}</span>
                    <span className="text-sm text-slate-600">{Math.round(((currentActionIndex + 1) / actionPlanQuestions.length) * 100)}% Voltooid</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-700"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentActionIndex + 1) / actionPlanQuestions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 space-y-6 border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Brain className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="space-y-4 flex-1">
                      <h2 className="text-2xl font-bold text-slate-900">{actionPlanQuestions[currentActionIndex]}</h2>
                      <textarea
                        value={currentActionAnswer}
                        onChange={(e) => setCurrentActionAnswer(e.target.value)}
                        placeholder="Neem de tijd om hier dieper over na te denken..."
                        className="w-full h-32 bg-slate-50 border-2 border-slate-300 rounded-lg p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                      <button
                        onClick={handleActionPlanSubmit}
                        disabled={!currentActionAnswer.trim()}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                      >
                        {currentActionIndex < actionPlanQuestions.length - 1 ? 'Volgende Vraag' : 'Bekijk Resultaten'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {isAdminMode && showAdminPanel && (
          <div className="mt-12">
            <AdminPanel />
          </div>
        )}
      </div>
    </div>
  );
}
