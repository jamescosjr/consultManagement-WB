import promptSync from 'prompt-sync';
import { 
    createPatientHandler,
    listPatientsHandler,
    findPatientByNameHandler,
    listPatientsByAgeHandler,
    deletePatientHandler,
    updatePatientHandler 
} from '../controllers/patientController.js';


const prompt = promptSync({ sigint: true });

export function createPatient() {
    const name = prompt('Enter the patient name: ');
    const age = parseInt(prompt('Enter the patient age: '), 10);

    createPatientHandler({ name, age });
};

export function listPatients() {
    listPatientsHandler();
};

export function findPatientByName() {
    const name = prompt('Enter the patient name to search: ');
    findPatientByNameHandler(name);
};

export function listPatientsByAge() {
    const age = prompt('Enter the age to search: ');
    listPatientsByAgeHandler(age);
}

export function deletePatient() {
    const id = prompt('Enter the patient ID to delete: ');
    deletePatientHandler(id);
};

export function updatePatient() {
    const id = prompt('Enter the patient ID to update: ');
    const name = prompt('Enter the patient name: ');
    const age = prompt('Enter the patient age: ');

    const updatedPatient = {};

    if (name) updatedPatient.name = name;
    if (age) updatedPatient.age = age;

    updatePatientHandler(id, updatedPatient);
}