import supertest from "supertest";
import { app } from "../../../../server";
import { User } from "../../../infrastructure/schemas/user.schema";
import bcrypt from 'bcryptjs';
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
        const rootPassword = await bcrypt.hash('RootPass123!', 12);
        const rootUser = new User({
            name: "Root User",
            email: "root@test.com",
            passwordHash: rootPassword,
            role: "root"
        });
        await rootUser.save();

        const rootLogin = await supertest(app)
            .post('/auth/register')
            .send({
                name: "Root User",
                email: "root@test.com",
                password: "RootPass123!",
                role: "root"
            });
        rootToken = rootLogin.body.token;

        const employeePassword = await bcrypt.hash('EmployeePass123!', 12);
        const employeeUser = new User({
            name: "Employee User",
            email: "employee@test.com",
            passwordHash: employeePassword,
            role: "employee"
        });
        await employeeUser.save();

        const employeeLogin = await supertest(app)
            .post('/auth/register')
            .send({
                name: "Employee User",
                email: "employee@test.com",
                password: "EmployeePass123!",
                role: "employee"
            });
        employeeToken = employeeLogin.body.token;
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
            for (let i = 1; i <= 15; i++) {
                const password = await bcrypt.hash(`Password${i}123!`, 12);
                const user = new User({
                    name: `User ${i}`,
                    email: `user${i}@test.com`,
                    passwordHash: password,
                    role: "client"
                });
                await user.save();
            }

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
            const clientPassword = await bcrypt.hash('ClientPass123!', 12);
            const clientUser = new User({
                name: "Client User",
                email: "client@test.com",
                passwordHash: clientPassword,
                role: "client"
            });
            await clientUser.save();

            const clientLogin = await supertest(app)
                .post('/auth/register')
                .send({
                    name: "Client User",
                    email: "client@test.com",
                    password: "ClientPass123!",
                    role: "client"
                });
            const clientToken = clientLogin.body.token;

            const response = await supertest(app)
                .get('/users')
                .set('Authorization', `Bearer ${clientToken}`);

            expect(response.status).toBe(403);
        });
    });
});
