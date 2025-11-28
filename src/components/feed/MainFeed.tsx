import PostComposer from "@/components/home/PostComposer";
import QALiveCard from "@/components/home/QALiveCard";
import RecommendedCarousel from "@/components/home/RecommendedCarousel";
import ChallengesSection from "@/components/home/ChallengesSection";
import MonetizationOverview from "@/components/home/MonetizationOverview";
import PuentesOniricosPanel from "@/components/puentes/PuentesOniricosPanel";
import ReferralLeague from "@/components/referrals/ReferralLeague";
import EnterVRButton from "@/components/home/EnterVRButton";

export default function MainFeed() {
  return (
    <main className="flex-1 lg:ml-64 xl:mr-80 min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* VR Entry Banner */}
        <div className="card-tamv-featured p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold">Experimenta TAMV en realidad virtual</h3>
            <p className="text-sm text-muted-foreground">
              Sumérgete en DreamSpaces y conciertos inmersivos
            </p>
          </div>
          <EnterVRButton />
        </div>

        {/* Q&A Live */}
        <QALiveCard />

        {/* Post Composer */}
        <PostComposer />

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
