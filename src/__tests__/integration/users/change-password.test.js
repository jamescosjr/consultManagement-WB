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

describe("PUT /users/:id/password", () => {
    let userToken;
    let testUserId;
    // A senha que corresponde ao MOCK_PASSWORD_HASH usado nos testes
    const currentPassword = 'TestPass123!';

    beforeEach(async () => {
        const [testUser] = await User.insertMany([{
            name: "Test User",
            email: "test@test.com",
            passwordHash: MOCK_PASSWORD_HASH,
            role: "client"
        }]);
        
        testUserId = testUser._id.toString();
        userToken = generateToken(testUser._id, testUser.role);
    });

    describe("success cases", () => {
        it("should return 200 when changing password with valid data", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'NewValidPass123!'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Password changed successfully');
            expect(response.body.user).toBeDefined();
            expect(response.body.user.passwordHash).toBeUndefined();
        });
    });

    describe("non success cases", () => {
        it("should return 401 when not authenticated", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'NewValidPass123!'
                });

            expect(response.status).toBe(401);
        });

        it("should return 401 when current password is incorrect", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: 'WrongPassword123!',
                    newPassword: 'NewValidPass123!'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Current password is incorrect');
        });

        it("should return 400 when new password is same as current", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: currentPassword
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when new password is too short", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'Short1!'
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when new password missing uppercase", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'nouppercase123!'
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when new password missing lowercase", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'NOLOWERCASE123!'
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when new password missing number", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'NoNumbersHere!'
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when new password missing special character", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'NoSpecialChar123'
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when new password contains user name", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'TestUserPassword123!'
                });

            expect(response.status).toBe(400);
        });

        it("should return 400 when new password contains email part", async () => {
            const response = await supertest(app)
                .put(`/users/${testUserId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'test@Password123!'
                });

            expect(response.status).toBe(400);
        });

        it("should return 404 when user does not exist", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const response = await supertest(app)
                .put(`/users/${fakeId}/password`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    currentPassword: currentPassword,
                    newPassword: 'NewValidPass123!'
                });

            expect(response.status).toBe(404);
        });
    });
});
