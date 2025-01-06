import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import { User } from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skilllink';

describe('Auth Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          fullName: 'Test User',
          skillToTeach: 'Programming',
          skillToLearn: 'Music'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).toHaveProperty('skillToTeach', 'Programming');
      expect(res.body.user).toHaveProperty('skillToLearn', 'Music');
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should not create user with existing email', async () => {
      // First create a user
      await User.create({
        email: 'test@example.com',
        password: 'Password123!',
        fullName: 'Test User',
        skillToTeach: 'Programming',
        skillToLearn: 'Music'
      });

      // Try to create another user with same email
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          fullName: 'Another User',
          skillToTeach: 'Design',
          skillToLearn: 'Cooking'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          fullName: 'Test User',
          skillToTeach: 'Programming',
          skillToLearn: 'Music'
        });
      authToken = response.body.token;
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

  describe('PUT /api/auth/profile', () => {
    beforeEach(async () => {
      // Create a test user and get token before each profile test
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          fullName: 'Test User',
          skillToTeach: 'Programming',
          skillToLearn: 'Music'
        });
      authToken = response.body.token;
    });

    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Updated Name',
          skillToTeach: 'Updated Skill',
          skillToLearn: 'Updated Learning'
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('fullName', 'Updated Name');
      expect(res.body.user).toHaveProperty('skillToTeach', 'Updated Skill');
      expect(res.body.user).toHaveProperty('skillToLearn', 'Updated Learning');
    });

    it('should update single field', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          skillToTeach: 'Only This Updated'
        });

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('skillToTeach', 'Only This Updated');
      expect(res.body.user).toHaveProperty('fullName', 'Test User');
    });

    it('should reject unauthorized requests', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .send({
          fullName: 'Updated Name'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Authentication required');
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          fullName: 'Updated Name'
        });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Invalid or expired token');
    });
  });
});
