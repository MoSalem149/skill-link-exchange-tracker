import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validateSignup, validateLogin } from '../validators/authValidators.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = validateSignup(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ error: validatedData.error });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
      skillToTeach: req.body.skillToTeach,
      skillToLearn: req.body.skillToLearn
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        skillToTeach: user.skillToTeach,
        skillToLearn: user.skillToLearn
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = validateLogin(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ error: validatedData.error });
    }

    // Find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId; // From auth middleware
    const updates = {
      ...(req.body.fullName && { fullName: req.body.fullName }),
      ...(req.body.skillToTeach && { skillToTeach: req.body.skillToTeach }),
      ...(req.body.skillToLearn && { skillToLearn: req.body.skillToLearn }),
      ...(req.body.password && { password: req.body.password })
    };

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        skillToTeach: user.skillToTeach,
        skillToLearn: user.skillToLearn
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
