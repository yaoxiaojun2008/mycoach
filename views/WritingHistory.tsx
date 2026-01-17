import React, { useEffect, useState } from 'react';
import { ViewState, Essay } from '../types';
import { supabase } from '../services/supabaseClient';

interface WritingHistoryProps {
    onNavigate: (view: ViewState) => void;
}

export const WritingHistory: React.FC<WritingHistoryProps> = ({ onNavigate }) => {
    const [essays, setEssays] = useState<Essay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('essays')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setEssays(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 gap-2">
                    <button
                        onClick={() => onNavigate('writing-coach')}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Writing History</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : essays.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">history_edu</span>
                        <p>No essays saved yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {essays.map((essay) => (
                            <div
                                key={essay.id}
                                className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => {
                                    // Logic to open/view specific essay could go here
                                    // For now, we just log it or maybe pass it back to writing coach if requested
                                    console.log('Clicked essay:', essay.id);
                                }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                        Essay
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {formatDate(essay.created_at)}
                                    </span>
                                </div>
                                <p className="text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                                    {essay.content}
                                </p>

                                {/* Indicators for AI analysis presence */}
                                <div className="flex gap-2 mt-3 text-slate-400">
                                    {essay.ai_style_analysis && <span className="material-symbols-outlined text-[16px] text-green-500" title="Analyzed">check_circle</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
