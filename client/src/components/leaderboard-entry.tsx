import React from "react";
import { LeaderboardEntry as LocalLeaderboardEntry } from "@/lib/types";
import { LeaderboardEntry as DbLeaderboardEntry } from "@shared/schema";

// Create a combined type that works with both local and DB leaderboard entries
type CombinedEntry = {
  name: string;
  score: number;
  difficulty: string;
  date: string;
};

interface LeaderboardEntryProps {
  entry: LocalLeaderboardEntry | DbLeaderboardEntry | any;
  rank: number;
  animationDelay?: number;
}

export function LeaderboardEntryComponent({ entry, rank, animationDelay = 0 }: LeaderboardEntryProps) {
  let rankBgClass;
  if (rank === 1) rankBgClass = "bg-primary";
  else if (rank === 2) rankBgClass = "bg-secondary bg-opacity-70";
  else if (rank === 3) rankBgClass = "bg-accent bg-opacity-70";
  else rankBgClass = "bg-white bg-opacity-20";
  
  return (
    <div 
      className="leaderboard-entry bg-white bg-opacity-10 rounded-xl p-4 mb-2 flex justify-between items-center animate-slide-up"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full ${rankBgClass} flex items-center justify-center font-bold mr-3`}>
          {rank}
        </div>
        <div className="text-left">
          <div className="font-medium text-white">{entry.name}</div>
          <div className="text-xs opacity-70">{entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)} Level</div>
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{entry.score}</div>
    </div>
  );
}
