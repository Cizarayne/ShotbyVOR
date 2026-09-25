import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  Eye,
  EyeOff,
  Play,
} from "lucide-react";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";

export default function AdminJournals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.get("/journals?all=true"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    try {
      await api.delete(`/journals/${deleteTarget}`);
      toast.success("Journal deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function togglePublished(item) {
    try {
      const fd = new FormData();
      fd.append("title", item.title);
      fd.append("excerpt", item.excerpt || "");
      fd.append("content", item.content);
      fd.append("tags", JSON.stringify(item.tags));
      fd.append("published", String(!item.published));
      await api.patch(`/journals/${item._id}`, fd, true);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="w-full">
      <PageHeader
        icon={BookOpen}
        title="Journals"
        description="Write and manage your blog posts"
        actions={
          <Link to="/admin/journals/new" className="admin-btn-primary">
            <Plus className="w-4 h-4" /> New journal
          </Link>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No journals yet"
          description="Write your first journal entry to get started"
          action={
            <Link to="/admin/journals/new" className="admin-btn-primary">
              <Plus className="w-4 h-4" />
              New journal
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="admin-card p-4 flex items-start gap-4"
            >
              {item.coverUrl ? (
                item.coverType === "video" ? (
                  <div className="relative w-16 h-16 shrink-0">
                    <video
                      src={item.coverUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                    />
                    <span className="absolute inset-0 flex items-center justify-center rounded-lg">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm">
                        <Play className="h-3 w-3 text-white" fill="currentColor" />
                      </span>
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.coverUrl}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100"
                  />
                )
              ) : (
                <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-slate-800 truncate">
                    {item.title}
                  </p>
                  <span
                    className={`admin-badge shrink-0 ${item.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                  {item.coverType === "video" && (
                    <span className="admin-badge shrink-0 bg-blue-100 text-blue-700">
                      Video
                    </span>
                  )}
                </div>
                {item.excerpt && (
                  <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                    {item.excerpt}
                  </p>
                )}
                {item.tags?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="admin-badge bg-blue-50 text-blue-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  className="admin-btn-secondary px-2.5"
                  onClick={() => togglePublished(item)}
                  title={item.published ? "Unpublish" : "Publish"}
                >
                  {item.published ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-blue-500" />
                  )}
                </button>
                <Link
                  to={`/admin/journals/${item._id}/edit`}
                  className="admin-btn-secondary px-2.5"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  className="admin-btn-danger px-2.5"
                  onClick={() => setDeleteTarget(item._id)}
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete journal"
        message="This will permanently delete the journal entry. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
