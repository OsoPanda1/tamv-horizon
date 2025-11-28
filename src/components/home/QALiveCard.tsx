import { Calendar, Users, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QA_EVENTS } from "@/data/mockData";

export default function QALiveCard() {
  // Get live event or next upcoming
  const liveEvent = QA_EVENTS.find(e => e.isLive);
  const upcomingEvent = QA_EVENTS.find(e => !e.isLive);
  const event = liveEvent || upcomingEvent;

  if (!event) return null;

  const eventTime = new Date(event.startTime);
  const isLive = event.isLive;

  return (
    <div className={`card-tamv-featured overflow-hidden ${isLive ? "animate-glow-pulse" : ""}`}>
      {/* Live Banner */}
      {isLive && (
        <div className="bg-destructive/20 px-4 py-2 flex items-center gap-2">
          <span className="status-live" />
          <span className="text-sm font-semibold text-destructive">EN VIVO AHORA</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Host Avatar */}
          <Avatar className="h-14 w-14 border-2 border-primary/50">
            <AvatarImage src={event.hostAvatar} alt={event.host} />
            <AvatarFallback>{event.host[0]}</AvatarFallback>
          </Avatar>

          {/* Event Info */}
          <div className="flex-1">
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full mb-2">
              {event.topic}
            </span>
            <h3 className="font-bold text-lg mb-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              con <span className="text-foreground font-medium">{event.host}</span>
            </p>
          </div>
        </div>

        {/* Event Stats */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {isLive ? "Ahora" : eventTime.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{event.attendees.toLocaleString()} {isLive ? "viendo" : "interesados"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button className={isLive ? "btn-tamv-gold flex-1" : "btn-tamv-cyan flex-1"}>
            {isLive ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Entrar al Q&A
              </>
            ) : (
              <>
                Reservar lugar
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          <Button variant="outline" className="btn-tamv-ghost">
            <Calendar className="h-4 w-4 mr-2" />
            Calendario
          </Button>
        </div>
      </div>
    </div>
  );
}
