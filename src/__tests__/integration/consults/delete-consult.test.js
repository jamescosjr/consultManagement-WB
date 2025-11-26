import supertest from "supertest";
import { app } from "../../../../server";
const dbHandler = require('../../../../jest/jest.setup');
import { Doctor } from "../../../infrastructure/schemas/doctor.schema";
import { Patient } from "../../../infrastructure/schemas/patient.schema";
import { User } from "../../../infrastructure/schemas/user.schema";
import { generateToken, MOCK_PASSWORD_HASH } from "../../../test-helpers/test-utils";

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
    let rootToken;

    beforeEach(async () => {
        const rootUser = new User({
            name: "Root User",
            email: "root@test.com",
            passwordHash: MOCK_PASSWORD_HASH,
            role: "root"
        });
        const savedUser = await rootUser.save();
        rootToken = generateToken(savedUser._id, savedUser.role);
    });

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

            const responseCreateConsult = await supertest(app).post("/consults").set('Authorization', `Bearer ${rootToken}`).send(consult)

            const responseDeleteConsult = await supertest(app).delete(`/consults/${responseCreateConsult.body._id}`).set('Authorization', `Bearer ${rootToken}`)

            expect(responseDeleteConsult.status).toBe(204);
        });
    });

    describe("error cases", () => {
        it("should return 500 if consult not found", async () => {
            const response = await supertest(app).delete("/consults/67aa3327ac2f8b10df67f361").set('Authorization', `Bearer ${rootToken}`)

            expect(response.status).toBe(500);
        });
    });
});