// TAMV Services - Isabella Client
// Cliente especializado para comunicación con Isabella IA

import { supabase } from '@/integrations/supabase/client';
import type { IsabellaResponse, IsabellaChatInput } from '@/features/isabella/types';

export interface IsabellaClientConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  streamingEnabled?: boolean;
}

const DEFAULT_CONFIG: IsabellaClientConfig = {
  model: 'google/gemini-3-flash-preview',
  temperature: 0.7,
  maxTokens: 2048,
  streamingEnabled: false
};

export class IsabellaClient {
  private config: IsabellaClientConfig;
  private conversationId: string | null = null;

  constructor(config: IsabellaClientConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Send a message to Isabella
   */
  async chat(input: IsabellaChatInput): Promise<IsabellaResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('isabella-chat', {
        body: {
          message: input.message,
          conversationId: input.conversationId || this.conversationId,
          contextSpaceId: input.contextSpaceId,
          model: this.config.model,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens
        }
      });

      if (error) throw error;

      // Store conversation ID for continuity
      if (data.conversationId) {
        this.conversationId = data.conversationId;
      }

      return {
        message: data.message || data.content,
        emotion: data.emotion || 'neutral',
        suggestions: data.suggestions || [],
        actions: data.actions || [],
        metadata: {
          processingTime: data.processingTime,
          model: this.config.model
        }
      };
    } catch (err) {
      console.error('[Isabella Client] Chat error:', err);
      return {
        message: 'Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentarlo de nuevo?',
        emotion: 'concerned'
      };
    }
  }

  /**
   * Stream a response from Isabella
   */
  async *chatStream(input: IsabellaChatInput): AsyncGenerator<string, void, unknown> {
    const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          message: input.message,
          conversationId: input.conversationId || this.conversationId,
          stream: true
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') return;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch {
              // Incomplete JSON, continue
            }
          }
        }
      }
    } catch (err) {
      console.error('[Isabella Client] Stream error:', err);
      yield 'Error en la conexión con Isabella.';
    }
  }

  /**
   * Get quick suggestions from Isabella
   */
  async getSuggestions(context: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('isabella-chat', {
        body: {
          message: `Dame 3 sugerencias breves para: ${context}`,
          quickMode: true
        }
      });

      if (error) throw error;
      return data.suggestions || [];
    } catch {
      return [];
    }
  }

  /**
   * Reset conversation context
   */
  resetConversation(): void {
    this.conversationId = null;
  }

  /**
   * Update client configuration
   */
  updateConfig(config: Partial<IsabellaClientConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
let clientInstance: IsabellaClient | null = null;

export function getIsabellaClient(): IsabellaClient {
  if (!clientInstance) {
    clientInstance = new IsabellaClient();
  }
  return clientInstance;
}
