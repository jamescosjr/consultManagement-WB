import { generateId } from '../utils/generateId.js';


export let doctors = [];

export function create(doctor) {
    const id = generateId();
    const newDoctor = { ...doctor, id };
    doctors.push(newDoctor);
    return newDoctor;
};

export function findAll() { return doctors };

export function findByName(name){ return doctors.find(doctor => doctor.name === name) };

export function listBySpecialty(specialty) { return doctors.filter(doctor => doctor.specialty === specialty) };

export function deleteById(id) {
    const index = doctors.findIndex(doctor => doctor.id === id);
    if (index !== -1) {
        return doctors.splice(index, 1)[0];
    }
    return null;
};

export function updateById(id, data) {
    const index = doctors.findIndex(doctor => doctor.id === id);
    if (index !== -1) {
        doctors[index] = { ...doctors[index], ...data };
        return doctors[index];
    }
    return null;
}