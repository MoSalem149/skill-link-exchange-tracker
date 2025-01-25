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

  describe('POST /connections/create', () => {
    it('should create a new connection request', async () => {
      const response = await request(app)
        .post('/connections/create')
        .set('Authorization', `Bearer ${token1}`)
        .send({ receiverEmail: testUser2.email });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('senderId', testUser1.email);
      expect(response.body).toHaveProperty('receiverId', testUser2.email);
      expect(response.body).toHaveProperty('status', ConnectionStatus.PENDING);
    });

    it('should not allow duplicate connections', async () => {
      // Create initial connection
      await Connection.create({
        senderId: testUser1.email,
        receiverId: testUser2.email,
        status: ConnectionStatus.PENDING
      });

      const response = await request(app)
        .post('/connections/create')
        .set('Authorization', `Bearer ${token1}`)
        .send({ receiverEmail: testUser2.email });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Connection already exists');
    });

    it('should return 404 for non-existent receiver', async () => {
      const response = await request(app)
        .post('/connections/create')
        .set('Authorization', `Bearer ${token1}`)
        .send({ receiverEmail: 'nonexistent@test.com' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Receiver not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/connections/create')
        .send({ receiverEmail: testUser2.email });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /connections/pending', () => {
    beforeEach(async () => {
      // Create pending connection
      await Connection.create({
        senderId: testUser1.email,
        receiverId: testUser2.email,
        status: ConnectionStatus.PENDING
      });
    });

    it('should return pending connections for receiver', async () => {
      const response = await request(app)
        .get('/connections/pending')
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('senderId.fullName', testUser1.fullName);
      expect(response.body[0]).toHaveProperty('status', ConnectionStatus.PENDING);
    });

    it('should not return accepted connections', async () => {
      await Connection.findOneAndUpdate(
        { senderId: testUser1.email },
        { status: ConnectionStatus.ACCEPTED }
      );

      const response = await request(app)
        .get('/connections/pending')
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/connections/pending');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /connections/:id', () => {
    let connectionId: string;

    beforeEach(async () => {
      // Create pending connection
      const connection = await Connection.create({
        senderId: testUser1.email,
        receiverId: testUser2.email,
        status: ConnectionStatus.PENDING
      });
      connectionId = connection._id.toString();
    });

    it('should accept a connection request', async () => {
      const response = await request(app)
        .put(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ status: ConnectionStatus.ACCEPTED });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', ConnectionStatus.ACCEPTED);

      // Check if connected users count was incremented
      const updatedUser1 = await User.findOne({ email: testUser1.email });
      const updatedUser2 = await User.findOne({ email: testUser2.email });
      expect(updatedUser1?.connectedUsers).toBe(1);
      expect(updatedUser2?.connectedUsers).toBe(1);
    });

    it('should reject a connection request', async () => {
      const response = await request(app)
        .put(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ status: ConnectionStatus.REJECTED });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', ConnectionStatus.REJECTED);

      // Check if connected users count remained the same
      const updatedUser1 = await User.findOne({ email: testUser1.email });
      const updatedUser2 = await User.findOne({ email: testUser2.email });
      expect(updatedUser1?.connectedUsers).toBe(0);
      expect(updatedUser2?.connectedUsers).toBe(0);
    });

    it('should not allow sender to accept their own request', async () => {
      const response = await request(app)
        .put(`/connections/${connectionId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ status: ConnectionStatus.ACCEPTED });

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent connection', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/connections/${fakeId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ status: ConnectionStatus.ACCEPTED });

      expect(response.status).toBe(404);
    });
  });
});
