import { 
    createPatient, 
    listPatients,
    findPatientByName, 
    listPatientsByAge, 
    deletePatientById, 
    updatePatientById 
} from '../service/patientService.js';

export function createPatientHandler(data) {
    try {
        const patient = createPatient(data);
        console.log('Patient created successfully:', patient);
    } catch (error) {
        console.error('Error registering patient:', error.message);
    }
};

export function listPatientsHandler() {
    const patient = listPatients();
    console.log('patients:', patient);
};

export function listPatientsByAgeHandler(age) {
    try {
        const patient = listPatientsByAge(age);
        console.log('patient found:', patient);
    } catch (error) {
        console.error('Error listing patients by age:', error.message);
    }
}

export function findPatientByNameHandler(name) {
    try {
        const patient = findPatientByName(name);
        if (!patient) {
            console.log('Patient not found.');
            return;
        }
        console.log('patient found:', patient);
    } catch (error) {
        console.error('Error listing patient by name:', error.message);
    }
}

export function deletePatientHandler(id) {
    try {
        const deletedPatient = deletePatientById(id);
        if (!deletedPatient) {
            console.log('Doctor not found, nothing to delete.');
            return;
        }
        console.log('Patient deleted successfully:', deletedPatient);
    } catch (error) {
        console.error('Error deleting patient:', error.message);
    }
};

export function updatePatientHandler(id, data) {
    try {
        const updatedPatient = updatePatientById(id, data);
        if (!updatedPatient) {
            console.log('Patient not found, nothing to update.');
            return;
        }
        console.log('Patient updated successfully:', updatedPatient);
    } catch (error) {
        console.error('Error updating patient:', error.message);
    }
};