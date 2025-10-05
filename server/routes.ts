import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { apiRequestSchema, insertSearchHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/search", async (req, res) => {
    try {
      const token = process.env.API_TOKEN;
      const { request, limit = 100, lang = "en", type = "json" } = req.body;

      const apiUrl = "https://leakosintapi.com/";
      const apiPayload = {
        token: token,
        request: request,
        limit: limit,
        lang: lang,
        type: type,
        ...(req.body.bot_name && { bot_name: req.body.bot_name }),
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(`Invalid API token or malformed request. Please verify your token is correct.`);
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`API returned non-JSON response. This usually means the API token is invalid or the API is unavailable.`);
      }

      const data = await response.json();

      const query = Array.isArray(request)
        ? request.join(", ")
        : request;

      const complexity = calculateComplexity(query);
      const cost = calculateCost(limit, complexity);

      await storage.addSearchHistory({
        query,
        limit: limit,
        lang: lang,
        estimatedCost: `$${cost.toFixed(4)}`,
      });

      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/history", async (_req, res) => {
    try {
      const history = await storage.getSearchHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });

  app.delete("/api/history", async (_req, res) => {
    try {
      await storage.clearSearchHistory();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear search history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

function calculateComplexity(query: string): number {
  const words = query
    .split(/\s+/)
    .filter((word) => {
      if (word.length < 4 && !/^\d{6,}$/.test(word)) return false;
      if (/^\d{1,5}$/.test(word)) return false;
      if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/.test(word)) return false;
      return true;
    });

  const wordCount = words.length;
  if (wordCount === 0) return 1;
  if (wordCount === 1) return 1;
  if (wordCount === 2) return 5;
  if (wordCount === 3) return 16;
  return 40;
}

function calculateCost(limit: number, complexity: number): number {
  return (5 + Math.sqrt(limit * complexity)) / 5000;
}