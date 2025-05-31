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

// Job proposal validation
export const validateProposal = [
  body('coverLetter').trim().notEmpty().isLength({ min: 50, max: 5000 })
    .withMessage('Cover letter must be between 50 and 5000 characters'),
  body('proposedRate').isNumeric().withMessage('Proposed rate must be a number'),
  body('availableStartDate').isISO8601().withMessage('Available start date must be a valid date'),
  body('estimatedDuration').isObject().withMessage('Estimated duration must be an object')
    .custom((value) => {
      if (!value.amount || !value.unit) {
        throw new Error('Duration must include amount and unit');
      }
      if (!['days', 'weeks', 'months'].includes(value.unit)) {
        throw new Error('Duration unit must be days, weeks, or months');
      }
      if (!Number.isInteger(value.amount) || value.amount <= 0) {
        throw new Error('Duration amount must be a positive integer');
      }
      return true;
    }),
  body('milestones').optional().isArray()
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every(milestone => 
        typeof milestone.title === 'string' &&
        typeof milestone.description === 'string' &&
        typeof milestone.duration === 'number' &&
        milestone.duration > 0
      );
    }).withMessage('Each milestone must have a title, description, and positive duration'),
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