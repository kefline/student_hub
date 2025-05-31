import BaseController from './BaseController.js';
import { Profile, User } from '../models/index.js';

class ProfileController extends BaseController {
  constructor() {
    super(Profile);
  }

  // Get profile by user ID
  async getByUserId(userId) {
    try {
      const profile = await Profile.findOne({
        where: { userId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'role', 'isVerified', 'isActive']
        }]
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update profile
  async updateProfile(userId, profileData) {
    try {
      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      await profile.update(profileData);

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add education
  async addEducation(userId, educationData) {
    try {
      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      const education = profile.education || [];
      education.push({
        ...educationData,
        id: Date.now().toString()
      });

      await profile.update({ education });

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add experience
  async addExperience(userId, experienceData) {
    try {
      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      const experience = profile.experience || [];
      experience.push({
        ...experienceData,
        id: Date.now().toString()
      });

      await profile.update({ experience });

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update skills
  async updateSkills(userId, skills) {
    try {
      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      await profile.update({ skills });

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add portfolio link
  async addPortfolioLink(userId, linkData) {
    try {
      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      const portfolioLinks = profile.portfolioLinks || [];
      portfolioLinks.push({
        ...linkData,
        id: Date.now().toString()
      });

      await profile.update({ portfolioLinks });

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update resume
  async updateResume(userId, resumeUrl) {
    try {
      const profile = await Profile.findOne({ where: { userId } });
      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      await profile.update({
        resume: {
          url: resumeUrl,
          lastUpdated: new Date()
        }
      });

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search profiles
  async searchProfiles(query) {
    try {
      const { skills, role, location, page = 1, limit = 10 } = query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      const include = [{
        model: User,
        as: 'user',
        attributes: ['email', 'role', 'isVerified', 'isActive'],
        where: role ? { role } : {}
      }];

      const profiles = await Profile.findAndCountAll({
        where: whereClause,
        include,
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        success: true,
        data: profiles.rows,
        pagination: {
          total: profiles.count,
          page: parseInt(page),
          pages: Math.ceil(profiles.count / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new ProfileController(); 