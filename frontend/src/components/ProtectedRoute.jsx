import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, getUserRole } from '../services/auth'

export default function ProtectedRoute({ children, roles = [] }) {
  const token = getToken()
  const role = getUserRole()
  if (!token) return <Navigate to="/login" replace />
  if (roles.length && !roles.includes(role)) return <Navigate to="/login" replace />
  return children
}
