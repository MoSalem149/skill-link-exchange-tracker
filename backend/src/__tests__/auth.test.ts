import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import { User } from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skilllink';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    // Clean up database and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          fullName: 'Test User'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('fullName', 'Test User');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should not create user with existing email', async () => {
      // First create a user
      await User.create({
        email: 'test@example.com',
        password: 'Password123!',
        fullName: 'Test User'
      });

      // Try to create another user with same email
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          fullName: 'Another User'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          fullName: 'Test User'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});
