import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDb } from "./db/init.js";

import authRoutes     from "./routes/auth.js";
import jobsRoutes     from "./routes/jobs.js";
import tasksRoutes    from "./routes/tasks.js";
import testRoutes     from "./routes/test.js";
import earningsRoutes from "./routes/earnings.js";
import profileRoutes  from "./routes/profile.js";
import contactRoutes  from "./routes/contact.js";

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "https://medcyber-works.vercel.app",credentials: true }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/jobs",     jobsRoutes);
app.use("/api/tasks",    tasksRoutes);
app.use("/api/test",     testRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/profile",  profileRoutes);
app.use("/api/contact",  contactRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── 404 ───────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: "Route not found" }));

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Boot ──────────────────────────────────────────────────────
async function start() {
  try {
    await initDb();
    app.listen(PORT, () => console.log(`✓ API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
}

start();
