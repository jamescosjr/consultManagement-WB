import supertest from "supertest";
import { app } from "../../../../server";
import { User } from "../../../infrastructure/schemas/user.schema";
import { MOCK_PASSWORD_HASH } from "../../../test-helpers/test-utils";
const dbHandler = require('../../../../jest/jest.setup');

describe("Requests API", () => {
    let token;

    beforeAll(async () => {
        await dbHandler.connect();
    });

    afterEach(async () => {
        await dbHandler.clearDatabase();
    });

    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    beforeEach(async () => {
        await User.create({
            name: "Root User",
            email: "root@test.com",
            passwordHash: MOCK_PASSWORD_HASH,
            role: "root"
        });

        const response = await supertest(app)
            .post("/auth/login")
            .send({ email: "root@test.com", password: "TestPass123!" });
        token = response.body.token;
    });

    it("should create a new request", async () => {
        const response = await supertest(app)
            .post("/requests")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Request", description: "This is a test request." });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
    });

    it("should list all requests", async () => {
        const response = await supertest(app)
            .get("/requests")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("should get a request by ID", async () => {
        const newRequest = await supertest(app)
            .post("/requests")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Another Request", description: "Another test request." });

        const response = await supertest(app)
            .get(`/requests/${newRequest.body._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id", newRequest.body._id);
    });
});