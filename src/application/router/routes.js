import { Router } from 'express';
import {
    createPatientHandler,
    updatePatientHandler,
    deletePatientHandler,
    listPatientsHandler,
    getPatientByIdHandler,
    findPatientByNameHandler,
    listPatientsByAgeHandler,
} from '../controllers/patientController';
import {
    createDoctorHandler,
    updateDoctorHandler,
    deleteDoctorHandler,
    listDoctorsHandler,
    getDoctorByIdHandler,
    findDoctorByNameHandler,
    listDoctorsBySpecialtyHandler,
} from '../controllers/doctorController'
import {
    createConsultController,
    updateConsultByIdController,
    deleteConsultByIdController,
    getAllConsultController,
    getConsultByDateController,
    getConsultByDoctorIdController,
    getConsultByPatientIdController,
    getConsultByIdController,
} from '../controllers/consultController'

const router = Router();

router.post('/consults', createConsultController);
router.get('/consults/id/:id', getConsultByIdController);
router.get('/consults/doctor/:doctorId', getConsultByDoctorIdController);
router.get('/consults/patient/:patientId', getConsultByPatientIdController);
router.get('/consults', getAllConsultController);
router.get('/consults/date/:date', getConsultByDateController);
router.put('/consults/:id', updateConsultByIdController);
router.delete('/consults/:id', deleteConsultByIdController);

router.post('/patients', createPatientHandler);
router.get('/patients', listPatientsHandler);
router.get('/patients/name/:name', findPatientByNameHandler);
router.get('/patients/age/:age', listPatientsByAgeHandler);
router.get('/patients/id/:id', getPatientByIdHandler);
router.put('/patients/:id', updatePatientHandler);
router.delete('/patients/:id', deletePatientHandler);

router.post('/doctors', createDoctorHandler);
router.get('/doctors', listDoctorsHandler);
router.get('/doctors/name/:name', findDoctorByNameHandler);
router.get('/doctors/specialty/:specialty', listDoctorsBySpecialtyHandler);
router.get('/doctors/id/:id', getDoctorByIdHandler);
router.put('/doctors/:id', updateDoctorHandler);
router.delete('/doctors/:id', deleteDoctorHandler);

export default router;