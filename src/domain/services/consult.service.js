import {
    createConsult,
    updateConsultById,
    deleteConsultById,
} from "../../infrastructure/repositories/consult-repositories/consult.repository.write.js"
import {
    getAllConsult,
    getConsultByDate,
    getConsultByDoctorId,
    getConsultById,
    getConsultByPatientId,
} from "../../infrastructure/repositories/consult-repositories/consult.repository.read.js"
import { NotFoundError } from "../error/customErros.js";
import { Patient } from "../../infrastructure/schemas/patient.schema.js";
import { Doctor } from "../../infrastructure/schemas/doctor.schema.js";
import { updateDoctorById } from "../../infrastructure/repositories/doctor-repositories/doctor.repository.write.js"; 
import { updatePatientById } from "../../infrastructure/repositories/patient-repositories/patient.repository.write.js";

export async function createConsultService({date, doctorId, patientId, description, shift}) {
    const patientExists = await Patient.findById(patientId).lean();
        if (!patientExists) {
            throw new NotFoundError("Patient not found");
        }

        const doctorExists = await Doctor.findById(doctorId).lean();
        if (!doctorExists) {
            throw new NotFoundError("Doctor not found");
        }

    try {
        const consult = await createConsult({date, doctorId, patientId, description, shift});
        
        const updateOperation = {
            $push: { consultIds: consult._id }
        };

        await Promise.all([
            updateDoctorById(doctorId, updateOperation),
            updatePatientById(patientId, updateOperation)
        ]);

        return consult;
    } catch (error) {
        throw new AppError(error.message || 'Error creating the Doctor', 500);
    }
}

export async function updateConsultByIdService(id, {date, doctorId, patientId, description, shift}) {

    const currentConsult = await getConsultById(id);

    if(!currentConsult) {
        throw new NotFoundError("Consult not found")
    }

    const patientExists = await Patient.findById(patientId).lean();

    if (!patientExists) {
        throw new NotFoundError("Patient not found");
    }

    const doctorExists = await Doctor.findById(doctorId).lean();

    if (!doctorExists) {
        throw new NotFoundError("Doctor not found");
    }
    try {
        const pushOperation = {
            $push: { consultIds: id }
        };

        const removeOperations = {
            $remove: { consultIds: id }
        }

        const consultUpdated = await updateConsultById(id, {date, doctorId, patientId, description, shift});

        if(currentConsult.doctorId !== doctorId ) {
            await updateDoctorById(doctorId, pushOperation);
            await updateDoctorById(currentConsult.doctorId, removeOperations);
        };

        if(currentConsult.patientId !== patientId ) {
            await updatePatientById(patientId, pushOperation);
            await updatePatientById(currentConsult.patientId, removeOperations);
        };
        
        return consultUpdated;
    } catch (error) {
        throw new AppError(error.message || 'Error updating the Doctor', 500);
    }
}

export async function deleteConsultByIdService(id) {
    try {
        const consult = await getConsultById(id);

        if(!consult) {
            throw new NotFoundError("Consult not found")
        }

        const removeOperations = {
            $remove: { consultIds: id }
        }

        const consultDeleted = await deleteConsultById(id);

        await updateDoctorById(consult._id, removeOperations);
        await updatePatientById(consult._id, removeOperations);

        return consultDeleted;
    } catch (error) {
        throw new AppError(error.message || 'Error deleting the Doctor', 500);
    }
}

export async function getAllConsultService() {
    try {
        return await getAllConsult();
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctors', 500);
    }
}

export async function getConsultByDateService(date) {
    try {
        return await getConsultByDate(date);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctor', 500);
    }
}

export async function getConsultByDoctorIdService(doctorId) {
    try {
        return await getConsultByDoctorId(doctorId);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctor', 500);
    }
}

export async function getConsultByIdService(id) {
    try {
        return await getConsultById(id);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctor', 500);
    }
}

export async function getConsultByPatientIdService(patientId) {
    try {
        return await getConsultByPatientId(patientId);
    } catch (error) {
        throw new AppError(error.message || 'Error getting the Doctor', 500);
    }
}
