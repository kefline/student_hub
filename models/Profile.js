import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class Profile extends Model {}

Profile.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  social_links: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  education: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  experience: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  portfolio: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  profile_photo: {
    type: DataTypes.STRING
  },
  cover_photo: {
    type: DataTypes.STRING
  },
  languages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  pay_rate: {
    type: DataTypes.JSONB,
    defaultValue: {
      hourly: null,
      currency: 'USD'
    }
  },
  portfolio_links: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  resume: {
    type: DataTypes.JSONB,
    defaultValue: {
      url: null,
      last_updated: null
    }
  },
  badges: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  verification_status: {
    type: DataTypes.JSONB,
    defaultValue: {
      is_verified: false,
      verified_by: null,
      verification_date: null
    }
  }
}, {
  sequelize,
  modelName: 'Profile',
  tableName: 'profiles',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    }
  ]
});

// Remove association from here - it should be in models/index.js
export default Profile;