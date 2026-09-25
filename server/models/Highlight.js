import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    cloudinaryId: { type: String, required: true },
    event: { type: String, trim: true, default: "" },
    date: { type: Date },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Highlight", highlightSchema);
