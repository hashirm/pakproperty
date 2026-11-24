import { Router } from 'express';
import {
  getAdminStats,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  toggleFeaturedProperty,
  getAllUsers,
} from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/dashboard', getAdminStats);
router.get('/properties/pending', getPendingProperties);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);
router.patch('/properties/:id/feature', toggleFeaturedProperty);
router.get('/users', getAllUsers);

export default router;
