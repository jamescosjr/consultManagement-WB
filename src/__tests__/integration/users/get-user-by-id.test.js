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

describe("GET /users/id/:id", () => {
    let rootToken;
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
    });

    describe("success cases", () => {
        it("should return 200 and user data when user exists", async () => {
            const response = await supertest(app)
                .get(`/users/id/${testUserId}`)
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                name: "Test User",
                email: "test@test.com",
                role: "client"
            });
            expect(response.body.passwordHash).toBeUndefined();
        });
    });

    describe("non success cases", () => {
        it("should return 401 when not authenticated", async () => {
            const response = await supertest(app).get(`/users/id/${testUserId}`);

            expect(response.status).toBe(401);
        });

        it("should return 404 when user does not exist", async () => {
            const fakeId = "507f1f77bcf86cd799439011";
            const response = await supertest(app)
                .get(`/users/id/${fakeId}`)
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ message: 'User not found' });
        });

        it("should return 500 when invalid ID format", async () => {
            const response = await supertest(app)
                .get('/users/id/invalid-id')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(500);
        });
    });
});
