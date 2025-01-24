import express from 'express';
import { studyRoomController } from '../controllers/studyRoomController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/rooms/user/:userEmail/active', studyRoomController.getUserActiveRoom);
router.post('/rooms', studyRoomController.createRoom);
router.get('/rooms/:roomId', studyRoomController.getRoom);
router.put('/rooms/:roomId/progress', studyRoomController.updateProgress);

export default router;
