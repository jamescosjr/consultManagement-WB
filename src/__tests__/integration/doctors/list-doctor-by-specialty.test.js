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

describe("GET /doctors/specialty/:specialty", () => {
    describe("success cases", () => {
        it ("should return a 200 status when list all doctors by specialty", async () => {
            const doctor = new Doctor({
                name: "doctor 1",
                specialty: "specialty 1",
            });
            await doctor.save();

            const response = await supertest(app).get(`/doctors/specialty/specialty 1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: "doctor 1",
                        specialty: "specialty 1",
                    })
                ])
            );
        });

        it("should return 200 when getting doctors by specialty with empty array", async () => {
            const response = await supertest(app).get(`/doctors/specialty/20`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("non success cases", () => {
        it("should return 500 when database error", async () => {
            jest.spyOn(Doctor, 'find').mockImplementationOnce(() => {
                throw new Error();
            });

            const response = await supertest(app).get(`/doctors/specialty/20`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'AppError is not defined' });
        });
    });
});