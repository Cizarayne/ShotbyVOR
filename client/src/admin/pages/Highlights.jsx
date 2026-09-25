import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { gooeyToast } from "gooey-toast";
import {
  Sparkles,
  Plus,
  Trash2,
  Star,
  StarOff,
  Loader2,
  Save,
  X,
  Play,
} from "lucide-react";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";
import UploadDropzone from "../components/UploadDropzone";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";

const SAMPLES = [
  {
    title: "Featured Photographer — Weddings",
    category: "Press",
    description:
      "Recognised among the top storytellers of the season for a coastal wedding series.",
    event: "The Wedding Diaries",
    date: "2025-08-16",
    order: "1",
    featured: true,
  },
  {
    title: "Campaign Reel Crossed 1M Views",
    category: "Milestone",
    description:
      "A short-form brand campaign passed one million organic views across platforms.",
    event: "Instagram",
    date: "2025-06-04",
    order: "2",
    featured: false,
  },
  {
    title: "Guest Speaker — Creative Summit",
    category: "Event",
    description:
      "Led a session on visual storytelling and building a personal brand as a creative.",
    event: "Lagos Creative Summit",
    date: "2025-05-22",
    order: "3",
    featured: false,
  },
  {
    title: "Brand Collab — Lumen Wear Lookbook",
    category: "Collaboration",
    description:
      "Shot the seasonal lookbook plus a set of vertical cuts for paid socials.",
    event: "Lumen Wear",
    date: "2025-09-01",
    order: "4",
    featured: true,
  },
];

export default function AdminHighlights() {
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
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      event: "",
      date: new Date().toISOString().substring(0, 10),
      order: "0",
      featured: false,
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.get("/highlights"));
    } catch (err) {
      gooeyToast.error(err.message, { preset: "snappy", showProgress: true });
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
      event: "",
      date: new Date().toISOString().substring(0, 10),
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
      event: item.event || "",
      date: item.date ? item.date.substring(0, 10) : "",
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
    gooeyToast.success("Form autofilled — tweak anything you don't like");
  }

  async function onSubmit(data) {
    if (!editId && !file) {
      gooeyToast.error("Please select a file");
      return;
    }
    try {
      if (editId) {
        await api.patch(`/highlights/${editId}`, data);
        gooeyToast.success("Highlight updated");
      } else {
        const fd = new FormData();
        fd.append("file", file);
        Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
        await api.post("/highlights", fd, true);
        gooeyToast.success("Highlight uploaded");
      }
      resetForm();
      load();
    } catch (err) {
      gooeyToast.error(err.message, { preset: "snappy", showProgress: true });
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/highlights/${deleteTarget}`);
      gooeyToast.success("Highlight deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      gooeyToast.error(err.message, { preset: "snappy", showProgress: true });
    }
  }

  async function toggleFeatured(item) {
    try {
      await api.patch(`/highlights/${item._id}`, {
        ...item,
        featured: !item.featured,
      });
      load();
    } catch (err) {
      gooeyToast.error(err.message, { preset: "snappy", showProgress: true });
    }
  }

  return (
    <div className="w-full">
      <PageHeader
        icon={Sparkles}
        title="Highlights"
        description="Manage event highlights and featured moments"
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
            {showForm ? "Cancel" : "Add highlight"}
          </button>
        }
      />

      {showForm && (
        <div className="admin-card p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">
            {editId ? "Edit highlight" : "Add new highlight"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!editId && (
              <div>
                <label className="admin-label">File (image or video) *</label>
                <UploadDropzone
                  accept="image/*,video/*"
                  onChange={setFile}
                  label="Drop image or video here"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Title *</label>
                <input
                  className={`admin-input ${errors.title ? "border-red-400" : ""}`}
                  placeholder="e.g. Wedding highlights — Smith & Jones"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="admin-label">Event</label>
                <input
                  className="admin-input"
                  placeholder="e.g. Wedding, Birthday…"
                  {...register("event")}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Category</label>
              <input
                className="admin-input"
                placeholder="e.g. LIVE PERFORMANCE / REEL"
                {...register("category")}
              />
              <p className="text-xs text-slate-400 mt-1">
                Shown as a small label above the title. Use uppercase, e.g.
                ARTIST SPOTLIGHT
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Date</label>
                <input
                  type="date"
                  className="admin-input"
                  {...register("date")}
                />
              </div>
              <div>
                <label className="admin-label">Order</label>
                <input
                  type="number"
                  className="admin-input"
                  {...register("order")}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-input min-h-[5rem] resize-y"
                placeholder="Brief description…"
                {...register("description")}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                {...register("featured")}
              />
              <span className="text-sm text-slate-700">
                Featured — shows as a large spotlight row on the Highlights page
              </span>
            </label>

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
          icon={Sparkles}
          title="No highlights yet"
          description="Upload your first highlight to get started"
          action={
            <button
              className="admin-btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4" />
              Add highlight
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="admin-card overflow-hidden group">
              <div className="relative aspect-video bg-slate-100">
                {item.mediaType === "video" ? (
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover"
                    muted
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {item.featured && (
                  <span className="absolute top-2 left-2 admin-badge bg-amber-100 text-amber-700">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
                {item.mediaType === "video" && (
                  <>
                    <span className="absolute top-2 right-2 admin-badge bg-blue-100 text-blue-700">
                      Video
                    </span>
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                      <span className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" fill="currentColor" />
                      </span>
                    </span>
                  </>
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
                {(item.event || item.date) && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.event}
                    {item.event && item.date ? " · " : ""}
                    {item.date && new Date(item.date).toLocaleDateString()}
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
        title="Delete highlight"
        message="This will permanently delete the highlight and remove it from Cloudinary."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
