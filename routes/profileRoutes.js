import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateProfile } from '../middlewares/validation.js';

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

// Get own profile
router.get('/me', async (req, res) => {
  const result = await ProfileController.getByUserId(req.user.id);
  res.status(result.success ? 200 : 404).json(result);
});

// Update own profile
router.put('/me', validateProfile, async (req, res) => {
  const result = await ProfileController.updateProfile(req.user.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
});

// Education routes
router.post('/me/education', async (req, res) => {
  const result = await ProfileController.addEducation(req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

// Experience routes
router.post('/me/experience', async (req, res) => {
  const result = await ProfileController.addExperience(req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

// Skills routes
router.put('/me/skills', async (req, res) => {
  const result = await ProfileController.updateSkills(req.user.id, req.body.skills);
  res.status(result.success ? 200 : 400).json(result);
});

// Portfolio routes
router.post('/me/portfolio', async (req, res) => {
  const result = await ProfileController.addPortfolioLink(req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

// Resume routes
router.put('/me/resume', async (req, res) => {
  const result = await ProfileController.updateResume(req.user.id, req.body.resumeUrl);
  res.status(result.success ? 200 : 400).json(result);
});

// Get profile by ID (public profiles)
router.get('/:id', async (req, res) => {
  const result = await ProfileController.getById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
});

// Search profiles
router.get('/', async (req, res) => {
  const result = await ProfileController.searchProfiles(req.query);
  res.status(result.success ? 200 : 400).json(result);
});

export default router; 