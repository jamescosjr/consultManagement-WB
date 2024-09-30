import { 
    createConsult, 
    listConsults,
    listConsultsByDate, 
    listConsultsByDescription,
    listConsultsByDoctorId, 
    listConsultsByPatientId,
    deleteConsultById, 
    updateConsultById 
} from '../service/consultService.js';

export function createConsultHandler(data) {
    try {
        const doctor = createConsult(data);
        console.log('Consult created successfully:', doctor);
    } catch (error) {
        console.error('Error registering consult:', error.message);
    }
};

export function listConsultsHandler() {
    const consults = listConsults();
    console.log('consults:', consults);
};

export function listConsultsByDoctorIdHandler(doctorId) {
    try {
        const consults = listConsultsByDoctorId(doctorId);
        console.log('Consults found:', consults);
    } catch (error) {
        console.error('Error listing consults by doctorId:', error.message);
    }
}

export function listConsultsByPatientIdHandler(patientId) {
    try {
        const consults = listConsultsByPatientId(patientId);
        console.log('Consults found:', consults);
    } catch (error) {
        console.error('Error listing consults by patientId:', error.message);
    }
}

export function listConsultsByDescriptionHandler(description) {
    try {
        const consult = listConsultsByDescription(description);
        if (!consult) {
            console.log('Consult not found.');
            return;
        }
        console.log('Consult found:', consult);
    } catch (error) {
        console.error('Error listing consult by description:', error.message);
    }
}

export function listConsultsByDateHandler(date) {
    try {
        const consult = listConsultsByDate(date);
        if (!consult) {
            console.log('Consult not found.');
            return;
        }
        console.log('Consult found:', consult);
    } catch (error) {
        console.error('Error listing consult by date:', error.message);
    }
}

export function deleteConsultHandler(id) {
    try {
        const deletedConsult = deleteConsultById(id);
        if (!deletedConsult) {
            console.log('Consult not found, nothing to delete.');
            return;
        }
        console.log('Consult deleted successfully:', deletedConsult);
    } catch (error) {
        console.error('Error deleting consult:', error.message);
    }
};

export function updateConsultHandler(id, data) {
    try {
        const updatedConsult = updateConsultById(id, data);
        if (!updatedConsult) {
            console.log('Consult not found, nothing to update.');
            return;
        }
        console.log('Consult updated successfully:', updatedConsult);
    } catch (error) {
        console.error('Error updating consult:', error.message);
    }
};