import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeaderboardEntrySchema, leaderboardEntries } from "@shared/schema";
import { setupAuth } from "./auth";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Middleware to ensure user is authenticated
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Get top leaderboard entries (limit to 5 by default)
  app.get("/api/leaderboard/top", async (_req, res) => {
    try {
      const entries = await storage.getTopLeaderboardEntries(5);
      res.json(entries);
    } catch (error) {
      console.error('Error fetching top leaderboard entries:', error);
      res.status(500).json({ message: "Error retrieving leaderboard" });
    }
  });

  // Get all leaderboard entries
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const entries = await storage.getAllLeaderboardEntries();
      res.json(entries);
    } catch (error) {
      console.error('Error fetching all leaderboard entries:', error);
      res.status(500).json({ message: "Error retrieving leaderboard" });
    }
  });

  // Save a new leaderboard entry
  app.post("/api/leaderboard", ensureAuthenticated, async (req, res) => {
    try {
      // If authenticated, add userId to the entry
      const user = req.user as any; // Using any for now to avoid type issues
      const leaderboardData = {
        ...req.body,
        userId: user.id
      };
      
      const result = insertLeaderboardEntrySchema.safeParse(leaderboardData);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid entry data", errors: result.error.format() });
      }
      
      const entry = await storage.createLeaderboardEntry(result.data);
      res.status(201).json(entry);
    } catch (error) {
      console.error('Error saving leaderboard entry:', error);
      res.status(500).json({ message: "Error saving entry" });
    }
  });

  // Get current user's top scores
  app.get("/api/user/scores", ensureAuthenticated, async (req, res) => {
    try {
      const user = req.user as any; // Using any for now to avoid type issues
      const entries = await db.select()
        .from(leaderboardEntries)
        .where(eq(leaderboardEntries.userId, user.id))
        .orderBy(desc(leaderboardEntries.score))
        .limit(5);
      
      res.json(entries);
    } catch (error) {
      console.error('Error fetching user scores:', error);
      res.status(500).json({ message: "Error retrieving user scores" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
