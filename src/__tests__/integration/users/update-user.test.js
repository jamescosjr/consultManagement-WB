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

describe("PUT /users/:id", () => {
    let rootToken;
    let userToken;
    let testUserId;

    beforeEach(async () => {
        const [rootUser, testUser] = await User.insertMany([
            {
                name: "Root User",
                email: "root@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "root"
            },
            {
                name: "Test User",
                email: "test@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "client"
            }
        ]);
        
        rootToken = generateToken(rootUser._id, rootUser.role);
        testUserId = testUser._id.toString();
        userToken = generateToken(testUser._id, testUser.role);
    });

    describe("success cases", () => {
        it("should return 200 when updating user name", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: "Updated Name"
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe("Updated Name");
            expect(response.body.passwordHash).toBeUndefined();
        });

        it("should return 200 when updating user email", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    email: "newemail@test.com"
                });

            expect(response.status).toBe(200);
            expect(response.body.email).toBe("newemail@test.com");
        });

        it("should return 200 when updating user role as root", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${rootToken}`)
                .send({
                    role: "employee"
                });

            expect(response.status).toBe(200);
            expect(response.body.role).toBe("employee");
        });

        it("should return 200 when updating multiple fields", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: "New Name",
                    email: "updated@test.com"
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe("New Name");
            expect(response.body.email).toBe("updated@test.com");
        });
    });

    describe("non success cases", () => {
        it("should return 401 when not authenticated", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .send({ name: "New Name" });

            expect(response.status).toBe(401);
        });

        it("should return 400 when no fields to update", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({});

            expect(response.status).toBe(400);
        });

        it("should return 400 when email is invalid", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    email: "invalid-email"
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when role is invalid", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${rootToken}`)
                .send({
                    role: "invalidrole"
                });

            expect(response.status).toBe(400);
        });

        it("should return 409 when email already exists", async () => {
            await User.insertMany([{
                name: "Another User",
                email: "another@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "client"
            }]);

            const response = await supertest(app)
                .put(`/users/${testUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    email: "another@test.com"
                });

            expect(response.status).toBe(409);
        });

        it("should return 404 when user does not exist", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const response = await supertest(app)
                .put(`/users/${fakeId}`)
                .set('Authorization', `Bearer ${rootToken}`)
                .send({
                    name: "New Name"
                });

            expect(response.status).toBe(404);
        });
    });
});
