import { useState } from "react";
import { Plus, Play } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasNew: boolean;
  mediaUrl: string;
  mediaType: "image" | "video";
}

const MOCK_STORIES: Story[] = [
  { id: "s1", username: "ArteLATAM", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600", mediaType: "image" },
  { id: "s2", username: "DreamMaker", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600", mediaType: "image" },
  { id: "s3", username: "XR_Pioneer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", mediaType: "image" },
  { id: "s4", username: "SonicTAMV", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80", hasNew: false, mediaUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600", mediaType: "image" },
  { id: "s5", username: "CodexMexa", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600", mediaType: "image" },
  { id: "s6", username: "NeonArts", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", hasNew: false, mediaUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600", mediaType: "image" },
  { id: "s7", username: "TAMVMusic", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600", mediaType: "image" },
  { id: "s8", username: "PixelDream", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80", hasNew: true, mediaUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600", mediaType: "image" },
];

export default function StoriesBar() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
        {/* Add Story */}
        <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/40">
              <Plus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground w-16 text-center truncate">Tu historia</span>
        </button>

        {/* Stories */}
        {MOCK_STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div className={cn(
              "p-[2px] rounded-full",
              story.hasNew
                ? "bg-gradient-to-tr from-primary via-accent to-primary"
                : "bg-muted"
            )}>
              <Avatar className="h-16 w-16 border-2 border-background">
                <AvatarImage src={story.avatar} className="object-cover" />
                <AvatarFallback>{story.username[0]}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-[10px] text-muted-foreground w-16 text-center truncate group-hover:text-foreground transition-colors">
              {story.username}
            </span>
          </button>
        ))}
      </div>

      {/* Story Viewer Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-md p-0 bg-background border-border overflow-hidden">
          {selectedStory && (
            <div className="relative aspect-[9/16] max-h-[80vh]">
              <img
                src={selectedStory.mediaUrl}
                alt={selectedStory.username}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-background/80 to-transparent">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 ring-2 ring-primary">
                    <AvatarImage src={selectedStory.avatar} />
                    <AvatarFallback>{selectedStory.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-foreground">{selectedStory.username}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
