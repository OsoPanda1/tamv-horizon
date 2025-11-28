import { Trophy, Users, Gift, ChevronRight, Crown, Medal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { REFERRAL_LEVELS } from "@/data/mockData";
import { ReferralStats } from "@/types/tamv";

// Mock user referral stats
const userReferralStats: ReferralStats = {
  totalReferrals: 347,
  activeReferrals: 289,
  currentTier: REFERRAL_LEVELS[0],
  earnedRewards: 0,
  pendingRewards: 0,
  rank: 156
};

// Mock leaderboard
const leaderboard = [
  { rank: 1, name: "Carlos M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", referrals: 8547, tier: "diamond" },
  { rank: 2, name: "María L.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", referrals: 7234, tier: "diamond" },
  { rank: 3, name: "Juan G.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", referrals: 6891, tier: "platinum" },
  { rank: 4, name: "Ana R.", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100", referrals: 5432, tier: "platinum" },
  { rank: 5, name: "Diego S.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", referrals: 4987, tier: "gold" }
];

const getTierIcon = (tier: string) => {
  switch (tier) {
    case "diamond": return <Crown className="h-4 w-4 text-cyan-400" />;
    case "platinum": return <Star className="h-4 w-4 text-purple-400" />;
    case "gold": return <Medal className="h-4 w-4 text-yellow-400" />;
    case "silver": return <Medal className="h-4 w-4 text-gray-400" />;
    default: return <Medal className="h-4 w-4 text-orange-400" />;
  }
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case "diamond": return "from-cyan-500 to-blue-500";
    case "platinum": return "from-purple-500 to-pink-500";
    case "gold": return "from-yellow-500 to-orange-500";
    case "silver": return "from-gray-400 to-gray-500";
    default: return "from-orange-500 to-red-500";
  }
};

export default function ReferralLeague() {
  const nextTier = REFERRAL_LEVELS.find(l => l.minReferrals > userReferralStats.totalReferrals);
  const progressToNext = nextTier 
    ? ((userReferralStats.totalReferrals - userReferralStats.currentTier.minReferrals) / 
       (nextTier.minReferrals - userReferralStats.currentTier.minReferrals)) * 100
    : 100;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-bold text-lg">Liga de Embajadores</h2>
            <p className="text-xs text-muted-foreground">Competencia de 3 meses</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Reglas
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Your Stats */}
      <div className="card-tamv-featured p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTierColor(userReferralStats.currentTier.tier)} flex items-center justify-center`}>
              {getTierIcon(userReferralStats.currentTier.tier)}
            </div>
            <div>
              <p className="font-bold text-lg">{userReferralStats.totalReferrals}</p>
              <p className="text-xs text-muted-foreground">referidos totales</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">#{userReferralStats.rank}</p>
            <p className="text-xs text-muted-foreground">tu ranking</p>
          </div>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progreso al siguiente nivel</span>
              <span className="text-primary font-medium">
                {userReferralStats.totalReferrals} / {nextTier.minReferrals}
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Faltan <span className="text-foreground font-medium">{nextTier.minReferrals - userReferralStats.totalReferrals}</span> referidos para {nextTier.rewardDescription}
            </p>
          </div>
        )}

        {/* Referral Link */}
        <div className="p-3 rounded-lg bg-muted/30 mb-4">
          <p className="text-xs text-muted-foreground mb-2">Tu link de referido:</p>
          <div className="flex gap-2">
            <code className="flex-1 text-xs bg-background p-2 rounded truncate">
              tamv.online/r/tu-codigo
            </code>
            <Button size="sm" variant="outline" className="btn-tamv-ghost">
              Copiar
            </Button>
          </div>
        </div>

        <Button className="w-full btn-tamv-gold">
          <Gift className="h-4 w-4 mr-2" />
          Invitar amigos
        </Button>
      </div>

      {/* Reward Tiers */}
      <div className="card-tamv p-4">
        <h3 className="font-semibold text-sm mb-3">Niveles de recompensa</h3>
        <div className="space-y-2">
          {REFERRAL_LEVELS.map((level) => (
            <div 
              key={level.tier}
              className={`flex items-center justify-between p-2 rounded-lg ${
                userReferralStats.totalReferrals >= level.minReferrals 
                  ? "bg-primary/10 border border-primary/30" 
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {getTierIcon(level.tier)}
                <span className="text-sm capitalize">{level.tier}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{level.minReferrals.toLocaleString()}+ referidos</p>
                <p className="text-xs text-muted-foreground">{level.rewardMonths} {level.rewardMonths === 1 ? "mes" : "meses"} gratis</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card-tamv p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Top 5 Embajadores</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary">
            Ver top 1000
          </Button>
        </div>
        
        <div className="space-y-2">
          {leaderboard.map((user) => (
            <div 
              key={user.rank}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <span className={`w-6 text-center font-bold ${
                user.rank === 1 ? "text-yellow-400" :
                user.rank === 2 ? "text-gray-400" :
                user.rank === 3 ? "text-orange-400" :
                "text-muted-foreground"
              }`}>
                {user.rank}
              </span>
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {getTierIcon(user.tier)}
                <span className="text-sm font-bold">{user.referrals.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
