'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Bot,
  User,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Download,
  RefreshCw,
  Phone,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  Maximize2,
  X,
} from 'lucide-react';

interface WhatsAppMessage {
  _id?: string;
  messageId: string;
  direction: 'inbound' | 'outbound';
  sender?: 'user' | 'bot' | 'admin';
  type?: 'text' | 'image' | 'document' | 'audio' | 'video';
  text: string;
  mediaId?: string;
  mimeType?: string;
  filename?: string;
  caption?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
}

interface WhatsAppConversationSummary {
  _id: string;
  phoneNumber: string;
  contactName: string;
  lastMessageText: string;
  lastUserMessageAt: string;
  windowExpiresAt: string;
  status: 'active' | 'closed';
  isBotPaused: boolean;
  unreadAdminCount: number;
  step: string;
  isWindowOpen: boolean;
  hoursRemaining: string;
  leadId?: any;
}

interface FullConversation extends WhatsAppConversationSummary {
  messages: WhatsAppMessage[];
  enquiryData?: any;
}

export const AdminWhatsAppChats: React.FC = () => {
  const [conversations, setConversations] = useState<WhatsAppConversationSummary[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [activeConvo, setActiveConvo] = useState<FullConversation | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [pauseBotChecked, setPauseBotChecked] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  };

  // Fetch list of conversations
  const fetchConversations = useCallback(async (quiet: boolean = false) => {
    if (!quiet) setLoadingList(true);
    try {
      const res = await fetch('/api/admin/whatsapp/conversations', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
        // Auto-select first if none selected
        if (!selectedPhone && data.conversations.length > 0) {
          setSelectedPhone(data.conversations[0].phoneNumber);
        }
      }
    } catch (err) {
      console.error('Error fetching WhatsApp conversations:', err);
    } finally {
      if (!quiet) setLoadingList(false);
    }
  }, [selectedPhone]);

  // Fetch active conversation thread
  const fetchThread = useCallback(async (phone: string, quiet: boolean = false) => {
    if (!quiet) setLoadingThread(true);
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${phone}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setActiveConvo(data.conversation);
      }
    } catch (err) {
      console.error('Error fetching conversation thread:', err);
    } finally {
      if (!quiet) setLoadingThread(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // When selectedPhone changes, load thread
  useEffect(() => {
    if (selectedPhone) {
      fetchThread(selectedPhone);
    } else {
      setActiveConvo(null);
    }
  }, [selectedPhone, fetchThread]);

  // Polling every 4s for real-time messages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations(true);
      if (selectedPhone) {
        fetchThread(selectedPhone, true);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchConversations, fetchThread, selectedPhone]);

  // Scroll to bottom of message thread
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConvo?.messages]);

  // Send admin intervention reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedPhone || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${selectedPhone}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          text: adminReplyText.trim(),
          pauseBot: pauseBotChecked,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminReplyText('');
        await fetchThread(selectedPhone, true);
        await fetchConversations(true);
      } else {
        alert(`Failed to send WhatsApp message: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error sending message: ${err.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Toggle Bot Pause
  const handleToggleBotPause = async () => {
    if (!selectedPhone || !activeConvo) return;
    const newStatus = !activeConvo.isBotPaused;

    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${selectedPhone}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isBotPaused: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveConvo((prev) => (prev ? { ...prev, isBotPaused: newStatus } : null));
        fetchConversations(true);
      }
    } catch (err) {
      console.error('Error toggling bot status:', err);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      c.phoneNumber.toLowerCase().includes(q) ||
      c.contactName.toLowerCase().includes(q) ||
      c.lastMessageText.toLowerCase().includes(q)
    );
  });

  const formatMessageTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-[750px] flex flex-col">
      {/* Top Section Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[#25D366]">
            <MessageSquare className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">WhatsApp Live Customer Conversations</h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                {conversations.length} {conversations.length === 1 ? 'Customer' : 'Customers'}
              </span>
            </div>
            <p className="text-xs text-emerald-100/80">
              Monitor customer chats, review submitted documents, and intervene with live human replies
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            fetchConversations();
            if (selectedPhone) fetchThread(selectedPhone);
          }}
          className="p-2 bg-emerald-900/60 hover:bg-emerald-700/60 text-emerald-100 rounded-lg border border-emerald-500/30 transition flex items-center gap-1.5 text-xs"
          title="Refresh active chats"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Main Split Panel (Left: Chat list, Right: Chat thread) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversations List */}
        <div className="w-80 md:w-96 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* Search box */}
          <div className="p-3 border-b border-gray-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by phone, name, or text..."
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loadingList && conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-2" />
                Loading WhatsApp chats...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                No WhatsApp conversations found.
              </div>
            ) : (
              filteredConversations.map((convo) => {
                const isSelected = selectedPhone === convo.phoneNumber;

                return (
                  <div
                    key={convo._id || convo.phoneNumber}
                    onClick={() => setSelectedPhone(convo.phoneNumber)}
                    className={`p-3.5 cursor-pointer transition-colors relative flex items-start gap-3 ${isSelected
                        ? 'bg-emerald-50/90 border-l-4 border-emerald-600'
                        : 'hover:bg-gray-100/80 bg-white'
                      }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
                      {convo.contactName ? convo.contactName.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-xs text-gray-900 truncate">
                          {convo.contactName || `+${convo.phoneNumber}`}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">
                          {formatRelativeTime(convo.lastUserMessageAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[10px] text-gray-500 truncate">
                          +{convo.phoneNumber}
                        </span>

                        {convo.isWindowOpen ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="24h Service Window Active" />
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-gray-300" title="24h Window Closed" />
                        )}

                        {convo.isBotPaused && (
                          <span className="text-[9px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                            Paused
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 truncate leading-snug">
                        {convo.lastMessageText || 'No messages yet'}
                      </p>
                    </div>

                    {convo.unreadAdminCount > 0 && (
                      <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 self-center">
                        {convo.unreadAdminCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Panel: Conversation Thread & Admin Intervention */}
        <div className="flex-1 flex flex-col bg-[#efeae2]/40 relative">
          {!activeConvo ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Select a Conversation</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Choose a customer from the left to view the full WhatsApp chat history, inspect shared images/PDFs, and reply directly.
              </p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="p-3.5 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
                    {activeConvo.contactName ? activeConvo.contactName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-gray-900">
                        {activeConvo.contactName || 'WhatsApp Customer'}
                      </h3>
                      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        +{activeConvo.phoneNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                      <span>Flow Step: <strong className="text-gray-700">{activeConvo.step || 'INIT'}</strong></span>
                      <span>•</span>
                      {activeConvo.isWindowOpen ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          24h Window: {activeConvo.hoursRemaining}h left
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          24h Window Expired
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls: Bot toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleBotPause}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeConvo.isBotPaused
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                      }`}
                    title={activeConvo.isBotPaused ? 'Click to resume automated bot' : 'Click to pause bot for human chat'}
                  >
                    {activeConvo.isBotPaused ? (
                      <>
                        <PauseCircle className="w-4 h-4 text-amber-700" />
                        <span>Bot Paused (Human Takeover)</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-4 h-4 text-emerald-700" />
                        <span>Bot Active</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Message Thread Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingThread && (!activeConvo.messages || activeConvo.messages.length === 0) ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-2" />
                    Loading messages...
                  </div>
                ) : !activeConvo.messages || activeConvo.messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No messages recorded in this conversation thread yet.
                  </div>
                ) : (
                  activeConvo.messages.map((msg, index) => {
                    const isInbound = msg.direction === 'inbound';
                    const isAdmin = msg.sender === 'admin';
                    const isBot = msg.sender === 'bot' || (!isAdmin && !isInbound);

                    const isImage = msg.type === 'image' || msg.mimeType?.startsWith('image/');
                    const isDocument = msg.type === 'document' || msg.mimeType?.includes('pdf') || (msg.filename && msg.filename.endsWith('.pdf'));

                    const mediaUrl = msg.mediaId ? `/api/whatsapp/media/${msg.mediaId}` : null;

                    return (
                      <div
                        key={msg._id || msg.messageId || index}
                        className={`flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm text-xs relative space-y-1.5 ${isInbound
                              ? 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
                              : isAdmin
                                ? 'bg-blue-600 text-white rounded-tr-sm'
                                : 'bg-[#d9fdd3] text-gray-900 rounded-tr-sm border border-[#c1ebb9]'
                            }`}
                        >
                          {/* Sender badge */}
                          <div className="flex items-center justify-between gap-3 text-[10px] font-semibold opacity-80 mb-0.5">
                            {isInbound ? (
                              <span className="text-gray-600 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {activeConvo.contactName || 'Customer'}
                              </span>
                            ) : isAdmin ? (
                              <span className="text-blue-100 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Human Advisor (Admin)
                              </span>
                            ) : (
                              <span className="text-emerald-800 flex items-center gap-1">
                                <Bot className="w-3 h-3" />
                                AI Assistant
                              </span>
                            )}
                          </div>

                          {/* Media: Image Rendering */}
                          {isImage && mediaUrl && (
                            <div className="rounded-xl overflow-hidden border border-black/10 bg-black/5 relative group cursor-pointer max-w-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={mediaUrl}
                                alt={msg.caption || 'Customer submitted image'}
                                className="w-full h-auto max-h-60 object-contain hover:opacity-95 transition"
                                onClick={() => setPreviewMediaUrl(mediaUrl)}
                              />
                              <div
                                onClick={() => setPreviewMediaUrl(mediaUrl)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                                title="Expand image"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          )}

                          {/* Media: PDF / Document Rendering */}
                          {isDocument && (
                            <div
                              className={`p-3 rounded-xl border flex items-center gap-3 ${isAdmin
                                  ? 'bg-blue-700/60 border-blue-500/50 text-white'
                                  : 'bg-white border-gray-200 text-gray-900 shadow-sm'
                                }`}
                            >
                              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                PDF
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-xs truncate">
                                  {msg.filename || 'Loan_Document.pdf'}
                                </p>
                                <p className="text-[10px] opacity-70">
                                  {msg.mimeType || 'application/pdf'}
                                </p>
                              </div>
                              {mediaUrl && (
                                <a
                                  href={mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={msg.filename || 'Document.pdf'}
                                  className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-semibold ${isAdmin
                                      ? 'bg-white text-blue-700 hover:bg-blue-50'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    }`}
                                  title="View or download PDF"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Text Body */}
                          {msg.text && (
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {msg.text}
                            </div>
                          )}

                          {/* Bottom timestamp and delivery status */}
                          <div
                            className={`flex items-center justify-end gap-1 text-[10px] pt-0.5 ${isAdmin ? 'text-blue-100' : 'text-gray-500'
                              }`}
                          >
                            <span>{formatMessageTime(msg.timestamp)}</span>
                            {!isInbound && (
                              <span title={msg.status}>
                                {msg.status === 'read' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
                                ) : msg.status === 'delivered' ? (
                                  <CheckCheck className="w-3.5 h-3.5 text-gray-400 stroke-[2.5]" />
                                ) : msg.status === 'failed' ? (
                                  <AlertCircle className="w-3 h-3 text-rose-500" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-gray-400" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Admin Intervention Input Area */}
              <div className="p-3 bg-white border-t border-gray-200">
                {!activeConvo.isWindowOpen && (
                  <div className="mb-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span>
                      Notice: The 24-hour service window for this customer has expired. Standard freeform messages may fail unless the customer messages again.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSendAdminReply} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pauseBotChecked}
                        onChange={(e) => setPauseBotChecked(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                      />
                      <span>Keep bot paused during human takeover</span>
                    </label>

                    <span className="text-[10px] text-gray-400">
                      Replies send instantly to customer&apos;s WhatsApp
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder={`Reply to ${activeConvo.contactName || activeConvo.phoneNumber} on WhatsApp...`}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />

                    <button
                      type="submit"
                      disabled={sendingReply || !adminReplyText.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {sendingReply ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full Image View */}
      {previewMediaUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewMediaUrl}
              alt="Enlarged customer document"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
