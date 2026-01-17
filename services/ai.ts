
// Service to interact with DeepSeek LLM
import { Article, GeneratedLesson } from '../types';

const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[`VITE_${key}`] || (import.meta as any).env[key];
  }
  return '';
};

const DEEPSEEK_API_KEY = getEnv('DEEPSEEK_API_KEY');
const API_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = "You are an expert English tutor API. You must strictly output valid JSON only. No markdown formatting, no conversational text.";

export const generateReadingLesson = async (level: string, topic?: string): Promise<GeneratedLesson> => {
  if (!DEEPSEEK_API_KEY) {
    console.error("DeepSeek API Key is missing.");
    return {
      article: {
        id: 'fallback-no-key',
        title: "API Key Missing",
        readTime: "1 MIN READ",
        type: "article",
        content: [
          "Please configure your .env file with a valid DEEPSEEK_API_KEY to generate real content.",
          "This is a placeholder lesson."
        ]
      },
      questions: []
    };
  }

  const topics = [
    "The Future of Artificial Intelligence",
    "Sustainable Living and Minimalist Lifestyles",
    "The History of Coffee Culture",
    "Space Exploration: Mars and Beyond",
    "The Psychology of Happiness",
    "Remote Work: Benefits and Challenges",
    "The Impact of Social Media on Communication",
    "Underwater Ecosystems and Coral Reefs",
    "Traditional vs Modern Education Systems",
    "The Rise of Electric Vehicles"
  ];

  const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];

  const prompt = `
    Create an English reading lesson for ${level} level students.
    Topic: ${selectedTopic}.
    Ensure the article is unique and creative. Do not repeat previous content.
    
    Output strictly valid JSON with this structure:
    {
      "article": {
        "id": "gen-${Date.now()}",
        "title": "String",
        "readTime": "String (e.g. 5 MIN READ)",
        "content": ["Paragraph 1", "Paragraph 2", "Paragraph 3"],
        "type": "article"
      },
      "questions": [
        {
          "id": 1,
          "text": "Question text?",
          "correctId": 2,
          "explanation": "Why the answer is correct",
          "options": [
            {"id": 1, "label": "A", "text": "Option 1"},
            {"id": 2, "label": "B", "text": "Option 2"},
            {"id": 3, "label": "C", "text": "Option 3"},
            {"id": 4, "label": "D", "text": "Option 4"}
          ]
        },
        {
          "id": 2,
          "text": "Question 2 text?",
          "correctId": 1,
          "explanation": "Explanation 2",
          "options": [...]
        }
      ]
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 1.1 // Slightly creative
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    let contentString = data.choices[0].message.content;

    // Clean up if markdown code blocks are returned
    contentString = contentString.replace(/```json/g, '').replace(/```/g, '');

    return JSON.parse(contentString);
  } catch (error) {
    console.error("AI Generation failed", error);
    // Fallback data if API fails or key is missing
    return {
      article: {
        id: 'fallback',
        title: "The Evolution of Language (Fallback)",
        readTime: "3 MIN READ",
        type: "article",
        content: [
          "Language is a dynamic and ever-evolving system of communication. Over centuries, English has transformed through cultural exchange, technological advancement, and social shifts.",
          "Modern English continues to integrate new terminology from the digital age while maintaining its foundational Germanic and Latin roots."
        ]
      },
      questions: [
        {
          "id": 1,
          "text": "What is the main driver of change mentioned?",
          "correctId": 1,
          "explanation": "The text mentions cultural exchange and technology.",
          "options": [
            { id: 1, label: 'A', text: 'Cultural exchange' },
            { id: 2, label: 'B', text: 'Static rules' },
            { id: 3, label: 'C', text: 'Isolation' },
            { id: 4, label: 'D', text: 'None of above' }
          ]
        }
      ]
    };
  }
};

export const generateRecommendations = async (level: string): Promise<Article[]> => {
  if (!DEEPSEEK_API_KEY) return [];

  const prompt = `
    Generate 5 recommended English reading content items for a ${level} student.
    Mix of 'News' and 'Blog'.
    
    Output strictly valid JSON array of objects:
    [
      {
        "id": "String",
        "title": "String",
        "level": "String (e.g. B2 Intermediate)",
        "time": "String (e.g. 5 MIN READ)",
        "snippet": "Short description",
        "type": "News"
      }
    ]
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    let contentString = data.choices[0].message.content;
    contentString = contentString.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(contentString);
  } catch (error) {
    console.error("Recommendation Generation failed", error);
    return []; // Return empty to let frontend handle empty state or show static
  }
};

export const getEducationNews = async (): Promise<Article[]> => {
  if (!DEEPSEEK_API_KEY) return [];

  const systemMessage = {
    role: "system",
    content: "You are a helpful education news/blogs assistant, use web search function to answer user's questions. OUTPUT VALID JSON ARRAY ONLY."
  };
  const userMessage = {
    role: "user",
    content: "please send me a list link to top 3 news and top 3 blogs about elementary/middle/high school education. Format as JSON array of objects with structure: { title, snippet, type: 'News'|'Blog', level: 'General', time: '5 MIN READ', url: 'https://...' }"
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          systemMessage,
          userMessage
        ]
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    let contentString = data.choices[0].message.content;
    contentString = contentString.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(contentString);
  } catch (error) {
    console.error("News Generation failed", error);
    return [];
  }

};

export const sendChatMessage = async (history: { role: 'user' | 'assistant', content: string }[]): Promise<string> => {
  if (!DEEPSEEK_API_KEY) return "Sorry, I can't connect to the AI right now. Please check your API key.";

  const systemMessage = {
    role: "system",
    content: "You are a helpful AI Living Tutor for students. You can ONLY discuss topics related to elementary, middle, and high school education (subjects, study tips, homework help, school life). If the user asks about anything else, politely decline and steer the conversation back to education."
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          systemMessage,
          ...history
        ]
      })
    });

    if (!response.ok) return "I'm having trouble thinking right now. Please try again.";

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Chat Error", error);
    return "Something went wrong. Please try again later.";
  }
};
