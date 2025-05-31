'use strict';

import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Get student user ID
    const [student] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE role = \'student\' LIMIT 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!student) {
      console.log('No student found, skipping payment method seeding');
      return;
    }

    const now = new Date();
    const paymentMethods = [
      {
        id: uuidv4(),
        userId: student.id,
        type: 'bank_account',
        provider: 'stripe',
        accountDetails: JSON.stringify({
          bankName: 'Demo Bank',
          accountType: 'checking',
          lastFour: '1234',
          routingNumber: '******123'
        }),
        isDefault: true,
        isVerified: true,
        verificationDetails: JSON.stringify({
          verifiedAt: now,
          method: 'micro_deposits'
        }),
        lastUsed: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        userId: student.id,
        type: 'paypal',
        provider: 'paypal',
        accountDetails: JSON.stringify({
          email: 'student@uniskills.com',
          paypalId: 'PP123456789'
        }),
        isDefault: false,
        isVerified: true,
        verificationDetails: JSON.stringify({
          verifiedAt: now,
          method: 'email_verification'
        }),
        lastUsed: null,
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('PaymentMethods', paymentMethods, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PaymentMethods', null, {});
  }
};

export default migration; 