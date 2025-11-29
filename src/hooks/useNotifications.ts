import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "achievement" | "social" | "economic";
  title: string;
  message: string;
  actionUrl?: string;
  icon?: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
      return;
    }

    const mapped: Notification[] = (data || []).map(n => ({
      id: n.id,
      type: n.type as Notification["type"],
      title: n.title,
      message: n.message || "",
      actionUrl: n.action_url || undefined,
      icon: n.icon || undefined,
      isRead: n.is_read,
      createdAt: n.created_at
    }));

    setNotifications(mapped);
    setUnreadCount(mapped.filter(n => !n.isRead).length);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Suscribirse a nuevas notificaciones en tiempo real
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotif = payload.new as Record<string, unknown>;
          const notification: Notification = {
            id: newNotif.id as string,
            type: newNotif.type as Notification["type"],
            title: newNotif.title as string,
            message: (newNotif.message as string) || "",
            actionUrl: newNotif.action_url as string | undefined,
            icon: newNotif.icon as string | undefined,
            isRead: newNotif.is_read as boolean,
            createdAt: newNotif.created_at as string
          };
          
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (!error) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
