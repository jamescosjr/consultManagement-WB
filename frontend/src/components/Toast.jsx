import React, { useEffect } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

export default function Toast({ message, type = 'error', duration = 5000, onClose }) {
  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    error: 'bg-red-50 border-red-200',
    success: 'bg-emerald-50 border-emerald-200',
    info: 'bg-blue-50 border-blue-200'
  }[type]

  const textColor = {
    error: 'text-red-800',
    success: 'text-emerald-800',
    info: 'text-blue-800'
  }[type]

  const borderColor = {
    error: 'border-red-200',
    success: 'border-emerald-200',
    info: 'border-blue-200'
  }[type]

  const icon = {
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />
  }[type]

  return (
    <div className={`fixed top-4 right-4 rounded-lg border ${bgColor} px-4 py-3 flex items-start gap-3 max-w-md shadow-lg z-50 animate-slideIn`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className={`flex-1 text-sm font-medium ${textColor}`}>
        {message}
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${textColor} hover:opacity-75`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
