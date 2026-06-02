import { Router } from "express";

const router = Router();

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "name, email and message are required" });

  // In production: wire up nodemailer here using SMTP_* env vars
  console.log(`[CONTACT] From: ${name} <${email}> — ${message.slice(0, 80)}`);
  res.json({ message: "Message received. We'll be in touch within 24 hours." });
});

export default router;
