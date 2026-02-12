import { Play, Heart, MessageCircle, Share2, Volume2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reel {
  id: string;
  thumbnail: string;
  views: number;
  likes: number;
  creator: string;
  description: string;
}

const MOCK_REELS: Reel[] = [
  { id: "r1", thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=700", views: 12400, likes: 890, creator: "SonicTAMV", description: "Concierto sensorial en DreamSpace #XR" },
  { id: "r2", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700", views: 8900, likes: 567, creator: "DreamMaker", description: "Mi nuevo DreamSpace inmersivo" },
  { id: "r3", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700", views: 15200, likes: 1230, creator: "NeonArts", description: "Arte digital en VR #TAMV" },
  { id: "r4", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=700", views: 6700, likes: 445, creator: "XR_Pioneer", description: "Tutorial: Crea tu primer espacio XR" },
  { id: "r5", thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&h=700", views: 21000, likes: 1890, creator: "ArteLATAM", description: "Galería virtual LATAM" },
  { id: "r6", thumbnail: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=700", views: 9800, likes: 720, creator: "PixelDream", description: "Subasta de arte digital NFT" },
];

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function ReelsGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Reels TAMV
        </h2>
        <button className="text-sm text-primary hover:underline">Ver todos</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {MOCK_REELS.map((reel) => (
          <div
            key={reel.id}
            className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={reel.thumbnail}
              alt={reel.description}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-14 w-14 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                <Play className="h-7 w-7 text-primary-foreground ml-0.5" />
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-xs font-semibold text-foreground line-clamp-2 mb-1">
                {reel.description}
              </p>
              <p className="text-[10px] text-muted-foreground">@{reel.creator}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatCount(reel.views)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {formatCount(reel.likes)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
