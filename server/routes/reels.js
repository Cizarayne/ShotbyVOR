import { Router } from "express";
import { requireApiKey } from "../middleware/auth.js";
import {
  memUpload,
  uploadToCloudinary,
  cloudinary,
} from "../config/cloudinary.js";
import Reel from "../models/Reel.js";

import { viewThrottle } from "../middleware/viewThrottle.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────

router.get("/", async (_req, res, next) => {
  try {
    const items = await Reel.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// ── Signed upload — admin only ────────────────────────────────────────────────
// Returns a short-lived signature the browser uses to POST directly to
// Cloudinary's upload API. The file never passes through this server, so
// Vercel's 4.5 MB body limit is not a factor.
router.get("/sign-upload", requireApiKey, (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "shotbyvor/reels";
  const paramsToSign = { folder, timestamp };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret,
  );

  // Pull credentials from the parsed CLOUDINARY_URL config
  const config = cloudinary.config();

  res.json({
    signature,
    timestamp,
    folder,
    apiKey: config.api_key,
    cloudName: config.cloud_name,
  });
});

// ── Save after direct upload — admin only ─────────────────────────────────────
// Called once the browser has finished uploading to Cloudinary directly.
// Body: { videoUrl, cloudinaryId, title, category, description, duration,
//         featured, order }
router.post("/from-url", requireApiKey, async (req, res, next) => {
  try {
    const {
      videoUrl,
      cloudinaryId,
      title,
      category,
      description,
      duration,
      featured,
      order,
    } = req.body;

    if (!videoUrl || !cloudinaryId) {
      return res
        .status(400)
        .json({ error: "videoUrl and cloudinaryId are required" });
    }

    // Auto-generate thumbnail from Cloudinary's video thumbnail
    const thumbnailUrl = videoUrl
      .replace("/upload/", "/upload/so_auto,pg_1/")
      .replace(/\.[^.]+$/, ".jpg");

    const item = await Reel.create({
      title,
      category,
      description,
      duration,
      featured: featured === true || featured === "true",
      order: Number(order) || 0,
      videoUrl,
      thumbnailUrl,
      cloudinaryId,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Reel.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// Count a public view of this reel — one hit per genuine watch.
// (Throttled per IP per minute on the server.)
router.post("/:id/view", viewThrottle("reels"), async (req, res, next) => {
  try {
    const item = await Reel.findByIdAndUpdate(
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

      const { title, category, description, duration, featured, order } =
        req.body;

      const result = await uploadToCloudinary(
        req.file.buffer,
        "reels",
        "video",
      );

      // Auto-generate thumbnail from Cloudinary's video thumbnail
      const thumbnailUrl = result.secure_url
        .replace("/upload/", "/upload/so_auto,pg_1/")
        .replace(/\.[^.]+$/, ".jpg");

      const item = await Reel.create({
        title,
        category,
        description,
        duration,
        featured: featured === "true",
        order: Number(order) || 0,
        videoUrl: result.secure_url,
        thumbnailUrl,
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
    const { title, category, description, duration, featured, order } =
      req.body;
    const item = await Reel.findByIdAndUpdate(
      req.params.id,
      { title, category, description, duration, featured, order },
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
    const item = await Reel.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });

    await cloudinary.uploader.destroy(item.cloudinaryId, {
      resource_type: "video",
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
