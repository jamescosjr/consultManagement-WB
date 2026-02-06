import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function login({ email, password }) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
  const { token, user } = res.data
  if (!token) throw new Error('Token não retornado')
  localStorage.setItem('cm_token', token)
  localStorage.setItem('cm_user', JSON.stringify(user))
  return user
}

export function getToken() {
  return localStorage.getItem('cm_token')
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('cm_user'))
  } catch (e) {
    return null
  }
}

export function getUserRole() {
  const u = getUser()
  return u?.role
}

export function logout() {
  localStorage.removeItem('cm_token')
  localStorage.removeItem('cm_user')
}
