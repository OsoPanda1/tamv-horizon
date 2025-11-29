import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Algoritmo de Precios Dinámicos TAMV
interface PricingFactors {
  basePrice: number;
  scarcityFactor: number;
  demandFactor: number;
  timeFactor: number;
  trendFactor: number;
  qualityFactor: number;
}

function calculateDynamicPrice(factors: PricingFactors): number {
  const { basePrice, scarcityFactor, demandFactor, timeFactor, trendFactor, qualityFactor } = factors;
  
  // Precio = Base * (1 + suma de factores ponderados)
  const totalMultiplier = 1 + 
    (scarcityFactor * 0.25) +    // Escasez: 25% peso
    (demandFactor * 0.30) +      // Demanda: 30% peso
    (timeFactor * 0.15) +        // Tiempo: 15% peso
    (trendFactor * 0.20) +       // Tendencia: 20% peso
    (qualityFactor * 0.10);      // Calidad: 10% peso
  
  // Limitar variación máxima al ±50%
  const cappedMultiplier = Math.max(0.5, Math.min(1.5, totalMultiplier));
  
  return Math.round(basePrice * cappedMultiplier * 100) / 100;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { entityType, entityId, action = "calculate" } = await req.json();

    if (!entityType || !entityId) {
      throw new Error("entityType and entityId are required");
    }

    let result: Record<string, unknown> = {};

    if (entityType === "concert") {
      const { data: concert } = await supabase
        .from("concerts")
        .select("*, concert_tickets(count)")
        .eq("id", entityId)
        .single();

      if (!concert) throw new Error("Concert not found");

      // Calcular factores
      const basePrice = concert.ticket_price;
      const ticketsSold = concert.current_attendees || 0;
      const maxTickets = concert.max_attendees || 1000;
      const occupancyRate = ticketsSold / maxTickets;

      // Factor de escasez (más caro cuando quedan pocos)
      const scarcityFactor = occupancyRate > 0.8 ? 0.3 : occupancyRate > 0.5 ? 0.1 : 0;

      // Factor de demanda (basado en velocidad de ventas)
      const { count: recentSales } = await supabase
        .from("concert_tickets")
        .select("*", { count: "exact", head: true })
        .eq("concert_id", entityId)
        .gte("purchased_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      const demandFactor = (recentSales || 0) > 50 ? 0.25 : (recentSales || 0) > 20 ? 0.1 : 0;

      // Factor de tiempo (más caro cerca del evento)
      const hoursUntil = (new Date(concert.start_time).getTime() - Date.now()) / (1000 * 60 * 60);
      const timeFactor = hoursUntil < 24 ? 0.2 : hoursUntil < 48 ? 0.1 : 0;

      // Factor de tendencia (basado en interacciones)
      const { count: interactions } = await supabase
        .from("user_interactions")
        .select("*", { count: "exact", head: true })
        .eq("entity_type", "concert")
        .eq("entity_id", entityId)
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      const trendFactor = (interactions || 0) > 100 ? 0.2 : (interactions || 0) > 50 ? 0.1 : 0;

      // Factor de calidad (basado en historial del creador)
      const { data: creatorConcerts } = await supabase
        .from("concerts")
        .select("current_attendees")
        .eq("creator_id", concert.creator_id)
        .eq("status", "ended");
      
      const avgAttendees = creatorConcerts && creatorConcerts.length > 0
        ? creatorConcerts.reduce((sum, c) => sum + (c.current_attendees || 0), 0) / creatorConcerts.length
        : 0;
      const qualityFactor = avgAttendees > 500 ? 0.15 : avgAttendees > 100 ? 0.05 : 0;

      const dynamicPrice = calculateDynamicPrice({
        basePrice,
        scarcityFactor,
        demandFactor,
        timeFactor,
        trendFactor,
        qualityFactor
      });

      result = {
        entityType: "concert",
        entityId,
        basePrice,
        dynamicPrice,
        priceChange: dynamicPrice - basePrice,
        priceChangePercent: ((dynamicPrice - basePrice) / basePrice * 100).toFixed(1),
        factors: {
          scarcity: { value: scarcityFactor, description: `Ocupación: ${(occupancyRate * 100).toFixed(0)}%` },
          demand: { value: demandFactor, description: `Ventas 24h: ${recentSales || 0}` },
          time: { value: timeFactor, description: `Horas hasta evento: ${Math.round(hoursUntil)}` },
          trend: { value: trendFactor, description: `Interacciones 7d: ${interactions || 0}` },
          quality: { value: qualityFactor, description: `Promedio asistentes: ${Math.round(avgAttendees)}` }
        }
      };

      // Actualizar precio si es acción de update
      if (action === "update") {
        await supabase
          .from("concerts")
          .update({ ticket_price: dynamicPrice })
          .eq("id", entityId);
        
        result.updated = true;
      }

    } else if (entityType === "auction") {
      const { data: auction } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", entityId)
        .single();

      if (!auction) throw new Error("Auction not found");

      // Sugerir precio mínimo de siguiente puja
      const currentBid = auction.current_bid || auction.starting_price;
      const bidIncrement = currentBid < 100 ? 5 : currentBid < 1000 ? 10 : currentBid * 0.02;
      
      result = {
        entityType: "auction",
        entityId,
        currentBid,
        suggestedNextBid: currentBid + bidIncrement,
        minBidIncrement: bidIncrement,
        bidCount: auction.bid_count
      };

    } else if (entityType === "dreamspace") {
      const { data: space } = await supabase
        .from("dreamspaces")
        .select("*")
        .eq("id", entityId)
        .single();

      if (!space) throw new Error("DreamSpace not found");

      const basePrice = space.entry_price || 0;
      
      // Factor basado en rating
      const qualityFactor = (space.rating || 0) > 4 ? 0.15 : (space.rating || 0) > 3 ? 0.05 : 0;
      
      // Factor basado en visitantes
      const demandFactor = (space.visitors_count || 0) > 1000 ? 0.2 : (space.visitors_count || 0) > 100 ? 0.1 : 0;

      const dynamicPrice = calculateDynamicPrice({
        basePrice,
        scarcityFactor: 0,
        demandFactor,
        timeFactor: 0,
        trendFactor: 0,
        qualityFactor
      });

      result = {
        entityType: "dreamspace",
        entityId,
        basePrice,
        dynamicPrice,
        factors: {
          quality: { value: qualityFactor, description: `Rating: ${space.rating || 0}` },
          demand: { value: demandFactor, description: `Visitantes: ${space.visitors_count || 0}` }
        }
      };
    }

    console.log(`[DYNAMIC_PRICING] ${entityType}:${entityId.slice(0, 8)}... | Action: ${action}`);

    return new Response(
      JSON.stringify({
        ...result,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Dynamic pricing error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error calculating price" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
