import express from 'express';
import { signup, login, updateProfile, getProfile, getAllUsers } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/users', authenticateToken, getAllUsers);

export default router;
