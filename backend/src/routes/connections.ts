import { Router, Request } from 'express';
import { Connection, ConnectionStatus } from '../models/Connection.js';
import { User } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

// Add custom interface for Request with user
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  }
}

const router = Router();

// Create connection request
router.post('/create', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { receiverEmail } = req.body;
    const senderId = req.user.email;

    // Check if receiver exists
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { senderId, receiverId: receiverEmail },
        { senderId: receiverEmail, receiverId: senderId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({
        message: 'Connection already exists'
      });
    }

    // Create new connection
    const connection = new Connection({
      senderId,
      receiverId: receiverEmail,
      status: ConnectionStatus.PENDING
    });

    await connection.save();
    res.status(201).json(connection);

  } catch (error) {
    res.status(500).json({
      message: 'Error creating connection request'
    });
  }
});

// Get pending connections for current user
router.get('/pending', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userEmail = req.user.email;

    // Find pending connections where user is the receiver
    const pendingConnections = await Connection.aggregate([
      {
        $match: {
          receiverId: userEmail,
          status: ConnectionStatus.PENDING
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: 'email',
          as: 'senderId'
        }
      },
      {
        $unwind: '$senderId'
      },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          'senderId.fullName': 1,
          'senderId.skillToTeach': 1
        }
      }
    ]);

    res.json(pendingConnections);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching pending connections'
    });
  }
});

// Update connection status
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const { status } = req.body;
    const userEmail = req.user.email;

    const connection = await Connection.findById(id);

    if (!connection) {
      return res.status(404).json({
        message: 'Connection not found'
      });
    }

    // Verify the current user is the receiver
    if (connection.receiverId !== userEmail) {
      return res.status(403).json({
        message: 'Not authorized to update this connection'
      });
    }

    // Update connection status
    connection.status = status;
    await connection.save();

    // If accepted, increment connected users count for both users
    if (status === ConnectionStatus.ACCEPTED) {
      await User.updateOne(
        { email: connection.senderId },
        { $inc: { connectedUsers: 1 } }
      );

      await User.updateOne(
        { email: connection.receiverId },
        { $inc: { connectedUsers: 1 } }
      );
    }

    res.json(connection);

  } catch (error) {
    res.status(500).json({
      message: 'Error updating connection status'
    });
  }
});

// Get accepted connections for current user
router.get('/accepted', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userEmail = req.user.email;

    // Find accepted connections where user is either sender or receiver
    const acceptedConnections = await Connection.find({
      $or: [
        { senderId: userEmail, status: ConnectionStatus.ACCEPTED },
        { receiverId: userEmail, status: ConnectionStatus.ACCEPTED }
      ]
    });

    // Get unique user IDs from connections excluding current user
    const connectedUserEmails = acceptedConnections.reduce((emails: string[], conn) => {
      if (conn.senderId === userEmail) {
        emails.push(conn.receiverId);
      } else {
        emails.push(conn.senderId);
      }
      return emails;
    }, []);

    // Get user details for connected users
    const connectedUsers = await User.find({
      email: { $in: connectedUserEmails }
    }, 'fullName email skillToTeach skillToLearn');

    // Map connection data with user details
    const connectionsWithUsers = acceptedConnections.map(conn => {
      const otherUserEmail = conn.senderId === userEmail ? conn.receiverId : conn.senderId;
      const otherUser = connectedUsers.find(u => u.email === otherUserEmail);

      return {
        id: conn._id,
        senderId: conn.senderId,
        receiverId: conn.receiverId,
        status: conn.status,
        createdAt: conn.createdAt,
        connectedUser: otherUser
      };
    });

    res.json(connectionsWithUsers);

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching accepted connections'
    });
  }
});

export default router;
