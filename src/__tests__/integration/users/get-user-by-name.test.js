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

describe("GET /users/name/:name", () => {
    let rootToken;

    beforeEach(async () => {
        const usersToCreate = [
            {
                name: "Root User",
                email: "root@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "root"
            }
        ];

        for (let i = 1; i <= 5; i++) {
            usersToCreate.push({
                name: `John Doe ${i}`,
                email: `john${i}@test.com`,
                passwordHash: MOCK_PASSWORD_HASH,
                role: "client"
            });
        }

        usersToCreate.push({
            name: "Jane Smith",
            email: "jane@test.com",
            passwordHash: MOCK_PASSWORD_HASH,
            role: "client"
        });

        const users = await User.insertMany(usersToCreate);
        rootToken = generateToken(users[0]._id, users[0].role);
    });

    describe("success cases", () => {
        it("should return 200 and matching users", async () => {
            const response = await supertest(app)
                .get('/users/name/John')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            response.body.forEach(user => {
                expect(user.name).toMatch(/John/i);
                expect(user.passwordHash).toBeUndefined();
            });
        });

        it("should support pagination", async () => {
            const page1 = await supertest(app)
                .get('/users/name/John?page=1&limit=2')
                .set('Authorization', `Bearer ${rootToken}`);

            const page2 = await supertest(app)
                .get('/users/name/John?page=2&limit=2')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(page1.status).toBe(200);
            expect(page1.body.length).toBe(2);
            expect(page2.status).toBe(200);
            expect(page2.body.length).toBeGreaterThan(0);
        });

        it("should return empty array when no users match", async () => {
            const response = await supertest(app)
                .get('/users/name/NonExistent')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe("non success cases", () => {
        it("should return 401 when not authenticated", async () => {
            const response = await supertest(app).get('/users/name/John');

            expect(response.status).toBe(401);
        });
    });
});
