import { pgTable, text, serial, integer, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define the leaderboard entries table with foreign key to users
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  score: integer("score").notNull(),
  difficulty: text("difficulty").notNull(),
  date: text("date").notNull(), // ISO string
});

// Create insert schema for users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Create insert schema for leaderboard entries
export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).pick({
  userId: true,
  name: true,
  score: true,
  difficulty: true,
  date: true,
});

// Define the types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
