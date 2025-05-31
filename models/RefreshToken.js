import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

class RefreshToken extends Model {}

RefreshToken.init({
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
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  issued_ip: {
    type: DataTypes.STRING
  },
  browser: {
    type: DataTypes.STRING
  },
  os: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['token']
    }
  ]
});

export default RefreshToken; 