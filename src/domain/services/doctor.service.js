import { 
    getAllDoctors,
    getDoctorById, 
    getDoctorByName,
    getDoctorBySpecialty,
} from "../../infrastructure/repositories/doctor-repositories/doctor.repository.read.js";
import { 
    createDoctor,
    deleteDoctorById,
    updateDoctorById,
} from "../../infrastructure/repositories/doctor-repositories/doctor.repository.write.js";

export async function createDoctorService({ name, specialty }){
    try {
        return await createDoctor({ name, specialty });
    } catch (error) {
        throw new AppError(error.message || 'Error creating the Doctor', 500);
    }
}

export async function updateDoctorService(id, { name, specialty }){
    try {
        return await updateDoctorById(id, { name, specialty });
    } catch (error) {
        throw new AppError(error.messsage || 'Error updating the Doctor', 500);   
    }
}

export async function deleteDoctorService(id){
    try {
        return await deleteDoctorById(id);
    } catch (error) {
        throw new AppError(error.message || 'Error deleting the Doctor', 500);   

    }
}

export async function getAllDoctorsService() {
    try {
        return await getAllDoctors();
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctors', 500);
    }
}

export async function getDoctorByIdService(id){
    try {
        return await getDoctorById(id);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctor', 500);

    }
}

export async function getDoctorByNameService(name){
    try {
        return await getDoctorByName(name);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctor', 500);
    }
}

export async function getDoctorBySpecialtyService(specialty){
    try {
        return await getDoctorBySpecialty(specialty);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctor', 500);
    }
}