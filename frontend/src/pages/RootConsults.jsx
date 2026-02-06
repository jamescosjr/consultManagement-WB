import React from 'react'
import api from '../services/api'

export default function RootConsults() {
  const [consults, setConsults] = React.useState([])

  const fetchConsults = async () => {
    try {
      const res = await api.get('/consults')
      setConsults(res.data)
    } catch (err) {
      alert('Erro ao buscar consultas')
    }
  }

  React.useEffect(() => { fetchConsults() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Confirma deletar consulta?')) return
    try {
      await api.delete(`/consults/${id}`)
      setConsults(consults.filter(c => c._id !== id))
    } catch (err) {
      alert('Erro ao deletar consulta')
    }
  }

  return (
    <div className="page">
      <h2>Consultas (Root)</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={fetchConsults}>Atualizar</button>
      </div>
      <ul>
        {consults.map(c => (
          <li key={c._id}>{c.date} — {c.doctorName || c.doctorId} — {c.patientName || c.patientId} <button onClick={() => handleDelete(c._id)}>Deletar</button></li>
        ))}
      </ul>
    </div>
  )
}
