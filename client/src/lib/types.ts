export type DifficultyLevel = "easy" | "medium" | "hard";

export type Operation = "+" | "-" | "×";

export interface Question {
  questionText: string;
  expectedAnswer: number;
}

export interface GameState {
  difficulty: DifficultyLevel;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  questionCount: number; // Track how many questions have been answered
  currentQuestion: Question | null;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  questionStartTime: number;
  highestLevel: DifficultyLevel;
  gameStartTime: number;
  timeSpent?: number; // Optional, set when the game ends
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  difficulty: DifficultyLevel;
  date: string;
}

export interface AnswerResult {
  isCorrect: boolean;
  newScore: number;
  newDifficulty?: DifficultyLevel;
  gameOver?: boolean; // Indicates if the game should end (reached 10 questions)
}
