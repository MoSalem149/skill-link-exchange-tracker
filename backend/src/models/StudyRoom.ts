import mongoose from 'mongoose';

const studyRoomSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  progress: {
    type: Number,
    default: 0
  },
  messages: [{
    from: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  meetings: [{
    date: Date,
    scheduled: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

export const StudyRoom = mongoose.model('StudyRoom', studyRoomSchema);
