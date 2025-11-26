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

describe("PUT /patients/:id", () => {
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
        it ("should return a status 200 when update a patient", async () => {
            const patient = new Patient({
                name: "Patient 1",
                age: 19,
            });
            const databasePatient = await patient.save();

            const updatedPatient = {
                name: "Patient 2",
                age: 20,
            };

            const response = await supertest(app)
                .put(`/patients/${databasePatient._id}`)
                .set('Authorization', `Bearer ${rootToken}`)
                .send(updatedPatient);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(updatedPatient));
        });
    });

    describe("non success case", () => {
        it ("should return a 400 status when the name is not provided", async () => {
            const patient = new Patient({
                name: "Patient 1",
                age: 19,
            });
            const databasePatient = await patient.save();

            const updatedPatient = {
                age: 20,
            };

            const response = await supertest(app)
                .put(`/patients/${databasePatient._id}`)
                .set('Authorization', `Bearer ${rootToken}`)
                .send(updatedPatient);

            expect(response.status).toBe(400);
            expect(response.body. message).toEqual("The name should be a valid string");
        });

        it ("should return a 400 status when the age is not provided", async () => {
            const patient = new Patient({
                name: "Patient 1",
                age: 19,
            });
            const databasePatient = await patient.save();

            const updatedPatient = {
                name: "Patient 2"
            };

            const response = await supertest(app)
                .put(`/patients/${databasePatient._id}`)
                .set('Authorization', `Bearer ${rootToken}`)
                .send(updatedPatient);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual("The age should be a valid number");
        });
    })
})