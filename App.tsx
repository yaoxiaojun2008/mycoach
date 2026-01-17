import React, { useState, useEffect } from 'react';
import { ViewState, User, Article } from './types';
import { BottomNav } from './components/BottomNav';
import { Home } from './views/Home';
import { ReadingCoach } from './views/ReadingCoach';
import { QuizAnalysis } from './views/QuizAnalysis';
import { RecommendedFeed } from './views/RecommendedFeed';
import { RecommendedContent } from './views/RecommendedContent';
import { ArticleReader } from './views/ArticleReader';
import { History } from './views/History';
import { ChatInterface } from './views/ChatInterface';
import { WritingCoach } from './views/WritingCoach';
import { WritingHistory } from './views/WritingHistory';
import { Auth } from './views/Auth';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('loading'); // Changed to 'loading' initially
  const [session, setSession] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Initialize Supabase auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If there's an active session, go to home; otherwise show auth
      if (session) {
        setCurrentView('home');
      } else {
        setCurrentView('auth');
      }
    });

    // Also check the current session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // If there's an active session, go to home; otherwise show auth
      if (session) {
        setCurrentView('home');
      } else {
        setCurrentView('auth');
      }
    }).catch(() => {
      // If there's an error getting the session (e.g., due to misconfigured Supabase keys),
      // default to showing the auth page
      setCurrentView('auth');
    });

    return () => subscription.unsubscribe();
  }, []);

  // Static user fallback if DB auth is partial, or enrich with DB data
  const user: User = {
    name: session?.user?.email?.split('@')[0] || "Guest",
    level: "B2 Intermediate",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbgMzQAemg9hfw8Avdlmuz4zi70OIjHlgeABrKIvs0gHBkeju9DVqvJPddyOHI666DlKu6t04ADZ7tCw91wNpyeTn0ZTta4YEZGlqoA3CeUe3Ng2zygg2_7HB2PiGZVbnN21Qg0qdubaNobOcHUyJaURh8R__aoS95ZKeic8GSX5w3IrO5Dp9WJRUnpqcZthoWIOpXwVlpPXBJeZmdNIF4Ck8oGQC1VGSGgqqAR4AERAHtg4ehi1ELJJ5p-pM-zxo9OpKYjSJP4iLC"
  };

  const [previousView, setPreviousView] = useState<ViewState>('home');

  const handleNavigate = (view: ViewState) => {
    // Save previous view if navigating TO article-reader from key pages
    // This allows the back button to work correctly in ArticleReader
    if (view === 'article-reader') {
      // If we are already on article reader (unlikely in this flow but safe), keep old prev
      if (currentView !== 'article-reader') {
        setPreviousView(currentView);
      }
    }

    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home user={user} onNavigate={handleNavigate} />;
      case 'reading-coach':
        return <ReadingCoach onNavigate={handleNavigate} />;
      case 'quiz-analysis':
        return <QuizAnalysis onNavigate={handleNavigate} />;
      case 'recommended-feed':
        return <RecommendedFeed onNavigate={handleNavigate} />;
      case 'recommended-content':
        return <RecommendedContent onNavigate={handleNavigate} onSelectArticle={setSelectedArticle} />;
      case 'article-reader':
        return <ArticleReader article={selectedArticle} onNavigate={handleNavigate} previousView={previousView} />;
      case 'history':
        return <History onNavigate={handleNavigate} onSelectArticle={setSelectedArticle} />;
      case 'chat':
        return <ChatInterface onNavigate={handleNavigate} />;
      case 'writing-coach':
        return <WritingCoach onNavigate={handleNavigate} />;
      case 'writing-history':
        return <WritingHistory onNavigate={handleNavigate} />;
      case 'auth':
        return <Auth onLoginSuccess={() => {
          // Small delay to ensure session is properly established
          setTimeout(() => {
            setCurrentView('home');
          }, 300);
        }} />;
      case 'loading':
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        );
      default:
        return <Home user={user} onNavigate={handleNavigate} />;
    }
  };

  // Views that should show the bottom navigation
  const showBottomNav = ['home', 'recommended-feed', 'recommended-content'].includes(currentView);

  // No separate loading state needed since it's handled in renderView

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden relative">
      {renderView()}

      {showBottomNav && (
        <BottomNav currentView={currentView} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;