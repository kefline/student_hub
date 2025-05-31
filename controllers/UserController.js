import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BaseController from './BaseController.js';
import { User, Profile } from '../models/index.js';

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  // Register a new user
  async register(userData) {
    try {
      const { email, password, role, firstName, lastName, ...otherData } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return {
          success: false,
          error: 'Email already registered'
        };
      }

      // Create user
      const user = await User.create({
        email,
        password,
        role,
        ...otherData
      });

      // Create profile
      await Profile.create({
        userId: user.id,
        firstName,
        lastName
      });

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user,
          token
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const user = await User.findOne({
        where: { email },
        include: [{
          model: Profile,
          as: 'profile'
        }]
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid password'
        };
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user,
          token
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Social login/register
  async socialAuth(profile) {
    try {
      const { provider, id: socialId, emails, displayName, photos } = profile;
      const email = emails[0].value;

      let user = await User.findOne({
        where: {
          email
        }
      });

      if (!user) {
        // Create new user
        user = await User.create({
          email,
          socialProvider: provider,
          socialId,
          isVerified: true
        });

        // Create profile
        const names = displayName.split(' ');
        await Profile.create({
          userId: user.id,
          firstName: names[0],
          lastName: names[1] || '',
          profilePhoto: photos[0]?.value
        });
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        data: {
          user,
          token
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      await user.update({ isVerified: true });

      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Reset password request
  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const token = this.generateToken(user, '1h');
      // TODO: Send password reset email with token

      return {
        success: true,
        message: 'Password reset instructions sent to email'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      await user.update({ password: newPassword });

      return {
        success: true,
        message: 'Password reset successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate JWT token
  generateToken(user, expiresIn = '7d') {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  }
}

export default new UserController(); 