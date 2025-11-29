import { useState, useCallback } from "react";
import { 
  sendMessageToIsabella, 
  getOrCreateSession, 
  getSessionMessages,
  type IsabellaMessage,
  type IsabellaSession 
} from "@/lib/api/isabella";
import { useAuth } from "./useAuth";

export function useIsabella() {
  const { user } = useAuth();
  const [session, setSession] = useState<IsabellaSession | null>(null);
  const [messages, setMessages] = useState<IsabellaMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    if (!user) return null;
    
    setInitializing(true);
    setError(null);

    try {
      const newSession = await getOrCreateSession(user.id);
      setSession(newSession);

      if (newSession) {
        const history = await getSessionMessages(newSession.id);
        setMessages(history);
      }

      return newSession;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error iniciando sesión con Isabella");
      return null;
    } finally {
      setInitializing(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (
    content: string, 
    context?: string,
    quickAction?: string
  ) => {
    if (!user) {
      setError("Debes iniciar sesión para hablar con Isabella");
      return null;
    }

    setLoading(true);
    setError(null);

    // Añadir mensaje del usuario optimísticamente
    const userMessage: IsabellaMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Inicializar sesión si no existe
      let currentSession = session;
      if (!currentSession) {
        currentSession = await initSession();
      }

      const response = await sendMessageToIsabella(
        content,
        currentSession?.id,
        user.id,
        context,
        quickAction
      );

      // Añadir respuesta de Isabella
      const isabellaMessage: IsabellaMessage = {
        id: `isabella-${Date.now()}`,
        role: "isabella",
        content: response.response,
        emotion: response.emotion,
        timestamp: response.timestamp
      };
      setMessages(prev => [...prev, isabellaMessage]);

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error comunicándose con Isabella");
      // Remover mensaje optimista en caso de error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, session, initSession]);

  const executeQuickAction = useCallback(async (actionId: string) => {
    return sendMessage("", undefined, actionId);
  }, [sendMessage]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setSession(null);
  }, []);

  return {
    session,
    messages,
    loading,
    initializing,
    error,
    initSession,
    sendMessage,
    executeQuickAction,
    clearConversation,
    isReady: !initializing && !loading
  };
}
