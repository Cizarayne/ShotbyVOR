import { Router } from "express";
import { requireApiKey } from "../middleware/auth.js";
import {
  memUpload,
  uploadToCloudinary,
  cloudinary,
} from "../config/cloudinary.js";
import Highlight from "../models/Highlight.js";

import { viewThrottle } from "../middleware/viewThrottle.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────

router.get("/", async (_req, res, next) => {
  try {
    const items = await Highlight.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Highlight.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Count a public view of this highlight — one hit per genuine watch.
// (Throttled per IP per minute on the server.)
router.post("/:id/view", viewThrottle("highlights"), async (req, res, next) => {
  try {
    const item = await Highlight.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ views: item.views });
  } catch (err) {
    next(err);
  }
});

// ── Admin ─────────────────────────────────────────────────────────────────────

router.post(
  "/",
  requireApiKey,
  memUpload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const { title, category, description, event, date, featured, order } =
        req.body;

      const isVideo = req.file.mimetype?.startsWith("video/");
      const result = await uploadToCloudinary(
        req.file.buffer,
        "highlights",
        isVideo ? "video" : "image",
      );

      const item = await Highlight.create({
        title,
        category,
        description,
        event,
        date: date ? new Date(date) : new Date(),
        featured: featured === "true",
        order: Number(order) || 0,
        mediaUrl: result.secure_url,
        mediaType: isVideo ? "video" : "image",
        cloudinaryId: result.public_id,
      });

      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
);

router.patch("/:id", requireApiKey, async (req, res, next) => {
  try {
    const { title, category, description, event, date, featured, order } =
      req.body;
    const item = await Highlight.findByIdAndUpdate(
      req.params.id,
      { title, category, description, event, date, featured, order },
      { new: true, runValidators: true },
    );
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireApiKey, async (req, res, next) => {
  try {
    const item = await Highlight.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });

    await cloudinary.uploader.destroy(item.cloudinaryId, {
      resource_type: item.mediaType === "video" ? "video" : "image",
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
