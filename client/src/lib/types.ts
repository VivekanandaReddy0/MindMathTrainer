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
  currentQuestion: Question | null;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  questionStartTime: number;
  highestLevel: DifficultyLevel;
  gameStartTime: number;
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
}
