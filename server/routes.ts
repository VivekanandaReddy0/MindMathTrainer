import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeaderboardEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all leaderboard entries
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const entries = await storage.getAllLeaderboardEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving leaderboard" });
    }
  });

  // Save a new leaderboard entry
  app.post("/api/leaderboard", async (req, res) => {
    try {
      const result = insertLeaderboardEntrySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid entry data" });
      }
      
      const entry = await storage.createLeaderboardEntry(result.data);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ message: "Error saving entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
