import { Router } from "express";
import { query } from "../db/init.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/earnings/summary
router.get("/summary", async (req, res) => {
  try {
    const uid = req.user.id;

    const { rows: [{ total: allTime }] } = await query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM earnings WHERE user_id = $1 AND type = 'credit'", [uid]
    );
    const { rows: [{ total: payouts }] } = await query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM earnings WHERE user_id = $1 AND type = 'payout'", [uid]
    );
    const { rows: [{ total: thisMonth }] } = await query(`
      SELECT COALESCE(SUM(amount), 0) AS total FROM earnings
      WHERE user_id = $1 AND type = 'credit'
        AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())
    `, [uid]);

    res.json({
      balance:     +Number(allTime  - payouts).toFixed(2),
      allTime:     +Number(allTime).toFixed(2),
      thisMonth:   +Number(thisMonth).toFixed(2),
      nextPayout:  nextMonday(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/earnings/transactions
router.get("/transactions", async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT id, description, type, amount,
             TO_CHAR(created_at, 'Mon DD') AS date
      FROM earnings
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

function nextMonday() {
  const d = new Date();
  const daysUntil = (8 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + daysUntil);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default router;
