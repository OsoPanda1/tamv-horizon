// TAMV Isabella Ω-Core - Vault (Memoria Persistente)
// Sistema de memoria civilizacional con contexto total

import { supabase } from '@/integrations/supabase/client';
import type { IsabellaDiaryEntry, IsabellaEmotion } from './types';

export interface VaultMemory {
  id: string;
  userId: string;
  memoryType: 'preference' | 'fact' | 'emotion' | 'goal' | 'relationship';
  content: Record<string, unknown>;
  importance: 1 | 2 | 3 | 4 | 5;
  emotionContext?: IsabellaEmotion;
  relatedEntities: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class IsabellaVault {
  private userId: string;
  private cache: Map<string, VaultMemory> = new Map();

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Store a memory in the vault
   */
  async remember(
    memoryType: VaultMemory['memoryType'],
    content: Record<string, unknown>,
    options: {
      importance?: 1 | 2 | 3 | 4 | 5;
      emotionContext?: IsabellaEmotion;
      relatedEntities?: string[];
      expiresAt?: string;
    } = {}
  ): Promise<VaultMemory | null> {
    try {
      const insertData = {
        user_id: this.userId,
        memory_type: memoryType,
        content: content as unknown as Record<string, never>,
        importance: options.importance || 3,
        emotion_context: options.emotionContext || null,
        related_entities: options.relatedEntities || [],
        expires_at: options.expiresAt || null
      };

      const { data, error } = await supabase
        .from('isabella_vault')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      const memory: VaultMemory = {
        id: data.id,
        userId: data.user_id,
        memoryType: data.memory_type as VaultMemory['memoryType'],
        content: data.content as Record<string, unknown>,
        importance: data.importance as 1 | 2 | 3 | 4 | 5,
        emotionContext: data.emotion_context as IsabellaEmotion | undefined,
        relatedEntities: data.related_entities || [],
        expiresAt: data.expires_at || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      this.cache.set(memory.id, memory);
      return memory;
    } catch (error) {
      console.error('[Isabella Vault] Error storing memory:', error);
      return null;
    }
  }

  /**
   * Retrieve memories by type
   */
  async recall(
    memoryType?: VaultMemory['memoryType'],
    limit: number = 20
  ): Promise<VaultMemory[]> {
    try {
      let query = supabase
        .from('isabella_vault')
        .select('*')
        .eq('user_id', this.userId)
        .order('importance', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (memoryType) {
        query = query.eq('memory_type', memoryType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        userId: d.user_id,
        memoryType: d.memory_type as VaultMemory['memoryType'],
        content: d.content as Record<string, unknown>,
        importance: d.importance as 1 | 2 | 3 | 4 | 5,
        emotionContext: d.emotion_context as IsabellaEmotion | undefined,
        relatedEntities: d.related_entities || [],
        expiresAt: d.expires_at || undefined,
        createdAt: d.created_at,
        updatedAt: d.updated_at
      }));
    } catch (error) {
      console.error('[Isabella Vault] Error recalling memories:', error);
      return [];
    }
  }

  /**
   * Search memories by entity or keyword
   */
  async search(query: string): Promise<VaultMemory[]> {
    try {
      const { data, error } = await supabase
        .from('isabella_vault')
        .select('*')
        .eq('user_id', this.userId)
        .contains('related_entities', [query])
        .order('importance', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(d => ({
        id: d.id,
        userId: d.user_id,
        memoryType: d.memory_type as VaultMemory['memoryType'],
        content: d.content as Record<string, unknown>,
        importance: d.importance as 1 | 2 | 3 | 4 | 5,
        emotionContext: d.emotion_context as IsabellaEmotion | undefined,
        relatedEntities: d.related_entities || [],
        expiresAt: d.expires_at || undefined,
        createdAt: d.created_at,
        updatedAt: d.updated_at
      }));
    } catch (error) {
      console.error('[Isabella Vault] Error searching memories:', error);
      return [];
    }
  }

  /**
   * Forget a specific memory
   */
  async forget(memoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('isabella_vault')
        .delete()
        .eq('id', memoryId)
        .eq('user_id', this.userId);

      if (error) throw error;

      this.cache.delete(memoryId);
      return true;
    } catch (error) {
      console.error('[Isabella Vault] Error forgetting memory:', error);
      return false;
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<Record<string, unknown>> {
    const memories = await this.recall('preference');
    const preferences: Record<string, unknown> = {};

    for (const memory of memories) {
      Object.assign(preferences, memory.content);
    }

    return preferences;
  }

  /**
   * Get emotional context for conversation
   */
  async getEmotionalContext(): Promise<IsabellaEmotion[]> {
    const memories = await this.recall('emotion', 5);
    return memories
      .filter(m => m.emotionContext)
      .map(m => m.emotionContext as IsabellaEmotion);
  }

  /**
   * Store a diary entry
   */
  async addDiaryEntry(
    content: string,
    entryType: IsabellaDiaryEntry['entryType'],
    options: {
      emotionDetected?: IsabellaEmotion;
      importance?: 1 | 2 | 3 | 4 | 5;
      tags?: string[];
    } = {}
  ): Promise<boolean> {
    return !!(await this.remember('emotion', {
      entryContent: content,
      entryType,
      emotionDetected: options.emotionDetected,
      tags: options.tags || []
    }, {
      importance: options.importance || 3,
      emotionContext: options.emotionDetected
    }));
  }

  /**
   * Clear all memories for user (with confirmation)
   */
  async clearAll(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('isabella_vault')
        .delete()
        .eq('user_id', this.userId);

      if (error) throw error;

      this.cache.clear();
      return true;
    } catch (error) {
      console.error('[Isabella Vault] Error clearing memories:', error);
      return false;
    }
  }
}

// Factory function
export function createVault(userId: string): IsabellaVault {
  return new IsabellaVault(userId);
}
