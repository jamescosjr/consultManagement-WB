/* eslint-disable no-undef */
import { json } from 'express';
import {
    createDoctorHandler,
    listDoctorsHandler,
    deleteDoctorHandler,
    updateDoctorHandler, 
    findDoctorByNameHandler,
    listDoctorsBySpecialtyHandler
 } from '../../controllers/doctorController.js';
import * as doctorRepository from '../../repository/doctorRepository.js';

afterEach(() => {
    jest.clearAllMocks();
});

describe('Doctor Handlers', () => {
    it ('should return a 201 and the new doctor when creating a doctor', () => {
        const req = { body: { name: 'Doctor', specialty: 'Specialty' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.spyOn(doctorRepository, 'create').mockReturnValue(req.body);
        createDoctorHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it ('should return a 200 and the list of doctors when listing all doctors', () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.spyOn(doctorRepository, 'findAll').mockReturnValue([]);
        listDoctorsHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([]);
    });

    it ('should return a 404 when no doctor is found by name', async () => {
        const req = { query: { name: 'Doctor' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(doctorRepository, 'findByName').mockReturnValue([]);
        await findDoctorByNameHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Doctor not found.');
    });

    it ('should return a 500 when an error occurs while creating a doctor', () => {
        const req = { body: { name: 'Doctor', specialty: 'Specialty' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(doctorRepository, 'create').mockImplementation(() => { throw new Error('Error') });
        createDoctorHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it ('should return a 500 when an error occurs while listing all doctors', () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(doctorRepository, 'findAll').mockImplementation(() => { throw new Error('Error') });
        listDoctorsHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it ('should return a 500 when an error occurs while listing doctors by specialty', () => {
        const req = { params: { specialty: 'Specialty' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(doctorRepository, 'listBySpecialty').mockImplementation(() => { throw new Error('Error') });
        listDoctorsBySpecialtyHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it ('should return a 500 when an error occurs while finding a doctor by name', async () => {
        const req = { query: { name: 'Doctor' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        jest.spyOn(doctorRepository, 'findByName').mockImplementation(() => { throw new Error('Error') });
        await findDoctorByNameHandler(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it('should create a doctor and then return a 200 and the doctor when updating a doctor', async () => {
        const req = { body: { name: 'Doctor', specialty: 'Specialty' }, params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    
        const updatedDoctor = { id: 1, name: 'Doctor', specialty: 'Specialty' };
    
        jest.spyOn(doctorRepository, 'updateById').mockResolvedValue(updatedDoctor);
    
        await updateDoctorHandler(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedDoctor);
    });

    it('should return a 404 when no doctor is found by id', async () => {
        const req = { body: { name: 'Doctor', specialty: 'Specialty' }, params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    
        jest.spyOn(doctorRepository, 'updateById').mockResolvedValue(null);
    
        await updateDoctorHandler(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Doctor not found.');
    });

    it('should return a 500 when an error occurs while updating a doctor', async () => {
        const req = { body: { name: 'Doctor', specialty: 'Specialty' }, params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    
        jest.spyOn(doctorRepository, 'updateById').mockRejectedValue(new Error('Error'));
    
        await updateDoctorHandler(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });

    it('should return a 200 and the deleted doctor when deleting a doctor', () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    
        const deletedDoctor = { id: 1, name: 'Doctor', specialty: 'Specialty' };
    
        jest.spyOn(doctorRepository, 'deleteById').mockReturnValue(deletedDoctor);
    
        deleteDoctorHandler(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(deletedDoctor);
    });

    it('should return a 404 when no doctor is found by id', () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    
        jest.spyOn(doctorRepository, 'deleteById').mockReturnValue(null);
    
        deleteDoctorHandler(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Doctor not found.');
    });

    it('should return a 500 when an error occurs while deleting a doctor', () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    
        jest.spyOn(doctorRepository, 'deleteById').mockImplementation(() => { throw new Error('Error') });
    
        deleteDoctorHandler(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error');
    });
    
});
