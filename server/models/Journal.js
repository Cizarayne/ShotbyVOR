import mongoose from 'mongoose';
import slugify from 'slugify';

const journalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, trim: true, default: '' },
    content: { type: String, required: true },
    coverUrl: { type: String, default: '' },
    coverCloudinaryId: { type: String, default: '' },
    coverType: { type: String, enum: ['image', 'video'], default: 'image' },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title before saving
journalSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Journal', journalSchema);
