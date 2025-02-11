import { Doctor } from "../../schemas/doctor.schema";

export async function createDoctor({ name, specialty }){
    try {
        const newDoctor = Doctor({
            name,
            specialty,
        });

        return await newDoctor.save();
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function updateDoctorById(id, { name, specialty }){
    try {
        return await Doctor.findByIdAndUpdate(id, { name, specialty }, { new: true })
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function deleteDoctorById(id){
    try {
        return await Doctor.findByIdAndDelete(id, {lean: true});
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}