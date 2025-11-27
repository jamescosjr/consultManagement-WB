import { Router } from 'express';
import { ensureAuthenticated, ensureRoles } from '../middleware/authMiddleware.js';
import { registerController, loginController } from '../controllers/authController.js';
import {
    createPatientHandler,
    updatePatientHandler,
    deletePatientHandler,
    listPatientsHandler,
    getPatientByIdHandler,
    findPatientByNameHandler,
    listPatientsByAgeHandler,
} from '../controllers/patientController.js';
import {
    createDoctorHandler,
    updateDoctorHandler,
    deleteDoctorHandler,
    listDoctorsHandler,
    getDoctorByIdHandler,
    findDoctorByNameHandler,
    listDoctorsBySpecialtyHandler,
} from '../controllers/doctorController.js'
import {
    createConsultController,
    updateConsultByIdController,
    deleteConsultByIdController,
    getAllConsultController,
    getConsultByDateController,
    getConsultByDoctorIdController,
    getConsultByPatientIdController,
    getConsultByIdController,
} from '../controllers/consultController.js'
import {
    listUsersHandler,
    getUserByIdHandler,
    findUserByNameHandler,
    findUserByEmailHandler,
    listUsersByRoleHandler,
    updateUserHandler,
    deleteUserHandler,
    changePasswordHandler,
} from '../controllers/userController.js'

const router = Router();

// Auth
router.post('/auth/register', registerController);
router.post('/auth/login', loginController);

router.post('/consults', ensureAuthenticated, createConsultController);
router.get('/consults/id/:id', getConsultByIdController);
router.get('/consults/doctor/:doctorId', getConsultByDoctorIdController);
router.get('/consults/patient/:patientId', getConsultByPatientIdController);
router.get('/consults', getAllConsultController);
router.get('/consults/date/:date', getConsultByDateController);
router.put('/consults/:id', ensureAuthenticated, updateConsultByIdController);
router.delete('/consults/:id', ensureAuthenticated, ensureRoles(['root','employee','doctor']), deleteConsultByIdController);

router.post('/patients', ensureAuthenticated, ensureRoles(['root','employee']), createPatientHandler);
router.get('/patients', listPatientsHandler);
router.get('/patients/name/:name', findPatientByNameHandler);
router.get('/patients/age/:age', listPatientsByAgeHandler);
router.get('/patients/id/:id', getPatientByIdHandler);
router.put('/patients/:id', ensureAuthenticated, ensureRoles(['root','employee']), updatePatientHandler);
router.delete('/patients/:id', ensureAuthenticated, ensureRoles(['root','employee']), deletePatientHandler);

router.post('/doctors', ensureAuthenticated, ensureRoles(['root','employee']), createDoctorHandler);
router.get('/doctors', listDoctorsHandler);
router.get('/doctors/name/:name', findDoctorByNameHandler);
router.get('/doctors/specialty/:specialty', listDoctorsBySpecialtyHandler);
router.get('/doctors/id/:id', getDoctorByIdHandler);
router.put('/doctors/:id', ensureAuthenticated, ensureRoles(['root','employee']), updateDoctorHandler);
router.delete('/doctors/:id', ensureAuthenticated, ensureRoles(['root','employee']), deleteDoctorHandler);

// Users
router.get('/users', ensureAuthenticated, ensureRoles(['root', 'employee']), listUsersHandler);
router.get('/users/id/:id', ensureAuthenticated, ensureRoles(['root', 'employee']), getUserByIdHandler);
router.get('/users/name/:name', ensureAuthenticated, ensureRoles(['root', 'employee']), findUserByNameHandler);
router.get('/users/email/:email', ensureAuthenticated, ensureRoles(['root', 'employee']), findUserByEmailHandler);
router.get('/users/role/:role', ensureAuthenticated, ensureRoles(['root', 'employee']), listUsersByRoleHandler);
router.put('/users/:id', ensureAuthenticated, updateUserHandler);
router.put('/users/:id/password', ensureAuthenticated, changePasswordHandler);
router.delete('/users/:id', ensureAuthenticated, ensureRoles(['root']), deleteUserHandler);

export default router;