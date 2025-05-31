'use strict';

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const now = new Date();

    const users = [
      {
        id: uuidv4(),
        email: 'admin@uniskills.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isActive: true,
        lastLogin: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        email: 'student@uniskills.com',
        password: hashedPassword,
        role: 'student',
        isVerified: true,
        isActive: true,
        lastLogin: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        email: 'employer@uniskills.com',
        password: hashedPassword,
        role: 'employer',
        isVerified: true,
        isActive: true,
        lastLogin: now,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        email: 'mentor@uniskills.com',
        password: hashedPassword,
        role: 'mentor',
        isVerified: true,
        isActive: true,
        lastLogin: now,
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

export default migration; 