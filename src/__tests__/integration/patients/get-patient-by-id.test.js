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

describe("GET /patients/id/:id", () => {
    describe("success cases", () => {
        it ("should return a 200 status when get a patient by id", async () => {
            const patient = new Patient({
                name: "patient 1",
                age: 20,
            });
            const dataBasePatient = await patient.save();

            const response = await supertest(app).get(`/patients/id/${dataBasePatient._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                _id: expect.any(String),
                name: "patient 1",
                age: 20, 
                consultIds: [],
                __v: 0,
            });
        });
    });

    describe("non success cases", () => {
        it("should return 404 if there is no patient with that id", async () => {
            const response = await supertest(app).get(`/patients/id/677aa30f88a6da644245cae7`);

            expect(response.status).toBe(404);
            expect(response.body.message).toEqual("patient not found")

        });
    });
});