import React from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getUserRole } from '../services/auth'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ email, password })
      const role = getUserRole()
      if (role === 'root') navigate('/root')
      if (role === 'doctor') navigate('/doctor')
      if (role === 'client') navigate('/client')
    } catch (err) {
      setError(err?.message || 'Erro no login')
    }
  }

  return (
    <div className="page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <label>Senha</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
