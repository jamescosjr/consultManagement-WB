import supertest from "supertest";
import { app } from "../../../../server";
import { Patient } from "../../../infrastructure/schemas/patient.schema";
const dbHandler = require('../../../../jest/jest.setup');

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe("DELETE /patients/:id", () => {
    describe("success cases", () => {
        it ("should return a status 204 when delete a patient", async () => {
            const patient = new Patient({
                name: "Patient 1",
                age: 19,
            });
            const databasePatient = await patient.save();

            

            const response = await supertest(app).delete(`/patients/${databasePatient._id}`);

            expect(response.status).toBe(204);
        });
    });

    describe("non success cases", () => {
        it("should return 404 when patient not found", async () => {
            const response = await supertest(app).delete(`/patients/677aa30f88a6da644245cae7`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'patient not found' });
        });
        it("should return 500 when database error", async () => {
            const patient = new Patient({
                name: "patient 1",
                age: 10,
            });
            const databasepatient = await patient.save();

            jest.spyOn(Patient, 'findByIdAndDelete').mockImplementationOnce(() => {
                throw new Error();
            });

            const response = await supertest(app).delete(`/patients/${databasepatient._id}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'AppError is not defined' });
        });
    });
});