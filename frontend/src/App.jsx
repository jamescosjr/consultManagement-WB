import React from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardRoot from './pages/DashboardRoot'
import DashboardDoctor from './pages/DashboardDoctor'
import DashboardClient from './pages/DashboardClient'
import RootUsers from './pages/RootUsers'
import RootConsults from './pages/RootConsults'
import ProtectedRoute from './components/ProtectedRoute'
import { getToken, getUserRole } from './services/auth'
import ManageClients from './pages/ManageClients';
import ManageDoctors from './pages/ManageDoctors';

export default function App() {
  const navigate = useNavigate()

  React.useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/login')
    } else {
      const role = getUserRole()
      if (role) {
        if (role === 'root') navigate('/root')
        if (role === 'doctor') navigate('/doctor')
        if (role === 'client') navigate('/client')
      }
    }
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/root" element={<ProtectedRoute roles={["root"]}><DashboardRoot /></ProtectedRoute>} />
      <Route path="/root/users" element={<ProtectedRoute roles={["root"]}><RootUsers /></ProtectedRoute>} />
      <Route path="/root/consults" element={<ProtectedRoute roles={["root"]}><RootConsults /></ProtectedRoute>} />
      <Route path="/root/clients" element={<ProtectedRoute roles={["root"]}><ManageClients /></ProtectedRoute>} />
      <Route path="/root/doctors" element={<ProtectedRoute roles={["root"]}><ManageDoctors /></ProtectedRoute>} />
      <Route path="/doctor" element={<ProtectedRoute roles={["doctor"]}><DashboardDoctor /></ProtectedRoute>} />
      <Route path="/client" element={<ProtectedRoute roles={["client"]}><DashboardClient /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
