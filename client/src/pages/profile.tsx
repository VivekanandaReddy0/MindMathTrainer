import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { GlassCard } from "@/components/glass-card";
import { useQuery } from "@tanstack/react-query";
import { LeaderboardEntry as LeaderboardEntryType } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { LeaderboardEntryComponent } from "@/components/leaderboard-entry";
import { DifficultyLevel } from "@/lib/types";

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Use type assertion to handle the difficulty field being a string from the API
  const { data: userScores, isLoading } = useQuery<any[]>({
    queryKey: ['/api/user/scores'],
    enabled: !!user,
  });
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h2>
          <Link href="/auth">
            <button className="px-6 py-2 bg-accent rounded-lg hover:bg-opacity-90 transition">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-poppins mb-2 text-white">Your Profile</h2>
            <div className="text-xl font-medium text-white">{user.username}</div>
            <div className="text-sm opacity-70 mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Your Top Scores</h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : userScores && userScores.length > 0 ? (
              <div className="space-y-3">
                {userScores.map((entry, index) => (
                  <LeaderboardEntryComponent 
                    key={index} 
                    entry={entry} 
                    rank={index + 1} 
                    animationDelay={index * 0.1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-300">
                <p>You haven't played any games yet.</p>
                <p className="mt-2">Start playing to see your scores here!</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Link href="/">
              <button className="text-light opacity-70 hover:opacity-100 transition duration-300">
                Return to Home
              </button>
            </Link>
            
            <Link href="/leaderboard">
              <button className="text-accent hover:text-accent-hover transition duration-300">
                View Global Leaderboard
              </button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}