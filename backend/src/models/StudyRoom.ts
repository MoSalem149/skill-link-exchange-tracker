import mongoose from 'mongoose';

const studyRoomSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  participants: [{
    type: String,
    required: true
  }],
  progress: {
    type: Number,
    default: 0
  },
  messages: [{
    from: String,
    content: String,
    timestamp: Date
  }],
  meetings: [{
    date: Date,
    scheduled: Date
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

export const StudyRoom = mongoose.model('StudyRoom', studyRoomSchema);
