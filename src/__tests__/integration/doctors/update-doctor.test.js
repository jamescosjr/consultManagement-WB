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

describe("PUT /doctors/:id", () => {
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
        it ("should return a status 200 when update a doctor", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: "specialty 1",
            });
            const databasedoctor = await doctor.save();

            const updateddoctor = {
                name: "doctor 2",
                specialty: "specialty 2",
            };

            const response = await supertest(app).put(`/doctors/${databasedoctor._id}`).set('Authorization', `Bearer ${rootToken}`).send(updateddoctor);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(updateddoctor));
        });
    });

    describe("non success case", () => {
        it ("should return a 400 status when the name is not provided", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: "specialty 1",
            });
            const databasedoctor = await doctor.save();

            const updateddoctor = {
                specialty: "specialty 2",
            };

            const response = await supertest(app).put(`/doctors/${databasedoctor._id}`).set('Authorization', `Bearer ${rootToken}`).send(updateddoctor);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual("The name should be a valid string");
        });

        it ("should return a 400 status when the specialty is not provided", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: "specialty 1",
            });
            const databasedoctor = await doctor.save();

            const updateddoctor = {
                name: "doctor 2"
            };

            const response = await supertest(app).put(`/doctors/${databasedoctor._id}`).set('Authorization', `Bearer ${rootToken}`).send(updateddoctor);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual("The specialty should be a valid string");
        });
    })
})