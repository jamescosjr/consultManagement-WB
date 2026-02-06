import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LogOut, RefreshCw, Users } from 'lucide-react'
import api from '../services/api'
import { logout } from '../services/auth'
import CreateUserForm from '../components/CreateUserForm'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

export default function RootUsers() {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || 'client'
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const { notification, showError, showSuccess, closeToast } = useToast()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Confirma deletar usuário?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
      showSuccess('Usuário deletado com sucesso!')
    } catch (err) {
      showError(err)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="section-subtitle">User directory</p>
              <h1 className="section-title">Users</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" onClick={fetchUsers}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link to="/root" className="btn-secondary">Back to dashboard</Link>
            <button className="btn-ghost" onClick={() => { logout(); window.location.href = '/login' }}>
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Directory</h2>
                <p className="section-subtitle">{users.length} users registered</p>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-sm text-slate-500">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600">
                      {users.map(u => (
                        <tr key={u._id} className="border-t border-slate-100">
                          <td className="py-3 font-medium text-slate-900">{u.name}</td>
                          <td className="py-3">{u.email}</td>
                          <td className="py-3">
                            <span className="badge">{u.role}</span>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button className="btn-secondary" onClick={() => alert('Edit not implemented yet')}>Edit</button>
                              <button className="btn-primary" onClick={() => handleDelete(u._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Create user</h2>
                <p className="section-subtitle">Assign access and role details</p>
              </div>
            </div>
            <div className="card-body">
              <CreateUserForm initialRole={initialRole} onCreated={fetchUsers} />
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          duration={notification.duration}
          onClose={closeToast}
        />
      )}
    </div>
  )
}
