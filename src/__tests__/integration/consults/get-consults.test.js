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

describe("GET/ consults", () => {
    describe("success cases", () => {
        it ("should return all consults", async () => {
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
                 description: "description 1" 
            });

            const dataBaseConsult = await consult.save();

            const response = await supertest(app).get('/consults');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });

        it("should return empty array when there is no consults", async () => {
            const response = await supertest(app).get('/consults');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });
    });

    describe("non success cases", () => {
        it("should return 500 when database error", async () => {
            jest.spyOn(Consult, 'find').mockImplementationOnce(() => {
                throw new Error();
            });

            const response = await supertest(app).get('/consults');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'AppError is not defined' });
        });
    });
});