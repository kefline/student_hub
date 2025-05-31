'use strict';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Create ENUM type
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_matchmaking_status') THEN
          CREATE TYPE "enum_matchmaking_status" AS ENUM ('pending', 'matched', 'rejected', 'expired');
        END IF;
      END
      $$;
    `);

    await queryInterface.createTable('Matchmaking', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      jobId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      status: {
        type: 'enum_matchmaking_status',
        defaultValue: 'pending'
      },
      matchScore: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      matchCriteria: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      studentResponse: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      employerResponse: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.addIndex('Matchmaking', ['jobId']);
    await queryInterface.addIndex('Matchmaking', ['studentId']);
    await queryInterface.addIndex('Matchmaking', ['employerId']);
    await queryInterface.addIndex('Matchmaking', ['status']);
    await queryInterface.addIndex('Matchmaking', ['matchScore']);
    await queryInterface.addIndex('Matchmaking', ['expiresAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Matchmaking');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_matchmaking_status";
    `);
  }
};

export default migration; 