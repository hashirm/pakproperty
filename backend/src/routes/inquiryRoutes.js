import { Router } from 'express';
import {
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuthenticate, createInquiry);
router.get('/my-inquiries', authenticate, getMyInquiries);
router.patch('/:id/status', authenticate, updateInquiryStatus);

export default router;
