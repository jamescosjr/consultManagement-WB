import {
    createConsultService,
    updateConsultByIdService,
    deleteConsultByIdService,
    getAllConsultService,
    getConsultByDateService,
    getConsultByDoctorIdService,
    getConsultByIdService,
    getConsultByPatientIdService,
} from '../../domain/services/consult.service.js';
import { ValidationError, NotFoundError } from '../../domain/error/customErros.js';
import { validateConsultData } from '../../domain/validation/consult.js';

export async function createConsultController(req, res, next) {
    const { date, doctorId, patientId, description, shift } = req.body;

    const validation = validateConsultData(date, doctorId, patientId, description, shift);

        if(!validation.valid){
            return next(new ValidationError(validation.message));
        }    
        
    try {
        const consult = await createConsultService(req.body);
        res.status(201).json(consult);
    } catch (error) {
        next(error);
    }
}

export async function updateConsultByIdController(req, res, next) {
    const { id } = req.params;
    const { date, doctorId, patientId, description } = req.body;

    const validation = validateConsultData(date, doctorId, patientId, description);
      
        if(!validation.valid){
            return next(new ValidationError(validation.message));
        }    
    try {
        const consult = await updateConsultByIdService(id, req.body);
        if(!consult){
            return next(new NotFoundError('Consult not found'));
        }
        res.status(200).json(consult);
    } catch (error) {
        next(error);
    }
}

export async function deleteConsultByIdController(req, res, next) {
    const { id } = req.params; 
    try {
       const result = await deleteConsultByIdService(id);

       if(!result) {
            return next(new NotFoundError('Consult not found'));
       }

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

export async function getAllConsultController(req, res, next) {
    try {
        const consults = await getAllConsultService();
        res.status(200).json(consults);
    } catch (error) {
        next(error);
    }
}

export async function getConsultByDateController(req, res, next) {
    const { date } = req.params;
    try {
        const consults = await getConsultByDateService(date);
        res.status(200).json(consults);
    } catch (error) {
        next(error);
    }
}

export async function getConsultByDoctorIdController(req, res, next) {
    const { doctorId } = req.params;
    try {
        const consults = await getConsultByDoctorIdService(doctorId);
        res.status(200).json(consults);
    } catch (error) {
        next(error);
    }
}

export async function getConsultByIdController(req, res, next) {
    const { id } = req.params;
    try {
        const consult = await getConsultByIdService(id);

        if(!consult){
            return next(new NotFoundError('Consult not found'));
        }
        res.status(200).json(consult);
    } catch (error) {
        next(error);
    }
}

export async function getConsultByPatientIdController(req, res, next) {
    const { patientId } = req.params;
    try {
        const consults = await getConsultByPatientIdService(patientId);
        res.status(200).json(consults);
    } catch (error) {
        next(error);
    }
}
