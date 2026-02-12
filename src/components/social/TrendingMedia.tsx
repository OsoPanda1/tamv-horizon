import { Music, Image, Play, TrendingUp, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  type: "photo" | "video" | "music";
  thumbnail: string;
  title: string;
  creator: string;
  engagement: number;
}

const TRENDING_MEDIA: MediaItem[] = [
  { id: "m1", type: "photo", thumbnail: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300", title: "Aurora Digital TAMV", creator: "ArteLATAM", engagement: 4500 },
  { id: "m2", type: "video", thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300", title: "Live Concert XR", creator: "SonicTAMV", engagement: 8900 },
  { id: "m3", type: "music", thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300", title: "Ritmo Civilizatorio", creator: "BeatMaker", engagement: 3200 },
  { id: "m4", type: "photo", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", title: "DreamSpace Vista", creator: "DreamMaker", engagement: 5600 },
  { id: "m5", type: "video", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300", title: "Tutorial VR Básico", creator: "XR_Pioneer", engagement: 7100 },
  { id: "m6", type: "music", thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300", title: "Ambient Mexa", creator: "TAMVMusic", engagement: 2800 },
];

const TYPE_ICON = {
  photo: Image,
  video: Play,
  music: Headphones,
};

export default function TrendingMedia() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Multimedia Trending
        </h2>
        <button className="text-sm text-primary hover:underline">Explorar</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {TRENDING_MEDIA.map((item) => {
          const Icon = TYPE_ICON[item.type];
          return (
            <div
              key={item.id}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Type indicator */}
              <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center">
                <Icon className="h-3 w-3 text-primary" />
              </div>

              {/* Info on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs font-semibold truncate">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">@{item.creator}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
