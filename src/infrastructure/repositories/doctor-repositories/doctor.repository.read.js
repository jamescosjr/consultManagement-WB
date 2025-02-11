import { Doctor } from "../../schemas/doctor.schema";
import { AppError } from "../../../domain/error/customErros";

export async function getAllDoctors(page = 1, limit = 10) {
    try{
        const skip = (page - 1) * limit;
        const doctors = await Doctor.find().skip(skip).limit(limit);
        return doctors;
    } catch(error){
        throw new AppError(error.message, 500);
    }
}

export async function getDoctorById(id){
    try {
        const doctor = await Doctor.findById(id);
        return doctor;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getDoctorByName(name) {
    try{
        const doctor = await Doctor.find({ name });
        return doctor;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getDoctorBySpecialty(specialty) {
    try{
        const doctor = await Doctor.find({ specialty });
        return doctor;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}