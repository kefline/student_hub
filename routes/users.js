import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validateRegistration, validateLogin } from '../middlewares/validation.js';
import { User, Profile, RefreshToken } from '../models/index.js';
import { generateTokens, verifyRefreshToken, revokeRefreshToken, revokeAllUserRefreshTokens } from '../utils/tokenManager.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Public routes
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password, // Password will be hashed by model hook
      firstName,
      lastName,
      role
    });

    // Create profile
    await Profile.create({
      user_id: user.id,
      firstName,
      lastName
    });

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user, req);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Error registering user'
    });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user, req);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging in'
    });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }

    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Revoke old refresh token
    await revokeRefreshToken(refreshToken);

    // Generate new tokens
    const tokens = await generateTokens(user, req);

    res.json({
      success: true,
      data: {
        tokens
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Error refreshing token'
    });
  }
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revoke specific refresh token
      await revokeRefreshToken(refreshToken);
    } else {
      // Revoke all refresh tokens for the user
      await revokeAllUserRefreshTokens(req.user.id);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Error logging out'
    });
  }
});

router.post('/forgot-password', (req, res) => {
  // TODO: Implement forgot password
});

router.post('/reset-password', (req, res) => {
  // TODO: Implement reset password
});

// Protected routes
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Profile,
        as: 'profile',
        attributes: { exclude: ['created_at', 'updated_at'] }
      }],
      attributes: { exclude: ['password', 'created_at', 'updated_at'] }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user data'
    });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByPk(req.user.id);

    // Update user
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email
    });

    // Update profile if it exists
    const profile = await Profile.findOne({ where: { user_id: user.id } });
    if (profile) {
      await profile.update({
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating user'
    });
  }
});

// Admin routes
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Profile,
        as: 'profile',
        attributes: { exclude: ['created_at', 'updated_at'] }
      }],
      attributes: { exclude: ['password', 'created_at', 'updated_at'] }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching users'
    });
  }
});

router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Profile,
        as: 'profile',
        attributes: { exclude: ['created_at', 'updated_at'] }
      }],
      attributes: { exclude: ['password', 'created_at', 'updated_at'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user'
    });
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { firstName, lastName, email, role, isActive } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      role: role || user.role,
      isActive: isActive !== undefined ? isActive : user.isActive
    });

    // Update profile if it exists
    const profile = await Profile.findOne({ where: { user_id: user.id } });
    if (profile) {
      await profile.update({
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating user'
    });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete user (this will cascade to profile due to associations)
    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting user'
    });
  }
});

export default router; 