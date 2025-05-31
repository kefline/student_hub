'use strict';

import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Get student and payment method IDs
    const [student] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE role = \'student\' LIMIT 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const [paymentMethod] = await queryInterface.sequelize.query(
      'SELECT id FROM "PaymentMethods" WHERE "userId" = :userId AND "isDefault" = true LIMIT 1;',
      {
        replacements: { userId: student.id },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (!student || !paymentMethod) {
      console.log('Required data not found, skipping withdrawal seeding');
      return;
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

    const withdrawals = [
      {
        id: uuidv4(),
        userId: student.id,
        paymentMethodId: paymentMethod.id,
        amount: 1500.00,
        currency: 'USD',
        status: 'completed',
        processingDetails: JSON.stringify({
          processedAt: twoMonthsAgo,
          transactionId: 'TX123456789',
          processor: 'stripe'
        }),
        completedAt: twoMonthsAgo,
        notes: 'Monthly earnings withdrawal',
        createdAt: twoMonthsAgo,
        updatedAt: twoMonthsAgo
      },
      {
        id: uuidv4(),
        userId: student.id,
        paymentMethodId: paymentMethod.id,
        amount: 2000.00,
        currency: 'USD',
        status: 'completed',
        processingDetails: JSON.stringify({
          processedAt: lastMonth,
          transactionId: 'TX987654321',
          processor: 'stripe'
        }),
        completedAt: lastMonth,
        notes: 'Monthly earnings withdrawal',
        createdAt: lastMonth,
        updatedAt: lastMonth
      },
      {
        id: uuidv4(),
        userId: student.id,
        paymentMethodId: paymentMethod.id,
        amount: 1750.00,
        currency: 'USD',
        status: 'pending',
        processingDetails: null,
        completedAt: null,
        notes: 'Current month earnings withdrawal',
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('Withdrawals', withdrawals, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Withdrawals', null, {});
  }
};

export default migration; 