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

describe("GET /users/name/:name", () => {
    let rootToken;

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

        for (let i = 1; i <= 5; i++) {
            const password = await bcrypt.hash(`JohnPass${i}123!`, 12);
            const user = new User({
                name: `John Doe ${i}`,
                email: `john${i}@test.com`,
                passwordHash: password,
                role: "client"
            });
            await user.save();
        }

        const password = await bcrypt.hash('JanePass123!', 12);
        const janeUser = new User({
            name: "Jane Smith",
            email: "jane@test.com",
            passwordHash: password,
            role: "client"
        });
        await janeUser.save();
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
