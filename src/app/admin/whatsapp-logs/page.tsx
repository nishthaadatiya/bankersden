'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Trash2, Send, CheckCircle2, AlertTriangle, XCircle, Info, ShieldCheck } from 'lucide-react';

interface WebhookLog {
  id: string;
  timestamp: string;
  type: string;
  status: 'success' | 'error' | 'warning' | 'info';
  summary: string;
  sender?: string;
  recipient?: string;
  messageText?: string;
  messageId?: string;
  payload?: any;
  error?: any;
}

export default function AdminWhatsAppLogsPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/whatsapp/logs?limit=100');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setConfig(data.config || null);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all webhook logs?')) return;
    try {
      await fetch('/api/whatsapp/logs', { method: 'DELETE' });
      fetchLogs();
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !message) return;
    setSending(true);
    setActionStatus(null);
    try {
      const res = await fetch('/api/whatsapp/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_test', phone, message }),
      });
      const data = await res.json();
      if (data.success) {
        setActionStatus('Message sent successfully!');
        setMessage('');
        fetchLogs();
      } else {
        setActionStatus(`Error: ${data.error || 'Failed to send'}`);
      }
    } catch (err: any) {
      setActionStatus(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                WhatsApp Webhook Debug Logs
              </h1>
              <p className="text-xs text-slate-400">Real-time webhook and Cloud API activity inspector</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                autoRefresh
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Auto-refresh: {autoRefresh ? 'ON (3s)' : 'OFF'}
            </button>
            <button
              onClick={fetchLogs}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition"
              title="Refresh now"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearLogs}
              className="p-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 rounded-lg transition"
              title="Clear logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cloud API Config Info */}
        {config && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs">
            <div>
              <div className="text-slate-400">API Status</div>
              <div className="font-semibold text-emerald-400 mt-0.5">
                {config.isReady ? 'Configured & Ready' : 'Credentials Missing'}
              </div>
            </div>
            <div>
              <div className="text-slate-400">Phone Number ID</div>
              <div className="font-mono text-slate-200 mt-0.5 truncate">{config.phoneNumberId || 'None'}</div>
            </div>
            <div>
              <div className="text-slate-400">Admin Recipient</div>
              <div className="font-mono text-slate-200 mt-0.5">{config.adminWhatsApp || 'None'}</div>
            </div>
            <div>
              <div className="text-slate-400">Server Time</div>
              <div className="font-mono text-slate-400 mt-0.5">
                {new Date(config.serverTime).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* Test Outbound Dispatch */}
        <form
          onSubmit={handleSendTest}
          className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3"
        >
          <div className="text-sm font-semibold text-slate-200">Send Direct Test WhatsApp Message</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="e.g. 918887941939"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Message text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 md:col-span-1"
            />
            <button
              type="submit"
              disabled={sending || !phone || !message}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send Test'}
            </button>
          </div>
          {actionStatus && (
            <div className="text-xs font-mono text-slate-300 mt-1">{actionStatus}</div>
          )}
        </form>

        {/* Logs Stream */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300">Live Webhook Activity ({logs.length})</h2>
            {loading && <span className="text-xs text-slate-400">Loading...</span>}
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No webhook events logged yet. Send a WhatsApp message to test incoming activity!
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 font-mono text-xs">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className="font-semibold text-slate-200">{log.type}</span>
                      {log.sender && (
                        <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[11px]">
                          from: {log.sender}
                        </span>
                      )}
                      {log.recipient && (
                        <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[11px]">
                          to: {log.recipient}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-slate-300 break-words">{log.summary}</p>

                  {log.messageText && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded p-2 text-slate-200 text-xs break-words">
                      &quot;{log.messageText}&quot;
                    </div>
                  )}

                  {log.error && (
                    <pre className="text-red-400 text-[11px] overflow-x-auto whitespace-pre-wrap bg-red-950/20 p-2 rounded border border-red-900/30">
                      {typeof log.error === 'string' ? log.error : JSON.stringify(log.error, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
