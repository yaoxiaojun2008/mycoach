import React from 'react';
import { ViewState, GeneratedLesson } from '../types';

interface QuizAnalysisProps {
  onNavigate: (view: ViewState) => void;
}

export const QuizAnalysis: React.FC<QuizAnalysisProps> = ({ onNavigate }) => {
  // Load data from local storage
  const [lesson, setLesson] = React.useState<GeneratedLesson | null>(null);
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    const cachedLesson = localStorage.getItem('last_generated_lesson');
    const cachedAnswers = localStorage.getItem('last_quiz_answers');

    if (cachedLesson) {
      setLesson(JSON.parse(cachedLesson));
    }
    if (cachedAnswers) {
      setUserAnswers(JSON.parse(cachedAnswers));
    }
  }, []);

  if (!lesson) return <div className="p-8 text-center">No quiz data found.</div>;

  // Calculate stats
  let correctCount = 0;
  lesson.questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctId) {
      correctCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / lesson.questions.length) * 100);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scorePercentage / 100) * circumference;

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
          <div className="flex items-center gap-3" onClick={() => onNavigate('home')}>
            <span className="material-symbols-outlined cursor-pointer">close</span>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Quiz Analysis</h2>
          </div>
          <div className="flex items-center">
            <button className="flex items-center justify-center p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-40">
        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Score Card */}
          <section className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">
                {scorePercentage === 100 ? 'Perfect!' : scorePercentage >= 60 ? 'Great effort!' : 'Keep practicing!'}
              </h3>
              <p className="text-slate-400 text-sm">
                {scorePercentage === 100 ? "You've mastered this article." : "Review the answers below to improve."}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">{correctCount}/{lesson.questions.length}</span>
                <span className="text-slate-500 font-medium">Correct</span>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              {/* SVG Circle for dynamic progress */}
              <div className="w-20 h-20 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-200 dark:text-slate-700"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{scorePercentage}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Questions Analysis */}
          <section className="space-y-8">
            {lesson.questions.map((q, idx) => {
              const userAnswerId = userAnswers[idx];
              const isCorrect = userAnswerId === q.correctId;
              const userOption = q.options.find(o => o.id === userAnswerId);
              const correctOption = q.options.find(o => o.id === q.correctId);

              return (
                <div key={q.id} className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-white ${isCorrect ? 'bg-success' : 'bg-error'}`}>
                        <span className="material-symbols-outlined text-xs">{isCorrect ? 'check' : 'close'}</span>
                      </span>
                      <h4 className="text-sm font-semibold">{q.text}</h4>
                    </div>
                  </div>

                  <div className="ml-9 space-y-2">
                    <div className={`p-4 rounded-xl border ${isCorrect ? 'border-success/30 bg-success/5' : 'border-error/30 bg-error/5'}`}>
                      <p className="text-sm text-slate-300">
                        <span className={`font-bold mr-2 ${isCorrect ? 'text-success' : 'text-error'}`}>Your Answer:</span>
                        {userOption ? userOption.text : 'No answer selected'}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div className="p-4 rounded-xl border border-success/30 bg-success/5">
                        <p className="text-sm text-slate-300">
                          <span className="font-bold text-success mr-2">Correct Answer:</span>
                          {correctOption?.text}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-9 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Explanation</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 pb-8 md:pb-4 shadow-2xl safe-area-bottom">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('reading-coach')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">article</span>
            <span className="text-sm">Review Article</span>
          </button>
          <button
            onClick={() => {
              // Clear cache to force new generation
              localStorage.removeItem('last_generated_lesson');
              onNavigate('reading-coach');
            }}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span className="text-sm">Try Another</span>
          </button>
        </div>
      </footer>
    </div>
  );
};