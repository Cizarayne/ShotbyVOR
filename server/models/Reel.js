import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    cloudinaryId: { type: String, required: true },
    duration: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Reel", reelSchema);
