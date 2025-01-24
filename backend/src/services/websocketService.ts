import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../middleware/auth.js';
import { StudyRoom } from '../models/StudyRoom.js';
import { User } from '../models/User.js';

interface ConnectedUser {
  email: string;
  fullName: string;
  online: boolean;
}

export const initializeWebSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:8080',
      methods: ['GET', 'POST']
    }
  });

  // Store connected users by room
  const roomUsers = new Map<string, Set<string>>();

  // Store socket to user mapping
  const userSockets = new Map<string, string>();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = await verifyToken(token);
      socket.data.userId = decoded.userId;
      socket.data.email = decoded.email;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userEmail = socket.data.email;

    socket.on('joinStudyRoom', async ({ roomId, userEmail }) => {
      try {
        // Get user details
        const user = await User.findOne({ email: userEmail });
        if (!user) throw new Error('User not found');

        // Join the room
        socket.join(`room_${roomId}`);

        // Initialize room users set if it doesn't exist
        if (!roomUsers.has(`room_${roomId}`)) {
          roomUsers.set(`room_${roomId}`, new Set());
        }

        // Add user to room
        roomUsers.get(`room_${roomId}`)?.add(userEmail);
        userSockets.set(userEmail, socket.id);

        // Get all connected users in the room
        const connectedUsers: ConnectedUser[] = await Promise.all(
          Array.from(roomUsers.get(`room_${roomId}`) || []).map(async (email) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');
            return {
              email: user.email,
              fullName: user.fullName,
              online: true
            };
          })
        ).then(users => users.filter((user): user is ConnectedUser => user !== null));

        // Notify all users in the room about the new user
        io.to(`room_${roomId}`).emit('userJoined', connectedUsers);

        // Send existing messages
        const studyRoom = await StudyRoom.findOne({ id: roomId });
        if (studyRoom) {
          socket.emit('previousMessages', studyRoom.messages);
        }
      } catch (error) {
        console.error('Error joining study room:', error);
        socket.emit('error', 'Failed to join study room');
      }
    });

    socket.on('sendMessage', async ({ roomId, message }) => {
      try {
        // Save message to database
        await StudyRoom.findOneAndUpdate(
          { id: roomId },
          {
            $push: { messages: message },
          },
          { upsert: true }
        );

        // Broadcast message to all users in the room
        socket.to(`room_${roomId}`).emit('newMessage', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('leaveStudyRoom', async ({ roomId, userEmail }) => {
      try {
        // Remove user from room
        socket.leave(`room_${roomId}`);
        roomUsers.get(`room_${roomId}`)?.delete(userEmail);
        userSockets.delete(userEmail);

        // Get updated list of connected users
        const connectedUsers: ConnectedUser[] = await Promise.all(
          Array.from(roomUsers.get(`room_${roomId}`) || []).map(async (email) => {
            const user = await User.findOne({ email });
            return {
              email: user!.email,
              fullName: user!.fullName,
              online: true
            };
          })
        );

        // Notify remaining users
        io.to(`room_${roomId}`).emit('userLeft', connectedUsers);
      } catch (error) {
        console.error('Error leaving study room:', error);
      }
    });

    socket.on('scheduleMeeting', async ({ roomId, meeting }) => {
      try {
        await StudyRoom.findOneAndUpdate(
          { id: roomId },
          { $push: { meetings: meeting } },
          { upsert: true }
        );

        // Broadcast to all users in the room
        io.to(`room_${roomId}`).emit('meetingScheduled', meeting);
      } catch (error) {
        console.error('Error scheduling meeting:', error);
        socket.emit('error', 'Failed to schedule meeting');
      }
    });

    socket.on('disconnect', async () => {
      // Handle user disconnection
      const roomsToUpdate = [];
      for (const [roomId, users] of roomUsers.entries()) {
        if (users.has(userEmail)) {
          users.delete(userEmail);
          roomsToUpdate.push(roomId);
        }
      }

      // Update connected users for affected rooms
      for (const roomId of roomsToUpdate) {
        const connectedUsers: ConnectedUser[] = await Promise.all(
          Array.from(roomUsers.get(roomId) || []).map(async (email) => {
            const user = await User.findOne({ email });
            return {
              email: user!.email,
              fullName: user!.fullName,
              online: true
            };
          })
        );
        io.to(roomId).emit('userLeft', connectedUsers);
      }

      userSockets.delete(userEmail);
    });
  });

  return io;
};
