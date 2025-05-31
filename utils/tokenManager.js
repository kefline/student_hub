import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../models/index.js';
import { Op } from 'sequelize';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret-key-123';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-key-456';

const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

export const generateTokens = async (user, req = null) => {
  try {
    // Generate access token
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Generate refresh token
    const refreshToken = uuidv4();
    const hashedRefreshToken = jwt.sign({ token: refreshToken }, REFRESH_TOKEN_SECRET);

    // Save refresh token to database
    await RefreshToken.create({
      user_id: user.id,
      token: hashedRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      issued_ip: req?.ip,
      browser: req?.headers?.['user-agent'],
      os: req?.headers?.['sec-ch-ua-platform']
    });

    return {
      accessToken,
      refreshToken: hashedRefreshToken
    };
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Error generating tokens');
  }
};

export const verifyAccessToken = (token) => {
  try {
    console.log('Verifying access token...'); // Debug log
    console.log('Using secret:', ACCESS_TOKEN_SECRET.substring(0, 10) + '...'); // Debug log - show first 10 chars

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    if (!decoded) {
      console.error('Token verification failed: decoded is null');
      return null;
    }

    console.log('Token verified successfully:', { 
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      exp: new Date(decoded.exp * 1000).toISOString()
    }); // Debug log

    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    console.error('Error name:', error.name); // Debug log
    console.error('Error stack:', error.stack); // Debug log
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    // Verify token signature first
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (!decoded) {
      console.error('Refresh token verification failed: decoded is null');
      return null;
    }

    // Find token in database
    const refreshTokenDoc = await RefreshToken.findOne({
      where: {
        token,
        is_revoked: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!refreshTokenDoc) {
      console.error('Refresh token not found in database or expired');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Refresh token verification error:', error.message);
    return null;
  }
};

export const revokeRefreshToken = async (token) => {
  try {
    await RefreshToken.update(
      { is_revoked: true },
      { where: { token } }
    );
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    throw new Error('Error revoking refresh token');
  }
};

export const revokeAllUserRefreshTokens = async (userId) => {
  try {
    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: userId } }
    );
  } catch (error) {
    console.error('Error revoking all refresh tokens:', error);
    throw new Error('Error revoking all refresh tokens');
  }
}; 