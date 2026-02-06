import React from 'react'
import { logout } from '../services/auth'

export default function DashboardClient() {
  const [consults] = React.useState([{ date: '2026-02-06', doctor: 'Dr. Silva' }])

  return (
    <div className="page">
      <h2>Dashboard - Client</h2>
      <p>Suas consultas:</p>
      <ul>
        {consults.map((c, i) => <li key={i}>{c.date} — {c.doctor}</li>)}
      </ul>
      <button onClick={() => alert('Solicitar remarcação/cancelamento enviada ao root')}>Solicitar alteração</button>
      <button onClick={() => { logout(); window.location.href = '/login' }}>Sair</button>
    </div>
  )
}
