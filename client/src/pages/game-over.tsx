import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { getGameSummary } from "@/lib/game";
import { formatTimeSpent } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GameOver() {
  const [, setLocation] = useLocation();
  const [playerName, setPlayerName] = useState("");
  const [summary, setSummary] = useState<ReturnType<typeof getGameSummary> | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const gameSummary = getGameSummary();
    
    if (!gameSummary) {
      // No game summary available, redirect to home
      setLocation("/");
      return;
    }
    
    setSummary(gameSummary);
    
    // Pre-fill with username if logged in
    if (user) {
      setPlayerName(user.username);
    }
  }, [setLocation, user]);
  
  const saveScoreMutation = useMutation({
    mutationFn: async () => {
      if (!summary) {
        throw new Error("No game summary to save");
      }
      
      const data = {
        name: playerName.trim(),
        score: summary.score,
        difficulty: summary.highestLevel,
        date: new Date().toISOString(),
      };
      
      const res = await apiRequest("POST", "/api/leaderboard", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save score");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate leaderboard queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard/top"] });
      
      toast({
        title: "Score saved!",
        description: "Your score has been added to the leaderboard.",
      });
      
      // Navigate to leaderboard
      setLocation("/leaderboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving score",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  });
  
  const handleSaveScore = () => {
    if (!playerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to save your score.",
        variant: "destructive",
      });
      return;
    }
    
    if (summary) {
      saveScoreMutation.mutate();
    }
  };
  
  const handlePlayAgain = () => {
    setLocation("/difficulty");
  };
  
  const handleBackToMain = () => {
    setLocation("/");
  };
  
  if (!summary) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <h2 className="text-3xl font-bold font-poppins mb-2 text-white">Game Over!</h2>
          
          <div className="mb-8">
            <div className="text-sm opacity-70 mb-4">Your final score</div>
            <div className="text-5xl font-bold font-poppins text-white mb-6">{summary.score}</div>
            
            <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-6">
              <div className="text-sm opacity-70 mb-2">Statistics</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <div className="opacity-70">Correct Answers</div>
                  <div className="text-white text-lg font-medium">{summary.correctAnswers}</div>
                </div>
                <div className="text-left">
                  <div className="opacity-70">Wrong Answers</div>
                  <div className="text-white text-lg font-medium">{summary.wrongAnswers}</div>
                </div>
                <div className="text-left">
                  <div className="opacity-70">Highest Level</div>
                  <div className="text-white text-lg font-medium">
                    {summary.highestLevel.charAt(0).toUpperCase() + summary.highestLevel.slice(1)}
                  </div>
                </div>
                <div className="text-left">
                  <div className="opacity-70">Time Spent</div>
                  <div className="text-white text-lg font-medium">{formatTimeSpent(summary.timeSpent)}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="player-name" className="block text-sm text-left mb-2 opacity-70">
                Enter your name for the leaderboard:
              </label>
              <input 
                type="text" 
                id="player-name" 
                maxLength={15}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-white bg-opacity-20 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary glass"
                placeholder="Your name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleSaveScore}
              disabled={saveScoreMutation.isPending}
              className="bg-accent hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass flex items-center justify-center"
            >
              {saveScoreMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : "Save Score"}
            </button>
            
            <button 
              onClick={handlePlayAgain}
              className="bg-primary hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass"
            >
              Play Again
            </button>
          </div>
          
          <button 
            onClick={handleBackToMain}
            className="mt-4 text-light opacity-70 hover:opacity-100 transition duration-300"
          >
            Back to Main Menu
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
