import { useState } from "react";
import PostComposer from "@/components/home/PostComposer";
import QALiveCard from "@/components/home/QALiveCard";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import ChallengesSection from "@/components/home/ChallengesSection";
import MonetizationOverview from "@/components/home/MonetizationOverview";
import PuentesOniricosPanel from "@/components/puentes/PuentesOniricosPanel";
import ReferralLeague from "@/components/referrals/ReferralLeague";
import EnterVRButton from "@/components/home/EnterVRButton";
import DailyMissionWidget from "@/components/home/DailyMissionWidget";
import PostsFeed from "@/components/feed/PostsFeed";
import HoyoNegroWidget from "@/components/gamification/HoyoNegroWidget";
import StoriesBar from "@/components/social/StoriesBar";
import ReelsGrid from "@/components/social/ReelsGrid";
import TrendingMedia from "@/components/social/TrendingMedia";
import FeaturedCourses from "@/components/social/FeaturedCourses";
import { Sparkles, Flame, Compass, GraduationCap, Image } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MainFeed() {
  const [feedTab, setFeedTab] = useState("foryou");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <main className="flex-1 lg:ml-64 xl:mr-80 min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {/* Stories Bar */}
        <div className="card-tamv p-3 -mx-1">
          <StoriesBar />
        </div>

        {/* VR Entry Banner - Compact */}
        <div className="card-tamv-featured p-3 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Experiencias XR Inmersivas
            </h3>
            <p className="text-xs text-muted-foreground">DreamSpaces y conciertos sensoriales</p>
          </div>
          <EnterVRButton />
        </div>

        {/* Feed Navigation Tabs */}
        <Tabs value={feedTab} onValueChange={setFeedTab}>
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="foryou" className="text-xs gap-1">
              <Flame className="h-3 w-3" /> Para ti
            </TabsTrigger>
            <TabsTrigger value="explore" className="text-xs gap-1">
              <Compass className="h-3 w-3" /> Explorar
            </TabsTrigger>
            <TabsTrigger value="reels" className="text-xs gap-1">
              <Image className="h-3 w-3" /> Reels
            </TabsTrigger>
            <TabsTrigger value="media" className="text-xs gap-1">
              <Sparkles className="h-3 w-3" /> Media
            </TabsTrigger>
            <TabsTrigger value="learn" className="text-xs gap-1">
              <GraduationCap className="h-3 w-3" /> Cursos
            </TabsTrigger>
          </TabsList>

          {/* For You Tab - Main Social Feed */}
          <TabsContent value="foryou" className="space-y-4 mt-4">
            {/* Post Composer */}
            <PostComposer onPostCreated={() => setRefreshTrigger(n => n + 1)} />

            {/* Q&A Live */}
            <QALiveCard />

            {/* Trending Media Grid */}
            <TrendingMedia />

            {/* Posts Feed */}
            <div className="space-y-3">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Publicaciones
              </h2>
              <PostsFeed refreshTrigger={refreshTrigger} />
            </div>

            {/* Recommended */}
            <RecommendedCarousel />
          </TabsContent>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-4 mt-4">
            <RecommendedCarousel />
            <ChallengesSection />
            <PuentesOniricosPanel />
            <HoyoNegroWidget />
            <DailyMissionWidget />
          </TabsContent>

          {/* Reels Tab */}
          <TabsContent value="reels" className="mt-4">
            <ReelsGrid />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4 mt-4">
            <TrendingMedia />
            <MonetizationOverview />
            <ReferralLeague />
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-4 mt-4">
            <FeaturedCourses />
            <ChallengesSection />
          </TabsContent>
        </Tabs>

        {/* Footer space */}
        <div className="h-20" />
      </div>
    </main>
  );
}
