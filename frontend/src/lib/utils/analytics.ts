/**
 * CarbonTrack Analytics & Monitoring Module
 * Tracks page views, user interactions, wallet events, and transaction metrics.
 * Uses localStorage for persistence — no external dependencies.
 */

export interface AnalyticsEvent {
  id: string;
  category: 'page_view' | 'wallet' | 'transaction' | 'user_action' | 'error' | 'performance';
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface AppMetrics {
  totalPageViews: number;
  uniqueWalletConnections: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  avgPageLoadMs: number;
  errorCount: number;
  lastUpdated: number;
  walletAddresses: string[];
  eventLog: AnalyticsEvent[];
}

const STORAGE_KEY = 'carbontrack-analytics';
const MAX_EVENT_LOG = 200;

function getMetrics(): AppMetrics {
  if (typeof window === 'undefined') {
    return createDefaultMetrics();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppMetrics;
  } catch {
    // Ignore parse errors
  }
  return createDefaultMetrics();
}

function createDefaultMetrics(): AppMetrics {
  return {
    totalPageViews: 0,
    uniqueWalletConnections: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    avgPageLoadMs: 0,
    errorCount: 0,
    lastUpdated: Date.now(),
    walletAddresses: [],
    eventLog: [],
  };
}

function saveMetrics(metrics: AppMetrics): void {
  if (typeof window === 'undefined') return;
  try {
    metrics.lastUpdated = Date.now();
    // Trim event log to prevent unbounded growth
    if (metrics.eventLog.length > MAX_EVENT_LOG) {
      metrics.eventLog = metrics.eventLog.slice(-MAX_EVENT_LOG);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch {
    // Ignore storage errors
  }
}

function createEvent(
  category: AnalyticsEvent['category'],
  action: string,
  label?: string,
  value?: number,
  metadata?: Record<string, string | number | boolean>
): AnalyticsEvent {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    category,
    action,
    label,
    value,
    timestamp: Date.now(),
    metadata,
  };
}

// ─── Public API ──────────────────────────────────────────────────────

export const Analytics = {
  /** Track a page view */
  trackPageView(path: string): void {
    const metrics = getMetrics();
    const event = createEvent('page_view', 'view', path);
    metrics.totalPageViews++;
    metrics.eventLog.push(event);
    saveMetrics(metrics);
    console.debug(`[Analytics] Page view: ${path}`);
  },

  /** Track a wallet connection event */
  trackWalletConnect(address: string, mode: 'freighter' | 'demo'): void {
    const metrics = getMetrics();
    const event = createEvent('wallet', 'connect', address, undefined, { mode });
    if (!metrics.walletAddresses.includes(address)) {
      metrics.walletAddresses.push(address);
      metrics.uniqueWalletConnections++;
    }
    metrics.eventLog.push(event);
    saveMetrics(metrics);
    console.debug(`[Analytics] Wallet connected: ${address} (${mode})`);
  },

  /** Track a wallet disconnect */
  trackWalletDisconnect(address: string): void {
    const metrics = getMetrics();
    const event = createEvent('wallet', 'disconnect', address);
    metrics.eventLog.push(event);
    saveMetrics(metrics);
  },

  /** Track a transaction (issue, transfer, retire) */
  trackTransaction(
    type: 'issue' | 'transfer' | 'retire',
    status: 'success' | 'failed',
    amount?: number
  ): void {
    const metrics = getMetrics();
    const event = createEvent('transaction', type, status, amount);
    metrics.totalTransactions++;
    if (status === 'success') {
      metrics.successfulTransactions++;
    } else {
      metrics.failedTransactions++;
    }
    metrics.eventLog.push(event);
    saveMetrics(metrics);
    console.debug(`[Analytics] Transaction ${type}: ${status}${amount ? ` (${amount})` : ''}`);
  },

  /** Track a user action */
  trackAction(action: string, label?: string): void {
    const metrics = getMetrics();
    const event = createEvent('user_action', action, label);
    metrics.eventLog.push(event);
    saveMetrics(metrics);
  },

  /** Track an error */
  trackError(error: string, context?: string): void {
    const metrics = getMetrics();
    const event = createEvent('error', error, context);
    metrics.errorCount++;
    metrics.eventLog.push(event);
    saveMetrics(metrics);
    console.error(`[Monitor] Error tracked: ${error}`, context);
  },

  /** Track page load performance */
  trackPerformance(loadTimeMs: number): void {
    const metrics = getMetrics();
    const event = createEvent('performance', 'page_load', undefined, loadTimeMs);
    // Rolling average
    const totalLoads = metrics.eventLog.filter(
      (e) => e.category === 'performance' && e.action === 'page_load'
    ).length;
    metrics.avgPageLoadMs =
      totalLoads > 0
        ? (metrics.avgPageLoadMs * totalLoads + loadTimeMs) / (totalLoads + 1)
        : loadTimeMs;
    metrics.eventLog.push(event);
    saveMetrics(metrics);
  },

  /** Get current metrics snapshot */
  getMetrics(): AppMetrics {
    return getMetrics();
  },

  /** Reset all metrics */
  resetMetrics(): void {
    saveMetrics(createDefaultMetrics());
  },
};
