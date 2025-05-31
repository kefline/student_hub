'use strict';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Create ENUM type
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_jobs_status') THEN
          CREATE TYPE "enum_jobs_status" AS ENUM ('draft', 'active', 'in-progress', 'completed', 'cancelled');
        END IF;
      END
      $$;
    `);

    await queryInterface.createTable('Jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      employerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      skills: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: []
      },
      budget: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isInviteOnly: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: 'enum_jobs_status',
        defaultValue: 'draft'
      },
      proposals: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      selectedProposal: {
        type: Sequelize.STRING,
        allowNull: true
      },
      timeTracking: {
        type: Sequelize.JSONB,
        defaultValue: {
          totalHours: 0,
          logs: []
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
    await queryInterface.addIndex('Jobs', ['employerId']);
    await queryInterface.addIndex('Jobs', ['category']);
    await queryInterface.addIndex('Jobs', ['status']);
    await queryInterface.addIndex('Jobs', ['skills']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jobs');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_jobs_status";
    `);
  }
};

export default migration; 