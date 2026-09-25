import { Router } from "express";
import { requireApiKey } from "../middleware/auth.js";
import {
  memUpload,
  uploadToCloudinary,
  cloudinary,
} from "../config/cloudinary.js";
import Journal from "../models/Journal.js";

import { viewThrottle } from "../middleware/viewThrottle.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────

router.get("/", async (req, res, next) => {
  try {
    const filter = req.query.all === "true" ? {} : { published: true };
    const items = await Journal.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Journal.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Count a public view of this journal — one hit per genuine read.
// (Throttled per IP per minute on the server.)
router.post("/:id/view", viewThrottle("journals"), async (req, res, next) => {
  try {
    const item = await Journal.findByIdAndUpdate(
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
  memUpload.single("cover"),
  async (req, res, next) => {
    try {
      const { title, excerpt, content, tags, published } = req.body;

      let coverUrl = "";
      let coverCloudinaryId = "";
      let coverType = "image";

      if (req.file) {
        const isVideo = req.file.mimetype?.startsWith("video/");
        coverType = isVideo ? "video" : "image";
        const result = await uploadToCloudinary(
          req.file.buffer,
          "journals",
          coverType,
        );
        coverUrl = result.secure_url;
        coverCloudinaryId = result.public_id;
      }

      const item = await Journal.create({
        title,
        excerpt,
        content,
        tags: tags ? JSON.parse(tags) : [],
        published: published === "true",
        coverUrl,
        coverCloudinaryId,
        coverType,
      });

      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/:id",
  requireApiKey,
  memUpload.single("cover"),
  async (req, res, next) => {
    try {
      const { title, excerpt, content, tags, published } = req.body;
      const existing = await Journal.findById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Not found" });

      const updates = {
        title,
        excerpt,
        content,
        tags: tags ? JSON.parse(tags) : existing.tags,
        published:
          published !== undefined ? published === "true" : existing.published,
      };

      if (req.file) {
        if (existing.coverCloudinaryId) {
          await cloudinary.uploader.destroy(existing.coverCloudinaryId, {
            resource_type: existing.coverType === "video" ? "video" : "image",
          });
        }
        const isVideo = req.file.mimetype?.startsWith("video/");
        const result = await uploadToCloudinary(
          req.file.buffer,
          "journals",
          isVideo ? "video" : "image",
        );
        updates.coverUrl = result.secure_url;
        updates.coverCloudinaryId = result.public_id;
        updates.coverType = isVideo ? "video" : "image";
      }

      const item = await Journal.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });

      res.json(item);
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", requireApiKey, async (req, res, next) => {
  try {
    const item = await Journal.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });

    if (item.coverCloudinaryId) {
      await cloudinary.uploader.destroy(item.coverCloudinaryId, {
        resource_type: item.coverType === "video" ? "video" : "image",
      });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
