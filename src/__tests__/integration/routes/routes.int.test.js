/* eslint-disable no-undef */
import request from 'supertest';
import { app, server } from "../../../../server.js";
import { patients } from '../../../repository/patientRepository.js';
import { consults } from '../../../repository/consultRepository.js';

afterAll(() => {
    server.close();
});

describe('Doctor Routes', () => {
    it('should create a doctor', async () => {
        const response = await request(app)
            .post('/doctors')
            .send({ name: 'Doctor', specialty: 'Specialty' });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({id:response.body.id , name: 'Doctor', specialty: 'Specialty' });
    });

    it('should list all doctors', async () => {
        const response = await request(app)
            .get('/doctors');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: response.body[0].id, name: 'Doctor', specialty: 'Specialty' }]);
    });

    it('should return a 404 when no doctor is found by specialty', async () => {
        const response = await request(app)
            .get('/doctors/Specialty');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Doctor not found.');
    });

    it('should return a 404 when no doctor is found by name', async () => {
        const response = await request(app)
            .get('/doctors/nonexistent');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Doctor not found.');
    });
});

describe('Patient Routes', () => {
    beforeEach(() => {
        jest.resetModules();
        patients.length = 0;
      });
    it('should create a patient', async () => {
        const response = await request(app)
            .post('/patients')
            .send({ name: 'Patient', age: 20 });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: response.body.id, name: 'Patient', age: 20 });
    });

    it('should list all patients', async () => {
        const response = await request(app)
            .get('/patients');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should return a 404 when no patient is found by age', async () => {
        const response = await request(app)
            .get('/patients/20');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Patient not found.');
    });

    it('should return a 404 when no patient is found by name', async () => {
        const response = await request(app)
            .get('/patients/nonexistent');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Patient not found.');
    });

    it('should delete a patient', async () => {
        const response = await request(app)
            .delete('/patients/1');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Patient not found.');
    });

    it('should update a patient', async () => {
        const response = await request(app)
            .put('/patients/1')
            .send({ name: 'Patient', age: 20 });
        expect(response.status).toBe(404);
        expect(response.text).toBe('Patient not found.');
    });

    it('should find a patient by name', async () => {
        const response = await request(app)
            .get('/patients/Patient');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Patient not found.');
    });
});

describe('Consult Routes', () => {
    beforeEach(() => {
        jest.resetModules();
        consults.length = 0;
      });
    it('should create a consult', async () => {
        const response = await request(app)
            .post('/consults')
            .send({ doctorId: 1, patientId: 1, description: 'Description' });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: response.body.id, doctorId: 1, patientId: 1, description: 'Description' });
    });

    it('should list all consults', async () => {
        const response = await request(app)
            .get('/consults');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should return a 404 when no consult is found by doctorId', async () => {
        const response = await request(app)
            .get('/consults/doctor/1');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Consults not found.');
    });

    it('should return a 404 when no consult is found by patientId', async () => {
        const response = await request(app)
            .get('/consults/patient/1');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Consults not found.');
    });

    it('should update a consult', async () => {
        const response = await request(app)
            .put('/consults/1')
            .send({ doctorId: 1, patientId: 1, description: 'Description' });
        expect(response.status).toBe(404);
        expect(response.text).toBe('Consult not found.');
    });

    it('should delete a consult', async () => {
        const response = await request(app)
            .delete('/consults/1');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Consult not found.');
    });
});