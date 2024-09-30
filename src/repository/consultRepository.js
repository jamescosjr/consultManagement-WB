import { generateId } from "../utils/generateId.js"

export let consults = [];

export function create(consult) {
    const id = generateId();
    const newConsult = { ...consult, id };
    consults.push(newConsult);
    return newConsult;
}

export function findAll() { return consults };

export function findByPatientId(patientId) { return consults.filter(consult => consult.patientId === patientId) };

export function findByDoctorId(doctorId) { return consults.filter(consult => consult.doctorId === doctorId) };

export function findByDate(date) { return consults.filter(consult => consult.date === date) };

export function findByDescription(description) { return consults.filter(consult => consult.description === description) };

export function deleteById(id) {
    const index = consults.findIndex(consult => consult.id === id);
    if (index !== -1) {
        return consults.splice(index, 1)[0];
    }
    return null;
}

export function updateById(id, data) {
    const index = consults.findIndex(consult => consult.id === id);
    if (index !== -1) {
        consults[index] = { ...consults[index], ...data };
        return consults[index];
    }
    return null;
}