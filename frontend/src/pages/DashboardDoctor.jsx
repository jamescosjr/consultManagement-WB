import React from 'react'
import { CalendarDays, LogOut } from 'lucide-react'
import { logout } from '../services/auth'

export default function DashboardDoctor() {
  const [consults, setConsults] = React.useState([])

  React.useEffect(() => {
    setConsults([{ date: '2026-02-06', patient: 'Joao' }])
  }, [])

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-subtitle">Doctor workspace</p>
            <h1 className="section-title">My schedule</h1>
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
                <p className="section-subtitle">Your active agenda</p>
              </div>
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="card-body">
              <ul className="flex flex-col gap-3">
                {consults.map((consult, index) => (
                  <li key={index} className="rounded-lg border border-slate-200 px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{consult.date}</div>
                    <div className="text-sm text-slate-500">{consult.patient}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-slate-900">Need to adjust?</h2>
            </div>
            <div className="card-body flex flex-col gap-4">
              <p className="text-sm text-slate-500">
                Submit a request to adjust consult timing or patient assignment.
              </p>
              <button className="btn-primary" onClick={() => alert('Request sent to root')}>Request change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
