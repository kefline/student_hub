import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateJob } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  // TODO: Get all active jobs
});

router.get('/:id', (req, res) => {
  // TODO: Get job details
});

// Employer routes
router.post('/', authenticate, authorize('employer'), validateJob, (req, res) => {
  // TODO: Create new job
});

router.put('/:id', authenticate, authorize('employer'), validateJob, (req, res) => {
  // TODO: Update job
});

router.delete('/:id', authenticate, authorize('employer'), (req, res) => {
  // TODO: Delete job
});

router.get('/employer/my-jobs', authenticate, authorize('employer'), (req, res) => {
  // TODO: Get employer's jobs
});

// Proposals
router.get('/:id/proposals', authenticate, (req, res) => {
  // TODO: Get job proposals
});

router.post('/:id/proposals', authenticate, authorize('student'), (req, res) => {
  // TODO: Submit proposal
});

router.put('/:id/proposals/:proposalId', authenticate, (req, res) => {
  // TODO: Update proposal
});

// Time tracking
router.post('/:id/time', authenticate, (req, res) => {
  // TODO: Log time for job
});

router.get('/:id/time', authenticate, (req, res) => {
  // TODO: Get time logs for job
});

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), (req, res) => {
  // TODO: Get all jobs including inactive (admin only)
});

router.put('/admin/:id/status', authenticate, authorize('admin'), (req, res) => {
  // TODO: Update job status (admin only)
});

// Search and filters
router.get('/search', (req, res) => {
  // TODO: Search jobs
});

router.get('/categories', (req, res) => {
  // TODO: Get job categories
});

router.get('/skills', (req, res) => {
  // TODO: Get job skills
});

export default router; 