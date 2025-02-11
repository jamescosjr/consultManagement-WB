import supertest from "supertest";
import { app } from "../../../../server";
const dbHandler = require('../../../../jest/jest.setup');
import { Doctor } from "../../../infrastructure/schemas/doctor.schema";
import { Patient } from "../../../infrastructure/schemas/patient.schema";

beforeAll(async () => {
    await dbHandler.connect();
});

afterEach(async () => {
    await dbHandler.clearDatabase();
});

afterAll(async () => {
    await dbHandler.closeDatabase();
});

describe('POST /consults', () => {
    describe("success cases", () => {
        it("should create a new consult", async () => {
            const doctor = new Doctor({
                            name: "doctor 1",
                            specialty: "specialty 1",
                        });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({
                            name: "patient 1",
                            age: 20,
                        });

            const dataBasePatient = await patient.save();

            const consult = {
                date: new Date(),
                patientId: dataBasePatient._id,
                doctorId: dataBaseDoctor._id,
                description: "description 1",
            };

            const response = await supertest(app).post("/consults").send(consult)

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body).toHaveProperty("date");
            expect(response.body).toHaveProperty("patientId");
            expect(response.body).toHaveProperty("doctorId");
            expect(response.body).toHaveProperty("description");
        });
    });

    describe("error cases", () => {
        it("should return 404 if patient not found", async () => {
            const doctor = new Doctor({
                            name: "doctor 1",
                            specialty: "specialty 1",
                        });

            const dataBaseDoctor = await doctor.save();

            const consult = {
                date: new Date(),
                patientId: "67aa3327ac2f8b10df67f360",
                doctorId: dataBaseDoctor._id,
                description: "description 1",
            };

            const response = await supertest(app).post("/consults").send(consult)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Patient not found");
        });

        it ("should return a 404 if doctor not found", async () => {
            const patient = new Patient({
                            name: "patient 1",
                            age: 20,
                        });

            const dataBasePatient = await patient.save();

            const consult = {
                date: new Date(),
                patientId: dataBasePatient._id,
                doctorId: "67aa3327ac2f8b10df67f360",
                description: "description 1",
            };

            const response = await supertest(app).post("/consults").send(consult)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Doctor not found");
        });

        it("should return 400 if date is not provided", async () => {
            const doctor = new Doctor({
                            name: "doctor 1",
                            specialty: "specialty 1",
                        });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({
                            name: "patient 1",
                            age: 20,
                        });

            const dataBasePatient = await patient.save();

            const consult = {
                patientId: dataBasePatient._id,
                doctorId: dataBaseDoctor._id,
                description: "description 1",
            };

            const response = await supertest(app).post("/consults").send(consult)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "The date should be a valid string");
        });

        it("should return 400 if patientId is not provided", async () => {
            const doctor = new Doctor({
                            name: "doctor 1",
                            specialty: "specialty 1",
                        });

            const dataBaseDoctor = await doctor.save();

            const consult = {
                date: new Date(),
                doctorId: dataBaseDoctor._id,
                description: "description 1",
            };

            const response = await supertest(app).post("/consults").send(consult)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "The patientId should be a valid string");
        });

        it("should return 400 if doctorId is not provided", async () => {
            const patient = new Patient({
                            name: "patient 1",
                            age: 20,
                        });

            const dataBasePatient = await patient.save();

            const consult = {
                date: new Date(),
                patientId: dataBasePatient._id,
                description: "description 1",
            };

            const response = await supertest(app).post("/consults").send(consult)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "The doctorId should be a valid string");
        });

        it("should return 400 if description is not provided", async () => {
            const doctor = new Doctor({
                            name: "doctor 1",
                            specialty: "specialty 1",
                        });

            const dataBaseDoctor = await doctor.save();

            const patient = new Patient({
                            name: "patient 1",
                            age: 20,
                        });

            const dataBasePatient = await patient.save();

            const consult = {
                date: new Date(),
                patientId: dataBasePatient._id,
                doctorId: dataBaseDoctor._id,
            };

            const response = await supertest(app).post("/consults").send(consult)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "The description should be a valid string");
        });
    });
});