import { useState } from 'react'

export function useToast() {
  const [notification, setNotification] = useState(null)

  const showToast = (message, type = 'error', duration = 5000) => {
    setNotification({ message, type, duration })
  }

  const showError = (error) => {
    let message = 'Erro desconhecido'
    
    if (error.response?.data?.message) {
      message = error.response.data.message
    } else if (error.response?.status === 404) {
      message = 'Recurso não encontrado'
    } else if (error.response?.status === 401) {
      message = 'Não autorizado. Faça login novamente'
    } else if (error.response?.status === 403) {
      message = 'Acesso negado'
    } else if (error.response?.status === 400) {
      message = error.response.data.message || 'Dados inválidos'
    } else if (error.response?.status === 500) {
      message = 'Erro no servidor. Tente novamente'
    } else if (error.message) {
      message = error.message
    }
    
    showToast(message, 'error', 5000)
  }

  const showSuccess = (message) => {
    showToast(message, 'success', 3000)
  }

  const showInfo = (message) => {
    showToast(message, 'info', 3000)
  }

  const closeToast = () => {
    setNotification(null)
  }

  return {
    notification,
    showToast,
    showError,
    showSuccess,
    showInfo,
    closeToast
  }
}
