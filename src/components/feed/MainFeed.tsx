/**
 * 📱 TAMV SOCIAL NEXUS - FEED PRINCIPAL CIVILIZATORIO
 * Arquitectura: Social-First 78% Visual / 22% Text
 */
import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoriesBar from "@/components/social/StoriesBar";
import ReelsGrid from "@/components/social/ReelsGrid";
import TrendingMedia from "@/components/social/TrendingMedia";
import FeaturedCourses from "@/components/social/FeaturedCourses";
import PostsFeed from "@/components/feed/PostsFeed";
import PostComposer from "@/components/home/PostComposer";
import QALiveCard from "@/components/home/QALiveCard";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import ChallengesSection from "@/components/home/ChallengesSection";
import DailyMissionWidget from "@/components/home/DailyMissionWidget";
import EnterVRButton from "@/components/home/EnterVRButton";
import MonetizationOverview from "@/components/home/MonetizationOverview";
import ReferralLeague from "@/components/referrals/ReferralLeague";
import { Flame, Compass, Film, Image, GraduationCap, Music } from "lucide-react";

export default function MainFeed() {
  const [activeTab, setActiveTab] = useState("feed");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <main className="pt-16 lg:pl-72 lg:pr-80 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Stories Bar - Always visible */}
        <StoriesBar />

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="w-full justify-start gap-1 bg-card/50 backdrop-blur-md border border-border p-1.5 rounded-2xl overflow-x-auto">
            <TabsTrigger value="feed" className="gap-2 rounded-xl text-xs font-orbitron tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Flame className="h-3.5 w-3.5" /> Para Ti
            </TabsTrigger>
            <TabsTrigger value="explore" className="gap-2 rounded-xl text-xs font-orbitron tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Compass className="h-3.5 w-3.5" /> Explorar
            </TabsTrigger>
            <TabsTrigger value="reels" className="gap-2 rounded-xl text-xs font-orbitron tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Film className="h-3.5 w-3.5" /> Reels
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2 rounded-xl text-xs font-orbitron tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Image className="h-3.5 w-3.5" /> Media
            </TabsTrigger>
            <TabsTrigger value="music" className="gap-2 rounded-xl text-xs font-orbitron tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Music className="h-3.5 w-3.5" /> Música
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2 rounded-xl text-xs font-orbitron tracking-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GraduationCap className="h-3.5 w-3.5" /> Cursos
            </TabsTrigger>
          </TabsList>

          {/* FEED TAB - Main Social Experience */}
          <TabsContent value="feed" className="mt-6 space-y-8">
            {/* Q&A Live Card */}
            <QALiveCard />

            {/* Post Composer */}
            <PostComposer onPostCreated={handlePostCreated} />

            {/* VR Entry */}
            <EnterVRButton />

            {/* Recommendations */}
            <RecommendedCarousel />

            {/* Posts Feed */}
            <PostsFeed refreshTrigger={refreshTrigger} />

            {/* Challenges */}
            <ChallengesSection />

            {/* Daily Mission */}
            <DailyMissionWidget />

            {/* Referral League */}
            <ReferralLeague />

            {/* Monetization Overview */}
            <MonetizationOverview />
          </TabsContent>

          {/* EXPLORE TAB */}
          <TabsContent value="explore" className="mt-6 space-y-8">
            <TrendingMedia />
            <RecommendedCarousel />
            <ChallengesSection />
          </TabsContent>

          {/* REELS TAB */}
          <TabsContent value="reels" className="mt-6">
            <ReelsGrid />
          </TabsContent>

          {/* MEDIA TAB */}
          <TabsContent value="media" className="mt-6">
            <TrendingMedia />
          </TabsContent>

          {/* MUSIC TAB */}
          <TabsContent value="music" className="mt-6">
            <MusicSection />
          </TabsContent>

          {/* COURSES TAB */}
          <TabsContent value="courses" className="mt-6">
            <FeaturedCourses />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

/**
 * Music Section with audio tracks
 */
function MusicSection() {
  const tracks = [
    { id: "1", title: "Amanecer Digital", artist: "TAMV Collective", genre: "Ambient", duration: "4:32", plays: 12400 },
    { id: "2", title: "Protocolo Soberano", artist: "Citemesh", genre: "Electronica", duration: "3:45", plays: 8900 },
    { id: "3", title: "Isabella's Dream", artist: "Nexus Orchestra", genre: "Cinematic", duration: "5:12", plays: 15600 },
    { id: "4", title: "Quetzalcoatl Rising", artist: "Aztec Pulse", genre: "Tribal Techno", duration: "6:01", plays: 22100 },
    { id: "5", title: "Nubiwallet Blues", artist: "Economy Band", genre: "Jazz Fusion", duration: "4:18", plays: 6700 },
    { id: "6", title: "DreamSpace Frequencies", artist: "XR Synths", genre: "Synthwave", duration: "3:55", plays: 19300 },
    { id: "7", title: "Guardianía Nocturna", artist: "Anubis Sound", genre: "Dark Ambient", duration: "7:22", plays: 11200 },
    { id: "8", title: "Federación Libre", artist: "LATAM Unidos", genre: "Latin Electronic", duration: "4:45", plays: 28900 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-1.5 w-8 bg-primary rounded-full" style={{ boxShadow: "0 0 10px hsl(215 70% 55%)" }} />
        <h2 className="font-orbitron font-bold text-xl tracking-tighter text-foreground uppercase">
          Radio TAMV
        </h2>
      </div>

      <div className="grid gap-2">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-card/60 border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground">{track.artist} • {track.genre}</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
              <span>{track.duration}</span>
              <span>{(track.plays / 1000).toFixed(1)}K</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Flame className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
