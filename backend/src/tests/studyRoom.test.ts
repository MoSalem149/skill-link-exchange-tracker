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

  describe('POST /study/rooms', () => {
    it('should create a new study room', async () => {
      const roomData = {
        id: Date.now().toString(),
        participants: [testUser1.email, testUser2.email]
      };

      const response = await request(app)
        .post('/study/rooms')
        .set('Authorization', `Bearer ${token1}`)
        .send(roomData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', roomData.id);
      expect(response.body.participants).toContain(testUser1.email);
      expect(response.body.participants).toContain(testUser2.email);
      expect(response.body.progress).toBe(0);

      roomId = response.body.id;
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/study/rooms')
        .send({
          id: Date.now().toString(),
          participants: [testUser1.email, testUser2.email]
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /study/rooms/:roomId', () => {
    beforeEach(async () => {
      // Create a test room
      const room = await StudyRoom.create({
        id: Date.now().toString(),
        participants: [testUser1.email, testUser2.email],
        progress: 0,
        messages: [],
        meetings: []
      });
      roomId = room.id;
    });

    it('should get a study room by id', async () => {
      const response = await request(app)
        .get(`/study/rooms/${roomId}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', roomId);
      expect(response.body.participants).toContain(testUser1.email);
    });

    it('should return 404 for non-existent room', async () => {
      const response = await request(app)
        .get('/study/rooms/nonexistent')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /study/rooms/:roomId/progress', () => {
    beforeEach(async () => {
      // Create a test room
      const room = await StudyRoom.create({
        id: Date.now().toString(),
        participants: [testUser1.email, testUser2.email],
        progress: 0,
        messages: [],
        meetings: []
      });
      roomId = room.id;
    });

    it('should update room progress', async () => {
      const response = await request(app)
        .put(`/study/rooms/${roomId}/progress`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ progress: 50 });

      expect(response.status).toBe(200);
      expect(response.body.progress).toBe(50);
    });

    it('should handle room completion and update skills exchanged', async () => {
      const response = await request(app)
        .put(`/study/rooms/${roomId}/progress`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ progress: 100 });

      expect(response.status).toBe(200);
      expect(response.body.isCompleted).toBe(true);
      expect(response.body.completedAt).toBeDefined();

      // Check if users' skillsExchanged was incremented
      const updatedUser1 = await User.findOne({ email: testUser1.email });
      const updatedUser2 = await User.findOne({ email: testUser2.email });
      expect(updatedUser1?.skillsExchanged).toBe(1);
      expect(updatedUser2?.skillsExchanged).toBe(1);
    });

    it('should not complete room multiple times', async () => {
      // Complete room first time
      await request(app)
        .put(`/study/rooms/${roomId}/progress`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ progress: 100 });

      // Try to complete again
      const response = await request(app)
        .put(`/study/rooms/${roomId}/progress`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ progress: 100 });

      const user1 = await User.findOne({ email: testUser1.email });
      expect(user1?.skillsExchanged).toBe(1); // Should still be 1
    });
  });

  describe('GET /study/rooms/user/:userEmail/active', () => {
    it('should get active room for user', async () => {
      // Create an active room
      await StudyRoom.create({
        id: Date.now().toString(),
        participants: [testUser1.email, testUser2.email],
        progress: 50,
        isCompleted: false
      });

      const response = await request(app)
        .get(`/study/rooms/user/${testUser1.email}/active`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.hasActiveRoom).toBe(true);
      expect(response.body.room.participants).toContain(testUser1.email);
    });

    it('should create new room if user has connections but no active room', async () => {
      // Create a connection
      await Connection.create({
        senderId: testUser1.email,
        receiverId: testUser2.email,
        status: 'accepted'
      });

      const response = await request(app)
        .get(`/study/rooms/user/${testUser1.email}/active`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.hasActiveRoom).toBe(true);
      expect(response.body.isNewRoom).toBe(true);
      expect(response.body.room.participants).toContain(testUser1.email);
      expect(response.body.room.participants).toContain(testUser2.email);
    });

    it('should return no active room for user without connections', async () => {
      const response = await request(app)
        .get(`/study/rooms/user/${testUser1.email}/active`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.hasActiveRoom).toBe(false);
    });

    it('should require user email parameter', async () => {
      const response = await request(app)
        .get('/study/rooms/user//active')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(400);
    });
  });
});
