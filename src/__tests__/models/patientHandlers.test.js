/* eslint-disable no-undef */
import {
    createPatientHandler,
    listPatientsHandler,
    deletePatientHandler,
    updatePatientHandler, 
    findPatientByNameHandler,
    listPatientsByAgeHandler
 } from '../../controllers/patientController.js';
import * as patientRepository from '../../repository/patientRepository.js';

afterEach(() => {
    jest.clearAllMocks();
});

describe('Patient Handlers', () => {
   it ('should return a 201 and the new patient when creating a patient', () => {
       const req = { body: { name: 'Patient', age: 20 } };
       const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
       jest.spyOn(patientRepository, 'create').mockReturnValue(req.body);
       createPatientHandler(req, res);
       expect(res.status).toHaveBeenCalledWith(201);
       expect(res.json).toHaveBeenCalledWith(req.body);
   });

    it ('should return a 200 and the list of patients when listing all patients', () => {
         const req = {};
         const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
         jest.spyOn(patientRepository, 'findAll').mockReturnValue([]);
         listPatientsHandler(req, res);
         expect(res.status).toHaveBeenCalledWith(200);
         expect(res.json).toHaveBeenCalledWith([]);
    });

    it ('should return a 404 when no patient is found by age', () => {
        const req = { params: { age: 20 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(patientRepository, 'listByAge').mockReturnValue([]);
        listPatientsByAgeHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Patients not found.');
    });

    it ('should return a 404 when no patient is found by name', async () => {
        const req = { query: { name: 'nonexisten Patient' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(patientRepository, 'findByName').mockReturnValue([]);
        await findPatientByNameHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Patient not found.');
    });

    it ('should return a 500 when an error occurs while creating a patient', () => {
        const req = { body: { name: 'Patient', age: 20 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(patientRepository, 'create').mockImplementation(() => { throw new Error('Error') });
        createPatientHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it ('should return a 500 when an error occurs while listing all patients', () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(patientRepository, 'findAll').mockImplementation(() => { throw new Error('Error') });
        listPatientsHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it ('should return a 200 and the deleted patient when deleting a patient', () => {
        const req = { params: { id: '1' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.spyOn(patientRepository, 'deleteById').mockReturnValue(req.params.id);
        deletePatientHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(req.params.id);
    });

    it ('should return a 500 when an error occurs while deleting a patient', () => {
        const req = { params: { id: '1' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(patientRepository, 'deleteById').mockImplementation(() => { throw new Error('Error') });
        deletePatientHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it ('should return a 200 and the updated patient when updating a patient', () => {
        const req = { body: { name: 'Patient', age: 20 }, params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.spyOn(patientRepository, 'updateById').mockReturnValue(req.body);
        updatePatientHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it ('should return a 404 when no patient is found by id', () => {
        const req = { body: { name: 'Patient', age: 20 }, params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(patientRepository, 'updateById').mockReturnValue(null);
        updatePatientHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Patient not found.');
    });

    it ('should return a 500 when an error occurs while updating a patient', () => {
        const req = { body: { name: 'Patient', age: 20 }, params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(patientRepository, 'updateById').mockImplementation(() => { throw new Error('Error') });
        updatePatientHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

});