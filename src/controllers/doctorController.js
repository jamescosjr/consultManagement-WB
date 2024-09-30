import { 
    createDoctor, 
    listDoctors,
    findDoctorByName, 
    listDoctorsBySpecialty, 
    deleteDoctorById, 
    updateDoctorById 
} from '../service/doctorService.js';

export function createDoctorHandler(data) {
    try {
        const doctor = createDoctor(data);
        console.log('Doctor created successfully:', doctor);
    } catch (error) {
        console.error('Error registering doctor:', error.message);
    }
};

export function listDoctorsHandler() {
    const doctors = listDoctors();
    console.log('doctors:', doctors);
};

export function listDoctorsBySpecialtyHandler(specialty) {
    try {
        const doctors = listDoctorsBySpecialty(specialty);
        console.log('doctors found:', doctors);
    } catch (error) {
        console.error('Error listing doctors by specialty:', error.message);
    }
}

export function findDoctorByNameHandler(name) {
    try {
        const doctor = findDoctorByName(name);
        if (!doctor) {
            console.log('Doctor not found.');
            return;
        }
        console.log('doctor found:', doctor);
    } catch (error) {
        console.error('Error listing doctor by name:', error.message);
    }
}

export function deleteDoctorHandler(id) {
    try {
        const deletedDoctor = deleteDoctorById(id);
        if (!deletedDoctor) {
            console.log('Doctor not found, nothing to delete.');
            return;
        }
        console.log('Doctor deleted successfully:', deletedDoctor);
    } catch (error) {
        console.error('Error deleting doctor:', error.message);
    }
};

export function updateDoctorHandler(id, data) {
    try {
        const updatedDoctor = updateDoctorById(id, data);
        if (!updatedDoctor) {
            console.log('Doctor not found, nothing to update.');
            return;
        }
        console.log('Doctor updated successfully:', updatedDoctor);
    } catch (error) {
        console.error('Error updating doctor:', error.message);
    }
};