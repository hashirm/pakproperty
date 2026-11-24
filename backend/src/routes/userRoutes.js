import { Router } from 'express';
import {
  getMyProperties,
  getMyNotifications,
  markNotificationAsRead,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/properties', authenticate, getMyProperties);
router.get('/notifications', authenticate, getMyNotifications);
router.patch('/notifications/:id/read', authenticate, markNotificationAsRead);

export default router;
