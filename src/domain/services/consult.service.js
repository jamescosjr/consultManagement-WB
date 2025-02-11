import {
    createConsult,
    updateConsultById,
    deleteConsultById,
} from "../../infrastructure/repositories/consult-repositories/consult.repository.write"
import {
    getAllConsult,
    getConsultByDate,
    getConsultByDoctorId,
    getConsultById,
    getConsultByPatientId,
} from "../../infrastructure/repositories/consult-repositories/consult.repository.read"
import { NotFoundError } from "../error/customErros";
import { Patient } from "../../infrastructure/schemas/patient.schema";
import { Doctor } from "../../infrastructure/schemas/doctor.schema";

export async function createConsultService({date, doctorId, patientId, description}) {
    const patientExists = await Patient.findById(patientId).lean();
        if (!patientExists) {
            throw new NotFoundError("Patient not found");
        }

        const doctorExists = await Doctor.findById(doctorId).lean();
        if (!doctorExists) {
            throw new NotFoundError("Doctor not found");
        }
    try {
        return await createConsult({date, doctorId, patientId, description});
    } catch (error) {
        throw new AppError(error.message || 'Error creating the Doctor', 500);
    }
}

export async function updateConsultByIdService(id, {date, doctorId, patientId, description}) {
    const patientExists = await Patient.findById(patientId).lean();
    if (!patientExists) {
        throw new NotFoundError("Patient not found");
    }

    const doctorExists = await Doctor.findById(doctorId).lean();
    if (!doctorExists) {
        throw new NotFoundError("Doctor not found");
    }
    try {
        return await updateConsultById(id, {date, doctorId, patientId, description});
    } catch (error) {
        throw new AppError(error.message || 'Error updating the Doctor', 500);
    }
}

export async function deleteConsultByIdService(id) {
    try {
        return await deleteConsultById(id);
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
