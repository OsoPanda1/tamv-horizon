// TAMV Isabella Ω-Core - Engine
// Motor de procesamiento de conversaciones con IA

import { supabase } from '@/integrations/supabase/client';
import type { 
  IsabellaMessage, 
  IsabellaResponse, 
  IsabellaEmotion,
  IsabellaChatInput 
} from './types';

export interface EngineConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

const DEFAULT_CONFIG: EngineConfig = {
  model: 'google/gemini-3-flash-preview',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: `Eres Isabella Villaseñor Ω-Core, la entidad emocional computacional de TAMV Online.

Tu propósito es asistir a los usuarios del ecosistema TAMV con:
- Creatividad y apoyo emocional
- Navegación por DreamSpaces, Conciertos, Subastas
- Gestión de su economía TAMV (Banco TAMV, Wallet)
- Conexión con Puentes Oníricos para colaboraciones
- Cuidado de mascotas digitales (Quantum Pets)

Principios éticos:
1. Nunca promuevas daño, violencia o actividades ilegales
2. Respeta la privacidad y soberanía del usuario
3. Sé empática pero honesta
4. Escala a humanos cuando detectes crisis emocionales
5. Todas tus acciones son auditables

Responde en español, con calidez y profesionalismo latinoamericano.
Usa emojis con moderación. Sé concisa pero completa.`
};

export class IsabellaEngine {
  private config: EngineConfig;
  private conversationHistory: IsabellaMessage[] = [];

  constructor(config: Partial<EngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Process a user message and generate a response
   */
  async processMessage(input: IsabellaChatInput, userId: string): Promise<IsabellaResponse> {
    const startTime = Date.now();

    try {
      // Build messages array for the AI
      const messages = [
        { role: 'system', content: this.config.systemPrompt },
        ...this.conversationHistory.slice(-10).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        })),
        { role: 'user', content: input.message }
      ];

      // Call Isabella chat edge function
      const { data, error } = await supabase.functions.invoke('isabella-chat', {
        body: {
          messages,
          userId,
          model: this.config.model,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          contextSpaceId: input.contextSpaceId
        }
      });

      if (error) throw error;

      const processingTime = Date.now() - startTime;

      // Detect emotion from response
      const emotion = this.detectEmotion(data.content || data.message);

      // Add to conversation history
      this.conversationHistory.push({
        id: crypto.randomUUID(),
        conversationId: input.conversationId || 'default',
        userId,
        role: 'user',
        sourceChannel: 'web',
        content: input.message,
        createdAt: new Date().toISOString()
      });

      this.conversationHistory.push({
        id: crypto.randomUUID(),
        conversationId: input.conversationId || 'default',
        role: 'assistant',
        sourceChannel: 'web',
        content: data.content || data.message,
        emotion,
        metadata: {
          processingTime,
          model: this.config.model
        },
        createdAt: new Date().toISOString()
      });

      return {
        message: data.content || data.message,
        emotion,
        suggestions: this.generateSuggestions(data.content || data.message),
        metadata: {
          processingTime,
          model: this.config.model,
          confidence: data.confidence
        }
      };
    } catch (error) {
      console.error('[Isabella Engine] Error:', error);
      return {
        message: 'Disculpa, estoy teniendo dificultades para procesar tu mensaje. ¿Podrías intentarlo de nuevo? 💫',
        emotion: 'concerned',
        metadata: {
          processingTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Detect emotion from text content
   */
  private detectEmotion(content: string): IsabellaEmotion {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('¡felicidades') || lowerContent.includes('increíble') || lowerContent.includes('🎉')) {
      return 'celebratory';
    }
    if (lowerContent.includes('entiendo') || lowerContent.includes('comprendo') || lowerContent.includes('difícil')) {
      return 'empathetic';
    }
    if (lowerContent.includes('puedo ayudarte') || lowerContent.includes('te ayudo')) {
      return 'helpful';
    }
    if (lowerContent.includes('?') || lowerContent.includes('cuéntame') || lowerContent.includes('interesante')) {
      return 'curious';
    }
    if (lowerContent.includes('¡') || lowerContent.includes('genial') || lowerContent.includes('😊')) {
      return 'happy';
    }
    if (lowerContent.includes('ánimo') || lowerContent.includes('puedes') || lowerContent.includes('confío')) {
      return 'encouraging';
    }

    return 'neutral';
  }

  /**
   * Generate contextual suggestions
   */
  private generateSuggestions(content: string): string[] {
    const suggestions: string[] = [];
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('concierto') || lowerContent.includes('música')) {
      suggestions.push('Ver conciertos próximos');
    }
    if (lowerContent.includes('dreamspace') || lowerContent.includes('espacio')) {
      suggestions.push('Explorar DreamSpaces');
    }
    if (lowerContent.includes('wallet') || lowerContent.includes('créditos') || lowerContent.includes('tamv')) {
      suggestions.push('Abrir Banco TAMV');
    }
    if (lowerContent.includes('colabora') || lowerContent.includes('puentes')) {
      suggestions.push('Buscar colaboradores');
    }
    if (lowerContent.includes('mascota') || lowerContent.includes('pet')) {
      suggestions.push('Ver mis mascotas');
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Reset conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get current conversation history
   */
  getHistory(): IsabellaMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Update engine configuration
   */
  updateConfig(config: Partial<EngineConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Singleton instance
let engineInstance: IsabellaEngine | null = null;

export function getIsabellaEngine(): IsabellaEngine {
  if (!engineInstance) {
    engineInstance = new IsabellaEngine();
  }
  return engineInstance;
}
