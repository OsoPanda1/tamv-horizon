// ============= Isabella Vault - Bóveda de Conocimiento y Evolución =============
// Sistema de memoria persistente, aprendizaje y evolución de Isabella AI

import { supabase } from '@/integrations/supabase/client';

// Tipos de conocimiento almacenado
export type KnowledgeType = 
  | 'user_preference'
  | 'emotional_pattern'
  | 'interaction_insight'
  | 'creative_seed'
  | 'ethical_boundary'
  | 'collaboration_match'
  | 'skill_assessment';

export interface VaultEntry {
  id: string;
  type: KnowledgeType;
  userId?: string;
  key: string;
  value: unknown;
  confidence: number; // 0-1
  source: string;
  createdAt: string;
  updatedAt: string;
  accessCount: number;
  isActive: boolean;
}

export interface EmotionalProfile {
  dominantEmotion: string;
  emotionalStability: number;
  responsiveness: number;
  creativityIndex: number;
  collaborationAffinity: number;
  lastUpdated: string;
}

export interface UserInsight {
  userId: string;
  preferredTopics: string[];
  interactionStyle: 'verbose' | 'concise' | 'balanced';
  emotionalProfile: EmotionalProfile;
  skillSignature: Record<string, number>;
  dreamspacePreferences: string[];
  musicTaste: string[];
  activeHours: number[];
  engagementScore: number;
}

// Isabella Vault Service
class IsabellaVaultService {
  private cache = new Map<string, VaultEntry>();
  private userInsights = new Map<string, UserInsight>();

  // Store knowledge in vault
  async storeKnowledge(entry: Omit<VaultEntry, 'id' | 'createdAt' | 'updatedAt' | 'accessCount'>): Promise<void> {
    const cacheKey = `${entry.type}:${entry.key}:${entry.userId || 'global'}`;
    
    // Update local cache
    const now = new Date().toISOString();
    const fullEntry: VaultEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      accessCount: 0
    };
    this.cache.set(cacheKey, fullEntry);

    // Persist to audit_logs for now (can be migrated to dedicated table)
    await supabase.from('audit_logs').insert({
      entity_type: 'isabella_vault',
      entity_id: fullEntry.id,
      action: 'knowledge_stored',
      metadata: {
        type: entry.type,
        key: entry.key,
        value: entry.value,
        confidence: entry.confidence,
        source: entry.source
      }
    } as any);

    console.log(`[IsabellaVault] Stored: ${entry.type}/${entry.key}`);
  }

  // Retrieve knowledge from vault
  async getKnowledge(type: KnowledgeType, key: string, userId?: string): Promise<VaultEntry | null> {
    const cacheKey = `${type}:${key}:${userId || 'global'}`;
    
    if (this.cache.has(cacheKey)) {
      const entry = this.cache.get(cacheKey)!;
      entry.accessCount++;
      return entry;
    }

    // Query from audit logs
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', 'isabella_vault')
      .eq('action', 'knowledge_stored')
      .order('created_at', { ascending: false })
      .limit(1);

    if (data?.[0]) {
      const metadata = data[0].metadata as Record<string, unknown> | null;
      const entry: VaultEntry = {
        id: data[0].entity_id,
        type: (metadata?.type as KnowledgeType) || type,
        key: (metadata?.key as string) || key,
        value: metadata?.value,
        confidence: (metadata?.confidence as number) || 0.5,
        source: (metadata?.source as string) || 'unknown',
        userId: data[0].actor_id || undefined,
        createdAt: data[0].created_at || '',
        updatedAt: data[0].created_at || '',
        accessCount: 1,
        isActive: true
      };
      this.cache.set(cacheKey, entry);
      return entry;
    }

    return null;
  }

  // Analyze and store user insight
  async analyzeUserBehavior(userId: string, interactions: Array<{ type: string; content: string; emotion?: string }>): Promise<UserInsight> {
    // Emotional pattern analysis
    const emotions = interactions.map(i => i.emotion).filter(Boolean);
    const emotionCounts = emotions.reduce((acc, e) => {
      acc[e!] = (acc[e!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

    // Calculate interaction style
    const avgLength = interactions.reduce((sum, i) => sum + (i.content?.length || 0), 0) / interactions.length;
    const interactionStyle = avgLength > 200 ? 'verbose' : avgLength < 50 ? 'concise' : 'balanced';

    // Build insight
    const insight: UserInsight = {
      userId,
      preferredTopics: this.extractTopics(interactions),
      interactionStyle,
      emotionalProfile: {
        dominantEmotion,
        emotionalStability: this.calculateStability(emotions),
        responsiveness: Math.min(interactions.length / 10, 1),
        creativityIndex: this.estimateCreativity(interactions),
        collaborationAffinity: 0.5, // Will be updated with more data
        lastUpdated: new Date().toISOString()
      },
      skillSignature: {},
      dreamspacePreferences: [],
      musicTaste: [],
      activeHours: [],
      engagementScore: Math.min(interactions.length * 0.1, 1)
    };

    this.userInsights.set(userId, insight);

    // Store in vault
    await this.storeKnowledge({
      type: 'user_preference',
      userId,
      key: 'user_insight',
      value: insight,
      confidence: 0.7,
      source: 'behavior_analysis',
      isActive: true
    });

    return insight;
  }

  private extractTopics(interactions: Array<{ content: string }>): string[] {
    const keywords = [
      'música', 'concierto', 'arte', 'dreamspace', 'colaborar', 'crear',
      'subasta', 'nft', 'mascota', 'grupo', 'canal', 'xr', 'vr'
    ];
    
    const found = new Set<string>();
    interactions.forEach(i => {
      const content = i.content?.toLowerCase() || '';
      keywords.forEach(k => {
        if (content.includes(k)) found.add(k);
      });
    });
    
    return Array.from(found);
  }

  private calculateStability(emotions: (string | undefined)[]): number {
    if (emotions.length < 2) return 0.5;
    
    let changes = 0;
    for (let i = 1; i < emotions.length; i++) {
      if (emotions[i] !== emotions[i - 1]) changes++;
    }
    
    return 1 - (changes / emotions.length);
  }

  private estimateCreativity(interactions: Array<{ content: string }>): number {
    const creativeWords = ['crear', 'imaginar', 'diseñar', 'inventar', 'soñar', 'nuevo', 'único'];
    let creativeScore = 0;
    
    interactions.forEach(i => {
      const content = i.content?.toLowerCase() || '';
      creativeWords.forEach(w => {
        if (content.includes(w)) creativeScore++;
      });
    });
    
    return Math.min(creativeScore / (interactions.length * 2), 1);
  }

  // Get user insight
  getUserInsight(userId: string): UserInsight | undefined {
    return this.userInsights.get(userId);
  }

  // Evolution metrics for Isabella
  async getEvolutionMetrics(): Promise<{
    totalKnowledge: number;
    userProfiles: number;
    averageConfidence: number;
    topTopics: string[];
    emotionalBalance: Record<string, number>;
  }> {
    const entries = Array.from(this.cache.values());
    
    return {
      totalKnowledge: entries.length,
      userProfiles: this.userInsights.size,
      averageConfidence: entries.reduce((sum, e) => sum + e.confidence, 0) / (entries.length || 1),
      topTopics: ['conciertos', 'dreamspaces', 'colaboración', 'arte', 'música'],
      emotionalBalance: {
        happy: 0.35,
        neutral: 0.30,
        curious: 0.20,
        helpful: 0.15
      }
    };
  }
}

// Export singleton
export const isabellaVault = new IsabellaVaultService();

// Hook for components
export function useIsabellaVault() {
  return {
    storeKnowledge: (entry: Parameters<typeof isabellaVault.storeKnowledge>[0]) => 
      isabellaVault.storeKnowledge(entry),
    getKnowledge: (type: KnowledgeType, key: string, userId?: string) =>
      isabellaVault.getKnowledge(type, key, userId),
    analyzeUser: (userId: string, interactions: Parameters<typeof isabellaVault.analyzeUserBehavior>[1]) =>
      isabellaVault.analyzeUserBehavior(userId, interactions),
    getUserInsight: (userId: string) => isabellaVault.getUserInsight(userId),
    getEvolutionMetrics: () => isabellaVault.getEvolutionMetrics()
  };
}
