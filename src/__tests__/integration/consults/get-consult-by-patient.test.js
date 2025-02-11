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

describe("GET/ consults/patient/:patientId", () => {
    describe("success cases", () => {
        it ("should list the consults by patientId", async () => {
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

            const response = await supertest(app).get(`/consults/patient/${patient._id}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
        });

        it("should return 200 and an empty array when there is no consult for that patient", async () => {
            const patient = new Patient({
                name: "Patient",
                age: 30,
            });

            await patient.save();

            const response = await supertest(app).get(`/consults/patient/${patient._id}`);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        })
    });

    describe("error cases", () => {
        it("should return 500 when database error", async () => {
                    jest.spyOn(Consult, 'find').mockImplementationOnce(() => {
                        throw new Error();
                    });

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
                    });
        
                    await consult.save();
        
                    const consult2 = new Consult({
                        date: new Date(),
                        doctorId: doctor2._id,
                        patientId: patient._id,
                        description: "Consult Description",
                    });
        
                    await consult2.save();
        
                    const response = await supertest(app).get(`/consults/patient/${patient._id}`);
        
                    expect(response.status).toBe(500);
                    expect(response.body).toEqual({ message: 'AppError is not defined' });
                });
            });
});