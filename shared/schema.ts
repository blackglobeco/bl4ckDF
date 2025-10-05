import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searchHistoryTable = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  limit: integer("limit").notNull(),
  lang: text("lang").notNull(),
  estimatedCost: text("estimated_cost").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistoryTable).omit({
  id: true,
  timestamp: true,
});

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistoryTable.$inferSelect;

export const apiRequestSchema = z.object({
  token: z.string().min(1, "API token is required"),
  request: z.union([z.string(), z.array(z.string())]),
  limit: z.number().min(100).max(10000).default(100),
  lang: z.enum(["en", "ru"]).default("en"),
  type: z.enum(["json", "short", "html"]).default("json"),
  bot_name: z.string().optional(),
});

export type ApiRequest = z.infer<typeof apiRequestSchema>;
