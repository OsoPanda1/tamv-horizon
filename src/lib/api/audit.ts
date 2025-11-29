import { supabase } from "@/integrations/supabase/client";

export interface AuditEvent {
  entityType: string;
  entityId: string;
  action: string;
  prevState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AuditLogEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actorId: string;
  bookpiHash: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

// Registrar evento de auditoría
export async function logAuditEvent(event: AuditEvent): Promise<{
  success: boolean;
  auditLogId?: string;
  bookpiHash?: string;
  anomalyDetected?: boolean;
}> {
  const { data, error } = await supabase.functions.invoke("audit-log", {
    body: event
  });

  if (error) {
    console.error("Error logging audit event:", error);
    return { success: false };
  }

  return {
    success: true,
    auditLogId: data.auditLogId,
    bookpiHash: data.bookpiHash,
    anomalyDetected: data.anomalyDetected
  };
}

// Registrar evento financiero (wrapper especializado)
export async function logFinancialEvent(
  type: string,
  amount: number,
  currency: string,
  module: string,
  resourceId: string,
  userId: string,
  additionalData?: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType: "financial",
    entityId: resourceId,
    action: type,
    metadata: {
      amount,
      currency,
      module,
      userId,
      ...additionalData
    }
  });
}

// Registrar evento de subasta
export async function logAuctionEvent(
  auctionId: string,
  action: "bid_placed" | "auction_won" | "auction_cancelled" | "auction_created",
  data: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType: "auction",
    entityId: auctionId,
    action,
    metadata: data
  });
}

// Registrar evento de concierto
export async function logConcertEvent(
  concertId: string,
  action: "ticket_purchased" | "concert_started" | "concert_ended" | "concert_created",
  data: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType: "concert",
    entityId: concertId,
    action,
    metadata: data
  });
}

// Registrar evento de DreamSpace
export async function logDreamSpaceEvent(
  spaceId: string,
  action: "space_visited" | "space_rated" | "space_created" | "space_updated",
  data: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType: "dreamspace",
    entityId: spaceId,
    action,
    metadata: data
  });
}

// Registrar evento de wallet
export async function logWalletEvent(
  walletId: string,
  action: "deposit" | "withdrawal" | "transfer" | "purchase",
  data: Record<string, unknown>
): Promise<void> {
  await logAuditEvent({
    entityType: "wallet",
    entityId: walletId,
    action,
    metadata: data
  });
}
