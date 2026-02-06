import React from 'react'
import { CalendarDays, Pencil, Trash2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import api from '../services/api'
import SearchableSelect from '../components/SearchableSelect'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'

const WEEK_DAYS = [
  'Domingo',
  'Segunda-feira',
  'Terca-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sabado'
]

const consultSchema = z.object({
  date: z.string().min(1, { message: 'Data é obrigatória' }),
  shift: z.enum(['MORNING', 'AFTERNOON']),
  doctorId: z.string().min(1, { message: 'Médico é obrigatório' }),
  patientId: z.string().min(1, { message: 'Paciente é obrigatório' }),
  description: z.string().optional()
})

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
  
  const createForm = useForm({
    resolver: zodResolver(consultSchema),
    defaultValues: {
      date: '',
      shift: 'MORNING',
      doctorId: '',
      patientId: '',
      description: ''
    }
  })

  const editForm = useForm({
    resolver: zodResolver(consultSchema),
    defaultValues: {
      date: '',
      shift: 'MORNING',
      doctorId: '',
      patientId: '',
      description: ''
    }
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
    editForm.reset({
      date: formatDateInput(consult.date),
      shift: consult.shift || 'MORNING',
      doctorId: consult.doctorId || '',
      patientId: consult.patientId || '',
      description: consult.description || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    editForm.reset({
      date: '',
      shift: 'MORNING',
      doctorId: '',
      patientId: '',
      description: ''
    })
  }

  const convertDateToUTC = (dateString) => {
    // dateString vem como "2026-02-07"
    // Criar uma data no início do dia em hora local
    const [year, month, day] = dateString.split('-')
    const localDate = new Date(year, parseInt(month) - 1, day, 12, 0, 0) // 12:00 em hora local
    return localDate.toISOString()
  }

  const onEditSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        date: convertDateToUTC(values.date)
      }
      await api.put(`/consults/${editingId}`, submitData)
      setEditingId(null)
      fetchConsults()
      showSuccess('Consulta atualizada com sucesso!')
    } catch (err) {
      showError(err)
    }
  }

  const onCreateSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        date: convertDateToUTC(values.date)
      }
      await api.post('/consults', submitData)
      createForm.reset({
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
    createForm.reset({
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
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={createForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="shift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turno</FormLabel>
                        <FormControl>
                          <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" {...field}>
                            <option value="MORNING">Manhã</option>
                            <option value="AFTERNOON">Tarde</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Médico *</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            type="doctors"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paciente *</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            type="patients"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            rows="3"
                            placeholder="Observações sobre a consulta..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <Button type="submit" disabled={createForm.formState.isSubmitting}>
                      {createForm.formState.isSubmitting ? 'Criando...' : 'Criar consulta'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={resetCreateForm}>Cancelar</Button>
                  </div>
                </form>
              </Form>
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
                                  <Form {...editForm}>
                                    <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="grid gap-4 md:grid-cols-2">
                                      <FormField
                                        control={editForm.control}
                                        name="date"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                              <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={editForm.control}
                                        name="shift"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Shift</FormLabel>
                                            <FormControl>
                                              <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" {...field}>
                                                <option value="MORNING">Manhã</option>
                                                <option value="AFTERNOON">Tarde</option>
                                              </select>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={editForm.control}
                                        name="doctorId"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Médico</FormLabel>
                                            <FormControl>
                                              <SearchableSelect
                                                type="doctors"
                                                value={field.value}
                                                onChange={field.onChange}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={editForm.control}
                                        name="patientId"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Paciente</FormLabel>
                                            <FormControl>
                                              <SearchableSelect
                                                type="patients"
                                                value={field.value}
                                                onChange={field.onChange}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <FormField
                                        control={editForm.control}
                                        name="description"
                                        render={({ field }) => (
                                          <FormItem className="md:col-span-2">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                              <textarea
                                                className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                                rows="3"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      
                                      <div className="md:col-span-2 flex flex-wrap gap-3">
                                        <Button type="submit" disabled={editForm.formState.isSubmitting}>
                                          {editForm.formState.isSubmitting ? 'Salvando...' : 'Save changes'}
                                        </Button>
                                        <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                                      </div>
                                    </form>
                                  </Form>
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
