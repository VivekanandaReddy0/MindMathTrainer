import { useState, useEffect } from "react";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { LeaderboardEntryComponent } from "@/components/leaderboard-entry";
import { getLeaderboard } from "@/lib/storage";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  
  useEffect(() => {
    // Update leaderboard when component mounts
    setLeaderboard(getLeaderboard());
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <h2 className="text-2xl font-bold font-poppins mb-6 text-white">Leaderboard</h2>
          
          <div className="mb-8">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <LeaderboardEntryComponent 
                  key={`${entry.name}-${entry.score}-${index}`}
                  entry={entry}
                  rank={index + 1}
                  animationDelay={index * 0.1}
                />
              ))
            ) : (
              <div id="no-scores-message" className="py-8 text-center">
                <div className="text-xl opacity-70">No scores yet!</div>
                <div className="text-sm opacity-50 mt-2">Be the first to set a high score</div>
              </div>
            )}
          </div>
          
          <Link href="/">
            <button className="text-light opacity-70 hover:opacity-100 transition duration-300">
              <i className="fas fa-arrow-left mr-2"></i> Back to Menu
            </button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
