import { generateId } from '../utils/generateId.js';


export let patients = [];

export function create(patient) {
    const id = generateId();
    const newPatient = { ...patient, id };
    patients.push(newPatient);
    return newPatient;
};

export function findAll() { return patients };

export function findByName(name){ return patients.find(patient => patient.name === name) };

export function listByAge(age) { return patients.filter(patient => patient.age === age) };

export function deleteById(id) {
    const index = patients.findIndex(patient => patient.id === id);
    if (index !== -1) {
        return patients.splice(index, 1)[0];
    }
    return null;
};

export function updateById(id, data) {
    const index = patients.findIndex(patient => patient.id === id);
    if (index !== -1) {
        patients[index] = { ...patients[index], ...data };
        return patients[index];
    }
    return null;
}