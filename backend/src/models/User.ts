import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  skillToTeach: {
    type: String,
    required: true,
    trim: true,
  },
  skillToLearn: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profileImage: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  skillsExchanged: {
    type: Number,
    default: 0
  },
  connectedUsers: {
    type: Number,
    default: 0
  },
  messageCount: {
    type: Number,
    default: 0
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  fullName: string;
  role: "user" | "admin";
  profileImage: string;
  skillToTeach: string;
  skillToLearn: string;
  skillsExchanged: number;
  connectedUsers: number;
  messageCount: number;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const User = mongoose.model<IUser>('User', userSchema);
