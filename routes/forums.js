import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validatePost, validateComment } from '../middlewares/validation.js';

const router = express.Router();

// Categories
router.get('/categories', (req, res) => {
  // TODO: Get forum categories
});

router.post('/categories', authenticate, authorize('admin'), (req, res) => {
  // TODO: Create category (admin only)
});

router.put('/categories/:id', authenticate, authorize('admin'), (req, res) => {
  // TODO: Update category (admin only)
});

// Posts
router.get('/posts', (req, res) => {
  // TODO: Get all posts
});

router.get('/posts/:id', (req, res) => {
  // TODO: Get post details
});

router.post('/posts', authenticate, validatePost, (req, res) => {
  // TODO: Create new post
});

router.put('/posts/:id', authenticate, validatePost, (req, res) => {
  // TODO: Update post
});

router.delete('/posts/:id', authenticate, (req, res) => {
  // TODO: Delete post
});

// Comments
router.get('/posts/:id/comments', (req, res) => {
  // TODO: Get post comments
});

router.post('/posts/:id/comments', authenticate, validateComment, (req, res) => {
  // TODO: Add comment
});

router.put('/comments/:id', authenticate, validateComment, (req, res) => {
  // TODO: Update comment
});

router.delete('/comments/:id', authenticate, (req, res) => {
  // TODO: Delete comment
});

// Reactions
router.post('/posts/:id/react', authenticate, (req, res) => {
  // TODO: React to post
});

router.post('/comments/:id/react', authenticate, (req, res) => {
  // TODO: React to comment
});

// Moderation
router.put('/posts/:id/status', authenticate, authorize('admin'), (req, res) => {
  // TODO: Update post status (admin only)
});

router.put('/comments/:id/status', authenticate, authorize('admin'), (req, res) => {
  // TODO: Update comment status (admin only)
});

// Search
router.get('/search', (req, res) => {
  // TODO: Search forums
});

export default router; 