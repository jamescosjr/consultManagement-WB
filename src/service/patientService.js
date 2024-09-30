import { createPatientModel } from '../models/patient.js';
import { create, findAll, findByName, listByAge, deleteById, updateById } from '../repository/patientRepository.js';

export function createPatient(data) {
    const patient = createPatientModel(data);
    return create(patient);
};

export function listPatients() { return findAll() };

export function findPatientByName(name) { return findByName(name) };

export function listPatientsByAge(specialty) { return listByAge(specialty) };

export function deletePatientById(id) { return deleteById(id) };

export function updatePatientById(id, data) { return updateById(id, data) };