import { Patient } from "../../schemas/patient.schema";
import { AppError } from "../../../domain/error/customErros";

export async function getAllPatients(page = 1, limit = 10) {
    try{
        const skip = (page - 1) * limit;
        const patients = await Patient.find().skip(skip).limit(limit);
        return patients;
    } catch(error){
        throw new AppError(error.message, 500);
    }
}

export async function getPatientById(id){
    try {
        const patient = await Patient.findById(id);
        return patient;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getPatientByName(name) {
    try{
        const patient = await Patient.find({ name });
        return patient;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getPatientByAge(age) {
    try{
        const patient = await Patient.find({ age });
        return patient;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}