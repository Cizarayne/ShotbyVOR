import { Router } from "express";
import { requireApiKey } from "../middleware/auth.js";
import Work from "../models/Work.js";
import Reel from "../models/Reel.js";
import Highlight from "../models/Highlight.js";
import Journal from "../models/Journal.js";

const router = Router();

// ── Admin dashboard summary ─────────────────────────────────────────────────
// One authenticated request replaces the dashboard's four parallel GETs.
// Returns the full item arrays (needed for top-performer + drill-down) plus
// precomputed counts and view totals for convenience.
// Shape: { work, reels, highlights, journals, counts, totalViews }
router.get("/", requireApiKey, async (_req, res, next) => {
  try {
    const [work, reels, highlights, journals] = await Promise.all([
      Work.find().sort({ order: 1, createdAt: -1 }),
      Reel.find().sort({ order: 1, createdAt: -1 }),
      Highlight.find().sort({ order: 1, createdAt: -1 }),
      Journal.find().sort({ createdAt: -1 }),
    ]);

    const sumViews = (items) =>
      items.reduce((sum, it) => sum + (Number(it.views) || 0), 0);

    const counts = {
      work: work.length,
      reels: reels.length,
      highlights: highlights.length,
      journals: journals.length,
    };
    const views = {
      work: sumViews(work),
      reels: sumViews(reels),
      highlights: sumViews(highlights),
      journals: sumViews(journals),
    };
    const totalViews = views.work + views.reels + views.highlights + views.journals;

    res.json({ work, reels, highlights, journals, counts, views, totalViews });
  } catch (err) {
    next(err);
  }
});

export default router;
