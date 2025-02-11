import { validateDoctorData } from "../../domain/validation/doctor.js";
import { ValidationError, NotFoundError } from "../../domain/error/customErros";
import { 
    createDoctorService, 
    updateDoctorService,
    deleteDoctorService,
    getAllDoctorsService,
    getDoctorByIdService,
    getDoctorByNameService,
    getDoctorBySpecialtyService,
} from "../../domain/services/doctor.service.js";

export async function createDoctorHandler(req, res, next) {
    const { name, specialty } = req.body;
  
    const validation = validateDoctorData(name, specialty);
  
    if(!validation.valid){
        return next(new ValidationError(validation.message));
    }
    try{
        const result = await createDoctorService({ name, specialty });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function updateDoctorHandler(req, res, next) {
    const { id } = req.params;
    const { name, specialty } = req.body;
  
    const validation = validateDoctorData(name, specialty);
  
    if(!validation.valid){
        return next(new ValidationError(validation.message));
    }

    try{
        const result = await updateDoctorService(id, { name, specialty });
        if(!result){
            return next(new NotFoundError('Doctor not found'));
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function deleteDoctorHandler(req, res, next) {
    const { id } = req.params;
  
    try{
        const result = await deleteDoctorService(id);
        if(!result){
            return next(new NotFoundError('Doctor not found'));
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
  }

  export async function listDoctorsHandler(req, res, next) {
    try{
        const result = await getAllDoctorsService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function getDoctorByIdHandler(req, res, next) {
    const { id } = req.params;
    try{
        const result = await getDoctorByIdService(id);

        if(!result){
            return next(new NotFoundError('Doctor not found'));
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function findDoctorByNameHandler(req, res, next){
    const { name } = req.params;

    try {
        const result = await getDoctorByNameService(name);

        if(!result){
            return next(new NotFoundError("Doctor not founder"))
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function listDoctorsBySpecialtyHandler(req, res, next){
    const { specialty } = req.params;
    try {
        const result = await getDoctorBySpecialtyService(specialty);

        if(!result){
            return next(new NotFoundError("Doctor not founder"))
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }