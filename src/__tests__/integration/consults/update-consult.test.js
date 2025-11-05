import supertest from "supertest";
import { app } from "../../../../server";
const dbHandler = require('../../../../jest/jest.setup');
import { Doctor } from "../../../infrastructure/schemas/doctor.schema";
import { Patient } from "../../../infrastructure/schemas/patient.schema";
import { Consult } from "../../../infrastructure/schemas/consult.schema";

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe("PUT/ consults/:id", () => {
    describe("success cases", () => {
        it ("should update an existent consult", async () => {
            const doctor = new Doctor({ 
                name: "Doctor", 
                specialty: "specialty 1" 
            });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({ 
                name: "Patient", 
                age: 20 
            })
            const dataBasePatient = await patient.save();

            const consult = new Consult ({
                 doctorId: dataBaseDoctor._id, 
                 patientId: dataBasePatient._id, 
                 date: new Date(), 
                 description: "description 1",
                 shift: 'MORNING'
            });

            const dataBaseConsult = await consult.save();

            const updatedConsult = { 
                doctorId: doctor.id, 
                patientId: patient.id, 
                date: new Date(), 
                description: "description 2",
                shift: 'MORNING'
            }

            const response = await supertest(app).put(`/consults/${dataBaseConsult._id}`).send(updatedConsult);
            expect(response.status).toBe(200);
        });
    });

    describe("non success cases", () => {
        it ("should return 404 when consult does not exist", async () => {
            const doctor = new Doctor({ 
                name: "Doctor", 
                specialty: "specialty 1" 
            });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({ 
                name: "Patient", 
                age: 20 
            })
            const dataBasePatient = await patient.save();

            const updatedConsult = { 
                doctorId: dataBaseDoctor._id, 
                patientId: dataBasePatient._id, 
                date: new Date(), 
                description: "description 2",
                shift: 'MORNING'
            }

            const response = await supertest(app).put(`/consults/67aa3327ac2f8b10df67f360`).send(updatedConsult);
            expect(response.status).toBe(404);
        });

        it ("should return 404 when doctor does not exist", async () => {
            const doctor = new Doctor({
                name: "Doctor",
                specialty: "specialty 1"
            });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({ 
                name: "Patient", 
                age: 20 
            })
            const dataBasePatient = await patient.save();

            const consult = new Consult ({
                 doctorId: dataBaseDoctor._id, 
                 patientId: dataBasePatient._id, 
                 date: new Date(), 
                 description: "description 1",
                 shift: 'MORNING'
            });

            const dataBaseConsult = await consult.save();

            const updatedConsult = { 
                doctorId: "67aa3327ac2f8b10df67f360", 
                patientId: dataBasePatient._id, 
                date: new Date(), 
                description: "description 2",
                shift: 'MORNING'
            }

            const response = await supertest(app).put(`/consults/${dataBaseConsult._id}`).send(updatedConsult);
            expect(response.status).toBe(404);
        });

        it ("should return 404 when patient does not exist", async () => {
            const doctor = new Doctor({ 
                name: "Doctor", 
                specialty: "specialty 1" 
            });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({ 
                name: "Patient", 
                age: 20 
            })
            const dataBasePatient = await patient.save();

            const consult = new Consult ({
                 doctorId: dataBaseDoctor._id, 
                 patientId: dataBasePatient._id, 
                 date: new Date(),
                 description: "description 1",
                 shift: 'MORNING'
            });

            const dataBaseConsult = await consult.save();

            const updatedConsult = { 
                doctorId: doctor.id, 
                patientId: "67aa3327ac2f8b10df67f360", 
                date: new Date(), 
                description: "description 2",
                shift: 'MORNING'
            }

            const response = await supertest(app).put(`/consults/${dataBaseConsult._id}`).send(updatedConsult);
            expect(response.status).toBe(404);
        
        });
    });
})