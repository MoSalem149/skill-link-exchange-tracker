import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectionsRouter from './routes/connections.js';
import readline from 'readline';


dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skilllink';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionsRouter);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const promptConnectionType = (): Promise<string> => {
  return new Promise((resolve) => {
    rl.question('Choose connection type (1 for local, 2 for cloud): ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const getConnectionType = (): 'local' | 'cloud' => {
  const args = process.argv;
  const connectionType = args[2]; // Get the first argument after the script name

  if (connectionType === 'local' || connectionType === 'cloud') {
    return connectionType;
  }

  // Default to cloud if no valid argument is provided
  return 'cloud';
};

const connectToMongoDB = async () => {
  try {
    const connectionType = getConnectionType();
    let uri: string;
    let options = {};

    if (connectionType === 'local') {
      // Local connection
      uri = 'mongodb://127.0.0.1:27017/skilllink';
      options = { directConnection: true };
      console.log('Connecting to local MongoDB...');
    } else {
      // Cloud connection
      uri = process.env.MONGODB_URI || '';
      if (!uri) {
        throw new Error('MONGODB_URI environment variable is not set');
      }
      console.log('Connecting to cloud MongoDB...');
    }

    await mongoose.connect(uri, options);
    console.log('Connected to MongoDB');

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize connection
connectToMongoDB();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});
