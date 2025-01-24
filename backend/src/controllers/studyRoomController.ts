import { Request, Response } from 'express';
import { StudyRoom } from '../models/StudyRoom.js';
import { User } from '../models/User.js';
import { Connection } from '../models/Connection.js';

export const studyRoomController = {
  async createRoom(req: Request, res: Response) {
    try {
      const { id, participants } = req.body;
      const room = new StudyRoom({
        id,
        participants,
        progress: 0,
        messages: [],
        meetings: []
      });
      await room.save();
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create study room' });
    }
  },

  async getRoom(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const room = await StudyRoom.findOne({ id: roomId });
      if (!room) {
        return res.status(404).json({ error: 'Study room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get study room' });
    }
  },

  async updateProgress(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const { progress } = req.body;

      const room = await StudyRoom.findOne({ id: roomId });
      if (!room) {
        return res.status(404).json({ error: 'Study room not found' });
      }

      room.progress = progress;

      // Check if room is completed
      if (progress === 100 && !room.isCompleted) {
        room.isCompleted = true;
        room.completedAt = new Date();

        // Get all participants' user documents
        const participants = await User.find({
          email: { $in: room.participants }
        });

        // Update each participant's skillsExchanged count
        for (const participant of participants) {
          participant.skillsExchanged = (participant.skillsExchanged || 0) + 1;
          await participant.save();
        }

        // Save the completed room
        await room.save();

        return res.json({
          ...room.toObject(),
          participants: participants.map(p => ({
            _id: p._id,
            email: p.email,
            fullName: p.fullName,
            skillsExchanged: p.skillsExchanged
          }))
        });
      }

      await room.save();
      res.json(room);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  },

  async getUserActiveRoom(req: Request, res: Response) {
    try {
      const userEmail = req.params.userEmail;

      if (!userEmail) {
        return res.status(400).json({ error: 'User email is required' });
      }

      // First try to find an active room
      const existingRoom = await StudyRoom.findOne({
        participants: userEmail,
        isCompleted: false
      }).sort({ createdAt: -1 });

      if (existingRoom) {
        return res.json({
          hasActiveRoom: true,
          room: existingRoom
        });
      }

      // If no active room, get user's connections
      const connections = await Connection.find({
        $or: [
          { senderId: userEmail, status: 'accepted' },
          { receiverId: userEmail, status: 'accepted' }
        ]
      });

      // Extract connected users' emails
      const connectedUsers = connections.map(conn =>
        conn.senderId === userEmail ? conn.receiverId : conn.senderId
      );

      // Create new room only if there are connected users
      if (connectedUsers.length > 0) {
        const newRoom = new StudyRoom({
          id: Date.now(),
          participants: [userEmail, ...connectedUsers],
          progress: 0,
          messages: [],
          meetings: [],
          isCompleted: false
        });

        await newRoom.save();

        return res.json({
          hasActiveRoom: true,
          room: newRoom,
          isNewRoom: true
        });
      }

      // Return no active room if user has no connections
      return res.json({
        hasActiveRoom: false,
        message: 'No active room and no connections found'
      });

    } catch (error) {
      console.error('Error in getUserActiveRoom:', error);
      res.status(500).json({
        error: 'Failed to handle user room',
        details: error
      });
    }
  }
};
