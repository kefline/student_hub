import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Payment Methods
router.get('/methods', authenticate, (req, res) => {
  // TODO: Get user's payment methods
});

router.post('/methods', authenticate, (req, res) => {
  // TODO: Add new payment method
});

router.put('/methods/:id', authenticate, (req, res) => {
  // TODO: Update payment method
});

router.delete('/methods/:id', authenticate, (req, res) => {
  // TODO: Delete payment method
});

router.post('/methods/:id/verify', authenticate, (req, res) => {
  // TODO: Verify payment method
});

router.post('/methods/:id/set-default', authenticate, (req, res) => {
  // TODO: Set default payment method
});

// Withdrawals
router.get('/withdrawals', authenticate, (req, res) => {
  // TODO: Get user's withdrawals
});

router.post('/withdrawals', authenticate, (req, res) => {
  // TODO: Request new withdrawal
});

router.get('/withdrawals/:id', authenticate, (req, res) => {
  // TODO: Get withdrawal details
});

// Admin routes
router.get('/admin/withdrawals', authenticate, authorize('admin'), (req, res) => {
  // TODO: Get all withdrawals (admin only)
});

router.put('/admin/withdrawals/:id', authenticate, authorize('admin'), (req, res) => {
  // TODO: Update withdrawal status (admin only)
});

// Webhook handlers
router.post('/webhooks/stripe', (req, res) => {
  // TODO: Handle Stripe webhooks
});

router.post('/webhooks/paypal', (req, res) => {
  // TODO: Handle PayPal webhooks
});

export default router; 