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

// ─────────────────────────────────────────────
// CORS CONFIG (FIXED PRODUCTION VERSION)
// ─────────────────────────────────────────────
const allowedOrigins = [
  "https://medcyber-works.vercel.app",
  "https://medcyber-works-aate29tss-kenyons-projects-4dae9a90.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow mobile apps, curl, postman (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // TEMP SAFE MODE (prevents failed fetch during debugging)
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// IMPORTANT: handle preflight requests
app.options("*", cors());

// ── Middleware ────────────────────────────────────────────────
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
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});


async function start() {
  try {
    await initDb();
    app.listen(PORT, () =>
      console.log(`✓ API running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
}

start();
