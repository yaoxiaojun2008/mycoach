# recommended and deepseek
Updated UI Text: In 
RecommendedFeed.tsx
, I changed the card title from "The Nuances of Indirect Questions" to "we recommend today...".
Connected to DeepSeek: I created a new function 
getEducationNews
 in 
services/ai.ts
 that sends your exact prompts to the DeepSeek API.
System Prompt: "You are a helpful education news/blogs assistant..."
User Prompt: "please send me a list link to top 3 news and top 3 blogs..."
I added a format instruction to ensuring the AI returns a JSON structure that the app can actually display (Title, Snippet, etc.).
Wired Up Navigation: When you click that card (which navigates to 
RecommendedContent
), it now fetches data using this new 
getEducationNews
 function instead of the generic recommendation engine.
Try it out:

Go to the For You tab (Recommended Feed).

# In Supabase, the authentication callback will happen automatically when the user clicks the email confirmation link, so we don't need to add extra handling in the App component. The main thing is to make sure the signup process uses the correct redirect URL. check Supabase Dashboard → Authentication → URL Configuration

# To add Google authentication (like Gmail login) to your application, I'll need to update the Auth component to include OAuth functionality with Google. Let me modify the component to support this feature:

I've successfully added Google authentication support to your application. Here are the changes I made to the Auth component:

Added Google OAuth functionality:

Created a new function handleGoogleSignIn that handles the Google sign-in process
Used supabase.auth.signInWithOAuth() with the provider set to 'google'
Included the redirectTo parameter to ensure proper redirection after authentication
Added a Google login button:

Positioned below the email/password form
Styled with a Google-branded design (red background with white text and Google logo)
Added Google icon from Material Icons
Updated the import statements:

Added Material Icons for the Google logo
Maintained all existing functionality
Preserved existing functionality:

Email/password authentication remains unchanged
All other features continue to work as before
To make Google authentication work properly, you'll need to:

Enable Google OAuth in your Supabase project:

Go to your Supabase Dashboard
Navigate to Authentication → Settings
Enable the Google provider
Add your redirect URLs (both localhost for development and your production URL)
Ensure your Google Cloud Console is configured with your redirect URIs:

The redirect URI should match what's in your VITE_DEPLOY_HOST environment variable
For local development, typically http://localhost:3000/auth/callback
For production, https://your-domain.vercel.app/auth/callback
Once you've configured these settings in Supabase and Google Cloud Console, users will be able to sign in with their Google accounts using the new "Continue with Google" button.
