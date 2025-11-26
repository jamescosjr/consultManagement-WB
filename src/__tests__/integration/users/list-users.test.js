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

describe("GET /users", () => {
    let rootToken;
    let employeeToken;

    beforeEach(async () => {
        const [rootUser, employeeUser] = await User.insertMany([
            {
                name: "Root User",
                email: "root@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "root"
            },
            {
                name: "Employee User",
                email: "employee@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "employee"
            }
        ]);
        
        rootToken = generateToken(rootUser._id, rootUser.role);
        employeeToken = generateToken(employeeUser._id, employeeUser.role);
    });

    describe("success cases", () => {
        it("should return 200 status when listing all users as root", async () => {
            const response = await supertest(app)
                .get('/users')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it("should return 200 status when listing all users as employee", async () => {
            const response = await supertest(app)
                .get('/users')
                .set('Authorization', `Bearer ${employeeToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("should support pagination", async () => {
            const usersToCreate = [];
            
            for (let i = 1; i <= 15; i++) {
                usersToCreate.push({
                    name: `User ${i}`,
                    email: `user${i}@test.com`,
                    passwordHash: MOCK_PASSWORD_HASH,
                    role: "client"
                });
            }
            await User.insertMany(usersToCreate);

            const page1 = await supertest(app)
                .get('/users?page=1&limit=10')
                .set('Authorization', `Bearer ${rootToken}`);

            const page2 = await supertest(app)
                .get('/users?page=2&limit=10')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(page1.status).toBe(200);
            expect(page1.body.length).toBe(10);
            expect(page2.status).toBe(200);
            expect(page2.body.length).toBeGreaterThan(0);
        });

        it("should not return passwordHash in response", async () => {
            const response = await supertest(app)
                .get('/users')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(200);
            response.body.forEach(user => {
                expect(user.passwordHash).toBeUndefined();
            });
        });
    });

    describe("non success cases", () => {
        it("should return 401 when not authenticated", async () => {
            const response = await supertest(app).get('/users');

            expect(response.status).toBe(401);
        });

        it("should return 403 when user is not root or employee", async () => {
            const [clientUser] = await User.insertMany([{
                name: "Client User",
                email: "client@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "client"
            }]);
            const clientToken = generateToken(clientUser._id, clientUser.role);

            const response = await supertest(app)
                .get('/users')
                .set('Authorization', `Bearer ${clientToken}`);

            expect(response.status).toBe(403);
        });
    });
});
