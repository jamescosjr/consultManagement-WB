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

describe("GET /patients/age/:age", () => {
    describe("success cases", () => {
        it ("should return a 200 status when list all patients by age", async () => {
            const patient = new Patient({
                name: "patient 1",
                age: 20,
            });
            await patient.save();

            const response = await supertest(app).get(`/patients/age/20`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: "patient 1",
                        age: 20,
                    })
                ])
            );
        });

        it("should return 200 when getting patients by age with empty array", async () => {
            const response = await supertest(app).get(`/patients/age/20`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("non success cases", () => {
        it("should return 500 when database error", async () => {
            jest.spyOn(Patient, 'find').mockImplementationOnce(() => {
                throw new Error();
            });

            const response = await supertest(app).get(`/patients/age/20`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'AppError is not defined' });
        });
    });
});