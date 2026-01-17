import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const getIconClass = (viewName: ViewState) => {
    // Simple logic: if strictly equal, it's active (though in a real app, 'reading-coach' might arguably fall under 'library' etc.)
    // For this demo, we mainly highlight Home when on Home.
    return currentView === viewName 
      ? "text-primary fill-1" 
      : "text-slate-400 dark:text-slate-500";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button 
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1 ${currentView === 'home' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <span className={`material-symbols-outlined ${currentView === 'home' ? 'fill-1' : ''}`}>home</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined">library_books</span>
          <span className="text-[10px] font-medium">Library</span>
        </button>
        
        <div className="relative -top-5">
          <button 
            onClick={() => onNavigate('chat')}
            className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">smart_toy</span>
          </button>
        </div>
        
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px] font-medium">Stats</span>
        </button>
        
        <button className="flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
};