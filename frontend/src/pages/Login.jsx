import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Stethoscope } from 'lucide-react'
import { login, getUserRole } from '../services/auth'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      const role = getUserRole()
      if (role === 'root') navigate('/root')
      if (role === 'doctor') navigate('/doctor')
      if (role === 'client') navigate('/client')
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-inner">
        <div className="mx-auto flex max-w-lg flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="section-subtitle">Modern Medical</p>
              <h1 className="section-title">Secure access</h1>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Sign in</h2>
                <p className="section-subtitle">Use your credentials to continue</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <form onSubmit={handleSubmit} className="card-body flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  className="input-field"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@clinic.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              {error && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>}
              <button type="submit" className="btn-primary justify-center" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
