import { 
  GameState, 
  DifficultyLevel, 
  Question, 
  Operation, 
  AnswerResult 
} from "./types";
import { saveToLeaderboard } from "./storage";

// Game state is stored in memory during play
let gameState: GameState | null = null;

export function startGame(difficulty: DifficultyLevel): void {
  gameState = {
    difficulty,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    currentQuestion: null,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    questionStartTime: Date.now(),
    highestLevel: difficulty,
    gameStartTime: Date.now()
  };
}

export function getGameState(): GameState | null {
  return gameState;
}

export function getDifficultyDisplay(difficulty: DifficultyLevel): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function generateQuestion(): Question {
  if (!gameState) {
    throw new Error("No game in progress");
  }
  
  let num1: number, num2: number;
  
  const operations: Operation[] = ["+", "-", "×"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  // Determine number ranges based on difficulty
  switch(gameState.difficulty) {
    case "easy":
      num1 = Math.floor(Math.random() * 11); // 0-10
      num2 = Math.floor(Math.random() * 11); // 0-10
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 91) + 10; // 10-100
      num2 = Math.floor(Math.random() * 91) + 10; // 10-100
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 901) + 100; // 100-1000
      num2 = Math.floor(Math.random() * 901) + 100; // 100-1000
      break;
  }
  
  // For subtraction, ensure the result is positive
  if (operation === "-" && num1 < num2) {
    [num1, num2] = [num2, num1];
  }
  
  // For multiplication in hard mode, use smaller numbers
  if (operation === "×" && gameState.difficulty === "hard") {
    num1 = Math.floor(Math.random() * 31) + 10; // 10-40
    num2 = Math.floor(Math.random() * 31) + 10; // 10-40
  }
  
  let answer: number;
  switch(operation) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "×":
      answer = num1 * num2;
      break;
    default:
      answer = 0;
  }
  
  const question: Question = {
    questionText: `${num1} ${operation} ${num2} = ?`,
    expectedAnswer: answer
  };
  
  gameState.currentQuestion = question;
  gameState.questionStartTime = Date.now();
  
  return question;
}

export function checkAnswer(userAnswer: number): AnswerResult {
  if (!gameState || !gameState.currentQuestion) {
    throw new Error("No question to check");
  }
  
  const isCorrect = userAnswer === gameState.currentQuestion.expectedAnswer;
  let newDifficulty: DifficultyLevel | undefined;
  
  if (isCorrect) {
    // Calculate score based on difficulty, time, and consecutive correct answers
    const scoreIncrease = calculateScore();
    gameState.score += scoreIncrease;
    gameState.correctAnswers++;
    gameState.consecutiveCorrect++;
    gameState.consecutiveWrong = 0;
  } else {
    gameState.wrongAnswers++;
    gameState.consecutiveCorrect = 0;
    gameState.consecutiveWrong++;
  }
  
  // Check if we need to adjust difficulty
  if (gameState.consecutiveCorrect >= 5) {
    // Upgrade difficulty
    if (gameState.difficulty === "easy") {
      gameState.difficulty = "medium";
      if (gameState.highestLevel === "easy") {
        gameState.highestLevel = "medium";
      }
      newDifficulty = "medium";
    } else if (gameState.difficulty === "medium") {
      gameState.difficulty = "hard";
      if (gameState.highestLevel === "medium" || gameState.highestLevel === "easy") {
        gameState.highestLevel = "hard";
      }
      newDifficulty = "hard";
    }
    
    // Reset counters
    gameState.consecutiveCorrect = 0;
  } else if (gameState.consecutiveWrong >= 3) {
    // Downgrade difficulty
    if (gameState.difficulty === "hard") {
      gameState.difficulty = "medium";
      newDifficulty = "medium";
    } else if (gameState.difficulty === "medium") {
      gameState.difficulty = "easy";
      newDifficulty = "easy";
    }
    
    // Reset counter
    gameState.consecutiveWrong = 0;
  }
  
  return {
    isCorrect,
    newScore: gameState.score,
    newDifficulty
  };
}

function calculateScore(): number {
  if (!gameState) {
    return 0;
  }
  
  // Base score depends on difficulty
  let baseScore: number;
  switch(gameState.difficulty) {
    case "easy":
      baseScore = 5;
      break;
    case "medium":
      baseScore = 10;
      break;
    case "hard":
      baseScore = 20;
      break;
    default:
      baseScore = 5;
  }
  
  // Calculate time bonus - faster answers get more points
  const timeElapsed = (Date.now() - gameState.questionStartTime) / 1000; // in seconds
  const timeBonus = Math.max(0, Math.floor((30 - timeElapsed) / 3));
  
  // Add consecutive bonus
  const consecutiveBonus = gameState.consecutiveCorrect;
  
  return baseScore + timeBonus + consecutiveBonus;
}

export function endGame(): void {
  if (!gameState) {
    return;
  }
  
  // Calculate total time spent
  const timeSpent = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
  
  gameState = {
    ...gameState,
    timeSpent,
  };
}

export function getGameSummary() {
  if (!gameState) {
    return null;
  }
  
  return {
    score: gameState.score,
    correctAnswers: gameState.correctAnswers,
    wrongAnswers: gameState.wrongAnswers,
    highestLevel: gameState.highestLevel,
    timeSpent: gameState.timeSpent || Math.floor((Date.now() - gameState.gameStartTime) / 1000)
  };
}

export function saveScore(playerName: string): void {
  if (!gameState) {
    return;
  }
  
  saveToLeaderboard({
    name: playerName,
    score: gameState.score,
    difficulty: gameState.highestLevel,
    date: new Date().toISOString()
  });
  
  // Clear game state after saving
  gameState = null;
}
