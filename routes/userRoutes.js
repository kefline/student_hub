import express from 'express';
import UserController from '../controllers/UserController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRegistration, validateLogin } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, async (req, res) => {
  const result = await UserController.register(req.body);
  res.status(result.success ? 201 : 400).json(result);
});

router.post('/login', validateLogin, async (req, res) => {
  const { email, password } = req.body;
  const result = await UserController.login(email, password);
  res.status(result.success ? 200 : 401).json(result);
});

router.post('/social-auth/:provider', async (req, res) => {
  const result = await UserController.socialAuth(req.body);
  res.status(result.success ? 200 : 400).json(result);
});

router.get('/verify-email/:token', async (req, res) => {
  const result = await UserController.verifyEmail(req.params.token);
  res.status(result.success ? 200 : 400).json(result);
});

router.post('/forgot-password', async (req, res) => {
  const result = await UserController.requestPasswordReset(req.body.email);
  res.status(result.success ? 200 : 400).json(result);
});

router.post('/reset-password/:token', async (req, res) => {
  const result = await UserController.resetPassword(req.params.token, req.body.password);
  res.status(result.success ? 200 : 400).json(result);
});

// Protected routes
router.use(authenticate);

router.get('/me', async (req, res) => {
  const result = await UserController.getById(req.user.id);
  res.status(result.success ? 200 : 404).json(result);
});

router.put('/me', async (req, res) => {
  const result = await UserController.update(req.user.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
});

// Admin routes
router.get('/', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  const result = await UserController.getAll(req.query);
  res.status(result.success ? 200 : 400).json(result);
});

export default router; 