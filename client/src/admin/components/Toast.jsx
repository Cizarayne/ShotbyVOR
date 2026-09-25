import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3
        rounded-xl shadow-lg border bg-white
        ${type === 'success' ? 'border-green-200 text-green-800' : 'border-red-200 text-red-800'}`}
    >
      {type === 'success'
        ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
        : <XCircle className="w-5 h-5 text-red-500 shrink-0" />
      }
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-600"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
