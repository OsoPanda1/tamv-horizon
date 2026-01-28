// TAMV Services - API Client
// Cliente HTTP centralizado para llamadas a servicios

import { supabase } from '@/integrations/supabase/client';

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

const DEFAULT_CONFIG: ApiClientConfig = {
  timeout: 30000,
  retries: 2
};

export class TAMVApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Call a Supabase Edge Function
   */
  async invokeFunction<T>(
    functionName: string,
    body?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke<T>(functionName, {
        body
      });

      if (error) {
        return {
          data: null,
          error: new Error(error.message),
          status: 500
        };
      }

      return {
        data,
        error: null,
        status: 200
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Unknown error'),
        status: 500
      };
    }
  }

  /**
   * Fetch data from external API with retry logic
   */
  async fetch<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;
    const retries = this.config.retries || 0;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          data: data as T,
          error: null,
          status: response.status
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Fetch failed');
        
        // Don't retry on abort
        if (err instanceof Error && err.name === 'AbortError') {
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    return {
      data: null,
      error: lastError,
      status: 0
    };
  }
}

// Singleton instance
export const apiClient = new TAMVApiClient();

// Convenience functions
export async function invokeEdgeFunction<T>(
  name: string,
  body?: Record<string, unknown>
): Promise<T | null> {
  const { data, error } = await apiClient.invokeFunction<T>(name, body);
  if (error) {
    console.error(`[API] Error invoking ${name}:`, error);
    return null;
  }
  return data;
}
