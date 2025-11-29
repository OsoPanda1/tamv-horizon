import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generar hash BookPI para trazabilidad inmutable
function generateBookPIHash(data: Record<string, unknown>): string {
  const str = JSON.stringify(data) + Date.now().toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0') + 
         Date.now().toString(16).padStart(12, '0');
}

// Detectar anomalías básicas
function detectAnomalies(event: Record<string, unknown>): { isAnomaly: boolean; reasons: string[] } {
  const reasons: string[] = [];
  
  // Detectar transacciones inusualmente grandes
  if (event.amount && typeof event.amount === 'number' && event.amount > 10000) {
    reasons.push("Transacción de alto valor detectada");
  }
  
  // Detectar múltiples transacciones rápidas (necesitaría historial)
  if (event.type === 'transaction' && event.frequency && (event.frequency as number) > 10) {
    reasons.push("Alta frecuencia de transacciones");
  }
  
  // Detectar cambios de estado sospechosos
  if (event.prev_state && event.new_state) {
    const prev = event.prev_state as Record<string, unknown>;
    const next = event.new_state as Record<string, unknown>;
    
    if (prev.status === 'completed' && next.status === 'pending') {
      reasons.push("Reversión de estado sospechosa");
    }
  }

  return {
    isAnomaly: reasons.length > 0,
    reasons
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("authorization");
    let actorId: string | null = null;

    // Extraer usuario del token si existe
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      actorId = user?.id || null;
    }

    const { 
      entityType,
      entityId,
      action,
      prevState,
      newState,
      metadata = {},
      ipAddress,
      userAgent
    } = await req.json();

    if (!entityType || !entityId || !action) {
      throw new Error("entityType, entityId, and action are required");
    }

    // Generar hash BookPI
    const bookpiHash = generateBookPIHash({
      entityType,
      entityId,
      action,
      actorId,
      timestamp: Date.now()
    });

    // Detectar anomalías
    const anomalyCheck = detectAnomalies({
      type: entityType,
      amount: metadata.amount,
      prev_state: prevState,
      new_state: newState
    });

    // Insertar log de auditoría
    const { data: auditLog, error } = await supabase
      .from("audit_logs")
      .insert({
        entity_type: entityType,
        entity_id: entityId,
        action,
        actor_id: actorId,
        prev_state: prevState,
        new_state: newState,
        ip_address: ipAddress || req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip"),
        user_agent: userAgent || req.headers.get("user-agent"),
        bookpi_hash: bookpiHash,
        metadata: {
          ...metadata,
          anomaly_detected: anomalyCheck.isAnomaly,
          anomaly_reasons: anomalyCheck.reasons
        }
      })
      .select()
      .single();

    if (error) throw error;

    // Si se detectó anomalía, crear notificación para admins
    if (anomalyCheck.isAnomaly) {
      console.warn(`[ANOMALY DETECTED] ${entityType}:${entityId} - ${anomalyCheck.reasons.join(", ")}`);
      
      // Notificar a admins (en producción se enviaría a un sistema de alertas)
      await supabase.from("notifications").insert({
        user_id: actorId,
        type: "warning",
        title: "Actividad Inusual Detectada",
        message: `Se detectó actividad inusual: ${anomalyCheck.reasons.join(", ")}`,
        metadata: { auditLogId: auditLog.id }
      });
    }

    console.log(`[AUDIT] ${entityType}:${entityId.slice(0, 8)}... | Action: ${action} | Actor: ${actorId?.slice(0, 8) || 'anonymous'}... | Hash: ${bookpiHash.slice(0, 12)}...`);

    return new Response(
      JSON.stringify({
        success: true,
        auditLogId: auditLog.id,
        bookpiHash,
        anomalyDetected: anomalyCheck.isAnomaly,
        anomalyReasons: anomalyCheck.reasons,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Audit log error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error logging audit event" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
