import express from 'express';
import JobController from '../controllers/JobController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateJob, validateProposal } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  const result = await JobController.searchJobs(req.query);
  res.status(result.success ? 200 : 400).json(result);
});

router.get('/:id', async (req, res) => {
  const result = await JobController.getJobDetails(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
});

// Protected routes
router.use(authenticate);

// Employer routes
router.post('/', validateJob, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ success: false, error: 'Only employers can post jobs' });
  }
  const result = await JobController.createJob(req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

router.put('/:id', validateJob, async (req, res) => {
  const job = await JobController.getJobDetails(req.params.id);
  if (!job.success) {
    return res.status(404).json(job);
  }
  if (job.data.employerId !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  const result = await JobController.update(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
});

router.put('/:id/status', async (req, res) => {
  const job = await JobController.getJobDetails(req.params.id);
  if (!job.success) {
    return res.status(404).json(job);
  }
  if (job.data.employerId !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  const result = await JobController.updateJobStatus(req.params.id, req.body.status);
  res.status(result.success ? 200 : 400).json(result);
});

// Student/Freelancer routes
router.post('/:id/proposals', validateProposal, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, error: 'Only students can submit proposals' });
  }
  const result = await JobController.submitProposal(req.params.id, req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

// Employer - Proposal management
router.post('/:id/proposals/:proposalId/accept', async (req, res) => {
  const job = await JobController.getJobDetails(req.params.id);
  if (!job.success) {
    return res.status(404).json(job);
  }
  if (job.data.employerId !== req.user.id) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  const result = await JobController.acceptProposal(req.params.id, req.params.proposalId);
  res.status(result.success ? 200 : 400).json(result);
});

// Time tracking
router.post('/:id/time', async (req, res) => {
  const job = await JobController.getJobDetails(req.params.id);
  if (!job.success) {
    return res.status(404).json(job);
  }
  
  // Only assigned student can track time
  const proposal = job.data.proposals.find(p => 
    p.userId === req.user.id && p.status === 'accepted'
  );
  if (!proposal) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const result = await JobController.trackTime(req.params.id, req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

export default router; 