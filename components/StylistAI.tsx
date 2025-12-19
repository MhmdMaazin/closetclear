
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, User, Loader2, ArrowUp, Trash2 } from 'lucide-react';
import { generateStylistAdvice } from '../services/geminiService';
import { saveChatMessage, getChatHistory, deleteChatHistory, getCurrentUser } from '../services/appwrite';
import { ClothingItem } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface StylistAIProps {
  items: ClothingItem[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const StylistAI: React.FC<StylistAIProps> = ({ items }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load cached messages from localStorage
    const cached = localStorage.getItem('stylist_messages');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [{ role: 'model', text: "Hello! I'm your ClosetClear stylist. I can help you plan an outfit for an event, or identify pieces you haven't worn in a while. What's on your mind?" }];
      }
    }
    return [{ role: 'model', text: "Hello! I'm your ClosetClear stylist. I can help you plan an outfit for an event, or identify pieces you haven't worn in a while. What's on your mind?" }];
  });
  const [sessionId, setSessionId] = useState<string>(() => {
    // Get sessionId from localStorage or create new one
    const stored = localStorage.getItem('stylist_session_id');
    return stored || `session_${Date.now()}`;
  });
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cache messages to localStorage
  useEffect(() => {
    localStorage.setItem('stylist_messages', JSON.stringify(messages));
  }, [messages]);

  // Save sessionId to localStorage
  useEffect(() => {
    localStorage.setItem('stylist_session_id', sessionId);
  }, [sessionId]);

  // Load user and chat history on mount
  useEffect(() => {
    const loadUserAndHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.$id);
          const history = await getChatHistory(user.$id, sessionId);
          if (history.length > 0) {
            setMessages(history.map(msg => ({ role: msg.role as 'user' | 'model', text: msg.text })));
          }
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadUserAndHistory();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      // Save user message to database
      if (userId) {
        await saveChatMessage(userId, 'user', userMsg, sessionId);
      }

      // Pass the current history (messages) to the service for context
      const response = await generateStylistAdvice(userMsg, items, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);

      // Save AI response to database
      if (userId) {
        await saveChatMessage(userId, 'model', response, sessionId);
      }
    } catch (error) {
      const errorMsg = "I'm having trouble connecting right now. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Simple list detection
        const isListItem = line.trim().startsWith('-') || /^\d+\./.test(line.trim());
        
        return (
            <div key={i} className={`${isListItem ? 'pl-2' : ''} ${i < lines.length - 1 ? 'mb-1' : ''}`}>
                {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </div>
        );
    });
  };

  const suggestions = [
    "Outfit for a casual Friday?",
    "What goes with my green cargo pants?",
    "Date night outfit ideas",
    "Find items to sell"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen bg-slate-50 relative">
      {/* Header */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 flex items-center justify-between sticky top-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-serif">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Stylist
          </h2>
          <p className="text-xs font-medium text-slate-500 ml-7">Powered by AI</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <div className="hidden md:block">
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
               </span>
               Online
             </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-white ${
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-gradient-to-br from-emerald-400 to-teal-600'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
            </div>
            
            {/* Message Bubble */}
            <div className={`flex flex-col gap-1 min-w-[120px] max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm'
              }`}>
                {renderMessageText(msg.text)}
              </div>
              <span className="text-[10px] text-slate-400 px-1">
                {msg.role === 'user' ? 'You' : 'ClosetClear AI'}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-3xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
               <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-3 w-fit">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        {isLoadingHistory && (
          <div className="flex justify-center py-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                </div>
              </div>
              <p className="text-xs text-slate-400">Loading chat history...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200/60 pb-8 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Suggestions - Only show when idle or just starting */}
          {!isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="px-4 py-2 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-200 hover:border-indigo-200 rounded-full text-xs font-medium text-slate-600 hover:text-indigo-600 whitespace-nowrap transition-all duration-300"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          
          <div className="relative flex items-center group">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask for outfit advice, trends, or help..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUp className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400">
            AI can make mistakes. Check item availability.
          </p>
        </div>
      </div>

      {/* Clear History Confirmation */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear Chat History?"
        message="Are you sure you want to clear all chat messages? This action cannot be undone."
        confirmText="Yes, Clear"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={async () => {
          await deleteChatHistory(sessionId);
          const newSessionId = `session_${Date.now()}`;
          setSessionId(newSessionId);
          localStorage.setItem('stylist_session_id', newSessionId);
          setMessages([{ role: 'model', text: "Hello! I'm your ClosetClear stylist. I can help you plan an outfit for an event, or identify pieces you haven't worn in a while. What's on your mind?" }]);
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
