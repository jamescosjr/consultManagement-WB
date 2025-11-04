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

describe("GET /patients/:id", () => {
    describe("success cases", () => {
        it ("should return a 200 status when get a patient by id", async () => {
            const patient = new Patient({
                name: "patient 1",
                age: 20,
            });
            await patient.save();

            const response = await supertest(app).get(`/patients/name/patient 1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{
                _id: expect.any(String),
                name: "patient 1",
                age: 20, 
                consultIds: [],
                __v: 0,
            }]);
        });
    });

    describe("non success cases", () => {
        it("should return 200 and empty array if there is no patient with that name", async () => {
            const response = await supertest(app).get(`/patients/name/patient 1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([])

        });
    });
});