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

describe("GET/ consults/date/:date", () => {
    describe("success cases", () => {
        it ("should list the consults by date", async () => {
            const doctor = new Doctor({
                name: "Doctor",
                specialty: "specialty1",
            });

            await doctor.save();

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
            });

            await consult.save();

            const consult2 = new Consult({
                date: new Date(),
                doctorId: doctor._id,
                patientId: patient._id,
                description: "Consult Description",
            });

            await consult2.save();

            const response = await supertest(app).get(`/consults/date/${consult.date.toISOString()}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });

            it("should return 200 and an empty array when there is no consult on that date", async () => {
                const response = await supertest(app).get(`/consults/date/${new Date().toISOString()}`);
        
                expect(response.status).toBe(200);
                expect(response.body.length).toBe(0);
            })
    })
})