'use strict';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Create ENUM type
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_forums_status') THEN
          CREATE TYPE "enum_forums_status" AS ENUM ('active', 'hidden', 'reported', 'archived');
        END IF;
      END
      $$;
    `);

    await queryInterface.createTable('Forums', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      authorId: {
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
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      status: {
        type: 'enum_forums_status',
        defaultValue: 'active'
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      likes: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        defaultValue: []
      },
      shares: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      comments: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      lastActivity: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      reportDetails: {
        type: Sequelize.JSONB,
        allowNull: true
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
    await queryInterface.addIndex('Forums', ['authorId']);
    await queryInterface.addIndex('Forums', ['category']);
    await queryInterface.addIndex('Forums', ['status']);
    await queryInterface.addIndex('Forums', ['tags']);
    await queryInterface.addIndex('Forums', ['lastActivity']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Forums');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_forums_status";
    `);
  }
};

export default migration; 