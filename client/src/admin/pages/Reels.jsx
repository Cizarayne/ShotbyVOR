import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Film,
  Plus,
  Trash2,
  Star,
  StarOff,
  Loader2,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";
import UploadDropzone from "../components/UploadDropzone";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";

const SAMPLES = [
  {
    title: "First Look — Tolu & James",
    category: "Wedding",
    description:
      "The exact moment he saw her for the first time, cut in slow motion.",
    duration: "0:32",
    order: "1",
    featured: true,
  },
  {
    title: "Golden Hour in 30 Seconds",
    category: "Cinematic",
    description: "A rapid-cut edit of light, movement and coastal landscapes.",
    duration: "0:30",
    order: "2",
    featured: false,
  },
  {
    title: "Studio Day — Behind the Scenes",
    category: "Behind the Scenes",
    description:
      "Lighting setups, outfit changes and the crew behind a fashion editorial.",
    duration: "0:45",
    order: "3",
    featured: false,
  },
  {
    title: "Drone Reel — City Nights",
    category: "Aerial",
    description: "Neon-lit skyline flythroughs cut to an energetic beat.",
    duration: "0:28",
    order: "4",
    featured: true,
  },
];

export default function AdminReels() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      duration: "",
      order: "0",
      featured: false,
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.get("/reels"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    reset({
      title: "",
      category: "",
      description: "",
      duration: "",
      order: "0",
      featured: false,
    });
    setFile(null);
    setEditId(null);
    setShowForm(false);
  }

  function openEdit(item) {
    reset({
      title: item.title,
      category: item.category || "",
      description: item.description || "",
      duration: item.duration || "",
      order: String(item.order ?? 0),
      featured: item.featured,
    });
    setEditId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function autofill() {
    const s = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
    reset({ ...s });
    toast.success("Form autofilled — tweak anything you don't like");
  }

  async function onSubmit(data) {
    if (!editId && !file) {
      toast.error("Please select a video file");
      return;
    }
    try {
      if (editId) {
        await api.patch(`/reels/${editId}`, data);
        toast.success("Reel updated");
      } else {
        // Step 1 — get a short-lived Cloudinary signature from our server.
        // This is a tiny JSON request (no file), so it never hits the 4.5 MB
        // Vercel body limit.
        const sig = await api.get("/reels/sign-upload");

        // Step 2 — POST the file directly to Cloudinary's upload API.
        // The file goes straight from the browser to Cloudinary; our server
        // is not in the data path at all.
        const cloudForm = new FormData();
        cloudForm.append("file", file);
        cloudForm.append("api_key", sig.apiKey);
        cloudForm.append("timestamp", sig.timestamp);
        cloudForm.append("signature", sig.signature);
        cloudForm.append("folder", sig.folder);
        cloudForm.append("resource_type", "video");

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
          { method: "POST", body: cloudForm },
        );
        if (!cloudRes.ok) {
          const err = await cloudRes.json().catch(() => ({}));
          throw new Error(
            err.error?.message ||
              `Cloudinary upload failed (${cloudRes.status})`,
          );
        }
        const cloudData = await cloudRes.json();

        // Step 3 — save the metadata (URL, public_id, etc.) to our database.
        // Still just a small JSON body — no file involved.
        await api.post("/reels/from-url", {
          videoUrl: cloudData.secure_url,
          cloudinaryId: cloudData.public_id,
          ...data,
        });
        toast.success("Reel uploaded");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/reels/${deleteTarget}`);
      toast.success("Reel deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function toggleFeatured(item) {
    try {
      await api.patch(`/reels/${item._id}`, {
        ...item,
        featured: !item.featured,
      });
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="w-full">
      <PageHeader
        icon={Film}
        title="Reels"
        description="Manage your video reels"
        actions={
          <button
            className="admin-btn-primary"
            onClick={() => {
              // resetForm() always closes the form — only re-open it when it
              // was closed before, otherwise the toggle flips it straight
              // back open and Cancel appears broken.
              resetForm();
              if (!showForm) setShowForm(true);
            }}
          >
            {showForm ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {showForm ? "Cancel" : "Upload reel"}
          </button>
        }
      />

      {showForm && (
        <div className="admin-card p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">
            {editId ? "Edit reel" : "Upload new reel"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!editId && (
              <div>
                <label className="admin-label">Video file *</label>
                <UploadDropzone
                  accept="video/*"
                  onChange={setFile}
                  onDuration={(d) => setValue("duration", d)}
                  label="Drop video file here"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Title *</label>
                <input
                  className={`admin-input ${errors.title ? "border-red-400" : ""}`}
                  placeholder="e.g. Summer 2024 reel"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="admin-label">Duration</label>
                <input
                  className="admin-input"
                  placeholder="Auto-detected from video"
                  {...register("duration")}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Category</label>
              <input
                className="admin-input"
                placeholder="e.g. PERFORMANCE, LIVE AUDIO, FESTIVAL CULTURE"
                {...register("category")}
              />
              <p className="text-xs text-slate-400 mt-1">
                Shown as a small label above the title. Use uppercase.
              </p>
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-input min-h-[5rem] resize-y"
                placeholder="Brief description…"
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Order</label>
                <input
                  type="number"
                  className="admin-input"
                  {...register("order")}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                    {...register("featured")}
                  />
                  <span className="text-sm text-slate-700">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={autofill}
              >
                <Sparkles className="w-4 h-4" />
                Autofill
              </button>
              <button
                type="submit"
                className="admin-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSubmitting ? "Saving…" : editId ? "Save changes" : "Upload"}
              </button>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No reels yet"
          description="Upload your first reel to get started"
          action={
            <button
              className="admin-btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4" />
              Upload reel
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="admin-card overflow-hidden">
              <div className="relative aspect-video bg-slate-900">
                <video
                  src={item.videoUrl}
                  poster={item.thumbnailUrl || undefined}
                  className="w-full h-full object-cover opacity-90"
                  muted
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
                {item.featured && (
                  <span className="absolute top-2 left-2 admin-badge bg-amber-100 text-amber-700">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
                {item.duration && (
                  <span className="absolute bottom-2 right-2 admin-badge bg-black/60 text-white">
                    {item.duration}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-slate-800 truncate">
                  {item.title}
                </p>
                {item.category && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 truncate">
                    {item.category}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    className="admin-btn-secondary flex-1 justify-center"
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn-secondary px-2.5"
                    onClick={() => toggleFeatured(item)}
                  >
                    {item.featured ? (
                      <StarOff className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Star className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <button
                    className="admin-btn-danger px-2.5"
                    onClick={() => setDeleteTarget(item._id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete reel"
        message="This will permanently delete the reel and remove it from Cloudinary."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
