import { doctors } from "../repository/doctorRepository.js"
import { patients } from "../repository/patientRepository.js"

function validateConsultData ({ date, doctorId, patientId, description }) {
  if (!date || !doctorId || !patientId || !description) {
    throw new Error('Invalid data')
  }

  if (!doctors || !doctors.length || !doctors.find(doctor => doctor.id === doctorId)) {
    throw new Error('Doctor not found')
  }

  if (!patients || !patients.length || !patients.find(patient => patient.id === patientId)) {
    throw new Error('Patient not found')
  }
}

export function createConsultModel ({ date, doctorId, patientId, description }) {
  validateConsultData({ date, doctorId, patientId, description })
  return { date, doctorId, patientId, description, id: null }
}