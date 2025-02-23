import { Consult } from "../../schemas/consult.schema.js"
import { AppError } from "../../../domain/error/customErros.js"

export async function getAllConsult(page = 1, limit = 10) {
    try{
        const skip = (page - 1) * limit;
        const consults = await Consult.find().skip(skip).limit(limit);
        return consults;
    } catch(error){
        throw new AppError(error.message, 500);
    }
}

export async function getConsultById(id){
    try {
        const consult = await Consult.findById(id);
        return consult;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getConsultByPatientId(patientId) {
    try{
        const consult = await Consult.find({ patientId });
        return consult;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getConsultByDoctorId(doctorId) {
    try{
        const consult = await Consult.find({ doctorId });
        return consult;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

export async function getConsultByDate(date) {
    try{
        const consult = await Consult.find({ date });
        return consult;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}

