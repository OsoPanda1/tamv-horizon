import { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Minimize, List, X, Shuffle, Repeat, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  type: "audio" | "video";
  src: string;
  thumbnail?: string;
  duration?: number;
}

interface MultimediaPlayerProps {
  playlist?: MediaItem[];
  currentMedia?: MediaItem;
  onMediaChange?: (media: MediaItem) => void;
  mini?: boolean;
  className?: string;
}

export default function MultimediaPlayer({
  playlist = [],
  currentMedia,
  onMediaChange,
  mini = false,
  className
}: MultimediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeMedia = currentMedia || playlist[currentIndex];
  const mediaRef = activeMedia?.type === "video" ? videoRef : audioRef;

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleTimeUpdate = () => setCurrentTime(media.currentTime);
    const handleDurationChange = () => setDuration(media.duration || 0);
    const handleEnded = () => {
      if (repeatMode === "one") {
        media.currentTime = 0;
        media.play();
      } else if (repeatMode === "all" || currentIndex < playlist.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    media.addEventListener("timeupdate", handleTimeUpdate);
    media.addEventListener("durationchange", handleDurationChange);
    media.addEventListener("ended", handleEnded);

    return () => {
      media.removeEventListener("timeupdate", handleTimeUpdate);
      media.removeEventListener("durationchange", handleDurationChange);
      media.removeEventListener("ended", handleEnded);
    };
  }, [activeMedia, repeatMode, currentIndex, playlist.length]);

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!mediaRef.current) return;
    mediaRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) setIsMuted(false);
  };

  const playPrevious = () => {
    if (currentTime > 3 && mediaRef.current) {
      mediaRef.current.currentTime = 0;
      return;
    }
    const newIndex = isShuffled 
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(newIndex);
    onMediaChange?.(playlist[newIndex]);
    setIsPlaying(true);
  };

  const playNext = () => {
    const newIndex = isShuffled 
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex + 1) % playlist.length;
    setCurrentIndex(newIndex);
    onMediaChange?.(playlist[newIndex]);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!activeMedia) {
    return (
      <div className={cn("card-tamv p-4 text-center text-muted-foreground", className)}>
        <p>No hay media para reproducir</p>
      </div>
    );
  }

  // Mini player
  if (mini) {
    return (
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50",
        "flex items-center gap-4 p-2 px-4",
        className
      )}>
        {/* Thumbnail */}
        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
          <img 
            src={activeMedia.thumbnail || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100"}
            alt={activeMedia.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{activeMedia.title}</p>
          <p className="text-xs text-muted-foreground truncate">{activeMedia.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={playPrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={togglePlay} className="h-10 w-10">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={playNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="w-32 hidden md:block">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={activeMedia.src} />
      </div>
    );
  }

  // Full player
  return (
    <div 
      ref={containerRef}
      className={cn(
        "card-tamv overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* Video/Cover */}
      <div className="relative aspect-video bg-black">
        {activeMedia.type === "video" ? (
          <video
            ref={videoRef}
            src={activeMedia.src}
            className="w-full h-full object-contain"
            poster={activeMedia.thumbnail}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <img
              src={activeMedia.thumbnail || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"}
              alt={activeMedia.title}
              className="w-64 h-64 object-cover rounded-lg shadow-2xl"
            />
          </div>
        )}
        <audio ref={audioRef} src={activeMedia.type === "audio" ? activeMedia.src : undefined} />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Progress bar */}
            <div className="flex items-center gap-2 text-xs">
              <span>{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1 cursor-pointer"
              />
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={isShuffled ? "text-primary" : ""}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={playPrevious}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={togglePlay}
                  className="h-12 w-12 btn-tamv-gold"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={playNext}>
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setRepeatMode(
                    repeatMode === "none" ? "all" : repeatMode === "all" ? "one" : "none"
                  )}
                  className={repeatMode !== "none" ? "text-primary" : ""}
                >
                  <Repeat className="h-4 w-4" />
                  {repeatMode === "one" && <span className="absolute text-[10px]">1</span>}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>

                <Button variant="ghost" size="icon" onClick={() => setShowPlaylist(!showPlaylist)}>
                  <List className="h-4 w-4" />
                </Button>

                {activeMedia.type === "video" && (
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{activeMedia.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{activeMedia.artist}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Playlist Panel */}
      {showPlaylist && playlist.length > 0 && (
        <div className="border-t border-border max-h-64 overflow-y-auto">
          <div className="p-2 flex items-center justify-between border-b border-border">
            <span className="text-sm font-medium">Playlist ({playlist.length})</span>
            <Button variant="ghost" size="icon" onClick={() => setShowPlaylist(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {playlist.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentIndex(index);
                onMediaChange?.(item);
                setIsPlaying(true);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors",
                index === currentIndex && "bg-primary/10"
              )}
            >
              <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                <img
                  src={item.thumbnail || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100"}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.artist}</p>
              </div>
              {index === currentIndex && isPlaying && (
                <div className="flex gap-0.5">
                  <div className="w-1 h-4 bg-primary rounded animate-pulse" />
                  <div className="w-1 h-4 bg-primary rounded animate-pulse" style={{ animationDelay: "0.1s" }} />
                  <div className="w-1 h-4 bg-primary rounded animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
