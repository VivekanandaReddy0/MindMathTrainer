import { useCallback } from "react";
import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { DifficultyLevel } from "@/lib/types";
import { startGame } from "@/lib/game";

export default function Difficulty() {
  const [, setLocation] = useLocation();
  
  const handleDifficultySelect = useCallback((difficulty: DifficultyLevel) => {
    startGame(difficulty);
    setLocation("/game");
  }, [setLocation]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <h2 className="text-2xl font-bold font-poppins mb-6 text-white">Select Difficulty</h2>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
            <button 
              onClick={() => handleDifficultySelect("easy")}
              className="difficulty-btn bg-green-500 bg-opacity-30 hover:bg-opacity-50 text-white font-poppins font-semibold py-4 px-6 rounded-xl transition duration-300 button-hover glass"
            >
              <div className="text-xl mb-1">Easy</div>
              <div className="text-sm opacity-80">Numbers 0-10</div>
            </button>
            
            <button 
              onClick={() => handleDifficultySelect("medium")}
              className="difficulty-btn bg-yellow-500 bg-opacity-30 hover:bg-opacity-50 text-white font-poppins font-semibold py-4 px-6 rounded-xl transition duration-300 button-hover glass"
            >
              <div className="text-xl mb-1">Medium</div>
              <div className="text-sm opacity-80">Numbers 10-100</div>
            </button>
            
            <button 
              onClick={() => handleDifficultySelect("hard")}
              className="difficulty-btn bg-red-500 bg-opacity-30 hover:bg-opacity-50 text-white font-poppins font-semibold py-4 px-6 rounded-xl transition duration-300 button-hover glass"
            >
              <div className="text-xl mb-1">Hard</div>
              <div className="text-sm opacity-80">Numbers 100-1000</div>
            </button>
          </div>
          
          <Link href="/">
            <button className="text-light opacity-70 hover:opacity-100 transition duration-300">
              <i className="fas fa-arrow-left mr-2"></i> Back
            </button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
