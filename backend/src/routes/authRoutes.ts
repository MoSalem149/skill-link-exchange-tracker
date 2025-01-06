import express from 'express';
import { signup, login, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile', authenticateToken, updateProfile);

export default router;
