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

describe("PUT /patients/:id", () => {
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

            const response = await supertest(app).put(`/patients/${databasePatient._id}`).send(updatedPatient);

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

            const response = await supertest(app).put(`/patients/${databasePatient._id}`).send(updatedPatient);

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

            const response = await supertest(app).put(`/patients/${databasePatient._id}`).send(updatedPatient);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual("The age should be a valid number");
        });
    })
})