// ============= TAMV DreamSpaces API — Full Type System =============
// Core types, sessions, presence, economy, 4D, guardian integration

// ==================== CORE ====================

export type DreamspaceDimension = "3d" | "4d";
export type DreamspaceVisibility = "public" | "unlisted" | "private";
export type DreamspaceAccessMode = "open" | "invite_only" | "token_gated";

export interface DreamspaceMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  dimension: DreamspaceDimension;
  tags: string[];
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  maxOccupancy: number;
  isPersistent: boolean;
  visibility: DreamspaceVisibility;
  accessMode: DreamspaceAccessMode;
  createdAt: string;
  updatedAt: string;
  createdByUserId: string;
  ownerOrgId?: string;
}

export interface DreamspaceSceneConfig {
  sceneId: string;
  worldSeed?: string;
  skybox?: string;
  lightingProfile?: string;
  ambientAudio?: string;
  entrySpawnPoints: SpawnPoint[];
}

export interface SpawnPoint {
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface DreamspaceRuntimeState {
  dreamspaceId: string;
  activeSessionId?: string;
  currentOccupancy: number;
  isLocked: boolean;
  isUnderGuardianReview: boolean;
}

export interface Dreamspace {
  meta: DreamspaceMeta;
  scene: DreamspaceSceneConfig;
  runtime: DreamspaceRuntimeState;
}

// ==================== SESSIONS & PRESENCE ====================

export type MembershipTier = "free" | "creator" | "guardian" | "institutional";

export interface ParticipantPresence {
  userId: string;
  avatarId: string;
  displayName: string;
  membershipTier: MembershipTier;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  isSpeaking: boolean;
  lastHeartbeatAt: string;
}

export interface DreamspaceSession {
  id: string;
  dreamspaceId: string;
  startedAt: string;
  endsAt?: string;
  hostUserId?: string;
  isClosed: boolean;
  currentParticipants: number;
}

export interface ClientCapabilities {
  xr: boolean;
  audio: boolean;
  video: boolean;
}

export interface JoinSessionResponse {
  session: DreamspaceSession;
  token: string;
  initialState: {
    scene: DreamspaceSceneConfig;
    participants: ParticipantPresence[];
  };
}

// ==================== WEBSOCKET MESSAGES ====================

export type DreamspaceClientMessage =
  | { type: "presence:update"; payload: { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; isSpeaking?: boolean } }
  | { type: "interaction:event"; payload: { targetId: string; action: string; data?: Record<string, unknown> } }
  | { type: "chat:message"; payload: { channel: "local" | "global" | "private"; targetUserId?: string; text: string } }
  | { type: "state:request_snapshot" };

export type DreamspaceServerMessage =
  | { type: "presence:joined"; payload: { participant: ParticipantPresence } }
  | { type: "presence:left"; payload: { userId: string } }
  | { type: "presence:update"; payload: { userId: string } & ParticipantPresence }
  | { type: "interaction:event"; payload: { userId: string; targetId: string; action: string; data?: Record<string, unknown> } }
  | { type: "chat:message"; payload: { id: string; userId: string; channel: "local" | "global" | "system"; text: string; createdAt: string } }
  | { type: "state:snapshot"; payload: { participants: ParticipantPresence[]; scene: DreamspaceSceneConfig } }
  | { type: "guardian:alert"; payload: { level: "info" | "warning" | "critical"; code: string; message: string } };

// ==================== INTERACTIVE OBJECTS ====================

export type InteractiveObjectType =
  | "portal"
  | "art_piece"
  | "console"
  | "seat"
  | "stage"
  | "info_pedestal"
  | "mission_terminal";

export interface InteractiveObject {
  id: string;
  dreamspaceId: string;
  type: InteractiveObjectType;
  label?: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  metadata: Record<string, unknown>;
  isActive: boolean;
}

// ==================== ECONOMY ====================

export interface DreamspaceTicket {
  id: string;
  dreamspaceId: string;
  eventId?: string;
  priceTau: number;
  currency?: "TAMV" | "CREDITS";
  startsAt?: string;
  endsAt?: string;
  maxSupply?: number;
  sold: number;
}

export interface DreamspaceTipConfig {
  minTipTau: number;
  suggestedAmounts: number[];
}

export interface DreamspaceEconomy {
  tickets: DreamspaceTicket[];
  tipConfig: DreamspaceTipConfig;
}

// ==================== 4D TIME LAYERS ====================

export interface TimeLayer {
  id: string;
  label: string;
  description?: string;
  timeOffsetSeconds: number;
  colorTint?: string;
  opacity: number;
}

export interface Dreamspace4DConfig {
  dreamspaceId: string;
  layers: TimeLayer[];
  defaultLayerId: string;
}

// ==================== GUARDIAN ====================

export interface GuardianIncident {
  id: string;
  level: "info" | "warning" | "critical";
  code: string;
  message: string;
  createdAt: string;
}

export interface GuardianState {
  isLocked: boolean;
  lastIncidents: GuardianIncident[];
}

export type ReportCategory = "abuse" | "exploit" | "content" | "security" | "other";

// ==================== SCHEDULING ====================

export interface DreamspaceEvent {
  eventId: string;
  startsAt: string;
  endsAt?: string;
  title: string;
}

export interface DreamspaceScheduling {
  recurring?: {
    cron?: string;
    timeZone?: string;
  };
  plannedEvents?: DreamspaceEvent[];
}
