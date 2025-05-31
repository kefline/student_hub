import { verifyAccessToken } from '../utils/tokenManager.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found'); // Debug log
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token.substring(0, 20) + '...'); // Debug log - show first 20 chars

    const decoded = verifyAccessToken(token);
    console.log('Decoded token result:', decoded ? 'success' : 'failed'); // Debug log

    if (!decoded) {
      console.log('Token verification failed'); // Debug log
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    console.log('Decoded user:', { id: decoded.id, email: decoded.email, role: decoded.role }); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }
    next();
  };
}; 