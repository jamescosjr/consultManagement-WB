import { Consult } from '../../schemas/consult.schema.js';

export async function createConsult({ date, doctorId, patientId, description, shift }, session = null) {
    try {
        const newConsult = new Consult({
            date,
            doctorId,
            patientId,
            description,
            shift
        });
    
        return newConsult.save({ session }); 
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function updateConsultById(id, { date, doctorId, patientId, description }) {
    try {
        return Consult.findByIdAndUpdate(id, { date, doctorId, patientId, description }, { new: true });
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}

export async function deleteConsultById(id) {
    try {
        return Consult.findByIdAndDelete(id, { lean: true });
    } catch (error) {
        throw new AppError(error.message || 'Database error', 500);
    }
}