import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { supabase } from '../services/supabaseClient'; // Import supabase directly

interface HomeProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  session?: any; // Add session prop to determine if user is logged in
}

export const Home: React.FC<HomeProps> = ({ user, onNavigate, session }) => {
  // Define image paths relative to the public directory
  const articleBackground = '/assets/images/cards/article-background.jpg';
  const writingCoachBg = '/assets/images/tutors/writing-coach-bg.jpg';
  const readingCoachBg = '/assets/images/tutors/reading-coach-bg.jpg';
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileMenuClick = () => {
    if (session) {
      // If user is logged in, toggle the profile menu
      setShowProfileMenu(!showProfileMenu);
    } else {
      // If user is not logged in, navigate to auth page
      onNavigate('auth');
    }
  };

  const handleSignOut = async () => {
    // Close the menu first
    setShowProfileMenu(false);
    
    // Perform sign out using Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    
    // Navigate back to home which will show the auth page
    onNavigate('home');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 shrink-0 rounded-full border-2 border-primary relative">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover size-full cursor-pointer rounded-full" 
                style={{ backgroundImage: `url("${user.avatar}")` }}
                onClick={handleProfileMenuClick}
              ></div>
              
              {/* Profile Dropdown Menu */}
              {showProfileMenu && session && (
                <div className="absolute left-0 mt-12 w-64 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-2">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email || 'No email'}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Hi, {user.name}!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{user.level}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-primary/20 text-primary px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[18px] mr-1 fill-1">local_fire_department</span>
              <span className="text-sm font-bold">12</span>
            </div>
          </div>
        </div>
      </header>

      {/* For You Section */}
      <section className="pt-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">For You</h2>
          <button
            onClick={() => onNavigate('recommended-feed')}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Explore more
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 px-4 pb-4">
          {/* Card 1 - Article */}
          <div
            onClick={() => onNavigate('recommended-content')}
            className="w-full max-w-md flex flex-col gap-3 group cursor-pointer active:scale-95 transition-transform"
          >
            <div 
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-center bg-cover shadow-lg" 
              style={{ 
                backgroundImage: `url(${articleBackground})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover', // Ensures the image fits properly without hiding parts
              }}
            >
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white">
                <span className="material-symbols-outlined text-[16px]">description</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Article</span>
              </div>
            </div>
            <div className="px-1">
              <h3 className="text-slate-900 dark:text-white text-base font-bold line-clamp-1 leading-tight mb-1">Exploring news and blogs today</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">schedule</span> 8 min read • Vocabulary
              </p>
            </div>
          </div>

          {/* Removed the video card section as previously requested */}
        </div>
      </section>

      {/* Stats */}
      <div className="flex gap-3 px-4 py-4">
        <div className="flex flex-1 flex-col gap-1 rounded-xl p-4 bg-white dark:bg-card-dark shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Daily Goal</p>
            <span className="material-symbols-outlined text-primary text-sm">target</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-slate-900 dark:text-white text-2xl font-bold">85%</p>
            <p className="text-[#0bda5e] text-xs font-bold leading-normal">+5%</p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full w-[85%] rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-xl p-4 bg-white dark:bg-card-dark shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">New Words</p>
            <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-slate-900 dark:text-white text-2xl font-bold">24</p>
            <p className="text-primary text-xs font-bold leading-normal">/ 30</p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full w-[70%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Tutors */}
      <div className="px-4 pb-4">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight mb-4">Main Tutors</h2>
        <div className="grid grid-cols-1 gap-4">

          {/* Writing Coach */}
          <div className="group relative flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-card-dark p-4 shadow-md border border-slate-200 dark:border-slate-800">
            <div className="flex flex-[3_3_0px] flex-col justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                  <p className="text-slate-900 dark:text-white text-base font-bold">Writing Coach</p>
                </div>
                <p className="text-slate-500 dark:text-[#9da6b9] text-sm font-normal leading-snug">Improve grammar and style with real-time AI feedback.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('writing-coach')}
                  className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold w-fit shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  <span>Start Writing</span>
                </button>
                <button
                  onClick={() => onNavigate('writing-history')}
                  className="size-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="History Review"
                >
                  <span className="material-symbols-outlined text-[20px]">history</span>
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-[100px] bg-center bg-no-repeat aspect-square bg-cover rounded-lg" style={{ backgroundImage: `url(${writingCoachBg})` }}></div>
          </div>

          {/* Reading Coach */}
          <div className="group relative flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-card-dark p-4 shadow-md border border-slate-200 dark:border-slate-800">
            <div className="flex flex-[3_3_0px] flex-col justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">auto_stories</span>
                  <p className="text-slate-900 dark:text-white text-base font-bold">Reading Coach</p>
                </div>
                <p className="text-slate-500 dark:text-[#9da6b9] text-sm font-normal leading-snug">Practice comprehension with smart interactive quizzes.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('reading-coach')}
                  className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold w-fit shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  <span>Take Quiz</span>
                </button>
                <button
                  onClick={() => onNavigate('history')}
                  className="size-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="History"
                >
                  <span className="material-symbols-outlined text-[20px]">history</span>
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-[100px] bg-center bg-no-repeat aspect-square bg-cover rounded-lg" style={{ backgroundImage: `url(${readingCoachBg})` }}></div>
          </div>

          {/* Live AI Tutor */}
          <div className="group relative flex flex-col gap-4 rounded-xl bg-gradient-to-br from-primary to-blue-700 p-5 shadow-xl border border-primary/50 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined">forum</span>
                  <p className="text-lg font-bold">Live AI Tutor</p>
                </div>
                <p className="text-blue-100 text-sm font-normal">Speak with your AI anytime. 24/7 practice partner.</p>
              </div>
              <div className="flex size-10 items-center justify-center bg-white/20 rounded-full animate-pulse">
                <span className="material-symbols-outlined text-white">graphic_eq</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="flex w-full items-center justify-center rounded-lg h-11 bg-white text-primary text-sm font-bold shadow-sm active:scale-[0.98] transition-transform"
            >
              <span>Start Conversation</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};