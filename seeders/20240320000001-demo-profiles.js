'use strict';

import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // First, get the user IDs
    const users = await queryInterface.sequelize.query(
      'SELECT id, role FROM "Users";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const now = new Date();
    const profiles = users.map(user => {
      const baseProfile = {
        id: uuidv4(),
        userId: user.id,
        firstName: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        lastName: 'Demo',
        bio: `A demo ${user.role} account for testing purposes.`,
        profilePhoto: null,
        coverPhoto: null,
        skills: ['Communication', 'Time Management', 'Problem Solving'],
        languages: JSON.stringify([
          { language: 'English', proficiency: 'Native' },
          { language: 'Spanish', proficiency: 'Intermediate' }
        ]),
        createdAt: now,
        updatedAt: now
      };

      if (user.role === 'student') {
        baseProfile.education = JSON.stringify([
          {
            institution: 'Demo University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2020-09-01',
            endDate: '2024-06-30',
            current: true
          }
        ]);
        baseProfile.payRate = JSON.stringify({ hourly: 25, currency: 'USD' });
      } else if (user.role === 'employer') {
        baseProfile.experience = JSON.stringify([
          {
            company: 'Tech Solutions Inc.',
            position: 'HR Manager',
            startDate: '2018-01-01',
            endDate: null,
            current: true,
            description: 'Managing recruitment and employee relations.'
          }
        ]);
      } else if (user.role === 'mentor') {
        baseProfile.experience = JSON.stringify([
          {
            company: 'Industry Leaders Corp.',
            position: 'Senior Developer',
            startDate: '2015-01-01',
            endDate: null,
            current: true,
            description: 'Leading development teams and mentoring junior developers.'
          }
        ]);
        baseProfile.skills.push('Leadership', 'Mentoring', 'Technical Architecture');
      }

      return baseProfile;
    });

    await queryInterface.bulkInsert('Profiles', profiles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null, {});
  }
};

export default migration; 