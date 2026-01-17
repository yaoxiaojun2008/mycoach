import React, { useState, useEffect } from 'react';
import { ViewState, GeneratedLesson } from '../types';
import { generateReadingLesson } from '../services/ai';
import { supabase } from '../services/supabaseClient';

interface ReadingCoachProps {
  onNavigate: (view: ViewState) => void;
}

export const ReadingCoach: React.FC<ReadingCoachProps> = ({ onNavigate }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [lesson, setLesson] = useState<GeneratedLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // Map questionIndex -> optionId

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);

      // Check cache first
      const cached = localStorage.getItem('last_generated_lesson');
      if (cached) {
        setLesson(JSON.parse(cached));

        // Restore answers if available
        const cachedAnswers = localStorage.getItem('last_quiz_answers');
        if (cachedAnswers) {
          setUserAnswers(JSON.parse(cachedAnswers));
        }

        setLoading(false);
        return;
      }

      // Generate B2 level content about a random topic if no cache
      const data = await generateReadingLesson("B2");
      setLesson(data);
      localStorage.setItem('last_generated_lesson', JSON.stringify(data));
      // Reset answers for new lesson
      localStorage.removeItem('last_quiz_answers');
      setUserAnswers({});
      setLoading(false);
    };
    fetchLesson();
  }, []);

  // Effect to sync selectedAnswer with userAnswers when changing questions
  useEffect(() => {
    if (userAnswers[currentQuestionIndex] !== undefined) {
      setSelectedAnswer(userAnswers[currentQuestionIndex]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, userAnswers]);

  const handleAnswerSelect = (optionId: number) => {
    setSelectedAnswer(optionId);
    const newAnswers = { ...userAnswers, [currentQuestionIndex]: optionId };
    setUserAnswers(newAnswers);
    localStorage.setItem('last_quiz_answers', JSON.stringify(newAnswers));
  };

  const handleNext = async () => {
    if (!lesson) return;

    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz Submitted
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Insert Article
          const { data: articleData, error: articleError } = await supabase
            .from('articles')
            .insert({
              title: lesson.article.title,
              content: lesson.article.content,
              type: 'Generated',
              level: 'B2'
            })
            .select()
            .single();

          if (articleData && !articleError) {
            // 3. Insert Quiz Attempt
            let correctCount = 0;
            lesson.questions.forEach((q, idx) => {
              if (userAnswers[idx] === q.correctId) correctCount++;
            });

            await supabase.from('user_quiz_attempts').insert({
              user_id: user.id,
              article_id: articleData.id,
              score: correctCount,
              total_questions: lesson.questions.length,
              user_answers: userAnswers
            });
          }
        }
      } catch (err) {
        console.error("Failed to save progress:", err);
      }

      onNavigate('quiz-analysis');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-bold">Generating Lesson with AI...</h2>
        <p className="text-slate-500 text-sm">Crafting a unique article just for you</p>
      </div>
    );
  }

  if (!lesson) return <div>Error loading lesson.</div>;

  const currentQuestion = lesson.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
          <div className="flex items-center gap-3" onClick={() => onNavigate('home')}>
            <span className="material-symbols-outlined cursor-pointer hover:opacity-70">arrow_back_ios</span>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Reading Coach</h2>
          </div>
          <div className="flex items-center">
            <button className="flex items-center justify-center p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="max-w-md mx-auto px-4 pb-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium opacity-70 uppercase tracking-widest">Quiz Progress</p>
              <p className="text-xs font-bold text-primary">{currentQuestionIndex + 1} of {lesson.questions.length} Questions</p>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / lesson.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-md mx-auto">
          {/* Article */}
          <section className="p-4">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">article</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Reading Material</span>
              </div>
              <h1 className="text-xl font-bold leading-tight mb-4">{lesson.article.title}</h1>
              <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                {lesson.article.content?.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Question */}
          <section className="p-4 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold">0{currentQuestionIndex + 1}</span>
                <h3 className="text-base font-bold">{currentQuestion.text}</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${selectedAnswer === option.id ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 hover:border-primary/50 group'}`}
                  >
                    <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${selectedAnswer === option.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                      {option.label}
                    </span>
                    <span className={`text-sm ${selectedAnswer === option.id ? 'font-medium' : ''}`}>
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 p-4 pb-8 md:pb-4 safe-area-bottom">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentQuestionIndex < lesson.questions.length - 1 ? 'Next Question' : 'Submit Quiz'}</span>
            <span className="material-symbols-outlined text-base">
              {currentQuestionIndex < lesson.questions.length - 1 ? 'arrow_forward' : 'check_circle'}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};