import supertest from "supertest";
import { app } from "../../../../server";
const dbHandler = require('../../../../jest/jest.setup');
import { Doctor } from "../../../infrastructure/schemas/doctor.schema";
import { Patient } from "../../../infrastructure/schemas/patient.schema";
import { Consult } from "../../../infrastructure/schemas/consult.schema";

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe("GET/ consults/id/:id", () => {
    describe("success cases", () => {
        it ("should list the consults by id", async () => {
            const doctor = new Doctor({
                name: "Doctor",
                specialty: "specialty1",
            });

            await doctor.save();

            const doctor2 = new Doctor({
                name: "Doctor2",
                specialty: "specialty2",
            });

            await doctor2.save();

            const patient = new Patient({
                name: "Patient Test",
                age: 30,
            });

            await patient.save();

            const consult = new Consult({
                date: new Date(),
                doctorId: doctor._id,
                patientId: patient._id,
                description: "Consult Description",
                shift: 'MORNING'
            });

            await consult.save();

            const consult2 = new Consult({
                date: new Date(),
                doctorId: doctor._id,
                patientId: patient._id,
                description: "Consult Description",
            });

            await consult2.save();

            const consult3 = new Consult({
                date: new Date(),
                doctorId: doctor2._id,
                patientId: patient._id,
                description: "Consult Description",
            });

            await consult3.save();

            const response = await supertest(app).get(`/consults/id/${consult._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                _id: consult._id.toString(),
                date: consult.date.toISOString(),
                doctorId: doctor._id.toString(),
                patientId: patient._id.toString(),
                description: "Consult Description",
                __v: 0,
            });
        });
    });

    describe("error cases", () => {
        it("should return 404 when the consult is not found", async () => {
            const response = await supertest(app).get(`/consults/id/67aa3327ac2f8b10df67f360`);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                message: "Consult not found",
            });
        });
     });
});