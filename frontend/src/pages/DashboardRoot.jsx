import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, LogOut, Stethoscope, UserRound, Users } from 'lucide-react'
import { logout } from '../services/auth'

const quickLinks = [
  {
    title: 'Users',
    description: 'Create, audit, and manage access roles.',
    href: '/root/users',
    icon: Users,
    accent: 'bg-emerald-100 text-emerald-700'
  },
  {
    title: 'Patients',
    description: 'Profiles, history, and consult timeline.',
    href: '/root/clients',
    icon: UserRound,
    accent: 'bg-indigo-100 text-indigo-700'
  },
  {
    title: 'Doctors',
    description: 'Schedules, specialties, and availability.',
    href: '/root/doctors',
    icon: Stethoscope,
    accent: 'bg-emerald-100 text-emerald-700'
  },
  {
    title: 'Consults',
    description: 'Weekly overview and adjustments.',
    href: '/root/consults',
    icon: CalendarDays,
    accent: 'bg-indigo-100 text-indigo-700'
  }
]

export default function DashboardRoot() {
  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-subtitle">Operations hub</p>
            <h1 className="section-title">Root dashboard</h1>
          </div>
          <button className="btn-ghost" onClick={() => { logout(); window.location.href = '/login' }}>
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map(({ title, description, href, icon: Icon, accent }) => (
            <Link key={title} to={href} className="card group p-6 transition hover:-translate-y-0.5 hover:border-slate-300">
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              </div>
              <div className="mt-6 text-sm font-medium text-emerald-600">Open module</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
