import { Router } from 'express';
import {
  getProperties,
  getFeaturedProperties,
  getCityStats,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/stats/cities', getCityStats);
router.get('/:id', optionalAuthenticate, getPropertyById);
router.post('/', authenticate, createProperty);
router.patch('/:id', authenticate, updateProperty);
router.delete('/:id', authenticate, deleteProperty);

export default router;
