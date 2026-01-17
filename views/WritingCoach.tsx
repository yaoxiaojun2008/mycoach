import React, { useState } from 'react';
import { ViewState } from '../types';
import { supabase } from '../services/supabaseClient';
import {
    analyzeStyle,
    evaluateContent,
    suggestImprovements,
    refineContent,
    generateFollowUp
} from '../services/writingCoach';

interface WritingCoachProps {
    onNavigate: (view: ViewState) => void;
}

export const WritingCoach: React.FC<WritingCoachProps> = ({ onNavigate }) => {
    const [text, setText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    // AI Analysis State
    const [isLoading, setIsLoading] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [results, setResults] = useState<{
        style: string | null;
        evaluation: string | null;
        improvement: string | null;
        refinement: string | null;
        followup: string | null;
        saveStatus: string | null;
    }>({
        style: null,
        evaluation: null,
        improvement: null,
        refinement: null,
        followup: null,
        saveStatus: null
    });

    // Track which text version was used for each analysis
    const [analyzedVersions, setAnalyzedVersions] = useState<Record<string, string>>({});

    const handleAiAction = async (tool: string, action: (text: string, ...args: any[]) => Promise<string>) => {
        if (!text.trim()) {
            setMessage('Please write something first!');
            return;
        }

        const toolKey = tool.toLowerCase();

        // Check cache: if we have a result and the text hasn't changed since then, verify it
        if (results[toolKey as keyof typeof results] && analyzedVersions[toolKey] === text) {
            console.log(`Using cached result for ${tool}`);
            setActiveTool(tool);
            // No need to re-run
            return;
        }

        setIsLoading(true);
        setActiveTool(tool);
        setMessage('');

        try {
            let result = '';
            if (tool === 'Followup') {
                // Pass context if available
                result = await action(text, results.style, results.evaluation);
            } else {
                result = await action(text);
            }

            setResults(prev => ({
                ...prev,
                [toolKey]: result
            }));

            // Update the cache version
            setAnalyzedVersions(prev => ({
                ...prev,
                [toolKey]: text
            }));

        } catch (error) {
            console.error(`Error running ${tool}:`, error);
            setMessage(`Error running ${tool}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!text.trim()) {
            setMessage('Please write something first!');
            return;
        }

        setIsLoading(true);
        setMessage('Saving...');

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setMessage('You must be logged in to save.');
                return;
            }

            const { error } = await supabase
                .from('essays')
                .insert([
                    {
                        user_id: user.id,
                        content: text,
                        ai_style_analysis: results.style ? JSON.stringify(results.style) : null,
                        ai_evaluation: results.evaluation ? JSON.stringify(results.evaluation) : null,
                        ai_improvement: results.improvement ? JSON.stringify(results.improvement) : null,
                        ai_refinement: results.refinement ? JSON.stringify(results.refinement) : null,
                        ai_followup: results.followup ? JSON.stringify(results.followup) : null
                    }
                ]);

            if (error) throw error;

            setResults(prev => ({
                ...prev,
                saveStatus: 'saved'
            }));
            
            setMessage('Essay and analysis saved successfully!');
        } catch (error: any) {
            console.error('Error saving essay:', error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputComplete = () => {
        if (!text.trim()) {
            setMessage('Please write something first!');
        } else {
            // If there's text, allow the user to proceed with AI analysis
            setMessage('Input complete! You can now use AI tools to analyze your writing.');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setText(content);
                setMessage('File loaded!');
            };
            if (file.type.includes('text') || file.name.endsWith('.md')) {
                reader.readAsText(file);
            } else {
                setMessage(`Selected file: ${file.name} (Only text files supported for now)`);
            }
        }
    };

    const aiFunctions = [
        { key: 'Style', label: 'Style', fullName: 'Style Analyzer', icon: 'style', action: analyzeStyle },
        { key: 'Evaluation', label: 'Evaluate', fullName: 'Evaluate Content', icon: 'grade', action: evaluateContent },
        { key: 'Improvement', label: 'Improvement', fullName: 'Improvement Suggestions', icon: 'trending_up', action: suggestImprovements },
        { key: 'Refinement', label: 'Refiner', fullName: 'Content Refiner', icon: 'auto_fix_high', action: refineContent },
        { key: 'Followup', label: 'Followup', fullName: 'Follow-up Questions', icon: 'chat', action: generateFollowUp },
        { key: 'Save', label: 'Save', fullName: 'Save to Supabase', icon: 'save', action: null }, // Added save to AI tools
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onNavigate('home')}
                            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Writing Coach</h1>
                    </div>
                    <button
                        onClick={() => onNavigate('writing-history')}
                        className="text-primary font-semibold text-sm hover:underline"
                    >
                        History Review
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Editor Section */}
                <section className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start writing your essay here..."
                        className="w-full h-64 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-0 resize-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-medium text-base outline-none transition-all"
                    />

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                                <span>Upload File</span>
                                <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.md" />
                            </label>
                            <button
                                onClick={handleInputComplete}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[18px]">done</span>
                                Input Complete
                            </button>
                        </div>
                    </div>
                    {message && <p className="mt-2 text-sm text-center text-red-500 font-medium">{message}</p>}
                </section>

                {/* AI Tools Grid */}
                <section>
                    <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">AI Tools</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {aiFunctions.map((func) => (
                            <button
                                key={func.key}
                                onClick={() => {
                                    if (func.key === 'Save') {
                                        handleSave();
                                    } else {
                                        handleAiAction(func.key, func.action);
                                    }
                                }}
                                disabled={isLoading}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all group ${activeTool === func.key
                                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20 dark:bg-primary/10'
                                    : 'bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10'
                                    }`}
                            >
                                <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">{func.icon}</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{func.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Results Display */}
                {activeTool && results[activeTool.toLowerCase() as keyof typeof results] && (
                    <section className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                {aiFunctions.find(f => f.key === activeTool)?.fullName || activeTool} Result
                            </h3>
                            <button onClick={() => setActiveTool(null)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                {results[activeTool.toLowerCase() as keyof typeof results]}
                            </div>
                        </div>
                    </section>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Processing...</p>
                    </div>
                )}

            </main>
        </div>
    );
};