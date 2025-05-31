import BaseController from './BaseController.js';
import { Job, User, Profile } from '../models/index.js';
import { Op } from 'sequelize';

class JobController extends BaseController {
  constructor() {
    super(Job);
  }

  // Create a new job
  async createJob(employerId, jobData) {
    try {
      const job = await Job.create({
        ...jobData,
        employerId,
        status: 'draft'
      });

      return {
        success: true,
        data: job
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get job with employer details
  async getJobDetails(jobId) {
    try {
      const job = await Job.findOne({
        where: { id: jobId },
        include: [{
          model: User,
          as: 'employer',
          attributes: ['id', 'email', 'role'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'profilePhoto']
          }]
        }]
      });

      if (!job) {
        return {
          success: false,
          error: 'Job not found'
        };
      }

      return {
        success: true,
        data: job
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update job status
  async updateJobStatus(jobId, status) {
    try {
      const job = await Job.findByPk(jobId);
      if (!job) {
        return {
          success: false,
          error: 'Job not found'
        };
      }

      await job.update({ status });

      return {
        success: true,
        data: job
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Submit proposal
  async submitProposal(jobId, userId, proposalData) {
    try {
      const job = await Job.findByPk(jobId);
      if (!job) {
        return {
          success: false,
          error: 'Job not found'
        };
      }

      if (job.status !== 'active') {
        return {
          success: false,
          error: 'Job is not accepting proposals'
        };
      }

      const proposals = job.proposals || [];
      const existingProposal = proposals.find(p => p.userId === userId);
      if (existingProposal) {
        return {
          success: false,
          error: 'You have already submitted a proposal'
        };
      }

      proposals.push({
        id: Date.now().toString(),
        userId,
        ...proposalData,
        status: 'pending',
        submittedAt: new Date()
      });

      await job.update({ proposals });

      return {
        success: true,
        data: job
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Accept proposal
  async acceptProposal(jobId, proposalId) {
    try {
      const job = await Job.findByPk(jobId);
      if (!job) {
        return {
          success: false,
          error: 'Job not found'
        };
      }

      const proposals = job.proposals || [];
      const proposalIndex = proposals.findIndex(p => p.id === proposalId);
      if (proposalIndex === -1) {
        return {
          success: false,
          error: 'Proposal not found'
        };
      }

      // Update proposal status
      proposals[proposalIndex].status = 'accepted';
      // Update other proposals to rejected
      proposals.forEach((p, i) => {
        if (i !== proposalIndex) {
          p.status = 'rejected';
        }
      });

      await job.update({
        proposals,
        selectedProposal: proposalId,
        status: 'in-progress'
      });

      return {
        success: true,
        data: job
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search jobs
  async searchJobs(query) {
    try {
      const {
        category,
        skills,
        status,
        isInviteOnly,
        minBudget,
        maxBudget,
        location,
        page = 1,
        limit = 10
      } = query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (isInviteOnly !== undefined) whereClause.isInviteOnly = isInviteOnly;

      const jobs = await Job.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'employer',
          attributes: ['id', 'email', 'role'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'profilePhoto']
          }]
        }],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        success: true,
        data: jobs.rows,
        pagination: {
          total: jobs.count,
          page: parseInt(page),
          pages: Math.ceil(jobs.count / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Track time
  async trackTime(jobId, userId, timeData) {
    try {
      const job = await Job.findByPk(jobId);
      if (!job) {
        return {
          success: false,
          error: 'Job not found'
        };
      }

      const timeTracking = job.timeTracking || { totalHours: 0, logs: [] };
      timeTracking.logs.push({
        id: Date.now().toString(),
        userId,
        ...timeData,
        timestamp: new Date()
      });

      timeTracking.totalHours += parseFloat(timeData.hours);

      await job.update({ timeTracking });

      return {
        success: true,
        data: job
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new JobController(); 