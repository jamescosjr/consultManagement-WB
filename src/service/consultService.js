import { createConsultModel } from '../models/consult.js';
import { create, findAll, findByDescription, findByDate, findByDoctorId, findByPatientId, deleteById, updateById } from '../repository/consultRepository.js';

export function createConsult(data) {
    const consult = createConsultModel(data);
    return create(consult);
}

export function listConsults() { return findAll() };

export function listConsultsByDescription(description) { return findByDescription(description) };

export function listConsultsByDate(date) { return findByDate(date) };

export function listConsultsByDoctorId(doctorId) { return findByDoctorId(doctorId) };

export function listConsultsByPatientId(patientId) { return findByPatientId(patientId) };

export function deleteConsultById(id) { return deleteById(id) };

export function updateConsultById(id, data) { return updateById(id, data) };