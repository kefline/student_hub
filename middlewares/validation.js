import { body, validationResult } from 'express-validator';

// Helper function to handle validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validation
export const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('role').isIn(['student', 'employer', 'staff', 'mentor']),
  handleValidation
];

// User login validation
export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidation
];

// Profile validation
export const validateProfile = [
  body('bio').optional().trim(),
  body('location').optional().trim(),
  body('phone').optional().isMobilePhone('any'),
  body('website').optional().isURL(),
  body('socialLinks').optional().isObject(),
  body('skills').optional().isArray(),
  handleValidation
];

// Job validation
export const validateJob = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('requirements').isArray(),
  body('type').isIn(['full-time', 'part-time', 'contract', 'internship']),
  body('location').trim().notEmpty(),
  body('salary').optional().isObject(),
  body('skills').isArray(),
  body('deadline').optional().isISO8601(),
  handleValidation
];

// Forum post validation
export const validatePost = [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  body('categoryId').isUUID(),
  body('tags').optional().isArray(),
  handleValidation
];

// Forum comment validation
export const validateComment = [
  body('content').trim().notEmpty(),
  handleValidation
]; 