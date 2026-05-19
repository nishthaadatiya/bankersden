"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

const INITIAL_MESSAGE: Message = {
  id: 'msg-initial',
  role: 'model',
  text: 'Hi! 👋 Welcome to BankersDen. I can help you find the best loan for your needs. What are you looking for today?',
};

const QUICK_REPLIES = [
  "Check Loan Eligibility",
  "Interest Rates",
  "Documents Required",
  "Talk to Banker",
];

// Generate a stable session ID per browser tab (resets on full page reload)
function generateSessionId(): string {
  const key = 'bd_chat_session';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sessionId = useRef<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on client only
  useEffect(() => {
    sessionId.current = generateSessionId();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          sessionId: sessionId.current,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I am having trouble connecting right now. Please try again later or contact support.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shrink-0 border-2 border-white/40">
                <Image
                  src="/chatbot-icon.png"
                  alt="Leo"
                  width={90}
                  height={90}
                  className="w-[90px] h-[90px] object-cover"
                  style={{ marginTop: '-4px', marginLeft: '-10px' }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Leo — BankersDen Assistant</h3>
                <p className="text-xs text-orange-100">🟢 Online | Replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user'
                      ? 'bg-[#FF6B35] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                    }`}
                >
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-a:text-blue-600">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {!isLoading && messages[messages.length - 1].role === 'model' && (
              <div className="flex flex-wrap gap-2 mt-4">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="text-xs bg-white border border-orange-200 text-[#FF6B35] hover:bg-orange-50 px-3 py-1.5 rounded-full transition-colors shadow-sm font-medium"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF6B35]" />
                  <span className="text-gray-500 text-xs">Leo is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Leo anything..."
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-200 rounded-full px-4 py-2.5 text-sm transition-all outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white rounded-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-md"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Mascot + Speech Bubble */}
      {!isOpen && (
        <div className="flex flex-col items-end gap-2">
          {/* Speech bubble */}
          <div className="relative bg-white rounded-2xl rounded-br-none shadow-xl border border-orange-100 px-4 py-3 max-w-[220px]">
            <span className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-orange-100 rotate-45" />
            <p className="text-xs font-semibold text-gray-800 leading-snug">
              👋 Hi! I&apos;m <span className="text-[#FF6B35]">Leo</span>, your BankersDen guide.
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">How can I assist you today?</p>
          </div>

          {/* Lion button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-20 h-20 transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'transparent' }}
            aria-label="Open chat with Leo"
          >
            <span className="absolute inset-1 rounded-full bg-[#FF6B35]/20 animate-ping" />
            <Image
              src="/chatbot-icon.png"
              alt="Chat with Leo"
              width={80}
              height={80}
              className="w-20 h-20 object-contain drop-shadow-2xl"
              style={{ mixBlendMode: 'multiply' }}
            />
          </button>
        </div>
      )}
    </div>
  );
}
