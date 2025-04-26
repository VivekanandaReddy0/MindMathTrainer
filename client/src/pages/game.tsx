import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/glass-card";
import { TimerBar } from "@/components/timer-bar";
import { 
  getGameState, 
  generateQuestion, 
  checkAnswer, 
  getDifficultyDisplay, 
  endGame
} from "@/lib/game";

export default function Game() {
  const [, setLocation] = useLocation();
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [timerKey, setTimerKey] = useState(0); // To force timer reset
  const answerInputRef = useRef<HTMLInputElement>(null);
  
  // Load initial game state
  useEffect(() => {
    const gameState = getGameState();
    
    if (!gameState) {
      // No game in progress, redirect to difficulty selection
      setLocation("/difficulty");
      return;
    }
    
    setScore(gameState.score);
    setDifficulty(getDifficultyDisplay(gameState.difficulty));
    
    // Generate first question
    nextQuestion();
    
    // Focus the input field
    if (answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [setLocation]);
  
  const nextQuestion = useCallback(() => {
    const question = generateQuestion();
    setQuestion(question.questionText);
    
    // Clear feedback and answer input
    setFeedback(null);
    setAnswer("");
    
    // Reset timer
    setTimerKey(prev => prev + 1);
    
    // Focus the input field after a short delay (to ensure it's mounted)
    setTimeout(() => {
      if (answerInputRef.current) {
        answerInputRef.current.focus();
      }
    }, 100);
  }, []);
  
  const handleTimeUp = useCallback(() => {
    const result = checkAnswer(parseInt("0", 10));
    setFeedback({ message: "Time's up!", isCorrect: false });
    setScore(result.newScore);
    
    // If difficulty changed, update it
    if (result.newDifficulty) {
      setDifficulty(getDifficultyDisplay(result.newDifficulty));
    }
    
    // Move to next question after delay
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }, [nextQuestion]);
  
  const handleSubmitAnswer = useCallback(() => {
    // Don't allow submission while showing feedback
    if (feedback) return;
    
    if (!answer.trim()) {
      setFeedback({ message: "Please enter a number!", isCorrect: false });
      return;
    }
    
    const result = checkAnswer(parseInt(answer, 10));
    
    // Update score
    setScore(result.newScore);
    
    // Show feedback
    setFeedback({ 
      message: result.isCorrect ? "Correct! ✅" : "Wrong ❌", 
      isCorrect: result.isCorrect 
    });
    
    // If difficulty changed, update it
    if (result.newDifficulty) {
      setDifficulty(getDifficultyDisplay(result.newDifficulty));
    }
    
    // Move to next question after delay
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }, [answer, feedback, nextQuestion]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmitAnswer();
    }
  }, [handleSubmitAnswer]);
  
  const handleQuitGame = useCallback(() => {
    if (window.confirm("Are you sure you want to quit this game? Your score will be lost.")) {
      endGame();
      setLocation("/game-over");
    }
  }, [setLocation]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium opacity-80">
              <span id="current-difficulty">{difficulty}</span>
            </div>
            
            <div className="text-sm font-medium">
              Score: <span id="score-display" className="text-white">{score}</span>
            </div>
          </div>
          
          <TimerBar 
            key={timerKey}
            duration={30} 
            onTimeUp={handleTimeUp}
            className="mb-6"
          />
          
          <div className="mb-8">
            <div className="text-4xl font-bold font-poppins mb-8 text-white" id="question-display">
              {question}
            </div>
            
            <div className="mb-4">
              <input 
                type="number" 
                id="answer-input"
                ref={answerInputRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-white bg-opacity-20 text-white text-center text-2xl py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary glass"
                placeholder="Your answer"
              />
            </div>
            
            <div 
              className={`h-8 text-xl font-semibold ${feedback ? "" : "hidden"} ${feedback?.isCorrect ? "text-green-400" : "text-red-400"}`}
            >
              {feedback?.message}
            </div>
          </div>
          
          <button 
            onClick={handleSubmitAnswer}
            className="w-full bg-accent hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 button-hover glass"
          >
            Submit
          </button>
          
          <button 
            onClick={handleQuitGame}
            className="mt-4 text-light opacity-70 hover:opacity-100 transition duration-300"
          >
            Quit Game
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
