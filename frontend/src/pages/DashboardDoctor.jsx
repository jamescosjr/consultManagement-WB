import React from 'react'
import { getToken, logout, getUserRole } from '../services/auth'

export default function DashboardDoctor() {
  const [consults, setConsults] = React.useState([])

  React.useEffect(() => {
    // Carregamento placeholder: front-end pode chamar /consults/doctor/:id
    setConsults([{ date: '2026-02-06', patient: 'João' }])
  }, [])

  return (
    <div className="page">
      <h2>Dashboard - Doctor</h2>
      <p>Sua agenda:</p>
      <ul>
        {consults.map((c, i) => <li key={i}>{c.date} — {c.patient}</li>)}
      </ul>
      <button onClick={() => alert('Solicitar alteração: enviar request ao root')}>Solicitar alteração</button>
      <button onClick={() => { logout(); window.location.href = '/login' }}>Sair</button>
    </div>
  )
}
