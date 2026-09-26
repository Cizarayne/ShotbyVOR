import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDatabase } from "./config/database.js";
import workRouter from "./routes/work.js";
import reelsRouter from "./routes/reels.js";
import highlightsRouter from "./routes/highlights.js";
import journalsRouter from "./routes/journals.js";
import authRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
// Allowed browser origins. Local dev always works; production adds whatever
// you set as CLIENT_URL on Vercel (comma-separated if more than one, e.g.
// "https://shotbyvor.vercel.app,https://shotbyvor.com").
// The production client URL is also hardcoded as a fallback so CORS keeps
// working even if the CLIENT_URL env var was never set on the server.
const allowedOrigins = [
  "http://localhost:3000",
  "https://shotbyvor.vercel.app",
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((s) => s.trim()).filter(Boolean)
    : []),
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
// Registered before the database gate below so it always answers, even when
// MongoDB is unreachable.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── Database gate ─────────────────────────────────────────────────────────────
// Runs after cors() on purpose: cors() has already attached the CORS headers,
// so if MongoDB is unreachable the failure is returned as a normal JSON error
// *with* those headers. Without this gate a dead or slow connection can take
// the whole invocation down, and Vercel's own error/timeout pages carry no CORS
// headers — the browser then blames CORS instead of showing the real problem.
app.use((_req, _res, next) => {
  connectDatabase().then(
    () => next(),
    (err) => {
      err.status = err.status || 503;
      next(err);
    },
  );
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/work", workRouter);
app.use("/api/reels", reelsRouter);
app.use("/api/highlights", highlightsRouter);
app.use("/api/journals", journalsRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// ── Connect DB then start ─────────────────────────────────────────────────────
// On Vercel serverless there is no long-lived process to listen() on — the
// platform invokes the exported app per request. Only listen locally.
const startServer = () => {
  // Kick off the connection at boot for early feedback, but never block on it:
  // awaiting it at module scope would delay (or, past Vercel's function timeout,
  // kill) the very first request. Failures are surfaced per request by the
  // database gate above, as JSON errors that keep their CORS headers.
  connectDatabase().catch((error) => {
    console.error(
      "❌ Database connection failed at startup (will retry on next request):",
      error.message,
    );
  });

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
};

startServer();

// Vercel serverless entry — `server/api/index.js` re-exports this.
export default app;