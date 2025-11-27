import supertest from 'supertest';
import { app } from '../../../../server';
import { User } from '../../../infrastructure/schemas/user.schema';
import { Doctor } from '../../../infrastructure/schemas/doctor.schema';
import { Patient } from '../../../infrastructure/schemas/patient.schema';
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

  it('should login client and populate patient roleDetails', async () => {
    const patient = await Patient.create({ name: 'Patient User', age: 30 });
    const clientEmail = 'client@test.com';
    
    await User.create({
      name: 'Patient User',
      email: clientEmail,
      passwordHash: MOCK_PASSWORD_HASH,
      role: 'client',
      roleDetails: {
        refModel: 'Patient',
        refId: patient._id
      }
    });

    const res = await supertest(app)
      .post('/auth/login')
      .send({ email: clientEmail, password });

    expect(res.status).toBe(200);
    expect(res.body.user.roleDetails).toBeDefined();
    expect(res.body.user.roleDetails.refModel).toBe('Patient');
    expect(res.body.user.roleDetails.refId).toBeDefined();
    expect(res.body.user.roleDetails.refId.age).toBe(30);
  });

  it('should login doctor and populate doctor roleDetails', async () => {
    const doctor = await Doctor.create({ name: 'Dr. Smith', specialty: 'Cardiology' });
    const doctorEmail = 'doctor@test.com';
    
    await User.create({
      name: 'Dr. Smith',
      email: doctorEmail,
      passwordHash: MOCK_PASSWORD_HASH,
      role: 'doctor',
      roleDetails: {
        refModel: 'Doctor',
        refId: doctor._id
      }
    });

    const res = await supertest(app)
      .post('/auth/login')
      .send({ email: doctorEmail, password });

    expect(res.status).toBe(200);
    expect(res.body.user.roleDetails).toBeDefined();
    expect(res.body.user.roleDetails.refModel).toBe('Doctor');
    expect(res.body.user.roleDetails.refId).toBeDefined();
    expect(res.body.user.roleDetails.refId.specialty).toBe('Cardiology');
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
