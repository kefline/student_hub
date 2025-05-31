import express from 'express';
import ForumController from '../controllers/ForumController.js';
import { authenticate } from '../middlewares/auth.js';
import { validatePost, validateComment } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  const result = await ForumController.searchPosts(req.query);
  res.status(result.success ? 200 : 400).json(result);
});

router.get('/:id', async (req, res) => {
  const result = await ForumController.getPostDetails(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
});

// Protected routes
router.use(authenticate);

// Create post
router.post('/', validatePost, async (req, res) => {
  const result = await ForumController.createPost(req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

// Update post
router.put('/:id', validatePost, async (req, res) => {
  const post = await ForumController.getPostDetails(req.params.id);
  if (!post.success) {
    return res.status(404).json(post);
  }
  if (post.data.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  const result = await ForumController.update(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
});

// Delete post
router.delete('/:id', async (req, res) => {
  const post = await ForumController.getPostDetails(req.params.id);
  if (!post.success) {
    return res.status(404).json(post);
  }
  if (post.data.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  const result = await ForumController.delete(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
});

// Comments
router.post('/:id/comments', validateComment, async (req, res) => {
  const result = await ForumController.addComment(req.params.id, req.user.id, req.body);
  res.status(result.success ? 201 : 400).json(result);
});

// Likes
router.post('/:id/like', async (req, res) => {
  const result = await ForumController.likePost(req.params.id, req.user.id);
  res.status(result.success ? 200 : 400).json(result);
});

// Share
router.post('/:id/share', async (req, res) => {
  const result = await ForumController.sharePost(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
});

// Report post
router.post('/:id/report', async (req, res) => {
  const result = await ForumController.reportPost(req.params.id, {
    reportedBy: req.user.id,
    reason: req.body.reason,
    details: req.body.details,
    reportedAt: new Date()
  });
  res.status(result.success ? 200 : 400).json(result);
});

export default router; 