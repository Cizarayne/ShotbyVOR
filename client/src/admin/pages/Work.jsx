import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Image,
  Plus,
  Trash2,
  Star,
  StarOff,
  Loader2,
  Save,
  X,
  Sparkles,
  Play,
} from "lucide-react";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";
import UploadDropzone from "../components/UploadDropzone";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";

const SAMPLES = [
  {
    title: "Elena & Marcus — Sunset Vows",
    category: "Wedding",
    description:
      "Golden-hour ceremony and reception coverage told with candid, documentary storytelling.",
    order: "1",
    featured: true,
  },
  {
    title: "Adaeze Studio Portrait Series",
    category: "Portrait",
    description:
      "Editorial studio portraits exploring texture, shadow and bold colour blocking.",
    order: "2",
    featured: false,
  },
  {
    title: "Nova Motors Brand Campaign",
    category: "Commercial",
    description:
      "Campaign visuals shot on location — clean product frames paired with lifestyle context.",
    order: "3",
    featured: false,
  },
  {
    title: "Lagos Fashion Week Backstage",
    category: "Event",
    description:
      "Backstage and runway coverage capturing the energy behind the collections.",
    order: "4",
    featured: true,
  },
];

export default function AdminWork() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);

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
      order: "0",
      featured: false,
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.get("/work"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Close the media lightbox with Escape and lock background scroll while open
  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e) => e.key === "Escape" && setLightboxItem(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxItem]);

  function resetForm() {
    reset({
      title: "",
      category: "",
      description: "",
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
      toast.error("Please select a file to upload");
      return;
    }
    try {
      if (editId) {
        await api.patch(`/work/${editId}`, data);
        toast.success("Item updated");
      } else {
        const fd = new FormData();
        fd.append("file", file);
        Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
        await api.post("/work", fd, true);
        toast.success("Uploaded successfully");
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/work/${deleteTarget}`);
      toast.success("Item deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function toggleFeatured(item) {
    try {
      await api.patch(`/work/${item._id}`, {
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
        icon={Image}
        title="Work"
        description="Manage your portfolio images and videos"
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
            {showForm ? "Cancel" : "Upload work"}
          </button>
        }
      />

      {showForm && (
        <div className="admin-card p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">
            {editId ? "Edit item" : "Upload new work"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!editId && (
              <div>
                <label className="admin-label">File *</label>
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
                  placeholder="e.g. Brand shoot — Nike"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="admin-label">Category</label>
                <input
                  className="admin-input"
                  placeholder="e.g. Brands, Portraits…"
                  {...register("category")}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-input min-h-[5rem] resize-y"
                placeholder="Short description…"
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
          icon={Image}
          title="No work yet"
          description="Upload your first portfolio piece to get started"
          action={
            <button
              className="admin-btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4" />
              Upload work
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="admin-card overflow-hidden group">
              <button
                type="button"
                className="relative block aspect-video w-full cursor-zoom-in bg-slate-100"
                onClick={() => setLightboxItem(item)}
                aria-label={`Preview ${item.title}`}
              >
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
              </button>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {item.title}
                    </p>
                    {item.category && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.category}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    #{item.order}
                  </span>
                </div>
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
                    title={item.featured ? "Unfeature" : "Feature"}
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
        title="Delete work item"
        message="This will permanently delete the item and remove it from Cloudinary."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── Media lightbox ─────────────────────────────────────── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            aria-label="Close preview"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.mediaType === "video" ? (
              <video
                src={lightboxItem.mediaUrl}
                controls
                autoPlay
                playsInline
                className="max-h-[80vh] w-full rounded-xl bg-black object-contain"
              />
            ) : (
              <img
                src={lightboxItem.mediaUrl}
                alt={lightboxItem.title}
                className="max-h-[80vh] w-full rounded-xl object-contain"
              />
            )}
            <p className="mt-3 text-center text-sm text-white/70">
              {lightboxItem.title}
              {lightboxItem.category ? ` · ${lightboxItem.category}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
