import express from 'express';
import crypto from 'crypto';
import ProfileController from '../controllers/ProfileController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateProfile } from '../middlewares/validation.js';

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

// Get own profile
router.get('/me', async (req, res) => {
  try {
    // Add cache headers
    res.set('Cache-Control', 'private, max-age=300'); // Cache for 5 minutes

    const result = await ProfileController.getByUserId(req.user.id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    // Add ETag for caching
    const etag = crypto
      .createHash('md5')
      .update(JSON.stringify(result.data))
      .digest('hex');
    
    res.set('ETag', `"${etag}"`);

    // Check if client has a valid cached version
    if (req.headers['if-none-match'] === `"${etag}"`) {
      return res.status(304).end();
    }

    return res.json(result);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update own profile
router.put('/me', validateProfile, async (req, res) => {
  const result = await ProfileController.updateProfile(req.user.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
});

// Education routes
// Add new education entry
router.post('/me/education', async (req, res) => {
  try {
    console.log('Adding education with data:', req.body);

    // Validate education data structure
    const requiredFields = ['institution', 'degree', 'field', 'startDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate dates
    const startDate = new Date(req.body.startDate);
    if (req.body.endDate) {
      const endDate = new Date(req.body.endDate);
      if (endDate < startDate) {
        return res.status(400).json({
          success: false,
          error: 'End date cannot be before start date'
        });
      }
    }

    // Create education entry
    const educationEntry = {
      institution: req.body.institution,
      degree: req.body.degree,
      field: req.body.field,
      startDate: req.body.startDate,
      endDate: req.body.endDate || null,
      grade: req.body.grade || null,
      description: req.body.description || null,
      current: req.body.current || false
    };

    const result = await ProfileController.addEducation(req.user.id, educationEntry);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Education add error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all education entries
router.get('/me/education', async (req, res) => {
  try {
    const result = await ProfileController.getEducation(req.user.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Education fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update specific education entry
router.put('/me/education/:id', async (req, res) => {
  try {
    const result = await ProfileController.updateEducation(req.user.id, req.params.id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Education update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Delete specific education entry
router.delete('/me/education/:id', async (req, res) => {
  try {
    const result = await ProfileController.deleteEducation(req.user.id, req.params.id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Education delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Experience routes
router.get('/me/experience', async (req, res) => {
  try {
    const result = await ProfileController.getExperience(req.user.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Experience fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/me/experience', async (req, res) => {
  try {
    // Validate experience data
    const requiredFields = ['company', 'position', 'startDate'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const result = await ProfileController.addExperience(req.user.id, req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Experience add error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.put('/me/experience/:id', async (req, res) => {
  try {
    const result = await ProfileController.updateExperience(req.user.id, req.params.id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Experience update error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.delete('/me/experience/:id', async (req, res) => {
  try {
    const result = await ProfileController.deleteExperience(req.user.id, req.params.id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Experience delete error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Skills routes
router.get('/me/skills', async (req, res) => {
  try {
    const result = await ProfileController.getSkills(req.user.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Skills fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/me/skills', async (req, res) => {
  try {
    if (!req.body.skills || !Array.isArray(req.body.skills)) {
      return res.status(400).json({
        success: false,
        error: 'Skills must be provided as an array'
      });
    }

    const result = await ProfileController.addSkills(req.user.id, req.body.skills);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Skills add error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.delete('/me/skills/:skill', async (req, res) => {
  try {
    const result = await ProfileController.deleteSkill(req.user.id, req.params.skill);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Skill delete error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Portfolio routes
router.get('/me/portfolio', async (req, res) => {
  try {
    const result = await ProfileController.getPortfolio(req.user.id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/me/portfolio', async (req, res) => {
  try {
    const requiredFields = ['title', 'description', 'url'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const result = await ProfileController.addPortfolio(req.user.id, req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Portfolio add error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.put('/me/portfolio/:id', async (req, res) => {
  try {
    const result = await ProfileController.updatePortfolio(req.user.id, req.params.id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Portfolio update error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.delete('/me/portfolio/:id', async (req, res) => {
  try {
    const result = await ProfileController.deletePortfolio(req.user.id, req.params.id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Portfolio delete error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Resume routes
router.put('/me/resume', async (req, res) => {
  const result = await ProfileController.updateResume(req.user.id, req.body.resumeUrl);
  res.status(result.success ? 200 : 400).json(result);
});

// Get profile by ID (public profiles)
router.get('/:id', async (req, res) => {
  const result = await ProfileController.getById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
});

// Search profiles
router.get('/', async (req, res) => {
  const result = await ProfileController.searchProfiles(req.query);
  res.status(result.success ? 200 : 400).json(result);
});

export default router; 