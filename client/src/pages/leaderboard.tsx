import { useState } from "react";
import { Link } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { LeaderboardEntryComponent } from "@/components/leaderboard-entry";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { LeaderboardEntry as LeaderboardEntryType } from "@/lib/types";

export default function Leaderboard() {
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardEntryType[]>({
    queryKey: ["/api/leaderboard/top"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard/top");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }
      return response.json();
    }
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <h2 className="text-2xl font-bold font-poppins mb-6 text-white">Leaderboard</h2>
          
          <div className="mb-8">
            {isLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <div className="text-sm opacity-70">Loading leaderboard...</div>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <div className="text-xl text-red-400 mb-2">Failed to load leaderboard</div>
                <div className="text-sm opacity-70">Please try again later</div>
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
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
