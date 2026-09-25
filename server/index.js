import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/database.js";
import workRouter from "./routes/work.js";
import reelsRouter from "./routes/reels.js";
import highlightsRouter from "./routes/highlights.js";
import journalsRouter from "./routes/journals.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/work", workRouter);
app.use("/api/reels", reelsRouter);
app.use("/api/highlights", highlightsRouter);
app.use("/api/journals", journalsRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// ── Connect DB then start ─────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();