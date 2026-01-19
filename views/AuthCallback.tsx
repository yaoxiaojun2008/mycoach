import React, { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's a code in the URL (for PKCE flow) or other auth parameters in the hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove the '#' character
        
        // Check for different types of auth callbacks
        const code = urlParams.get('code');
        const nextUrl = urlParams.get('next');
        const errorDescription = urlParams.get('error_description');
        
        if (errorDescription) {
          console.error('Authentication error:', errorDescription);
          // Show error message to user and redirect after delay
          setTimeout(() => {
            window.location.hash = '#auth';
          }, 3000);
          return;
        }
        
        // For email confirmation, there might not be a code in the URL
        // Supabase handles the session automatically, we just need to wait and check
        if (!code) {
          // For email confirmation links, we just need to wait a bit for Supabase to process
          // and then check if the user is now authenticated
          setTimeout(async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (session) {
              // If we have a session, the user has been confirmed and logged in
              window.location.hash = '#home';
            } else {
              // If no session, redirect to auth page to allow login
              window.location.hash = '#auth';
            }
          }, 2000);
        } else {
          // For OAuth flows with PKCE
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            setTimeout(() => {
              window.location.hash = '#auth';
            }, 2000);
          } else {
            // Success, redirect to home
            window.location.hash = '#home';
          }
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setTimeout(() => {
          window.location.hash = '#auth';
        }, 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Confirming Authentication</h1>
        <p className="text-slate-500">Please wait while we confirm your authentication...</p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;