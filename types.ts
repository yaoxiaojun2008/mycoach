export type ViewState =
  | 'auth'
  | 'auth-callback'  // Adding the auth callback view state
  | 'home'
  | 'reading-coach'
  | 'quiz-analysis'
  | 'recommended-feed'
  | 'recommended-content'
  | 'chat'
  | 'article-reader'
  | 'history'
  | 'writing-coach'
  | 'writing-history';

export interface User {
  id?: string;
  email?: string;
  name: string;
  level: string;
  avatar: string;
}

export interface Article {
  id: string;
  title: string;
  category?: string;
  readTime: string;
  // Added time property to support AI generated content variations
  time?: string;
  url?: string;
  imageUrl?: string;
  level?: string;
  type: 'News' | 'Blog' | 'Video' | 'article' | 'video';
  snippet?: string;
  content?: string[]; // Paragraphs
}

export interface QuestionOption {
  id: number;
  label: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  correctId: number;
  explanation: string;
}

export interface GeneratedLesson {
  article: Article;
  questions: Question[];
}

export interface Essay {
  id: string;
  user_id: string;
  content: string;
  file_url?: string;
  ai_style_analysis?: any;
  ai_evaluation?: any;
  ai_improvement?: any;
  ai_refinement?: any;
  ai_followup?: any;
  created_at: string;
}