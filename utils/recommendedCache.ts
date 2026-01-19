import { supabase } from '../services/supabaseClient';

export interface RecommendedArticle {
  id: string;
  article_id: string;
  title: string;
  url: string;
  source: string;
  image_url: string;
  type: string;
  level: string;
  snippet: string;
  published_at?: string;
  pulled_at: string;
  is_pushed_to_client: boolean;
  pushed_at?: string;
  created_at: string;
  updated_at: string;
}

interface CacheData {
  news: RecommendedArticle[];
  blogs: RecommendedArticle[];
  lastUpdated: string; // ISO string date
}

const CACHE_KEY = 'recommendedContentCache';
const CACHE_DURATION_DAYS = 1; // Refresh cache every day

/**
 * Checks if the cache is still valid (less than 1 day old)
 */
export const isCacheValid = (): boolean => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return false;

  try {
    const { lastUpdated }: CacheData = JSON.parse(cachedData);
    const lastUpdateDate = new Date(lastUpdated);
    const now = new Date();
    const diffInDays = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays < CACHE_DURATION_DAYS;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

/**
 * Gets the cached data if it's still valid
 */
export const getCachedRecommendedContent = (): CacheData | null => {
  if (!isCacheValid()) {
    return null;
  }

  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return null;

  try {
    return JSON.parse(cachedData) as CacheData;
  } catch (error) {
    console.error('Error parsing cached data:', error);
    return null;
  }
};

/**
 * Fetches fresh recommended content from Supabase and caches it
 */
export const fetchAndCacheRecommendedContent = async (): Promise<CacheData> => {
  try {
    // Fetch latest 3 PUSHED news items
    const { data: newsData, error: newsError } = await supabase
      .from('recommended_articles')
      .select('*')
      .eq('type', 'News')
      .eq('is_pushed_to_client', true)  // Only fetch pushed articles
      .order('pulled_at', { ascending: false })
      .limit(3);

    if (newsError) throw new Error(newsError.message);

    // Fetch latest 3 PUSHED blog items
    const { data: blogData, error: blogError } = await supabase
      .from('recommended_articles')
      .select('*')
      .eq('type', 'Blog')
      .eq('is_pushed_to_client', true)  // Only fetch pushed articles
      .order('pulled_at', { ascending: false })
      .limit(3);

    if (blogError) throw new Error(blogError.message);

    const cacheData: CacheData = {
      news: newsData as RecommendedArticle[],
      blogs: blogData as RecommendedArticle[],
      lastUpdated: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    return cacheData;
  } catch (error) {
    console.error('Error fetching recommended content:', error);
    throw error;
  }
};


/**
 * Gets recommended content, using cache if available and valid, otherwise fetching fresh
 */
export const getRecommendedContent = async (): Promise<CacheData> => {
  const cached = getCachedRecommendedContent();
  if (cached) {
    return cached;
  }

  return await fetchAndCacheRecommendedContent();
};

