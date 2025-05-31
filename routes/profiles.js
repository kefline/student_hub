import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateProfile } from '../middlewares/validation.js';

const router = express.Router();

// Get profile
router.get('/me', authenticate, (req, res) => {
  // TODO: Get current user's profile
});

router.get('/:id', authenticate, (req, res) => {
  // TODO: Get profile by ID
});

// Update profile
router.put('/me', authenticate, validateProfile, (req, res) => {
  // TODO: Update current user's profile
});

// Education
router.post('/me/education', authenticate, (req, res) => {
  // TODO: Add education entry
});

router.put('/me/education/:id', authenticate, (req, res) => {
  // TODO: Update education entry
});

router.delete('/me/education/:id', authenticate, (req, res) => {
  // TODO: Delete education entry
});

// Experience
router.post('/me/experience', authenticate, (req, res) => {
  // TODO: Add experience entry
});

router.put('/me/experience/:id', authenticate, (req, res) => {
  // TODO: Update experience entry
});

router.delete('/me/experience/:id', authenticate, (req, res) => {
  // TODO: Delete experience entry
});

// Skills
router.post('/me/skills', authenticate, (req, res) => {
  // TODO: Add skills
});

router.delete('/me/skills/:skill', authenticate, (req, res) => {
  // TODO: Remove skill
});

// Portfolio
router.post('/me/portfolio', authenticate, (req, res) => {
  // TODO: Add portfolio item
});

router.put('/me/portfolio/:id', authenticate, (req, res) => {
  // TODO: Update portfolio item
});

router.delete('/me/portfolio/:id', authenticate, (req, res) => {
  // TODO: Delete portfolio item
});

// Admin routes
router.get('/', authenticate, authorize('admin'), (req, res) => {
  // TODO: Get all profiles (admin only)
});

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  // TODO: Update any profile (admin only)
});

export default router; 