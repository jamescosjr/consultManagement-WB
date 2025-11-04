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

describe("GET /doctors/name/:name", () => {
    describe("success cases", () => {
        it ("should return a 200 status when get a doctor by id", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: "specialty 1",
            });
            await doctor.save();

            const response = await supertest(app).get(`/doctors/name/doctor 1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{
                _id: expect.any(String),
                name: "doctor 1",
                specialty: "specialty 1", 
                consultIds: [],
                __v: 0,
            }]);
        });
    });

    describe("non success cases", () => {
        it("should return 200 and empty array if there is no doctor with that name", async () => {
            const response = await supertest(app).get(`/doctors/name/doctor 1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([])

        });
    });
});