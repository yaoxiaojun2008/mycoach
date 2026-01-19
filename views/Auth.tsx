import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface AuthProps {
  onLoginSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Helper to get the correct redirect URL
  const getRedirectUrl = () => {
    // For the callback, we want to redirect to our app's auth-callback handler
    // Try to get from environment variable first
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const envRedirect = (import.meta as any).env.VITE_DEPLOY_HOST;
      if (envRedirect) {
        return `${envRedirect}#auth-callback`;
      }
    }
    
    // Fallback to current origin with auth-callback hash
    return typeof window !== 'undefined' 
      ? `${window.location.origin}${window.location.pathname}#auth-callback` 
      : '';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Wait a moment to ensure session is established
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        const redirectTo = getRedirectUrl();
        
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { 
            data: { name: email.split('@')[0], level: 'B1 Intermediate' },
            emailRedirectTo: `${redirectTo}` // Use the correct redirect URL for email confirmation
          }
        });
        if (error) throw error;
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          setMessage("Sign up successful! Please check your email to confirm your account.");
          return;
        }
        
        // Wait a moment to ensure session is established
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-4xl">school</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">AI English Tutor</h1>
          <p className="text-slate-500">Your personalized path to fluency</p>
        </div>

        <div className="bg-white dark:bg-card-dark p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                placeholder="hello@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-error/10 text-error text-sm rounded-lg font-medium">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-lg font-medium">
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-500 hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center px-8">
           <p className="text-xs text-slate-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};