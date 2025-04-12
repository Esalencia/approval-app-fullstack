import express from 'express';
import {
  uploadDocument,
  getDocument,
  checkCompliance,
  downloadDocument,
  getUserDocuments,
  deleteDocument,
  addReview,
  getDocumentReviews,
  updateDocumentStatus
} from '../controllers/documentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

// Document CRUD routes
router.post('/', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getUserDocuments);
router.get('/:id', protect, getDocument);
router.delete('/:id', protect, deleteDocument);
router.get('/:id/download', protect, downloadDocument);

// Compliance routes
router.get('/:id/compliance', protect, checkCompliance);

// Review routes
router.post('/:id/reviews', protect, addReview);
router.get('/:id/reviews', protect, getDocumentReviews);

// Status management
router.put('/:id/status', protect, updateDocumentStatus);

export default router;