import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  BookOpen,
  Save,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  X,
  Plus,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { api } from "../lib/api";
import UploadDropzone from "../components/UploadDropzone";

const SAMPLES = [
  {
    title: "The Art of Golden Hour Portraits",
    excerpt:
      "Why the last hour before sunset delivers the most flattering light — and how to plan a shoot around it.",
    content: `Golden hour — the hour after sunrise and the hour before sunset — remains the most forgiving light in photography. The sun sits low, shadows stretch, and skin tones take on a warmth that no preset fully replicates.

For a portrait session we plan backwards from the forecast. If sunset is at 6:40pm, we arrive at 5:45pm: wide and environmental frames first while the light is still high, then close-up work as the sun drops. The final twenty minutes are reserved for silhouettes and backlit frames.

The trick is to keep the subject moving. Static poses under soft light look flat — a slow walk toward the camera, a turn of the head, hair catching the rim light. That is where the frame comes alive, and it is almost impossible to fake later.`,
    tags: ["Portrait", "Golden hour", "Tips"],
    published: false,
  },
  {
    title: "Behind the Lens: Our Wedding Season Recap",
    excerpt:
      "Twelve weddings, four cities and one very tired shutter finger — what this season taught us about documenting love.",
    content: `This season we documented twelve weddings across four cities, and every single one reminded us why we still get emotional during the vows. No two celebrations run the same way, and that unpredictability is exactly what keeps the work fresh.

Our favourite frames this year were almost all unplanned: a grandmother wiping tears during the speeches, the groom fixing his boutonniere in a hallway mirror, confetti caught mid-air against evening light. We shoot documentary-first, then steal ten minutes for portraits so couples get both the story and the hero image.

As the year winds down, we are already blocking calendars for next season. If your date is coming up, reach out early — weekend slots go fast.`,
    tags: ["Weddings", "Behind the scenes"],
    published: false,
  },
  {
    title: "5 Composition Rules We Actually Follow",
    excerpt:
      "Rule of thirds is just the beginning — the handful of framing habits that quietly upgrade every shot.",
    content: `Everyone learns the rule of thirds first, and it is a fine starting point. But over hundreds of shoots, a handful of habits have proven far more useful in practice.

One — frame within the frame. Doorways, arches and mirrors add depth and guide the eye without any post-processing.

Two — leave lead room. If your subject is moving or looking in a direction, give them space in the frame to move into.

Three — shoot through things. Foreground foliage, glass, even a stranger's shoulder creates layers that read as three-dimensional.

Four — straighten the horizon. It is the fastest quality upgrade in editing, and even easier if you get it right in camera.

Five — when in doubt, move your feet. Zooming with your legs changes the relationship between subject and background in ways a lens ring never will.`,
    tags: ["Education", "Composition"],
    published: false,
  },
];

export default function AdminJournalEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [coverFile, setCoverFile] = useState(null);
  const [existingCover, setExistingCover] = useState("");
  const [existingCoverType, setExistingCoverType] = useState("image");
  const [loading, setLoading] = useState(isEdit);
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      tags: [],
      published: false,
    },
  });

  const watchedValues = watch();

  // Load existing journal for edit
  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/journals/${id}`)
      .then((data) => {
        reset({
          title: data.title,
          excerpt: data.excerpt || "",
          content: data.content,
          tags: data.tags || [],
          published: data.published,
        });
        setExistingCover(data.coverUrl || "");
        setExistingCoverType(data.coverType === "video" ? "video" : "image");
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  function addTag(e) {
    e.preventDefault();
    const t = tagInput.trim();
    if (!t) return;
    const current = watchedValues.tags || [];
    if (!current.includes(t)) setValue("tags", [...current, t]);
    setTagInput("");
  }

  function removeTag(t) {
    setValue(
      "tags",
      (watchedValues.tags || []).filter((x) => x !== t),
    );
  }

  function autofill() {
    const s = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
    reset({ ...s, tags: [...s.tags] });
    setPreview(false);
    toast.success("Journal autofilled — tweak it before saving");
  }

  async function onSubmit(data) {
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("excerpt", data.excerpt);
      fd.append("content", data.content);
      fd.append("tags", JSON.stringify(data.tags));
      fd.append("published", String(data.published));
      if (coverFile) fd.append("cover", coverFile);

      if (isEdit) {
        await api.patch(`/journals/${id}`, fd, true);
        toast.success("Journal saved");
      } else {
        await api.post("/journals", fd, true);
        toast.success("Journal created");
        setTimeout(() => navigate("/admin/journals"), 1000);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/journals"
            className="admin-btn-secondary px-2.5"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800">
              {isEdit ? "Edit journal" : "New journal"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={autofill}
          >
            <Sparkles className="w-4 h-4" />
            Autofill
          </button>
          <button
            form="journal-form"
            type="submit"
            className="admin-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </div>

      {preview ? (
        /* ── Preview ── */
        <div className="admin-card p-8">
          {(existingCover || coverFile) &&
            (coverFile ? (
              coverFile.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(coverFile)}
                  controls
                  className="w-full max-h-64 rounded-xl mb-6 bg-black"
                />
              ) : (
                <img
                  src={URL.createObjectURL(coverFile)}
                  alt="Cover"
                  className="w-full max-h-64 object-cover rounded-xl mb-6"
                />
              )
            ) : existingCoverType === "video" ? (
              <video
                src={existingCover}
                controls
                className="w-full max-h-64 rounded-xl mb-6 bg-black"
              />
            ) : (
              <img
                src={existingCover}
                alt="Cover"
                className="w-full max-h-64 object-cover rounded-xl mb-6"
              />
            ))}
          <div className="flex gap-2 flex-wrap mb-3">
            {(watchedValues.tags || []).map((t) => (
              <span key={t} className="admin-badge bg-blue-50 text-blue-600">
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {watchedValues.title || "Untitled"}
          </h1>
          {watchedValues.excerpt && (
            <p className="text-slate-500 italic mb-4">
              {watchedValues.excerpt}
            </p>
          )}
          <hr className="border-slate-200 mb-4" />
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {watchedValues.content || (
              <span className="text-slate-400">No content yet…</span>
            )}
          </div>
        </div>
      ) : (
        /* ── Editor ── */
        <form
          id="journal-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Cover */}
          <div className="admin-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <label className="text-sm font-semibold text-slate-700">
                Cover image or video
              </label>
            </div>
            {existingCover && !coverFile && (
              <div className="relative mb-3">
                {existingCoverType === "video" ? (
                  <video
                    src={existingCover}
                    controls
                    muted
                    playsInline
                    className="w-full max-h-40 rounded-lg bg-black"
                  />
                ) : (
                  <img
                    src={existingCover}
                    alt="Current cover"
                    className="w-full max-h-40 object-cover rounded-lg"
                  />
                )}
                <span className="absolute top-2 left-2 z-10 admin-badge bg-black/50 text-white">
                  Current cover
                </span>
              </div>
            )}
            <UploadDropzone
              accept="image/*,video/*"
              onChange={setCoverFile}
              label="Drop cover image or video here"
              maxMB={50}
            />
          </div>

          {/* Title + excerpt */}
          <div className="admin-card p-5 space-y-4">
            <div>
              <label className="admin-label">Title *</label>
              <input
                className={`admin-input text-base font-medium ${errors.title ? "border-red-400" : ""}`}
                placeholder="Journal title…"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="admin-label">Excerpt</label>
              <textarea
                className="admin-input resize-y"
                rows={2}
                placeholder="Short teaser shown in the list…"
                {...register("excerpt")}
              />
            </div>
          </div>

          {/* Content */}
          <div className="admin-card p-5">
            <label className="admin-label">Content *</label>
            <textarea
              className={`admin-input resize-y font-mono text-sm leading-relaxed ${errors.content ? "border-red-400" : ""}`}
              rows={20}
              placeholder="Write your journal entry here…"
              {...register("content", { required: "Content is required" })}
            />
            {errors.content ? (
              <p className="text-xs text-red-500 mt-1">
                {errors.content.message}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                {(watchedValues.content || "").length} characters
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="admin-card p-5">
            <label className="admin-label">Tags</label>
            <div className="flex gap-2 flex-wrap mb-3">
              {(watchedValues.tags || []).map((t) => (
                <span
                  key={t}
                  className="admin-badge bg-blue-50 text-blue-600 pr-1"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="ml-1 hover:text-red-500"
                    aria-label={`Remove ${t}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="admin-input flex-1"
                placeholder="Add a tag…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag(e)}
              />
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={addTag}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          {/* Publish toggle */}
          <div className="admin-card p-5">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => field.onChange(!field.value)}
                  role="switch"
                  aria-checked={field.value}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === " " && field.onChange(!field.value)
                  }
                >
                  <div
                    className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${field.value ? "bg-blue-600" : "bg-slate-200"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform
                      ${field.value ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {field.value ? "Published" : "Draft"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {field.value
                        ? "Visible on the public site"
                        : "Not visible to visitors"}
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </form>
      )}
    </div>
  );
}
