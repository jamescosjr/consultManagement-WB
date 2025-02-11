import { 
    getAllPatients,
    getPatientById, 
    getPatientByName,
    getPatientByAge,
} from "../../infrastructure/repositories/patient-repositories/patient.repository.read.js";
import { 
    createPatient,
    deletePatientById,
    updatePatientById,
} from "../../infrastructure/repositories/patient-repositories/patient.repository.write.js";

export async function createPatientService({ name, age }){
    try {
        return await createPatient({ name, age });
    } catch (error) {
        throw new AppError(error.message || 'Error creating the Patient', 500);
    }
}

export async function updatePatientService(id, { name, age }){
    try {
        return await updatePatientById(id, { name, age });
    } catch (error) {
        throw new AppError(error.message || 'Error updating the Patient', 500);   
    }
}

export async function deletePatientService(id){
    try {
        return await deletePatientById(id);
    } catch (error) {
        throw new AppError(error.message || 'Error deleting the Patient', 500);   

    }
}

export async function getAllPatientsService() {
    try {
        return await getAllPatients();
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Patients', 500);
    }
}

export async function getPatientByIdService(id){
    try {
        return await getPatientById(id);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Patient', 500);

    }
}

export async function getPatientByNameService(name){
    try {
        return await getPatientByName(name);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Patient', 500);
    }
}

export async function getPatientByAgeService(age){
    try {
        return await getPatientByAge(age);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Patient', 500);
    }
}