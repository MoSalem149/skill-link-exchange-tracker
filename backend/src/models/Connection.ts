import { Schema, model } from 'mongoose';

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

const connectionSchema = new Schema({
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: Object.values(ConnectionStatus),
    default: ConnectionStatus.PENDING
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Connection = model('Connection', connectionSchema);
