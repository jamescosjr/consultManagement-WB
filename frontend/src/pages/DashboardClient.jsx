import React from 'react'
import { CalendarDays, LogOut } from 'lucide-react'
import { logout } from '../services/auth'

export default function DashboardClient() {
  const [consults] = React.useState([{ date: '2026-02-06', doctor: 'Dr. Silva' }])

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-subtitle">Patient portal</p>
            <h1 className="section-title">My consults</h1>
          </div>
          <button className="btn-ghost" onClick={() => { logout(); window.location.href = '/login' }}>
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Upcoming consults</h2>
                <p className="section-subtitle">Your next appointments</p>
              </div>
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="card-body">
              <ul className="flex flex-col gap-3">
                {consults.map((consult, index) => (
                  <li key={index} className="rounded-lg border border-slate-200 px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{consult.date}</div>
                    <div className="text-sm text-slate-500">{consult.doctor}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-slate-900">Need to reschedule?</h2>
            </div>
            <div className="card-body flex flex-col gap-4">
              <p className="text-sm text-slate-500">
                Submit a request to adjust your consult schedule. The admin team will respond promptly.
              </p>
              <button className="btn-primary" onClick={() => alert('Request sent to root')}>Request change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
