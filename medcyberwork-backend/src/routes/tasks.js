import { Router } from "express";
import { query } from "../db/init.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/tasks/available
router.get("/available", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT t.* FROM tasks t
      WHERE t.available = TRUE
        AND t.id NOT IN (
          SELECT task_id FROM claims WHERE user_id = $1
        )
      ORDER BY t.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tasks/:id/claim
router.post("/:id/claim", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM tasks WHERE id = $1 AND available = TRUE", [req.params.id]);
    const task = rows[0];
    if (!task) return res.status(404).json({ error: "Task not found or unavailable" });

    await query("INSERT INTO claims (user_id, task_id) VALUES ($1, $2)", [req.user.id, task.id]);
    res.json({ message: "Task claimed", task });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "You already claimed this task" });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tasks/:id/submit
router.post("/:id/submit", async (req, res) => {
  const { transcript } = req.body;
  if (!transcript?.trim()) return res.status(400).json({ error: "Transcript is required" });

  try {
    const { rows: claimRows } = await query(
      "SELECT * FROM claims WHERE user_id = $1 AND task_id = $2 AND status = 'claimed'",
      [req.user.id, req.params.id]
    );
    const claim = claimRows[0];
    if (!claim) return res.status(404).json({ error: "No active claim found for this task" });

    const { rows: taskRows } = await query("SELECT * FROM tasks WHERE id = $1", [req.params.id]);
    const task = taskRows[0];

    await query(`
      UPDATE claims SET transcript = $1, status = 'approved', submitted_at = NOW()
      WHERE id = $2
    `, [transcript.trim(), claim.id]);

    await query(`
      INSERT INTO earnings (user_id, claim_id, amount, type, description)
      VALUES ($1, $2, $3, 'credit', $4)
    `, [req.user.id, claim.id, task.pay, task.title]);

    res.json({ message: "Submitted and approved", earned: Number(task.pay) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/tasks/history
router.get("/history", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT c.id, t.title, c.status, c.submitted_at,
             e.amount AS pay
      FROM claims c
      JOIN tasks t ON t.id = c.task_id
      LEFT JOIN earnings e ON e.claim_id = c.id
      WHERE c.user_id = $1
      ORDER BY c.claimed_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
