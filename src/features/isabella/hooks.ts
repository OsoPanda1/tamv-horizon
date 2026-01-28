// TAMV Isabella Ω-Core - React Hooks

import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getIsabellaEngine, IsabellaEngine } from './engine';
import { createVault, IsabellaVault } from './vault';
import type { IsabellaMessage, IsabellaResponse, IsabellaChatInput } from './types';

export function useIsabellaChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<IsabellaMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const engineRef = useRef<IsabellaEngine | null>(null);

  // Initialize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = getIsabellaEngine();
    }
  }, []);

  const sendMessage = useCallback(async (input: IsabellaChatInput): Promise<IsabellaResponse | null> => {
    if (!user || !engineRef.current) {
      setError(new Error('Usuario no autenticado'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add user message immediately
      const userMessage: IsabellaMessage = {
        id: crypto.randomUUID(),
        conversationId: input.conversationId || 'default',
        userId: user.id,
        role: 'user',
        sourceChannel: 'web',
        content: input.message,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Process with engine
      const response = await engineRef.current.processMessage(input, user.id);

      // Add assistant message
      const assistantMessage: IsabellaMessage = {
        id: crypto.randomUUID(),
        conversationId: input.conversationId || 'default',
        role: 'assistant',
        sourceChannel: 'web',
        content: response.message,
        emotion: response.emotion,
        metadata: response.metadata,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearChat = useCallback(() => {
    setMessages([]);
    engineRef.current?.clearHistory();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
}

export function useIsabellaVault() {
  const { user } = useAuth();
  const [vault, setVault] = useState<IsabellaVault | null>(null);

  useEffect(() => {
    if (user) {
      setVault(createVault(user.id));
    } else {
      setVault(null);
    }
  }, [user]);

  return vault;
}

export function useIsabellaPreferences() {
  const vault = useIsabellaVault();
  const [preferences, setPreferences] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreferences() {
      if (vault) {
        const prefs = await vault.getPreferences();
        setPreferences(prefs);
      }
      setLoading(false);
    }

    loadPreferences();
  }, [vault]);

  const updatePreference = useCallback(async (key: string, value: unknown) => {
    if (!vault) return false;

    await vault.remember('preference', { [key]: value }, { importance: 4 });
    setPreferences(prev => ({ ...prev, [key]: value }));
    return true;
  }, [vault]);

  return {
    preferences,
    loading,
    updatePreference
  };
}
