import { Router } from "express";
import { query } from "../db/init.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/profile
router.get("/", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT id, name, email, specialty, bio, test_score, status, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/profile
router.put("/", async (req, res) => {
  const { name, email, specialty, bio } = req.body;
  try {
    await query(`
      UPDATE users SET name = $1, email = $2, specialty = $3, bio = $4
      WHERE id = $5
    `, [name, email, specialty ?? "General", bio ?? "", req.user.id]);
    res.json({ message: "Profile updated" });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already in use" });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
