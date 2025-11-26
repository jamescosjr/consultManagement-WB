import supertest from "supertest";
import { app } from "../../../../server";
import { Patient } from "../../../infrastructure/schemas/patient.schema";
import { User } from "../../../infrastructure/schemas/user.schema";
import { generateToken, MOCK_PASSWORD_HASH } from "../../../test-helpers/test-utils";
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
    let rootToken;

    beforeEach(async () => {
        const rootUser = await User.create({
            name: "Root User",
            email: "root@test.com",
            passwordHash: MOCK_PASSWORD_HASH,
            role: "root"
        });
        rootToken = generateToken(rootUser._id, rootUser.role);
    });

    describe("success cases", () => {
        it ("should return a status 204 when delete a patient", async () => {
            const patient = new Patient({
                name: "Patient 1",
                age: 19,
            });
            const databasePatient = await patient.save();

            const response = await supertest(app)
                .delete(`/patients/${databasePatient._id}`)
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(204);
        });
    });

    describe("non success cases", () => {
        it("should return 404 when patient not found", async () => {
            const response = await supertest(app)
                .delete(`/patients/677aa30f88a6da644245cae7`)
                .set('Authorization', `Bearer ${rootToken}`);

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

            const response = await supertest(app)
                .delete(`/patients/${databasepatient._id}`)
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'AppError is not defined' });
        });
    });
});