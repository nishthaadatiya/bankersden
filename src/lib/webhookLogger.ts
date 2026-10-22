export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  type: 'INCOMING_POST' | 'BOT_REPLY' | 'STATUS_UPDATE' | 'VERIFICATION_GET' | 'ERROR' | 'TEST_OUTBOUND';
  status: 'success' | 'error' | 'warning' | 'info';
  summary: string;
  sender?: string;
  recipient?: string;
  messageText?: string;
  messageId?: string;
  payload?: any;
  error?: any;
}

declare global {
  var __bankersden_webhook_logs__: WebhookLogEntry[] | undefined;
}

const MAX_LOGS = 200;

function getLogStore(): WebhookLogEntry[] {
  if (!global.__bankersden_webhook_logs__) {
    global.__bankersden_webhook_logs__ = [];
  }
  return global.__bankersden_webhook_logs__;
}

export function logWebhookEvent(entry: Omit<WebhookLogEntry, 'id' | 'timestamp'>): WebhookLogEntry {
  const store = getLogStore();
  const newEntry: WebhookLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  // Prepend so newest is first
  store.unshift(newEntry);

  if (store.length > MAX_LOGS) {
    store.length = MAX_LOGS;
  }

  return newEntry;
}

export function getWebhookLogs(limit: number = 100): WebhookLogEntry[] {
  const store = getLogStore();
  return store.slice(0, limit);
}

export function clearWebhookLogs(): void {
  if (global.__bankersden_webhook_logs__) {
    global.__bankersden_webhook_logs__ = [];
  }
}
