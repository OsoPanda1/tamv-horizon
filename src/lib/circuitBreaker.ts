// ============= TAMV Circuit Breaker & Backpressure System =============
// Production-ready resilience patterns for low latency and cascading failure prevention

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;      // Number of failures before opening
  successThreshold: number;       // Successes needed in half-open to close
  timeout: number;                // ms to wait before half-open
  resetTimeout: number;           // ms before resetting failure count
  maxConcurrent: number;          // Max concurrent requests (backpressure)
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  totalRequests: number;
  rejectedRequests: number;
  currentConcurrent: number;
}

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private successes = 0;
  private lastFailure: Date | null = null;
  private lastSuccess: Date | null = null;
  private lastStateChange = Date.now();
  private totalRequests = 0;
  private rejectedRequests = 0;
  private currentConcurrent = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalRequests++;

    // Check backpressure
    if (this.currentConcurrent >= this.config.maxConcurrent) {
      this.rejectedRequests++;
      throw new CircuitBreakerError(
        `Backpressure: max concurrent requests (${this.config.maxConcurrent}) exceeded for ${this.config.name}`,
        'BACKPRESSURE'
      );
    }

    // Check circuit state
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastStateChange >= this.config.timeout) {
        this.transitionTo('HALF_OPEN');
      } else {
        this.rejectedRequests++;
        throw new CircuitBreakerError(
          `Circuit OPEN for ${this.config.name}. Retry after ${Math.ceil((this.config.timeout - (Date.now() - this.lastStateChange)) / 1000)}s`,
          'CIRCUIT_OPEN'
        );
      }
    }

    this.currentConcurrent++;

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    } finally {
      this.currentConcurrent--;
    }
  }

  private onSuccess(): void {
    this.successes++;
    this.lastSuccess = new Date();
    
    if (this.state === 'HALF_OPEN') {
      if (this.successes >= this.config.successThreshold) {
        this.transitionTo('CLOSED');
      }
    } else if (this.state === 'CLOSED') {
      // Reset failure count after successful request
      if (Date.now() - this.lastStateChange > this.config.resetTimeout) {
        this.failures = 0;
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = new Date();
    
    if (this.state === 'HALF_OPEN') {
      this.transitionTo('OPEN');
    } else if (this.state === 'CLOSED') {
      if (this.failures >= this.config.failureThreshold) {
        this.transitionTo('OPEN');
      }
    }
  }

  private transitionTo(newState: CircuitState): void {
    console.log(`[CircuitBreaker:${this.config.name}] ${this.state} -> ${newState}`);
    this.state = newState;
    this.lastStateChange = Date.now();
    
    if (newState === 'CLOSED') {
      this.failures = 0;
      this.successes = 0;
    } else if (newState === 'HALF_OPEN') {
      this.successes = 0;
    }
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailure: this.lastFailure,
      lastSuccess: this.lastSuccess,
      totalRequests: this.totalRequests,
      rejectedRequests: this.rejectedRequests,
      currentConcurrent: this.currentConcurrent
    };
  }

  forceOpen(): void {
    this.transitionTo('OPEN');
  }

  forceClose(): void {
    this.transitionTo('CLOSED');
  }
}

export class CircuitBreakerError extends Error {
  constructor(message: string, public code: 'CIRCUIT_OPEN' | 'BACKPRESSURE') {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

// ============= Queue with Backpressure =============
interface QueueItem<T> {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  data: T;
  timestamp: number;
  retries: number;
}

export class BackpressureQueue<T> {
  private queue: QueueItem<T>[] = [];
  private processing = false;
  private maxSize: number;
  private maxRetries: number;
  private processDelay: number;

  constructor(config: { maxSize: number; maxRetries: number; processDelay: number }) {
    this.maxSize = config.maxSize;
    this.maxRetries = config.maxRetries;
    this.processDelay = config.processDelay;
  }

  enqueue(item: Omit<QueueItem<T>, 'timestamp' | 'retries'>): boolean {
    if (this.queue.length >= this.maxSize) {
      // Shed load: remove lowest priority items
      const lowPriorityIndex = this.queue.findIndex(i => i.priority === 'LOW');
      if (lowPriorityIndex !== -1) {
        this.queue.splice(lowPriorityIndex, 1);
        console.log(`[BackpressureQueue] Shed low priority item to make room`);
      } else {
        console.warn(`[BackpressureQueue] Queue full, rejecting item ${item.id}`);
        return false;
      }
    }

    const newItem: QueueItem<T> = {
      ...item,
      timestamp: Date.now(),
      retries: 0
    };

    // Insert by priority
    const priorityOrder = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
    const insertIndex = this.queue.findIndex(
      i => priorityOrder[i.priority] > priorityOrder[newItem.priority]
    );

    if (insertIndex === -1) {
      this.queue.push(newItem);
    } else {
      this.queue.splice(insertIndex, 0, newItem);
    }

    return true;
  }

  async process(handler: (item: T) => Promise<void>): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      
      try {
        await handler(item.data);
      } catch (error) {
        item.retries++;
        if (item.retries < this.maxRetries) {
          // Re-queue with exponential backoff
          setTimeout(() => this.enqueue(item), Math.pow(2, item.retries) * 1000);
        } else {
          console.error(`[BackpressureQueue] Max retries exceeded for ${item.id}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, this.processDelay));
    }

    this.processing = false;
  }

  getSize(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

// ============= Global Circuit Breakers Registry =============
const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker({
      name,
      failureThreshold: config?.failureThreshold ?? 5,
      successThreshold: config?.successThreshold ?? 2,
      timeout: config?.timeout ?? 30000,
      resetTimeout: config?.resetTimeout ?? 60000,
      maxConcurrent: config?.maxConcurrent ?? 10
    }));
  }
  return circuitBreakers.get(name)!;
}

// Pre-configured circuit breakers for TAMV services
export const TAMV_CIRCUITS = {
  isabella: () => getCircuitBreaker('isabella-ai', { 
    failureThreshold: 3, 
    timeout: 15000, 
    maxConcurrent: 5 
  }),
  payments: () => getCircuitBreaker('payments', { 
    failureThreshold: 2, 
    timeout: 60000, 
    maxConcurrent: 3 
  }),
  media: () => getCircuitBreaker('media-upload', { 
    failureThreshold: 5, 
    timeout: 20000, 
    maxConcurrent: 10 
  }),
  recommendations: () => getCircuitBreaker('recommendations', { 
    failureThreshold: 5, 
    timeout: 10000, 
    maxConcurrent: 20 
  }),
  realtime: () => getCircuitBreaker('realtime', { 
    failureThreshold: 3, 
    timeout: 5000, 
    maxConcurrent: 50 
  })
};

// ============= System Health Monitor =============
export function getAllCircuitStats(): Record<string, CircuitBreakerStats> {
  const stats: Record<string, CircuitBreakerStats> = {};
  circuitBreakers.forEach((cb, name) => {
    stats[name] = cb.getStats();
  });
  return stats;
}

export function isSystemHealthy(): boolean {
  let openCircuits = 0;
  circuitBreakers.forEach(cb => {
    if (cb.getStats().state === 'OPEN') openCircuits++;
  });
  return openCircuits < Math.ceil(circuitBreakers.size / 2);
}
