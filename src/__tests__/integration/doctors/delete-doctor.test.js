import supertest from "supertest";
import { app } from "../../../../server";
import { Doctor } from "../../../infrastructure/schemas/doctor.schema";
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

describe("DELETE /doctors/:id", () => {
    let rootToken;

    beforeEach(async () => {
        const rootUser = new User({
            name: 'Root User',
            email: 'root@test.com',
            passwordHash: MOCK_PASSWORD_HASH,
            role: 'root'
        });
        const savedUser = await rootUser.save();
        rootToken = generateToken(savedUser._id, savedUser.role);
    });
    describe("success cases", () => {
        it ("should return a status 204 when delete a doctor", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: "specialty 1",
            });
            const databasedoctor = await doctor.save();

            const response = await supertest(app).delete(`/doctors/${databasedoctor._id}`).set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(204);
        });
    });

    describe("non success cases", () => {
        it("should return 404 when doctor not found", async () => {
            const response = await supertest(app).delete(`/doctors/677aa30f88a6da644245cae7`).set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Doctor not found' });
        });
        it("should return 500 when database error", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: 10,
            });
            const databasedoctor = await doctor.save();

            jest.spyOn(Doctor, 'findByIdAndDelete').mockImplementationOnce(() => {
                throw new Error();
            });

            const response = await supertest(app).delete(`/doctors/${databasedoctor._id}`).set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'AppError is not defined' });
        });
    });
});