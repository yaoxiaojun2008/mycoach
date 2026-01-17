<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI English Learning Application

This is an AI-powered English learning application with integrated reading and writing coaching features. The application leverages AI models to provide personalized feedback and recommendations to English learners.

## Features

- **Article Reading Training** (ArticleReader)
- **Writing Coach Assistance** (WritingCoach)
- **Intelligent Q&A and Feedback** (ChatInterface)
- **Learning History Management** (History / WritingHistory)
- **Recommended Content Delivery** (RecommendedContent / RecommendedFeed)
- **User Authentication System** (Auth)

## Tech Stack

- **Frontend**: React v19.2.3
- **Build Tool**: Vite v6.2.0
- **Language**: TypeScript ~5.8.2
- **Backend API**: Gemini API and DeepSeek API for AI services
- **Database**: Supabase for data storage and user management

## Deployment to Vercel

### Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project pushed to a GitHub repository

### Deployment Steps

1. Sign in to your Vercel account at [vercel.com](https://vercel.com)
2. Click "New Project" and select your GitHub repository
3. Vercel will automatically detect that this is a Vite/React project
4. Configure the build settings:
   - **Framework Preset**: Select "Other"
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add your environment variables in the Environment Variables section:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `DEEPSEEK_API_KEY`: Your DeepSeek API key (if using)
6. Click "Deploy" and wait for the build to complete
7. Your application will be live with a URL like `https://your-project.vercel.app`

### Environment Variables

For the application to work properly, you need to set the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key for AI services
- `DEEPSEEK_API_KEY`: Your DeepSeek API key (optional, if using DeepSeek instead of Gemini)

These should be added in the Vercel dashboard under Settings > Environment Variables.

### Local Development

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```