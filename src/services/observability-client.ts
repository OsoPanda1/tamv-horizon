// TAMV Services - Observability Client
// Sistema de monitoreo y logging para el ecosistema

import { supabase } from '@/integrations/supabase/client';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type EventDomain = 'auth' | 'social' | 'economy' | 'xr' | 'isabella' | 'system';

export interface LogEvent {
  level: LogLevel;
  module: string;
  eventType: string;
  message?: string;
  metadata?: Record<string, unknown>;
  domain?: EventDomain;
  userId?: string;
  sessionId?: string;
  latencyMs?: number;
  errorCode?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
  tags?: Record<string, string>;
}

class ObservabilityClient {
  private sessionId: string;
  private userId: string | null = null;
  private buffer: LogEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }

  private generateSessionId(): string {
    return `ses_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Set the current user ID for attribution
   */
  setUserId(userId: string | null): void {
    this.userId = userId;
  }

  /**
   * Log an event
   */
  log(event: LogEvent): void {
    const enrichedEvent: LogEvent = {
      ...event,
      userId: event.userId || this.userId || undefined,
      sessionId: event.sessionId || this.sessionId
    };

    this.buffer.push(enrichedEvent);

    // Immediately flush errors
    if (event.level === 'error') {
      this.flush();
    }

    // Console output in development
    if (import.meta.env.DEV) {
      const consoleMethod = event.level === 'error' ? 'error' : 
                           event.level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${event.module}] ${event.eventType}:`, event.metadata);
    }
  }

  /**
   * Log debug message
   */
  debug(module: string, eventType: string, metadata?: Record<string, unknown>): void {
    this.log({ level: 'debug', module, eventType, metadata });
  }

  /**
   * Log info message
   */
  info(module: string, eventType: string, metadata?: Record<string, unknown>): void {
    this.log({ level: 'info', module, eventType, metadata });
  }

  /**
   * Log warning message
   */
  warn(module: string, eventType: string, metadata?: Record<string, unknown>): void {
    this.log({ level: 'warn', module, eventType, metadata });
  }

  /**
   * Log error message
   */
  error(module: string, eventType: string, error?: Error | unknown, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'error',
      module,
      eventType,
      errorCode: error instanceof Error ? error.name : 'UNKNOWN',
      metadata: {
        ...metadata,
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    });
  }

  /**
   * Track a performance metric
   */
  metric(metric: PerformanceMetric): void {
    this.log({
      level: 'info',
      module: 'performance',
      eventType: 'metric',
      metadata: {
        metricName: metric.name,
        value: metric.value,
        unit: metric.unit,
        tags: metric.tags
      },
      latencyMs: metric.unit === 'ms' ? metric.value : undefined
    });
  }

  /**
   * Start a timer for measuring latency
   */
  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.metric({
        name,
        value: Math.round(duration),
        unit: 'ms'
      });
    };
  }

  /**
   * Track a page view
   */
  pageView(pageName: string, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'info',
      module: 'navigation',
      eventType: 'page_view',
      domain: 'system',
      metadata: {
        pageName,
        url: window.location.pathname,
        referrer: document.referrer,
        ...metadata
      }
    });
  }

  /**
   * Track a user action
   */
  trackAction(action: string, category: string, metadata?: Record<string, unknown>): void {
    this.log({
      level: 'info',
      module: 'analytics',
      eventType: 'user_action',
      metadata: {
        action,
        category,
        ...metadata
      }
    });
  }

  /**
   * Flush buffered events to backend
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    try {
      // Send to Supabase bookpi_events table
      const formattedEvents = events.map(e => ({
        event_type: e.eventType,
        module: e.module,
        level: e.level || null,
        domain: e.domain || null,
        user_id: e.userId || null,
        session_id: e.sessionId || null,
        metadata: (e.metadata || null) as Record<string, never> | null,
        latency_ms: e.latencyMs || null,
        error_code: e.errorCode || null
      }));

      const { error } = await supabase
        .from('bookpi_events')
        .insert(formattedEvents);

      if (error) {
        console.error('[Observability] Failed to flush events:', error);
        // Re-add events to buffer on failure
        this.buffer = [...events, ...this.buffer];
      }
    } catch (err) {
      console.error('[Observability] Flush error:', err);
      // Re-add events to buffer
      this.buffer = [...events, ...this.buffer];
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Singleton instance
export const observability = new ObservabilityClient();

// Convenience exports
export const logDebug = observability.debug.bind(observability);
export const logInfo = observability.info.bind(observability);
export const logWarn = observability.warn.bind(observability);
export const logError = observability.error.bind(observability);
export const trackMetric = observability.metric.bind(observability);
export const trackPageView = observability.pageView.bind(observability);
export const trackAction = observability.trackAction.bind(observability);
export const startTimer = observability.startTimer.bind(observability);
