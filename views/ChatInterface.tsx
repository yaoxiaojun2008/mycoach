import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../types';
import { sendChatMessage } from '../services/ai';

import { supabase } from '../services/supabaseClient';

interface ChatInterfaceProps {
  onNavigate: (view: ViewState) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState("friend");

  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      let name = "friend";
      if (user && user.email) {
        // Simple logic to extract name from email or metadata
        name = user.user_metadata?.full_name || user.email.split('@')[0];
      }
      setUserName(name);
      setMessages([
        { id: 1, text: `Hi ${name}! Ready to practice your conversation skills today?`, sender: 'ai' }
      ]);
    };
    initChat();
  }, []);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newUserMsg: Message = { id: Date.now(), text: userText, sender: 'user' };

    // Optimistically update UI
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Prepare history for API
    // Convert current messages to AI format, exclude the very new one we just added manually to state (it's in userText)
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: m.text
    }));
    // Add current message
    history.push({ role: 'user', content: userText });

    try {
      const aiResponseText = await sendChatMessage(history);
      const aiMsg: Message = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = { id: Date.now() + 1, text: "Sorry, I had trouble connecting. Please try again.", sender: 'ai' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 gap-3 max-w-md mx-auto w-full">
          <div onClick={() => onNavigate('home')} className="flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span className="text-sm font-medium">Back</span>
          </div>
          <div className="flex-1 flex flex-col items-center pr-10">
            <h2 className="text-lg font-bold leading-tight">Live AI Tutor</h2>
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-slate-500">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
              ? 'bg-primary text-white rounded-br-none'
              : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-bl-none'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-none p-4 flex gap-1 items-center">
              <span className="size-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="size-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="size-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 p-3 safe-area-bottom">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">mic</span>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-slate-200 dark:bg-[#1e232e] border-none rounded-full py-3 px-4 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleSend}
            className={`p-3 rounded-full transition-all ${inputValue.trim() ? 'bg-primary text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};