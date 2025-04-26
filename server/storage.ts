import { 
  leaderboardEntries, 
  users,
  type User, 
  type InsertUser,
  type LeaderboardEntry, 
  type InsertLeaderboardEntry 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Session store setup
const PostgresSessionStore = connectPg(session);

// Modify the interface with CRUD methods for leaderboard and users
export interface IStorage {
  createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  getAllLeaderboardEntries(): Promise<LeaderboardEntry[]>;
  getTopLeaderboardEntries(limit?: number): Promise<LeaderboardEntry[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: any; // Use 'any' type for sessionStore to avoid type errors
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Use 'any' type for sessionStore to avoid type errors
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const [newEntry] = await db.insert(leaderboardEntries).values(entry).returning();
    return newEntry;
  }

  async getAllLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    // Get all entries and sort by score descending
    return await db.select().from(leaderboardEntries).orderBy(desc(leaderboardEntries.score));
  }
  
  async getTopLeaderboardEntries(limit: number = 5): Promise<LeaderboardEntry[]> {
    // Get top N entries sorted by score descending
    return await db.select()
      .from(leaderboardEntries)
      .orderBy(desc(leaderboardEntries.score))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
