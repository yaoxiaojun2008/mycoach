import React, { useEffect, useState } from 'react';
import { getRecommendedContent, RecommendedArticle } from '../utils/recommendedCache';

interface RecommendedContentProps {
  onNavigate: (view: any) => void;
}

export const RecommendedContent: React.FC<RecommendedContentProps> = ({ onNavigate }) => {
  const [newsItems, setNewsItems] = useState<RecommendedArticle[]>([]);
  const [blogItems, setBlogItems] = useState<RecommendedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendedContent();
  }, []);

  const loadRecommendedContent = async () => {
    try {
      setLoading(true);
      // Use the function that fetches only pushed articles
      const data = await getRecommendedContent();
      setNewsItems(data.news);
      setBlogItems(data.blogs);
    } catch (err) {
      console.error('Error loading recommended content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommended content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto pb-32 hide-scrollbar p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="mb-4 p-4 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex gap-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-16 h-16"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto pb-32 hide-scrollbar p-4">
        <div className="text-center py-10">
          <div className="text-red-500 text-sm mb-4">Error loading recommended content: {error}</div>
          <button 
            onClick={loadRecommendedContent}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 hide-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4">
          <button 
            onClick={() => onNavigate('home')} 
            className="mr-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold">Recommended Content</h2>
        </div>
      </header>

      <div className="p-4">
        {/* Latest News Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Latest News</h3>
          </div>
          
          {newsItems.length > 0 ? (
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div 
                  key={`news-${item.id}`} 
                  onClick={() => window.open(item.url, '_blank')}
                  className="flex gap-4 p-4 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div 
                    className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0" 
                    style={{ backgroundImage: item.image_url ? `url(${item.image_url})` : 'none' }}
                  >
                    {!item.image_url && (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-500">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 dark:text-white font-semibold line-clamp-2 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-2">
                      {item.snippet}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{new Date(item.pulled_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No news articles available
            </div>
          )}
        </section>

        {/* Latest Blogs Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Latest Blogs</h3>
          </div>
          
          {blogItems.length > 0 ? (
            <div className="space-y-4">
              {blogItems.map((item) => (
                <div 
                  key={`blog-${item.id}`} 
                  onClick={() => window.open(item.url, '_blank')}
                  className="flex gap-4 p-4 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div 
                    className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0" 
                    style={{ backgroundImage: item.image_url ? `url(${item.image_url})` : 'none' }}
                  >
                    {!item.image_url && (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-500">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 dark:text-white font-semibold line-clamp-2 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-2">
                      {item.snippet}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{new Date(item.pulled_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No blog articles available
            </div>
          )}
        </section>
      </div>
    </div>
  );
};