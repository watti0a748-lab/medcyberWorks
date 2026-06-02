import { Router } from "express";
import { query } from "../db/init.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/test/sample
router.get("/sample", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, title, sample_text, length_est FROM tasks ORDER BY RANDOM() LIMIT 1"
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/test/submit
router.post("/submit", async (req, res) => {
  const { taskId, transcript } = req.body;
  if (!transcript?.trim()) return res.status(400).json({ error: "transcript required" });

  try {
    const { rows } = await query("SELECT sample_text FROM tasks WHERE id = $1", [taskId]);
    const task = rows[0];
    if (!task) return res.status(404).json({ error: "Task not found" });

    const score = scoreTranscript(task.sample_text, transcript);
    const status = score >= 80 ? "active" : "pending";

    // Save best score
    await query(`
      UPDATE users
      SET test_score = GREATEST(COALESCE(test_score, 0), $1),
          status = CASE WHEN GREATEST(COALESCE(test_score, 0), $1) >= 80 THEN 'active' ELSE status END
      WHERE id = $2
    `, [score, req.user.id]);

    res.json({ score, passed: score >= 80 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Word-overlap scorer (MVP — swap for AI-based scoring later)
function scoreTranscript(reference, attempt) {
  const normalize = (s) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).filter(Boolean);

  const refWords = normalize(reference);
  const attWords = normalize(attempt);
  if (!refWords.length) return 0;

  const freq = new Map();
  refWords.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));

  let matches = 0;
  attWords.forEach((w) => {
    if (freq.get(w) > 0) { matches++; freq.set(w, freq.get(w) - 1); }
  });

  return Math.round((matches / refWords.length) * 100);
}

export default router;
