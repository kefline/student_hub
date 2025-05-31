import express from 'express';
import userRoutes from './userRoutes.js';
import profileRoutes from './profileRoutes.js';
import jobRoutes from './jobRoutes.js';
import forumRoutes from './forumRoutes.js';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API routes
router.use('/api/users', userRoutes);
router.use('/api/profiles', profileRoutes);
router.use('/api/jobs', jobRoutes);
router.use('/api/forum', forumRoutes);

export default router; 