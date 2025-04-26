import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { getGameSummary, saveScore } from "@/lib/game";
import { formatTimeSpent } from "@/lib/utils";

export default function GameOver() {
  const [, setLocation] = useLocation();
  const [playerName, setPlayerName] = useState("");
  const [summary, setSummary] = useState<ReturnType<typeof getGameSummary> | null>(null);
  
  useEffect(() => {
    const gameSummary = getGameSummary();
    
    if (!gameSummary) {
      // No game summary available, redirect to home
      setLocation("/");
      return;
    }
    
    setSummary(gameSummary);
  }, [setLocation]);
  
  const handleSaveScore = () => {
    if (!playerName.trim()) {
      alert("Please enter your name to save your score.");
      return;
    }
    
    if (summary) {
      saveScore(playerName);
      setLocation("/leaderboard");
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
              className="bg-accent hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass"
            >
              Save Score
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
