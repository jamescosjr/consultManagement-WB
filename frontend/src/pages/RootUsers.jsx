import React from 'react'
import api from '../services/api'
import { logout } from '../services/auth'

export default function RootUsers() {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      alert('Erro ao buscar usuários')
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
    } catch (err) {
      alert('Erro ao deletar usuário')
    }
  }

  return (
    <div className="page">
      <h2>Usuários (Root)</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={fetchUsers}>Atualizar</button>
        <button onClick={() => { logout(); window.location.href = '/login' }}>Sair</button>
      </div>
      {loading ? <div>Carregando...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Nome</th><th>Email</th><th>Role</th><th>Ações</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => alert('Editar não implementado ainda')}>Editar</button>
                  <button onClick={() => handleDelete(u._id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
