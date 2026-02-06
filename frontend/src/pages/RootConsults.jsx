import React from 'react'
import { CalendarDays, Pencil, Trash2, Plus } from 'lucide-react'
import api from '../services/api'
import SearchableSelect from '../components/SearchableSelect'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const WEEK_DAYS = [
  'Domingo',
  'Segunda-feira',
  'Terca-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sabado'
]

const formatDateInput = (value) => {
  const dateObj = new Date(value)
  if (Number.isNaN(dateObj.getTime())) return ''
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function RootConsults() {
  const [consults, setConsults] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [editingId, setEditingId] = React.useState(null)
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [doctors, setDoctors] = React.useState({})
  const [patients, setPatients] = React.useState({})
  const { notification, showError, showSuccess, closeToast } = useToast()
  
  const [editForm, setEditForm] = React.useState({
    date: '',
    shift: 'MORNING',
    doctorId: '',
    patientId: '',
    description: ''
  })

  const [createForm, setCreateForm] = React.useState({
    date: '',
    shift: 'MORNING',
    doctorId: '',
    patientId: '',
    description: ''
  })

  const fetchConsults = async () => {
    setLoading(true)
    try {
      const res = await api.get('/consults')
      setConsults(res.data)
    } catch (err) {
      showError(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctorsAndPatients = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/patients')
      ])
      const doctorsMap = {}
      const patientsMap = {}
      doctorsRes.data.forEach(doc => {
        doctorsMap[doc._id] = doc.name
      })
      patientsRes.data.forEach(pat => {
        patientsMap[pat._id] = pat.name
      })
      setDoctors(doctorsMap)
      setPatients(patientsMap)
    } catch (err) {
      console.error('Erro ao buscar médicos e pacientes:', err)
    }
  }

  React.useEffect(() => {
    fetchConsults()
    fetchDoctorsAndPatients()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Confirma deletar consulta?')) return
    try {
      await api.delete(`/consults/${id}`)
      setConsults(consults.filter(c => c._id !== id))
      showSuccess('Consulta deletada com sucesso!')
    } catch (err) {
      showError(err)
    }
  }

  const handleStartEdit = (consult) => {
    setEditingId(consult._id)
    setEditForm({
      date: formatDateInput(consult.date),
      shift: consult.shift || 'MORNING',
      doctorId: consult.doctorId || '',
      patientId: consult.patientId || '',
      description: consult.description || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      date: '',
      shift: 'MORNING',
      doctorId: '',
      patientId: '',
      description: ''
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveEdit = async (id) => {
    try {
      const submitData = {
        ...editForm,
        date: convertDateToUTC(editForm.date)
      }
      await api.put(`/consults/${id}`, submitData)
      setEditingId(null)
      fetchConsults()
      showSuccess('Consulta atualizada com sucesso!')
    } catch (err) {
      showError(err)
    }
  }

  const handleCreateChange = (e) => {
    const { name, value } = e.target
    setCreateForm((prev) => ({ ...prev, [name]: value }))
  }

  const convertDateToUTC = (dateString) => {
    // dateString vem como "2026-02-07"
    // Criar uma data no início do dia em hora local
    const [year, month, day] = dateString.split('-')
    const localDate = new Date(year, parseInt(month) - 1, day, 12, 0, 0) // 12:00 em hora local
    return localDate.toISOString()
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!createForm.doctorId || !createForm.patientId || !createForm.date) {
      showError({ message: 'Preencha todos os campos obrigatórios: Data, Médico e Paciente' })
      return
    }
    try {
      const submitData = {
        ...createForm,
        date: convertDateToUTC(createForm.date)
      }
      await api.post('/consults', submitData)
      setCreateForm({
        date: '',
        shift: 'MORNING',
        doctorId: '',
        patientId: '',
        description: ''
      })
      setShowCreateForm(false)
      fetchConsults()
      showSuccess('Consulta criada com sucesso!')
    } catch (err) {
      showError(err)
    }
  }

  const resetCreateForm = () => {
    setCreateForm({
      date: '',
      shift: 'MORNING',
      doctorId: '',
      patientId: '',
      description: ''
    })
    setShowCreateForm(false)
  }

  const consultsByDay = React.useMemo(() => {
    const grouped = WEEK_DAYS.map(() => [])
    consults.forEach((consult) => {
      const dayIndex = new Date(consult.date).getDay()
      if (!Number.isNaN(dayIndex)) grouped[dayIndex].push(consult)
    })
    return grouped
  }, [consults])

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="section-subtitle">Weekly view</p>
              <h1 className="section-title">Consults</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={fetchConsults}>Refresh</button>
            <button className="btn-primary flex items-center gap-2" onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4" />
              Nova consulta
            </button>
          </div>
        </header>

        {showCreateForm && (
          <div className="mt-8 card">
            <div className="card-header">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Criar nova consulta</h2>
                <p className="section-subtitle">Preencha os dados da consulta</p>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Data *</label>
                  <input
                    className="input-field"
                    type="date"
                    name="date"
                    value={createForm.date}
                    onChange={handleCreateChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Turno</label>
                  <select className="input-field" name="shift" value={createForm.shift} onChange={handleCreateChange}>
                    <option value="MORNING">Manhã</option>
                    <option value="AFTERNOON">Tarde</option>
                  </select>
                </div>
                <div>
                  <SearchableSelect
                    type="doctors"
                    value={createForm.doctorId}
                    onChange={(value) => setCreateForm(prev => ({ ...prev, doctorId: value || '' }))}
                    label="Médico *"
                  />
                </div>
                <div>
                  <SearchableSelect
                    type="patients"
                    value={createForm.patientId}
                    onChange={(value) => setCreateForm(prev => ({ ...prev, patientId: value || '' }))}
                    label="Paciente *"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Descrição</label>
                  <textarea
                    className="input-field"
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateChange}
                    rows="3"
                    placeholder="Observações sobre a consulta..."
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">Criar consulta</button>
                  <button type="button" className="btn-secondary" onClick={resetCreateForm}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8 card">
          <div className="card-header">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Weekly schedule</h2>
              <p className="section-subtitle">Review and adjust consults by weekday</p>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-sm text-slate-500">Loading consults...</div>
            ) : (
              <table className="w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3">Weekday</th>
                    <th className="pb-3">Consults</th>
                  </tr>
                </thead>
                <tbody>
                  {WEEK_DAYS.map((dayLabel, index) => (
                    <tr key={dayLabel}>
                      <td className="pr-6 align-top text-sm font-medium text-slate-700">{dayLabel}</td>
                      <td>
                        {consultsByDay[index].length === 0 ? (
                          <div className="text-sm text-slate-400">No consults</div>
                        ) : (
                          <ul className="flex flex-col gap-3">
                            {consultsByDay[index].map((consult) => (
                              <li key={consult._id} className="rounded-xl border border-slate-200 bg-white px-4 py-4">
                                {editingId === consult._id ? (
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Date</label>
                                      <input
                                        className="input-field"
                                        type="date"
                                        name="date"
                                        value={editForm.date}
                                        onChange={handleEditChange}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Shift</label>
                                      <select className="input-field" name="shift" value={editForm.shift} onChange={handleEditChange}>
                                        <option value="MORNING">Manhã</option>
                                        <option value="AFTERNOON">Tarde</option>
                                      </select>
                                    </div>
                                    <div>
                                      <SearchableSelect
                                        type="doctors"
                                        value={editForm.doctorId}
                                        onChange={(value) => setEditForm(prev => ({ ...prev, doctorId: value || '' }))}
                                        label="Médico"
                                      />
                                    </div>
                                    <div>
                                      <SearchableSelect
                                        type="patients"
                                        value={editForm.patientId}
                                        onChange={(value) => setEditForm(prev => ({ ...prev, patientId: value || '' }))}
                                        label="Paciente"
                                      />
                                    </div>
                                    <div className="md:col-span-2 flex flex-col gap-2">
                                      <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Description</label>
                                      <textarea
                                        className="input-field"
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        rows="3"
                                      />
                                    </div>
                                    <div className="md:col-span-2 flex flex-wrap gap-3">
                                      <button className="btn-primary" onClick={() => handleSaveEdit(consult._id)}>Save changes</button>
                                      <button className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="text-sm font-medium text-slate-900">
                                        {new Date(consult.date).toLocaleDateString()} · {consult.shift}
                                      </div>
                                      <span className={`badge ${consult.shift === 'MORNING' ? 'badge-emerald' : 'badge-indigo'}`}>
                                        {consult.shift}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-500">{consult.description}</p>
                                    <div className="text-xs text-slate-400">
                                      Médico: {doctors[consult.doctorId] || consult.doctorId} · Paciente: {patients[consult.patientId] || consult.patientId}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                      <button className="btn-secondary" onClick={() => handleStartEdit(consult)}>
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                      </button>
                                      <button className="btn-ghost" onClick={() => handleDelete(consult._id)}>
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          duration={notification.duration}
          onClose={closeToast}
        />
      )}
    </div>
  )
}
