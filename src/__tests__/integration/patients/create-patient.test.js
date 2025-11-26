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

describe('POST /patients', () => {
    let rootToken;

    beforeEach(async () => {
        const rootUser = await User.create({
            name: "Root User",
            email: "root@test.com",
            passwordHash: MOCK_PASSWORD_HASH,
            role: "root"
        });
        rootToken = generateToken(rootUser._id, rootUser.role);
    });

    describe("success cases", () => {
        it("should create a new patient", async () => {
            const patient = {
                name: "patient 1",
                age: 30,
            };

            const response = await supertest(app)
                .post("/patients")
                .set('Authorization', `Bearer ${rootToken}`)
                .send(patient);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                _id: expect.any(String),
                name: "patient 1",
                age: 30,
                consultIds: [],
                __v:0,
            }));
        });
    });

    describe("non success cases", () => {
        it("should throw an error if the name is not a string", async () => {
            const patient = {
                name: 30,
                age: 30,
            }

            const response = await supertest(app)
                .post("/patients")
                .set('Authorization', `Bearer ${rootToken}`)
                .send(patient);

            expect(response.status).toBe(400)
            expect(response.body.message). toBe("The name should be a valid string")
        })

        it("should throw an error if the age is not a number", async () => {
            const patient = {
                name: "patient 1",
                age: "30",
            }

            const response = await supertest(app)
                .post("/patients")
                .set('Authorization', `Bearer ${rootToken}`)
                .send(patient);

            expect(response.status).toBe(400)
            expect(response.body.message). toBe("The age should be a valid number")
        })
    })
});