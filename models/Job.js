import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Job extends Model {}

Job.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employer_id: {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salary: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  deadline: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'closed'),
    defaultValue: 'draft'
  }
}, {
  sequelize,
  modelName: 'Job',
  tableName: 'jobs',
  timestamps: true
});

export default Job; 