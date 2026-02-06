import React from 'react'
import { logout, getUserRole } from '../services/auth'

import { Link } from 'react-router-dom'

export default function DashboardRoot() {
  return (
    <div className="page">
      <h2>Dashboard - Root</h2>
      <p>Gerencie usuários, médicos, pacientes e consultas.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/root/users"><button>Usuários</button></Link>
        <Link to="/root/consults"><button>Consultas</button></Link>
        <button onClick={() => { logout(); window.location.href = '/login' }}>Sair</button>
      </div>
    </div>
  )
}
