// TAMV Identity - Web3 Wallet Adapter
// Integración con wallets Web3 estándar (MetaMask, WalletConnect, etc.)

import { supabase } from '@/integrations/supabase/client';
import type { AuthenticatedIdentity } from './index';

export interface Web3WalletConfig {
  supportedChains: number[];
  autoConnect?: boolean;
}

export type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom';

export class Web3WalletAdapter {
  private config: Web3WalletConfig;
  private provider: WalletProvider | null = null;
  private address: string | null = null;
  private chainId: number | null = null;

  constructor(config: Web3WalletConfig = { supportedChains: [1, 137, 8453] }) {
    this.config = config;
  }

  /**
   * Detect available wallet providers
   */
  async detectProviders(): Promise<WalletProvider[]> {
    const providers: WalletProvider[] = [];
    
    if (typeof window !== 'undefined') {
      // Check for MetaMask
      if ((window as unknown as { ethereum?: { isMetaMask?: boolean } }).ethereum?.isMetaMask) {
        providers.push('metamask');
      }
      // Additional provider detection would go here
    }

    return providers;
  }

  /**
   * Connect to a specific wallet provider
   */
  async connect(provider: WalletProvider): Promise<string | null> {
    try {
      this.provider = provider;

      switch (provider) {
        case 'metamask':
          return await this.connectMetaMask();
        default:
          throw new Error(`Provider ${provider} not yet supported`);
      }
    } catch (error) {
      console.error('[Web3Adapter] Connection error:', error);
      return null;
    }
  }

  private async connectMetaMask(): Promise<string | null> {
    try {
      const ethereum = (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
      if (!ethereum) {
        throw new Error('MetaMask not installed');
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.address = accounts[0];
      return this.address;
    } catch (error) {
      console.error('[Web3Adapter] MetaMask connection error:', error);
      return null;
    }
  }

  /**
   * Sign message with connected wallet
   */
  async signMessage(message: string): Promise<string | null> {
    if (!this.address) {
      throw new Error('No wallet connected');
    }

    try {
      const ethereum = (window as unknown as { ethereum?: { request: (args: { method: string; params: [string, string] }) => Promise<string> } }).ethereum;
      if (!ethereum) {
        throw new Error('Ethereum provider not found');
      }

      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, this.address]
      });

      return signature;
    } catch (error) {
      console.error('[Web3Adapter] Signing error:', error);
      return null;
    }
  }

  /**
   * Authenticate with TAMV using Web3 wallet
   */
  async authenticateWithTAMV(): Promise<AuthenticatedIdentity | null> {
    if (!this.address) {
      throw new Error('No wallet connected');
    }

    try {
      // Get nonce from backend
      const { data: nonceData, error: nonceError } = await supabase.functions.invoke('identity-nonce', {
        body: { walletAddress: this.address }
      });

      if (nonceError) throw nonceError;

      // Sign nonce
      const signature = await this.signMessage(nonceData.nonce);
      if (!signature) throw new Error('Failed to sign message');

      // Verify with backend
      const { data: authData, error: authError } = await supabase.functions.invoke('identity-verify', {
        body: {
          walletAddress: this.address,
          signature,
          provider: this.provider
        }
      });

      if (authError) throw authError;

      return authData.identity as AuthenticatedIdentity;
    } catch (error) {
      console.error('[Web3Adapter] Authentication error:', error);
      return null;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.address = null;
    this.chainId = null;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: !!this.address,
      provider: this.provider,
      address: this.address,
      chainId: this.chainId
    };
  }
}
