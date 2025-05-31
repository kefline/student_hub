import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';

class User extends Model {
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Optional: Add a method to get full name
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Optional: Method to check if user is social login
  get isSocialLogin() {
    return this.socialProvider && this.socialId;
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255] // Minimum password length
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  role: {
    type: DataTypes.ENUM('student', 'employer', 'staff', 'mentor', 'admin'),
    allowNull: false,
    defaultValue: 'student' // Set a default role
  },
  socialProvider: {
    type: DataTypes.ENUM('google', 'github', 'linkedin'),
    allowNull: true
  },
  socialId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users', // Explicitly set table name
  timestamps: true,
  underscored: true, // This will convert camelCase to snake_case in DB
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  },
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['social_provider', 'social_id'] // Composite index for social login
    },
    {
      fields: ['role']
    }
  ]
});

export default User;