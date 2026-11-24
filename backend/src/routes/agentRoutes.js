import { Router } from 'express';
import {
  getAgents,
  getAgentById,
  createAgentReview,
} from '../controllers/agentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getAgents);
router.get('/:id', getAgentById);
router.post('/:id/reviews', authenticate, createAgentReview);

export default router;
