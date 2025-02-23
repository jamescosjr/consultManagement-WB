import { validatePatientData } from "../../domain/validation/patient.js";
import { ValidationError, NotFoundError } from "../../domain/error/customErros.js";
import { 
    createPatientService, 
    updatePatientService,
    deletePatientService,
    getAllPatientsService,
    getPatientByIdService,
    getPatientByNameService,
    getPatientByAgeService,
} from "../../domain/services/patient.service.js";
export async function createPatientHandler(req, res, next) {
    const { name, age } = req.body;
  
    const validation = validatePatientData(name, age);
  
    if(!validation.valid){
        return next(new ValidationError(validation.message));
    }

    try{
        const result = await createPatientService({ name, age });
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function updatePatientHandler(req, res, next) {
    const { id } = req.params;
    const { name, age } = req.body;
  
    const validation = validatePatientData(name, age);
  
    if(!validation.valid){
        return next(new ValidationError(validation.message));
    }

    try{
        const result = await updatePatientService(id, { name, age });
        if(!result){
            return next(new NotFoundError('patient not found'));
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function deletePatientHandler(req, res, next) {
    const { id } = req.params;
  
    try{
        const result = await deletePatientService(id);
        if(!result){
            return next(new NotFoundError('patient not found'));
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
  }

  export async function listPatientsHandler(req, res, next) {
    try{
        const result = await getAllPatientsService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function getPatientByIdHandler(req, res, next) {
    const { id } = req.params;
    try{
        const result = await getPatientByIdService(id);

        if(!result){
            return next(new NotFoundError('patient not found'));
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function findPatientByNameHandler(req, res, next){
    const { name } = req.params;

    try {
        const result = await getPatientByNameService(name);

        if(!result){
            return next(new NotFoundError("patient not founder"))
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }

  export async function listPatientsByAgeHandler(req, res, next){
    const { age } = req.params;

    try {
        const result = await getPatientByAgeService(age);

        if(!result){
            return next(new NotFoundError("patient not founder"))
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
  }