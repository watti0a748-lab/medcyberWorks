import { Router } from "express";
import { query } from "../db/init.js";

const router = Router();

// GET /api/jobs?type=Full-time
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let result;
    if (type && type !== "All") {
      result = await query("SELECT * FROM jobs WHERE active = TRUE AND type = $1 ORDER BY id", [type]);
    } else {
      result = await query("SELECT * FROM jobs WHERE active = TRUE ORDER BY id");
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
