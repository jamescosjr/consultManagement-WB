import promptSync from 'prompt-sync';
import { 
    createDoctorHandler,
    listDoctorsHandler,
    findDoctorByNameHandler,
    listDoctorsBySpecialtyHandler,
    deleteDoctorHandler,
    updateDoctorHandler 
} from '../controllers/doctorController.js';


const prompt = promptSync({ sigint: true });

export function createDoctor() {
    const name = prompt('Enter the doctor name: ');
    const specialty = prompt('Enter the doctor specialty: ');

    createDoctorHandler({ name, specialty });
};

export function listDoctors() {
    listDoctorsHandler();
};

export function findDoctorByName() {
    const name = prompt('Enter the doctor name to search: ');
    findDoctorByNameHandler(name);
};

export function listDoctorsBySpecialty() {
    const specialty = prompt('Enter the specialty to search: ');
    listDoctorsBySpecialtyHandler(specialty);
}

export function deleteDoctor() {
    const id = prompt('Enter the doctor ID to delete: ');
    deleteDoctorHandler(id);
};

export function updateDoctor() {
    const id = prompt('Enter the doctor ID to update: ');
    const name = prompt('Enter the doctor name: ');
    const specialty = prompt('Enter the doctor specialty: ');

    const updatedDoctor = {};

    if (name) updatedDoctor.name = name;
    if (specialty) updatedDoctor.specialty = specialty;

    updateDoctorHandler(id, updatedDoctor);
}