import supertest from "supertest";
import { app } from "../../../../server";
const dbHandler = require('../../../../jest/jest.setup');
import { Doctor } from "../../../infrastructure/schemas/doctor.schema";
import { Patient } from "../../../infrastructure/schemas/patient.schema";

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe('DELETE /consults/:id', () => {
    describe("success cases", () => {
        it("should delete a consult", async () => {
            const doctor = new Doctor({
                            name: "doctor 1",
                            specialty: "specialty 1",
                        });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({
                            name: "patient 1",
                            age: 20,
                        });

            const dataBasePatient = await patient.save();

            const consult = {
                date: new Date(),
                patientId: dataBasePatient._id,
                doctorId: dataBaseDoctor._id,
                description: "description 1",
                shift: 'MORNING'
            };

            const responseCreateConsult = await supertest(app).post("/consults").send(consult)

            const responseDeleteConsult = await supertest(app).delete(`/consults/${responseCreateConsult.body._id}`)

            expect(responseDeleteConsult.status).toBe(204);
        });
    });

    describe("error cases", () => {
        it("should return 404 if consult not found", async () => {
            const response = await supertest(app).delete("/consults/67aa3327ac2f8b10df67f361")

            expect(response.status).toBe(404);
        });
    });
});