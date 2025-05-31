import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';

class Forum extends Model {}

Forum.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'forum_categories',
      key: 'id'
    }
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('published', 'draft', 'archived'),
    defaultValue: 'published'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_locked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_activity_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Forum',
  tableName: 'forums',
  timestamps: true,
  indexes: [
    {
      fields: ['author_id']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['status']
    }
  ]
});

// Define associations
Forum.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

export default Forum; 