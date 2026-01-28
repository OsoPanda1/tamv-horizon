// TAMV Isabella Ω-Core - Type Definitions
// Sistema IA civilizacional con memoria, ética y multimodalidad

export interface IsabellaProfile {
  userId: string;
  displayName: string;
  personaPreset: 'creator' | 'guardian' | 'institutional' | 'personal';
  language: string;
  timezone: string;
  preferences: IsabellaPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface IsabellaPreferences {
  voiceEnabled: boolean;
  emotionalFeedback: boolean;
  proactiveAssistance: boolean;
  privacyLevel: 'minimal' | 'standard' | 'maximum';
  ethicalBoundaries: string[];
}

export interface IsabellaContextSpace {
  id: string;
  userId: string;
  name: string;
  kind: 'personal' | 'institution' | 'workspace' | 'dreamspace';
  tamvWorkspaceId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IsabellaConversation {
  id: string;
  userId: string;
  contextSpaceId?: string;
  title?: string;
  channel: IsabellaChannel;
  state: 'active' | 'paused' | 'archived';
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export type IsabellaChannel = 
  | 'web' 
  | 'mobile' 
  | 'xr' 
  | 'whatsapp' 
  | 'discord' 
  | 'telegram' 
  | 'cli';

export interface IsabellaMessage {
  id: string;
  conversationId: string;
  userId?: string;
  role: 'user' | 'assistant' | 'system';
  sourceChannel: IsabellaChannel;
  content: string;
  metadata?: IsabellaMessageMetadata;
  emotion?: IsabellaEmotion;
  attachments?: IsabellaAttachment[];
  createdAt: string;
}

export interface IsabellaMessageMetadata {
  skill?: string;
  intent?: string;
  confidence?: number;
  processingTime?: number;
  model?: string;
  fileRefs?: string[];
  auditHash?: string;
}

export type IsabellaEmotion = 
  | 'neutral' 
  | 'happy' 
  | 'helpful' 
  | 'curious' 
  | 'encouraging'
  | 'empathetic'
  | 'concerned'
  | 'celebratory';

export interface IsabellaAttachment {
  id: string;
  type: 'image' | 'audio' | 'video' | 'document' | 'link';
  url: string;
  mimeType: string;
  metadata?: Record<string, unknown>;
}

// Isabella Diary - Memoria multimodal
export interface IsabellaDiaryEntry {
  id: string;
  userId: string;
  entryType: 'text' | 'audio' | 'image' | 'mixed';
  content: string;
  emotionDetected?: IsabellaEmotion;
  importance: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  relatedEntities: string[];
  createdAt: string;
}

// Isabella Skills - Hyper-Módulos
export interface IsabellaSkill {
  id: string;
  name: string;
  description: string;
  category: IsabellaSkillCategory;
  version: string;
  isBuiltIn: boolean;
  capabilities: string[];
  requiredPermissions: string[];
  config?: Record<string, unknown>;
}

export type IsabellaSkillCategory = 
  | 'finance' 
  | 'xr' 
  | 'social' 
  | 'legal' 
  | 'education' 
  | 'health' 
  | 'creative'
  | 'governance'
  | 'productivity';

// Isabella Audit - Trazabilidad ética
export interface IsabellaAuditEvent {
  id: string;
  userId: string;
  action: string;
  decision: string;
  reasoning: string;
  ethicalFlag?: 'none' | 'caution' | 'escalated' | 'blocked';
  bookpiHash?: string;
  createdAt: string;
}

// Isabella Response
export interface IsabellaResponse {
  message: string;
  emotion: IsabellaEmotion;
  suggestions?: string[];
  actions?: IsabellaAction[];
  attachments?: IsabellaAttachment[];
  metadata?: IsabellaMessageMetadata;
}

export interface IsabellaAction {
  type: 'navigate' | 'modal' | 'api_call' | 'create' | 'share';
  label: string;
  target: string;
  params?: Record<string, unknown>;
}

// Chat Input
export interface IsabellaChatInput {
  message: string;
  conversationId?: string;
  contextSpaceId?: string;
  attachments?: File[];
  emotion?: IsabellaEmotion;
}
