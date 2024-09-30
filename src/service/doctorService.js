import { createDoctorModel } from '../models/doctor.js';
import { create, findAll, findByName, listBySpecialty, deleteById, updateById } from '../repository/doctorRepository.js';

export function createDoctor(data) {
    const doctor = createDoctorModel(data);
    return create(doctor);
};

export function listDoctors() { return findAll() };

export function findDoctorByName(name) { return findByName(name) };

export function listDoctorsBySpecialty(specialty) { return listBySpecialty(specialty) };

export function deleteDoctorById(id) { return deleteById(id) };

export function updateDoctorById(id, data) { return updateById(id, data) };