import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the leaderboard entries table
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  score: integer("score").notNull(),
  difficulty: text("difficulty").notNull(),
  date: text("date").notNull(), // ISO string
});

// Create insert schema
export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).pick({
  name: true,
  score: true,
  difficulty: true,
  date: true,
});

// Define the types
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
