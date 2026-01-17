import React, { useState } from 'react';
import { ViewState, Article } from '../types';

interface ArticleReaderProps {
    article: Article | null;
    onNavigate: (view: ViewState) => void;
    previousView?: ViewState;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onNavigate, previousView = 'home' }) => {
    const [iframeError, setIframeError] = useState(false);

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <p className="text-slate-500 mb-4">No article selected.</p>
                <button onClick={() => onNavigate('recommended-content')} className="text-primary font-bold">Go Back</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark shadow-sm border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 gap-4">
                    <button
                        onClick={() => onNavigate(previousView)}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base font-bold truncate leading-tight">{article.title}</h1>
                        <p className="text-xs text-slate-500 truncate">{article.url ? article.url : 'Generated Article'}</p>
                    </div>
                    {article.url && (
                        <button
                            onClick={() => window.open(article.url, '_blank')}
                            className="p-2 text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                            title="Open in Browser"
                        >
                            <span className="material-symbols-outlined">open_in_new</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 relative bg-slate-50 dark:bg-black/20 overflow-y-auto">
                {article.url && !iframeError ? (
                    <>
                        <iframe
                            src={article.url}
                            className="w-full h-full border-0"
                            title={article.title}
                            onError={() => setIframeError(true)}
                            // Sandbox permissions to allow scripts but prevent top-level navigation hijack
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        />
                        <div className="absolute inset-0 bg-white dark:bg-card-dark pointer-events-none -z-10 flex items-center justify-center">
                            <span className="material-symbols-outlined animate-spin text-slate-400">progress_activity</span>
                        </div>
                    </>
                ) : article.content ? (
                    <div className="max-w-md mx-auto p-6 bg-white dark:bg-card-dark shadow-sm min-h-full">
                        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{article.title}</h1>
                        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-lg">
                            {article.content.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">web_asset_off</span>
                        <h3 className="text-lg font-bold mb-2">Unable to display content</h3>
                        <p className="text-sm text-slate-500 max-w-xs mb-6">No content available to read.</p>
                        {article.url && (
                            <button
                                onClick={() => window.open(article.url, '_blank')}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                            >
                                Open in Browser
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
