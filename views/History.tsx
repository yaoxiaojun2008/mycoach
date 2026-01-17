import React, { useState, useEffect } from 'react';
import { ViewState, Article } from '../types';
import { supabase } from '../services/supabaseClient';

interface HistoryProps {
    onNavigate: (view: ViewState) => void;
    onSelectArticle: (article: Article) => void;
}

interface AttemptWithArticle {
    id: string; // attempt id
    score: number;
    total_questions: number;
    created_at: string;
    articles: {
        id: string;
        title: string;
        content: string[];
        type: any;
        level: string;
    }
}

export const History: React.FC<HistoryProps> = ({ onNavigate, onSelectArticle }) => {
    const [attempts, setAttempts] = useState<AttemptWithArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('user_quiz_attempts')
                    .select(`
                    id, 
                    score, 
                    total_questions, 
                    created_at,
                    articles (
                        id,
                        title,
                        content,
                        type,
                        level
                    )
                `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (data) {
                    // @ts-ignore
                    setAttempts(data);
                }
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    const handleReadAgain = (attempt: AttemptWithArticle) => {
        // Construct Article object
        const article: Article = {
            id: attempt.articles.id,
            title: attempt.articles.title,
            content: attempt.articles.content,
            type: 'article', // Default type for history items
            level: attempt.articles.level,
            readTime: '5 MIN', // Estimate
            url: '' // Generated content has no URL usually
        };

        onSelectArticle(article);
        onNavigate('article-reader');
    };

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
                    <div className="flex items-center gap-3" onClick={() => onNavigate('home')}>
                        <span className="material-symbols-outlined cursor-pointer hover:opacity-70">arrow_back_ios</span>
                        <h2 className="text-lg font-bold leading-tight tracking-tight">Reading History</h2>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-4">
                <div className="max-w-md mx-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-sm text-slate-500">Loading history...</p>
                        </div>
                    ) : attempts.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">history</span>
                            <p className="text-slate-500">No reading history yet.</p>
                        </div>
                    ) : (
                        attempts.map((attempt) => (
                            <div key={attempt.id} className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-base leading-snug mb-1">{attempt.articles.title}</h3>
                                        <p className="text-xs text-slate-400">
                                            {new Date(attempt.created_at).toLocaleDateString()} • {new Date(attempt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${attempt.score === attempt.total_questions ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                        {attempt.score}/{attempt.total_questions}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => handleReadAgain(attempt)}
                                        className="text-sm font-bold text-primary flex items-center gap-1 hover:opacity-80"
                                    >
                                        Read Again
                                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};
