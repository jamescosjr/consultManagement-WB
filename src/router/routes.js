import { Router } from 'express';
import {
    createConsultHandler,
    listConsultsHandler,
    listConsultsByDoctorIdHandler,
    listConsultsByPatientIdHandler,
    listConsultsByDescriptionHandler,
    updateConsultHandler,
    deleteConsultHandler
} from '../controllers/consultController.js';
import {
    createPatientHandler,
    listPatientsHandler,
    findPatientByNameHandler,
    listPatientsByAgeHandler,
    updatePatientHandler,
    deletePatientHandler
} from '../controllers/patientController.js';
import {
    createDoctorHandler,
    listDoctorsHandler,
    findDoctorByNameHandler,
    listDoctorsBySpecialtyHandler,
    updateDoctorHandler,
    deleteDoctorHandler
} from '../controllers/doctorController.js';

const router = Router();

router.post('/consults', createConsultHandler);
router.get('/consults', listConsultsHandler);
router.get('/consults/doctor/:doctorId', listConsultsByDoctorIdHandler);
router.get('/consults/patient/:patientId', listConsultsByPatientIdHandler);
router.get('/consults', listConsultsByDescriptionHandler);
router.put('/consults/:id', updateConsultHandler);
router.delete('/consults/:id', deleteConsultHandler);

router.post('/patients', createPatientHandler);
router.get('/patients', listPatientsHandler);
router.get('/patients/:name', findPatientByNameHandler);
router.get('/patients/:age', listPatientsByAgeHandler);
router.put('/patients/:id', updatePatientHandler);
router.delete('/patients/:id', deletePatientHandler);

router.post('/doctors', createDoctorHandler);
router.get('/doctors', listDoctorsHandler);
router.get('/doctors/:name', findDoctorByNameHandler);
router.get('/doctors/:specialty', listDoctorsBySpecialtyHandler);
router.put('/doctors/:id', updateDoctorHandler);
router.delete('/doctors/:id', deleteDoctorHandler);

export default router;