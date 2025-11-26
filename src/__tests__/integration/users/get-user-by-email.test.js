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

describe("GET /users/email/:email", () => {
    let rootToken;
    let testUserEmail;

    beforeEach(async () => {
        const [rootUser] = await User.insertMany([
            {
                name: "Root User",
                email: "root@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "root"
            },
            {
                name: "Test User",
                email: "testuser@test.com",
                passwordHash: MOCK_PASSWORD_HASH,
                role: "client"
            }
        ]);
        
        rootToken = generateToken(rootUser._id, rootUser.role);
        testUserEmail = "testuser@test.com";
    });

    describe("success cases", () => {
        it("should return 200 and user data when email exists", async () => {
            const response = await supertest(app)
                .get(`/users/email/${testUserEmail}`)
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                name: "Test User",
                email: "testuser@test.com",
                role: "client"
            });
            expect(response.body.passwordHash).toBeUndefined();
        });
    });

    describe("non success cases", () => {
        it("should return 401 when not authenticated", async () => {
            const response = await supertest(app).get(`/users/email/${testUserEmail}`);

            expect(response.status).toBe(401);
        });

        it("should return 404 when email does not exist", async () => {
            const response = await supertest(app)
                .get('/users/email/nonexistent@test.com')
                .set('Authorization', `Bearer ${rootToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ message: 'User not found' });
        });
    });
});
