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
import { Sparkles } from "lucide-react";

export default function MainFeed() {
  return (
    <main className="flex-1 lg:ml-64 xl:mr-80 min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* VR Entry Banner */}
        <div className="card-tamv-featured p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Experimenta TAMV en realidad virtual
            </h3>
            <p className="text-sm text-muted-foreground">
              Sumérgete en DreamSpaces y conciertos inmersivos
            </p>
          </div>
          <EnterVRButton />
        </div>

        {/* Hoyo Negro - Gamification Widget */}
        <HoyoNegroWidget />

        {/* Daily Mission */}
        <DailyMissionWidget />

        {/* Q&A Live */}
        <QALiveCard />

        {/* Post Composer */}
        <PostComposer />

        {/* Posts Feed */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            Feed de la Comunidad
          </h2>
          <PostsFeed />
        </div>

        {/* Recommended for You */}
        <RecommendedCarousel />

        {/* Challenges Section */}
        <ChallengesSection />

        {/* Puentes Oníricos */}
        <PuentesOniricosPanel />

        {/* Monetization Overview */}
        <MonetizationOverview />

        {/* Referral League */}
        <ReferralLeague />

        {/* Footer space */}
        <div className="h-20" />
      </div>
    </main>
  );
}
