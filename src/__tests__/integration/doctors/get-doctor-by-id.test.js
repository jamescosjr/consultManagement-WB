import supertest from "supertest";
import { app } from "../../../../server";
import { Doctor } from "../../../infrastructure/schemas/doctor.schema";
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

describe("GET /doctors/id/:id", () => {
    describe("success cases", () => {
        it ("should return a 200 status when get a doctor by id", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: "specialty 1",
            });
            const dataBasedoctor = await doctor.save();

            const response = await supertest(app).get(`/doctors/id/${dataBasedoctor._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                _id: expect.any(String),
                name: "doctor 1",
                specialty: "specialty 1", 
                __v: 0,
            });
        });
    });

    describe("non success cases", () => {
        it("should return 404 if there is no doctor with that id", async () => {
            const response = await supertest(app).get(`/doctors/id/677aa30f88a6da644245cae7`);

            expect(response.status).toBe(404);
            expect(response.body.message).toEqual("Doctor not found")

        });
    });
});