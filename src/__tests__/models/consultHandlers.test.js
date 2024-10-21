/* eslint-disable no-undef */
import {
    createConsultHandler,
    listConsultsHandler,
    listConsultsByDescriptionHandler,
    listConsultsByDateHandler,
    listConsultsByDoctorIdHandler,
    listConsultsByPatientIdHandler,
    deleteConsultHandler,
    updateConsultHandler,
} from '../../controllers/consultController.js';
import * as consultRepository from '../../repository/consultRepository.js';

afterEach(() => {
    jest.clearAllMocks();
});

describe('Consult Handlers', () => {
    it ('should returna a 201 and the new consult when creating a consult', () => {
        const mockConsult = { description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 };
        jest.spyOn(consultRepository, 'create').mockReturnValue(mockConsult);

        const req = { body: mockConsult };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        createConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockConsult);
    });

    it('should return a 400 when the consult is not created', () => {
        jest.spyOn(consultRepository, 'create').mockReturnValue(null);

        const req = { body: { description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        createConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Consult not created.');
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'create').mockImplementation(() => {
            throw new Error('Creation Error');
        });

        const req = { body: { description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        createConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Creation Error');
    });

    it('should return a 200 and the list of consults', () => {
        const mockConsults = [{ description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 }];
        jest.spyOn(consultRepository, 'findAll').mockReturnValue(mockConsults);

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        listConsultsHandler({}, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockConsults);
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'findAll').mockImplementation(() => {
            throw new Error('List Error');
        });

        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsHandler({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('List Error');
    });

    it('should return a 404 when no consults are found by description', () => {
        jest.spyOn(consultRepository, 'findByDescription').mockReturnValue([]);

        const req = { query: { description: 'Test description' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByDescriptionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Consults not found.');
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'findByDescription').mockImplementation(() => {
            throw new Error('List Error');
        });

        const req = { query: { description: 'Test description' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByDescriptionHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('List Error');
    });

    it('should return a 404 when no consults are found by date', () => {
        jest.spyOn(consultRepository, 'findByDate').mockReturnValue([]);

        const req = { query: { date: '2021-09-01' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByDateHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Consults not found.');
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'findByDate').mockImplementation(() => {
            throw new Error('List Error');
        });

        const req = { query: { date: '2021-09-01' } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByDateHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('List Error');
    });

    it('should return a 404 when no consults are found by doctorId', () => {
        jest.spyOn(consultRepository, 'findByDoctorId').mockReturnValue([]);

        const req = { params: { doctorId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByDoctorIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Consults not found.');
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'findByDoctorId').mockImplementation(() => {
            throw new Error('List Error');
        });

        const req = { params: { doctorId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByDoctorIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('List Error');
    });

    it('should return a 404 when no consults are found by patientId', () => {
        jest.spyOn(consultRepository, 'findByPatientId').mockReturnValue([]);

        const req = { params: { patientId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByPatientIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Consults not found.');
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'findByPatientId').mockImplementation(() => {
            throw new Error('List Error');
        });

        const req = { params: { patientId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        listConsultsByPatientIdHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('List Error');
    });

    it('should return a 204 and the deleted consult', () => {
        const mockConsult = { description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 };
        jest.spyOn(consultRepository, 'deleteById').mockReturnValue(mockConsult);

        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        deleteConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return a 404 when no consult is found', () => {
        jest.spyOn(consultRepository, 'deleteById').mockReturnValue(null);

        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        deleteConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Consult not found.');
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'deleteById').mockImplementation(() => {
            throw new Error('Delete Error');
        });

        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        deleteConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return a 200 and the updated consult', () => {
        const mockConsult = { description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 };
        jest.spyOn(consultRepository, 'updateById').mockReturnValue(mockConsult);

        const req = { params: { id: 1 }, body: mockConsult };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        updateConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockConsult);
    });

    it('should return a 404 when no consult is found', () => {
        jest.spyOn(consultRepository, 'updateById').mockReturnValue(null);

        const req = { params: { id: 1 }, body: { description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        updateConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Consult not found.');
    });

    it('should return a 500 when an error occurs', () => {
        jest.spyOn(consultRepository, 'updateById').mockImplementation(() => {
            throw new Error('Update Error');
        });

        const req = { params: { id: 1 }, body: { description: 'Test description', date: '2021-09-01', doctorId: 1, patientId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        updateConsultHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Update Error');
    });
});