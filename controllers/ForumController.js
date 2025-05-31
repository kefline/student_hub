import BaseController from './BaseController.js';
import { Forum, User, Profile } from '../models/index.js';
import { Op } from 'sequelize';

class ForumController extends BaseController {
  constructor() {
    super(Forum);
  }

  // Create forum post
  async createPost(authorId, postData) {
    try {
      const post = await Forum.create({
        ...postData,
        authorId,
        status: 'active'
      });

      return {
        success: true,
        data: post
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get post with author details
  async getPostDetails(postId) {
    try {
      const post = await Forum.findOne({
        where: { id: postId },
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'email', 'role'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'profilePhoto']
          }]
        }]
      });

      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      // Increment views
      await post.update({
        views: post.views + 1,
        lastActivity: new Date()
      });

      return {
        success: true,
        data: post
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add comment
  async addComment(postId, userId, commentData) {
    try {
      const post = await Forum.findByPk(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      const comments = post.comments || [];
      comments.push({
        id: Date.now().toString(),
        userId,
        ...commentData,
        createdAt: new Date(),
        likes: []
      });

      await post.update({
        comments,
        lastActivity: new Date()
      });

      return {
        success: true,
        data: post
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Like post
  async likePost(postId, userId) {
    try {
      const post = await Forum.findByPk(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      const likes = post.likes || [];
      const userLikeIndex = likes.indexOf(userId);

      if (userLikeIndex === -1) {
        likes.push(userId);
      } else {
        likes.splice(userLikeIndex, 1);
      }

      await post.update({ likes });

      return {
        success: true,
        data: post
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Share post
  async sharePost(postId) {
    try {
      const post = await Forum.findByPk(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      await post.update({
        shares: post.shares + 1
      });

      return {
        success: true,
        data: post
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search posts
  async searchPosts(query) {
    try {
      const {
        category,
        tags,
        status,
        authorId,
        searchTerm,
        page = 1,
        limit = 10
      } = query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (category) whereClause.category = category;
      if (status) whereClause.status = status;
      if (authorId) whereClause.authorId = authorId;
      if (searchTerm) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { content: { [Op.iLike]: `%${searchTerm}%` } }
        ];
      }
      if (tags && tags.length > 0) {
        whereClause.tags = { [Op.overlap]: tags };
      }

      const posts = await Forum.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'email', 'role'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['firstName', 'lastName', 'profilePhoto']
          }]
        }],
        limit,
        offset,
        order: [['lastActivity', 'DESC']]
      });

      return {
        success: true,
        data: posts.rows,
        pagination: {
          total: posts.count,
          page: parseInt(page),
          pages: Math.ceil(posts.count / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Report post
  async reportPost(postId, reportData) {
    try {
      const post = await Forum.findByPk(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      await post.update({
        status: 'reported',
        reportDetails: reportData
      });

      return {
        success: true,
        data: post
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new ForumController(); 