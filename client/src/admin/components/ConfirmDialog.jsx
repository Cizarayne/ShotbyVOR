import { Trash2, X } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative admin-card p-6 w-full max-w-sm shadow-xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="font-semibold text-slate-800">{title || 'Confirm delete'}</h2>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          {message || 'Are you sure? This action cannot be undone.'}
        </p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="admin-btn-secondary">Cancel</button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white
                       text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
