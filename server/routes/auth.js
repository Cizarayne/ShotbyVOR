import { Router } from "express";
import { requireApiKey } from "../middleware/auth.js";

const router = Router();

// Lightweight key check for the admin login screen.
// Returns 200 {"ok":true} when the x-api-key header is valid,
// 401 when it is missing/wrong — no side effects, no upload needed.
router.get("/verify", requireApiKey, (_req, res) => {
  res.json({ ok: true });
});

export default router;
