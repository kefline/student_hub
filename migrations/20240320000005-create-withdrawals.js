'use strict';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Create ENUM type
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_withdrawals_status') THEN
          CREATE TYPE "enum_withdrawals_status" AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
        END IF;
      END
      $$;
    `);

    await queryInterface.createTable('Withdrawals', {
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
      paymentMethodId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'PaymentMethods',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'USD'
      },
      status: {
        type: 'enum_withdrawals_status',
        defaultValue: 'pending'
      },
      processingDetails: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('Withdrawals', ['userId']);
    await queryInterface.addIndex('Withdrawals', ['paymentMethodId']);
    await queryInterface.addIndex('Withdrawals', ['status']);
    await queryInterface.addIndex('Withdrawals', ['completedAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Withdrawals');
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_withdrawals_status";
    `);
  }
};

export default migration; 