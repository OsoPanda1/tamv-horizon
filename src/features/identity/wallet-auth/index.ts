// TAMV Identity - Wallet Authentication Module
// Sistema de autenticación civilizacional con soporte para NubiWallet y Web3

export { NubiWalletAdapter } from './nubi-adapter';
export { Web3WalletAdapter } from './web3-adapter';

export interface WalletAuthConfig {
  enableNubiWallet: boolean;
  enableWeb3: boolean;
  requireKYC: boolean;
  chainId?: string;
}

export interface AuthenticatedIdentity {
  userId: string;
  walletAddress?: string;
  displayName?: string;
  avatarUrl?: string;
  verificationLevel: 'none' | 'basic' | 'verified' | 'institution';
  permissions: string[];
  createdAt: string;
  lastActive: string;
}

export interface WalletSession {
  sessionId: string;
  userId: string;
  walletAddress: string;
  expiresAt: string;
  capabilities: string[];
}

// Identity verification levels
export const VERIFICATION_LEVELS = {
  NONE: 'none',
  BASIC: 'basic', // Email verified
  VERIFIED: 'verified', // ID + selfie verified
  INSTITUTION: 'institution' // Organizational account
} as const;

// Permission types for TAMV ecosystem
export const TAMV_PERMISSIONS = {
  // Core
  READ_PROFILE: 'profile:read',
  WRITE_PROFILE: 'profile:write',
  // Social
  CREATE_POST: 'post:create',
  CREATE_GROUP: 'group:create',
  CREATE_CHANNEL: 'channel:create',
  // Economic
  WALLET_READ: 'wallet:read',
  WALLET_TRANSFER: 'wallet:transfer',
  WALLET_WITHDRAW: 'wallet:withdraw',
  // XR
  CREATE_DREAMSPACE: 'dreamspace:create',
  HOST_CONCERT: 'concert:host',
  CREATE_AUCTION: 'auction:create',
  // Governance
  VOTE_PROPOSAL: 'governance:vote',
  CREATE_PROPOSAL: 'governance:propose',
  // Isabella
  ISABELLA_CHAT: 'isabella:chat',
  ISABELLA_VAULT: 'isabella:vault'
} as const;
