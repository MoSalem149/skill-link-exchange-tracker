// connections.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import { User } from '../models/User.js';
import { Connection, ConnectionStatus } from '../models/Connection.js';
import jwt from 'jsonwebtoken';

describe('Connection Routes', () => {
  // Test user data
  const testUser1 = {
    email: 'user1@test.com',
    fullName: 'Test User 1',
    password: 'password123',
    skillToTeach: 'JavaScript',
    skillToLearn: 'Python',
    role: 'user',
    connectedUsers: 0
  };

  const testUser2 = {
    email: 'user2@test.com',
    fullName: 'Test User 2',
    password: 'password123',
    skillToTeach: 'Python',
    skillToLearn: 'JavaScript',
    role: 'user',
    connectedUsers: 0
  };

  // JWT token for authentication
  let token1: string;
  let token2: string;
  let user1: any;
  let user2: any;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI!);

    // Create test users
    user1 = await User.create(testUser1);
    user2 = await User.create(testUser2);

    // Generate tokens
    token1 = jwt.sign(
      { userId: user1._id, email: user1.email, role: user1.role },
      process.env.JWT_SECRET!
    );
    token2 = jwt.sign(
      { userId: user2._id, email: user2.email, role: user2.role },
      process.env.JWT_SECRET!
    );
  });

  afterAll(async () => {
    // Clean up database
    await User.deleteMany({});
    await Connection.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear connections before each test
    await Connection.deleteMany({});
  });
});
