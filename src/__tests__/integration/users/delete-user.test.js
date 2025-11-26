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

describe("DELETE /users/:id", () => {
    let rootToken;
    let employeeToken;
    let testUserId;

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

        const testPassword = await bcrypt.hash('TestPass123!', 12);
        const testUser = new User({
            name: "Test User",
            email: "test@test.com",
            passwordHash: testPassword,
            role: "client"
        });
        const savedUser = await testUser.save();
        testUserId = savedUser._id.toString();
    });

    describe("success cases", () => {
        it("should return 200 when deleting user as root", async () => {
            const response = await supertest(app)
                .delete(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
            expect(response.body.user).toBeDefined();
            expect(response.body.user.name).toBe('Test User');

            const deletedUser = await User.findById(testUserId);
            expect(deletedUser).toBeNull();
        });
    });

    describe("non success cases", () => {
        it("should return 401 when not authenticated", async () => {
            const response = await supertest(app).delete(`/users/${testUserId}`);

            expect(response.status).toBe(401);
        });

        it("should return 403 when user is not root", async () => {
            const response = await supertest(app)
                .delete(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${employeeToken}`);

            expect(response.status).toBe(403);
        });

        it("should return 404 when user does not exist", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const response = await supertest(app)
                .delete(`/users/${fakeId}`)
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(404);
        });

        it("should return 500 when invalid ID format", async () => {
            const response = await supertest(app)
                .delete('/users/invalid-id')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(500);
        });
    });
});
