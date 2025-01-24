import { Request, Response } from 'express';
import { StudyRoom } from '../models/StudyRoom.js';

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
      const room = await StudyRoom.findOneAndUpdate(
        { id: roomId },
        { progress },
        { new: true }
      );
      if (!room) {
        return res.status(404).json({ error: 'Study room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update progress' });
    }
  }
};
