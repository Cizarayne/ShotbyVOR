import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { KeyRound, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!key.trim()) return
    setLoading(true)
    setError('')
    try {
      await login(key.trim())
      toast.success('Welcome back! You are now logged in.')
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Shotbyvor Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your master API key to continue</p>
        </div>

        <div className="admin-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">API Key</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="admin-input pr-10"
                  placeholder="sbv_••••••••••••••••"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={show ? 'Hide key' : 'Show key'}
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2">
                <span aria-hidden="true">⚠</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-btn-primary w-full justify-center py-2.5"
              disabled={loading || !key.trim()}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Shotbyvor CMS · Admin access only
        </p>
      </div>
    </div>
  )
}
