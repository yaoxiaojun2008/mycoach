import React, { useState, useEffect } from 'react';
import { ViewState, Article } from '../types';
import { getEducationNews } from '../services/ai';

interface RecommendedContentProps {
  onNavigate: (view: ViewState) => void;
  onSelectArticle: (article: Article) => void;
}

export const RecommendedContent: React.FC<RecommendedContentProps> = ({ onNavigate, onSelectArticle }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const getCacheKey = () => `daily_recs_${new Date().toDateString()}`;

  const fetchRecs = async (forceRefresh = false) => {
    setLoading(true);

    // Try to load from cache first if not refreshing
    if (!forceRefresh) {
      const cached = localStorage.getItem(getCacheKey());
      if (cached) {
        setArticles(JSON.parse(cached));
        setLoading(false);
        return;
      }
    }

    const data = await getEducationNews();
    if (data && data.length > 0) {
      setArticles(data);
      // Save to local storage with today's date as key
      localStorage.setItem(getCacheKey(), JSON.stringify(data));
    } else {
      // Fallback static data if AI fails or key invalid
      const fallbackData: Article[] = [
        { id: '1', title: "The Future of AI in Daily Life", level: "B2 Intermediate", readTime: "5 MIN READ", snippet: "Discover how artificial intelligence is reshaping our routines.", type: "News", url: "https://www.bbc.com/news/technology" },
        { id: '2', title: "Exploring London", level: "B1 Pre-Intermediate", readTime: "4 MIN READ", snippet: "A journey through historic alleys.", type: "News", url: "https://www.visitlondon.com" },
        { id: '3', title: "Business Idioms", level: "Business", readTime: "4 MIN READ", snippet: "Sound professional.", type: "Blog", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
      ];
      setArticles(fallbackData);
      // We don't cache fallback data to retry next time
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleRefresh = () => {
    fetchRecs(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div onClick={() => onNavigate('home')} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </div>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Recommended Content</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-24 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-slate-500">Curating content with AI...</p>
          </div>
        ) : (
          <>
            <section className="mt-6">
              <div className="px-5 mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">Top News</h2>
                <span className="text-primary text-xs font-semibold">See All</span>
              </div>
              <div className="flex flex-col gap-4 px-4">
                {articles.filter(a => a.type === 'News' || a.type === 'article').map((article, i) => (
                  <div key={i} className="flex flex-col items-stretch justify-start rounded-2xl bg-white dark:bg-[#1c2433] p-5 shadow-sm border border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-primary text-[11px] font-bold uppercase tracking-[0.05em]">{article.level}</span>
                        <span className="text-slate-400 text-[11px] font-medium tracking-wide">{article.readTime || article.time}</span>
                      </div>
                      <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-snug">{article.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">{article.snippet}</p>
                      <div className="mt-2 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                        <button
                          onClick={() => {
                            onSelectArticle(article);
                            onNavigate('article-reader');
                          }}
                          className="flex items-center gap-1 text-primary font-bold text-sm tracking-tight group"
                        >
                          Read Full Article
                          <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <div className="px-5 mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">Top Blogs</h2>
                <span className="text-primary text-xs font-semibold">See All</span>
              </div>
              <div className="flex flex-col gap-4 px-4">
                {articles.filter(a => a.type === 'Blog').map((article, i) => (
                  <div key={i} className="flex flex-col items-stretch justify-start rounded-2xl bg-white dark:bg-[#1c2433] p-5 shadow-sm border border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded">{article.level}</span>
                        <span className="text-slate-400 text-[11px] font-medium tracking-wide">{article.readTime || article.time}</span>
                      </div>
                      <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-snug">{article.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">{article.snippet}</p>
                      <div className="mt-2 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                        <button
                          onClick={() => {
                            onSelectArticle(article);
                            onNavigate('article-reader');
                          }}
                          className="flex items-center gap-1 text-primary font-bold text-sm tracking-tight group"
                        >
                          Read Full Post
                          <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="px-5 py-8">
          <button
            onClick={handleRefresh}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"

          >
            <span className="material-symbols-outlined">refresh</span>
            Refresh & Load New Content
          </button>
        </div>
      </main>
    </div>
  );
};