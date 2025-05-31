import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from '../models/index.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret';

const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

export const generateTokens = async (user, req = null) => {
  // Generate access token
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
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
    browser: req?.headers['user-agent'],
    os: req?.headers['sec-ch-ua-platform']
  });

  return {
    accessToken,
    refreshToken: hashedRefreshToken
  };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token) => {
  try {
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
      return null;
    }

    // Verify token signature
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const revokeRefreshToken = async (token) => {
  await RefreshToken.update(
    { is_revoked: true },
    { where: { token } }
  );
};

export const revokeAllUserRefreshTokens = async (userId) => {
  await RefreshToken.update(
    { is_revoked: true },
    { where: { user_id: userId } }
  );
}; 