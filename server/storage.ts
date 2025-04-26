import { leaderboardEntries, type LeaderboardEntry, type InsertLeaderboardEntry } from "@shared/schema";

// Modify the interface with CRUD methods for leaderboard
export interface IStorage {
  createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  getAllLeaderboardEntries(): Promise<LeaderboardEntry[]>;
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private leaderboard: Map<number, LeaderboardEntry>;
  currentId: number;
  leaderboardId: number;

  constructor() {
    this.users = new Map();
    this.leaderboard = new Map();
    this.currentId = 1;
    this.leaderboardId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const id = this.leaderboardId++;
    const newEntry: LeaderboardEntry = { ...entry, id };
    this.leaderboard.set(id, newEntry);
    
    return newEntry;
  }

  async getAllLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    // Get all entries and sort by score descending
    const entries = Array.from(this.leaderboard.values());
    return entries.sort((a, b) => b.score - a.score).slice(0, 5);
  }
}

export const storage = new MemStorage();
