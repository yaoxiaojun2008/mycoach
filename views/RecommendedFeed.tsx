import React from 'react';
import { ViewState } from '../types';

interface RecommendedFeedProps {
  onNavigate: (view: ViewState) => void;
}

export const RecommendedFeed: React.FC<RecommendedFeedProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-12 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div onClick={() => onNavigate('home')} className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm ring-2 ring-primary/20 bg-cover cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbgMzQAemg9hfw8Avdlmuz4zi70OIjHlgeABrKIvs0gHBkeju9DVqvJPddyOHI666DlKu6t04ADZ7tCw91wNpyeTn0ZTta4YEZGlqoA3CeUe3Ng2zygg2_7HB2PiGZVbnN21Qg0qdubaNobOcHUyJaURh8R__aoS95ZKeic8GSX5w3IrO5Dp9WJRUnpqcZthoWIOpXwVlpPXBJeZmdNIF4Ck8oGQC1VGSGgqqAR4AERAHtg4ehi1ELJJ5p-pM-zxo9OpKYjSJP4iLC')" }}></div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">For You</h1>
              <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">3 Day Streak 🔥</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar">
        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary px-5">
          <p className="text-white text-sm font-semibold">All</p>
        </div>
        {['Grammar', 'Business', 'Daily Life', 'IELTS Prep'].map(cat => (
          <div key={cat} className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-slate-200 dark:bg-card-dark px-5">
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{cat}</p>
          </div>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto pb-32">
        <section className="mt-2">
          <div className="px-4 flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold leading-tight tracking-tight">Because you asked about Email Etiquette</h3>
            <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
          </div>
          <div className="px-4">
            <div className="relative overflow-hidden rounded-xl bg-primary/10 border border-primary/20 p-5 group">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-primary text-white px-2 py-0.5 rounded">AI PICK</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Based on your session yesterday</p>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white pr-12">Mastering Professional Greetings & Sign-offs</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">In your last session, we noticed you were unsure about when to use "Kind Regards" vs "Best Wishes".</p>
                <button className="mt-2 flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold py-3 rounded-lg w-full">
                  Resume Lesson
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="absolute -right-4 -top-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">mail</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="px-4 mb-4">
            <h2 className="text-2xl font-bold leading-tight tracking-tight">Recommended for You</h2>
            <p className="text-sm text-slate-500">Curated daily to reach your C1 goal</p>
          </div>
          <div className="flex flex-col gap-4 px-4">
            {/* Item 1 */}
            <div
              onClick={() => onNavigate('recommended-content')}
              className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-card-dark p-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex flex-[2_2_0px] flex-col justify-between py-1">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-xs">description</span>
                    <p className="text-slate-500 dark:text-[#9da6b9] text-[10px] font-bold uppercase tracking-wider">5 min read</p>
                  </div>
                  <p className="text-slate-900 dark:text-white text-base font-bold leading-snug">We recommend today...</p>
                  <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-normal leading-normal line-clamp-1">Top 3 news and blogs.</p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button className="flex items-center justify-center rounded-lg h-8 px-4 bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 active:scale-95 transition-transform">Read Now</button>
                  <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer">bookmark</span>
                </div>
              </div>
              <div className="w-32 bg-center bg-no-repeat aspect-[4/5] bg-cover rounded-lg flex-none" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2rSeFf5Ov4YwH0lLv6vItmeUHyFCC5g1pioMCd3XcQudZ2Mqvd8fPocBkSB3ATI2Xp59h7hAPHucpfOaHIfXCa8QZiCWAkJjEEyoGILS7CARwq044LI0r4nV3rn1FXAtkrFD7KQ1FeGI9BFYmSShMR8gb9fHpTfheLlfmkVBFeZyQhqyChHnDi7sSa8T4Fj6GwpoXqtrYG0UQBulpih7rGKOzzTKiOr0RLsuB5iSv8wYYPcUjPOIB7zXx1Mv4U3Eys9ZhDzpEzqAs")' }}></div>
            </div>

            {/* Item 2 Video */}
            <div className="flex flex-col rounded-xl bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="relative w-full aspect-video bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoQDrv251N2OaOHJY0uhwJHoaAY1d0_H-HjsoSYPRbg9tdVhzGtIf-EMGH-CHoLRuzBvysMhfvb5cowGFMsvySEpMpGuDj5KQKrInOysV0umASU2zuMI9W5HtP7RzurXHZN76EyWMWfe3TW_yNpSTYb-eSO77u7ZFUfaUhp-mMEVub1UPXtdGR41g_wAjRUPB5vCZDI73_KTcDvXZ2yHOBstwXj5tmNCsbBKEXIpI20akKqP41hLiSlTSXdvjFTbd2KfCa-mGLaio9")' }}>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <span className="material-symbols-outlined text-white text-3xl fill-1">play_arrow</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-primary text-[10px] font-bold uppercase tracking-wider">Video Lesson</p>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Common Pronunciation Mistakes in Tech</h4>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">more_vert</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};