'use strict';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      profilePhoto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      coverPhoto: {
        type: Sequelize.STRING
      },
      education: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      experience: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      skills: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: []
      },
      languages: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      payRate: {
        type: Sequelize.JSONB,
        defaultValue: {
          hourly: null,
          currency: 'USD'
        }
      },
      portfolioLinks: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      resume: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      badges: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      verificationStatus: {
        type: Sequelize.JSONB,
        defaultValue: {
          isVerified: false,
          verifiedBy: null,
          verificationDate: null
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('Profiles', ['userId']);
    await queryInterface.addIndex('Profiles', ['skills']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Profiles');
  }
};

export default migration; 