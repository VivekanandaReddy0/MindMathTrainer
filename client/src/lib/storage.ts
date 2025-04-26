import { LeaderboardEntry } from "./types";

const LEADERBOARD_STORAGE_KEY = "mindmath-leaderboard";

export function saveToLeaderboard(entry: LeaderboardEntry): void {
  // Get existing leaderboard
  const leaderboard = getLeaderboard();
  
  // Add new entry
  leaderboard.push(entry);
  
  // Sort by score (highest first)
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep only top 5
  const topFive = leaderboard.slice(0, 5);
  
  // Save to localStorage
  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(topFive));
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const leaderboard = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    return leaderboard ? JSON.parse(leaderboard) : [];
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    return [];
  }
}

export function clearLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
}
