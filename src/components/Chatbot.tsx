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
  action?: {
    type: 'whatsapp';
    label: string;
    url: string;
  };
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
  "💬 Talk to Banker",
];

const OFFICIAL_WHATSAPP_NUMBER = '919834784681';
const OFFICIAL_WHATSAPP_URL = 'https://wa.me/919834784681?text=Hi';

const isBankerQuery = (text: string): boolean => {
  const q = text.trim().toLowerCase();
  const keywords = [
    'banker',
    'talk to banker',
    'speak to banker',
    'talk to human',
    'speak with human',
    'human',
    'agent',
    'advisor',
    'expert',
    'whatsapp',
    'call',
    'contact',
    'phone',
    'mobile',
    'number',
    'representative',
    'talk to someone',
    'speak to someone',
  ];
  return keywords.some((k) => q.includes(k));
};

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

    // Check if user is asking to talk to a banker / human
    if (isBankerQuery(text)) {
      const whatsappUrl = OFFICIAL_WHATSAPP_URL;

      // Open WhatsApp in new tab immediately to +91 98347 84681 with text=Hi
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      const bankerModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Connecting you to our senior loan advisor on WhatsApp (+91 98347 84681)! 🚀\n\nIf WhatsApp didn't open automatically, click the button below to start your conversation with **"Hi"**:`,
        action: {
          type: 'whatsapp',
          label: 'Chat on WhatsApp (+91 98347 84681)',
          url: whatsappUrl,
        },
      };

      setMessages((prev) => [...prev, bankerModelMessage]);
      setIsLoading(false);

      // Record in background session without blocking
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          sessionId: sessionId.current,
        }),
      }).catch((err) => console.warn('Background chat sync:', err));

      return;
    }

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
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#FF6B35] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-a:text-blue-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => {
                          const isWhatsApp = props.href?.includes('wa.me');
                          if (isWhatsApp) {
                            return (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 my-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg shadow transition-all no-underline"
                              >
                                <span>💬</span>
                                <span>{props.children}</span>
                              </a>
                            );
                          }
                          return (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            />
                          );
                        },
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>

                  {msg.action && msg.action.type === 'whatsapp' && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <a
                        href={msg.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 no-underline"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>{msg.action.label}</span>
                      </a>
                    </div>
                  )}
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
