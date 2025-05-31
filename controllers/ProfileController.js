import BaseController from './BaseController.js';
import { Profile, User } from '../models/index.js';

class ProfileController extends BaseController {
  constructor() {
    super(Profile);
  }

  // Get profile by user ID
  async getByUserId(userId) {
    try {
      // Get complete profile with all fields
      const profile = await Profile.findOne({
        where: { user_id: userId },
        include: [{
          model: User,
          as: 'profileOwner',
          attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isVerified', 'isActive']
        }]
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      // Format the response
      const formattedProfile = {
        ...profile.get({ plain: true }),
        user: profile.profileOwner // Rename profileOwner to user in response
      };
      delete formattedProfile.profileOwner; // Remove the original profileOwner field

      return {
        success: true,
        data: formattedProfile
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update profile
  async updateProfile(userId, profileData) {
    try {
      const profile = await Profile.findOne({ 
        where: { user_id: userId }  // Fix: changed userId to user_id
      });
      
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
      console.log('ProfileController: Adding education for user:', userId);
      console.log('Education data received:', educationData);

      const profile = await Profile.findOne({ 
        where: { user_id: userId }
      });
      
      if (!profile) {
        console.log('Profile not found for user:', userId);
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      // Get current education array or initialize if null
      let currentEducation = profile.education || [];
      if (!Array.isArray(currentEducation)) {
        currentEducation = [];
      }

      // Create new education entry
      const newEducation = {
        id: Date.now().toString(),
        ...educationData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to education array
      currentEducation.push(newEducation);

      // Sort by start date (most recent first)
      currentEducation.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      // Update profile with new education array
      const [updated] = await Profile.update(
        { 
          education: currentEducation,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId },
          returning: true
        }
      );

      if (!updated) {
        throw new Error('Failed to update profile');
      }

      // Fetch updated profile
      const updatedProfile = await Profile.findOne({
        where: { user_id: userId },
        include: [{
          model: User,
          as: 'profileOwner',
          attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isVerified', 'isActive']
        }]
      });

      // Format response
      const formattedProfile = {
        ...updatedProfile.get({ plain: true }),
        user: updatedProfile.profileOwner
      };
      delete formattedProfile.profileOwner;

      return {
        success: true,
        data: formattedProfile
      };
    } catch (error) {
      console.error('Add education error:', error);
      return {
        success: false,
        error: error.message || 'Error adding education'
      };
    }
  }

  // Experience Methods
  async getExperience(userId) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId },
        attributes: ['experience']
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return {
        success: true,
        data: profile.experience || []
      };
    } catch (error) {
      console.error('Get experience error:', error);
      return {
        success: false,
        error: error.message || 'Error fetching experience'
      };
    }
  }

  async addExperience(userId, experienceData) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let experience = profile.experience || [];
      if (!Array.isArray(experience)) {
        experience = [];
      }

      const newExperience = {
        id: Date.now().toString(),
        ...experienceData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      experience.push(newExperience);
      experience.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      await Profile.update(
        { 
          experience,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Add experience error:', error);
      return {
        success: false,
        error: error.message || 'Error adding experience'
      };
    }
  }

  async updateExperience(userId, experienceId, updateData) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let experience = profile.experience || [];
      const index = experience.findIndex(exp => exp.id === experienceId);

      if (index === -1) {
        return {
          success: false,
          error: 'Experience entry not found'
        };
      }

      experience[index] = {
        ...experience[index],
        ...updateData,
        updated_at: new Date().toISOString()
      };

      experience.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      await Profile.update(
        { 
          experience,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Update experience error:', error);
      return {
        success: false,
        error: error.message || 'Error updating experience'
      };
    }
  }

  async deleteExperience(userId, experienceId) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let experience = profile.experience || [];
      const index = experience.findIndex(exp => exp.id === experienceId);

      if (index === -1) {
        return {
          success: false,
          error: 'Experience entry not found'
        };
      }

      experience.splice(index, 1);

      await Profile.update(
        { 
          experience,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Delete experience error:', error);
      return {
        success: false,
        error: error.message || 'Error deleting experience'
      };
    }
  }

  // Skills Methods
  async getSkills(userId) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId },
        attributes: ['skills']
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return {
        success: true,
        data: profile.skills || []
      };
    } catch (error) {
      console.error('Get skills error:', error);
      return {
        success: false,
        error: error.message || 'Error fetching skills'
      };
    }
  }

  async addSkills(userId, newSkills) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let skills = new Set(profile.skills || []);
      newSkills.forEach(skill => skills.add(skill));

      await Profile.update(
        { 
          skills: Array.from(skills),
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Add skills error:', error);
      return {
        success: false,
        error: error.message || 'Error adding skills'
      };
    }
  }

  async deleteSkill(userId, skill) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let skills = new Set(profile.skills || []);
      skills.delete(skill);

      await Profile.update(
        { 
          skills: Array.from(skills),
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Delete skill error:', error);
      return {
        success: false,
        error: error.message || 'Error deleting skill'
      };
    }
  }

  // Portfolio Methods
  async getPortfolio(userId) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId },
        attributes: ['portfolio']
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return {
        success: true,
        data: profile.portfolio || []
      };
    } catch (error) {
      console.error('Get portfolio error:', error);
      return {
        success: false,
        error: error.message || 'Error fetching portfolio'
      };
    }
  }

  async addPortfolio(userId, portfolioData) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let portfolio = profile.portfolio || [];
      if (!Array.isArray(portfolio)) {
        portfolio = [];
      }

      const newPortfolio = {
        id: Date.now().toString(),
        ...portfolioData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      portfolio.push(newPortfolio);

      await Profile.update(
        { 
          portfolio,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Add portfolio error:', error);
      return {
        success: false,
        error: error.message || 'Error adding portfolio'
      };
    }
  }

  async updatePortfolio(userId, portfolioId, updateData) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let portfolio = profile.portfolio || [];
      const index = portfolio.findIndex(item => item.id === portfolioId);

      if (index === -1) {
        return {
          success: false,
          error: 'Portfolio entry not found'
        };
      }

      portfolio[index] = {
        ...portfolio[index],
        ...updateData,
        updated_at: new Date().toISOString()
      };

      await Profile.update(
        { 
          portfolio,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Update portfolio error:', error);
      return {
        success: false,
        error: error.message || 'Error updating portfolio'
      };
    }
  }

  async deletePortfolio(userId, portfolioId) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let portfolio = profile.portfolio || [];
      const index = portfolio.findIndex(item => item.id === portfolioId);

      if (index === -1) {
        return {
          success: false,
          error: 'Portfolio entry not found'
        };
      }

      portfolio.splice(index, 1);

      await Profile.update(
        { 
          portfolio,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Delete portfolio error:', error);
      return {
        success: false,
        error: error.message || 'Error deleting portfolio'
      };
    }
  }

  // Get all education entries
  async getEducation(userId) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId },
        attributes: ['education']
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return {
        success: true,
        data: profile.education || []
      };
    } catch (error) {
      console.error('Get education error:', error);
      return {
        success: false,
        error: error.message || 'Error fetching education'
      };
    }
  }

  // Update specific education entry
  async updateEducation(userId, educationId, updateData) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let education = profile.education || [];
      const index = education.findIndex(edu => edu.id === educationId);

      if (index === -1) {
        return {
          success: false,
          error: 'Education entry not found'
        };
      }

      // Validate dates if they're being updated
      if (updateData.startDate) {
        const startDate = new Date(updateData.startDate);
        if (updateData.endDate) {
          const endDate = new Date(updateData.endDate);
          if (endDate < startDate) {
            return {
              success: false,
              error: 'End date cannot be before start date'
            };
          }
        }
      }

      // Update the education entry
      education[index] = {
        ...education[index],
        ...updateData,
        updated_at: new Date().toISOString()
      };

      // Sort by start date (most recent first)
      education.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

      // Update profile
      await Profile.update(
        { 
          education,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      // Fetch updated profile
      const updatedProfile = await Profile.findOne({
        where: { user_id: userId },
        include: [{
          model: User,
          as: 'profileOwner',
          attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isVerified', 'isActive']
        }]
      });

      const formattedProfile = {
        ...updatedProfile.get({ plain: true }),
        user: updatedProfile.profileOwner
      };
      delete formattedProfile.profileOwner;

      return {
        success: true,
        data: formattedProfile
      };
    } catch (error) {
      console.error('Update education error:', error);
      return {
        success: false,
        error: error.message || 'Error updating education'
      };
    }
  }

  // Delete specific education entry
  async deleteEducation(userId, educationId) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      let education = profile.education || [];
      const index = education.findIndex(edu => edu.id === educationId);

      if (index === -1) {
        return {
          success: false,
          error: 'Education entry not found'
        };
      }

      // Remove the education entry
      education.splice(index, 1);

      // Update profile
      await Profile.update(
        { 
          education,
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      // Fetch updated profile
      const updatedProfile = await Profile.findOne({
        where: { user_id: userId },
        include: [{
          model: User,
          as: 'profileOwner',
          attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isVerified', 'isActive']
        }]
      });

      const formattedProfile = {
        ...updatedProfile.get({ plain: true }),
        user: updatedProfile.profileOwner
      };
      delete formattedProfile.profileOwner;

      return {
        success: true,
        data: formattedProfile
      };
    } catch (error) {
      console.error('Delete education error:', error);
      return {
        success: false,
        error: error.message || 'Error deleting education'
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

  // Resume Methods
  async updateResume(userId, resumeUrl) {
    try {
      const profile = await Profile.findOne({
        where: { user_id: userId }
      });

      if (!profile) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      await Profile.update(
        { 
          resume: {
            url: resumeUrl,
            last_updated: new Date().toISOString()
          },
          updated_at: new Date()
        },
        { 
          where: { user_id: userId }
        }
      );

      const updatedProfile = await this.getByUserId(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Update resume error:', error);
      return {
        success: false,
        error: error.message || 'Error updating resume'
      };
    }
  }
}

export default new ProfileController(); 