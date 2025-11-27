import supertest from "supertest";
import { app } from "../../../../server";
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

describe('POST /auth/register', () => {
    describe('success cases', () => {
        it('should register a new user and return token', async () => {
            const payload = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Str0ng Password!',
                role: 'client',
                roleDetails: {
                    age: 30
                }
            };

            const response = await supertest(app)
                .post('/auth/register')
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                user: expect.objectContaining({
                    _id: expect.any(String),
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'client',
                    roleDetails: expect.objectContaining({
                        refModel: 'Patient',
                        refId: expect.any(String)
                    })
                }),
                token: expect.any(String)
            }));
            // Ensure passwordHash isn't exposed
            expect(response.body.user.passwordHash).toBeUndefined();
        });

        it('should register a doctor with specialty', async () => {
            const payload = {
                name: 'Dr. Smith',
                email: 'dr.smith@hospital.com',
                password: 'Secure Doc Pass123!',
                role: 'doctor',
                roleDetails: {
                    specialty: 'Cardiology'
                }
            };

            const response = await supertest(app)
                .post('/auth/register')
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                user: expect.objectContaining({
                    _id: expect.any(String),
                    name: 'Dr. Smith',
                    email: 'dr.smith@hospital.com',
                    role: 'doctor',
                    roleDetails: expect.objectContaining({
                        refModel: 'Doctor',
                        refId: expect.any(String)
                    })
                }),
                token: expect.any(String)
            }));
        });
    });

    describe('non success cases', () => {
        it('should reject weak password', async () => {
            const payload = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'weak',
                role: 'client',
                roleDetails: {
                    age: 25
                }
            };

            const response = await supertest(app)
                .post('/auth/register')
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Password must be at least/);
        });

        it('should reject duplicate email', async () => {
            const payload = {
                name: 'User One',
                email: 'dup@example.com',
                password: 'Str0ng Password!',
                role: 'client',
                roleDetails: {
                    age: 28
                }
            };

            const first = await supertest(app).post('/auth/register').send(payload);
            expect(first.status).toBe(201);

            const second = await supertest(app).post('/auth/register').send(payload);
            expect(second.status).toBe(409);
            expect(second.body.message).toBe('Email already registered');
        });

        it('should validate email format', async () => {
            const payload = {
                name: 'Invalid Email',
                email: 'invalid-email',
                password: 'Str0ng Password!',
                role: 'client',
                roleDetails: {
                    age: 22
                }
            };

            const response = await supertest(app)
                .post('/auth/register')
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('The email address format is invalid');
        });

        it('should reject client registration without age', async () => {
            const payload = {
                name: 'No Age User',
                email: 'noage@example.com',
                password: 'Str0ng Password!',
                role: 'client'
            };

            const response = await supertest(app)
                .post('/auth/register')
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Client role requires roleDetails with age/);
        });

        it('should reject doctor registration without specialty', async () => {
            const payload = {
                name: 'Dr. NoSpec',
                email: 'nospec@hospital.com',
                password: 'Str0ng Password!',
                role: 'doctor'
            };

            const response = await supertest(app)
                .post('/auth/register')
                .send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/Doctor role requires roleDetails with specialty/);
        });
    });
});
