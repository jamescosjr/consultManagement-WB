import supertest from 'supertest';
import { app } from '../../../../server';
import { User } from '../../../infrastructure/schemas/user.schema';
import { MOCK_PASSWORD_HASH } from '../../../test-helpers/test-utils';
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

describe('POST /auth/login', () => {
  const email = 'test@test.com';
  const password = 'TestPass123!'; // corresponde ao MOCK_PASSWORD_HASH

  beforeEach(async () => {
    await User.create({
      name: 'Test User',
      email,
      passwordHash: MOCK_PASSWORD_HASH,
      role: 'client',
    });
  });

  it('should login successfully and return token + user', async () => {
    const res = await supertest(app)
      .post('/auth/login')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('should return 401 for invalid password', async () => {
    const res = await supertest(app)
      .post('/auth/login')
      .send({ email, password: 'WrongPass123!' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 401 for non existing user', async () => {
    const res = await supertest(app)
      .post('/auth/login')
      .send({ email: 'nouser@test.com', password });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 400 for invalid input', async () => {
    const res = await supertest(app)
      .post('/auth/login')
      .send({ email: 'invalid-email', password: '' });

    expect(res.status).toBe(400);
  });
});
