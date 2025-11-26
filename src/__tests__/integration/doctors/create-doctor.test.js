import supertest from "supertest";
import { app } from "../../../../server";
import { User } from "../../../infrastructure/schemas/user.schema";
import { generateToken, MOCK_PASSWORD_HASH } from "../../../test-helpers/test-utils";
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

describe('POST /doctors', () => {
    let rootToken;

    beforeEach(async () => {
        const rootUser = new User({
            name: 'Root User',
            email: 'root@test.com',
            passwordHash: MOCK_PASSWORD_HASH,
            role: 'root'
        });
        const savedUser = await rootUser.save();
        rootToken = generateToken(savedUser._id, savedUser.role);
    });
    describe("success cases", () => {
        it("should create a new doctor", async () => {
            const doctor = {
                name: "doctor 1",
                specialty: "specialty 1",
            };

            const response = await supertest(app).post("/doctors").set('Authorization', `Bearer ${rootToken}`).send(doctor);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                _id: expect.any(String),
                name: "doctor 1",
                specialty: "specialty 1",
                __v:0,
            }));
        });
    });

    describe("non success cases", () => {
        it("should throw an error if the name is not a string", async () => {
            const doctor = {
                name: 30,
                specialty:"specialty 1",
            }

            const response = await supertest(app).post("/doctors").set('Authorization', `Bearer ${rootToken}`).send(doctor);

            expect(response.status).toBe(400)
            expect(response.body.message). toBe("The name should be a valid string")
        })

        it("should throw an error if the specialty is not a string", async () => {
            const doctor = {
                name: "doctor 1",
                specialty: 30,
            }

            const response = await supertest(app).post("/doctors").set('Authorization', `Bearer ${rootToken}`).send(doctor);

            expect(response.status).toBe(400)
            expect(response.body.message). toBe("The specialty should be a valid string")
        })
    })
});