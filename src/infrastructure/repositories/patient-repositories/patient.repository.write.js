import { Patient } from "../../schemas/patient.schema.js";

export async function createPatient({ name, age }){
    try {
        const newPatient = Patient({
            name,
            age,
        });

        return await newPatient.save();
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function updatePatientById(id, { name, age }){
    try {
        return await Patient.findByIdAndUpdate(id, { name, age }, { new: true })
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function deletePatientById(id){
    try {
        return await Patient.findByIdAndDelete(id, {lean: true});
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}