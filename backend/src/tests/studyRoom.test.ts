// studyRoom.test.ts
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index.js';
import { StudyRoom } from '../models/StudyRoom.js';
import { User } from '../models/User.js';
import { Connection } from '../models/Connection.js';
import jwt from 'jsonwebtoken';

describe('Study Room Routes', () => {
  // Test users
  const testUser1 = {
    email: 'user1@test.com',
    fullName: 'Test User 1',
    password: 'password123',
    skillToTeach: 'JavaScript',
    skillToLearn: 'Python',
    skillsExchanged: 0
  };

  const testUser2 = {
    email: 'user2@test.com',
    fullName: 'Test User 2',
    password: 'password123',
    skillToTeach: 'Python',
    skillToLearn: 'JavaScript',
    skillsExchanged: 0
  };

  let token1: string;
  let token2: string;
  let user1: any;
  let user2: any;
  let roomId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI!);

    // Create test users
    user1 = await User.create(testUser1);
    user2 = await User.create(testUser2);

    // Generate tokens
    token1 = jwt.sign(
      { userId: user1._id, email: user1.email },
      process.env.JWT_SECRET!
    );
    token2 = jwt.sign(
      { userId: user2._id, email: user2.email },
      process.env.JWT_SECRET!
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await StudyRoom.deleteMany({});
    await Connection.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await StudyRoom.deleteMany({});
    await Connection.deleteMany({});
  });
});
