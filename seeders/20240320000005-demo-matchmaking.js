'use strict';

import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Get student, employer, and job IDs
    const [student] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE role = \'student\' LIMIT 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const [employer] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE role = \'employer\' LIMIT 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const jobs = await queryInterface.sequelize.query(
      'SELECT id FROM "Jobs" LIMIT 3;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!student || !employer || jobs.length === 0) {
      console.log('Required data not found, skipping matchmaking seeding');
      return;
    }

    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const matchmaking = [
      {
        id: uuidv4(),
        jobId: jobs[0].id,
        studentId: student.id,
        employerId: employer.id,
        status: 'matched',
        matchScore: 0.95,
        matchCriteria: JSON.stringify({
          skillMatch: 0.9,
          experienceMatch: 1.0,
          availabilityMatch: 0.95,
          budgetMatch: 0.95
        }),
        studentResponse: JSON.stringify({
          interested: true,
          responseTime: yesterday,
          message: 'Very interested in this opportunity!'
        }),
        employerResponse: JSON.stringify({
          interested: true,
          responseTime: yesterday,
          message: 'Looking forward to working together!'
        }),
        expiresAt: oneWeekFromNow,
        createdAt: yesterday,
        updatedAt: yesterday
      },
      {
        id: uuidv4(),
        jobId: jobs[1].id,
        studentId: student.id,
        employerId: employer.id,
        status: 'pending',
        matchScore: 0.85,
        matchCriteria: JSON.stringify({
          skillMatch: 0.8,
          experienceMatch: 0.9,
          availabilityMatch: 0.85,
          budgetMatch: 0.85
        }),
        studentResponse: null,
        employerResponse: null,
        expiresAt: oneWeekFromNow,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        jobId: jobs[2].id,
        studentId: student.id,
        employerId: employer.id,
        status: 'rejected',
        matchScore: 0.75,
        matchCriteria: JSON.stringify({
          skillMatch: 0.7,
          experienceMatch: 0.8,
          availabilityMatch: 0.75,
          budgetMatch: 0.75
        }),
        studentResponse: JSON.stringify({
          interested: false,
          responseTime: yesterday,
          message: 'Not available for this duration'
        }),
        employerResponse: null,
        expiresAt: oneWeekFromNow,
        createdAt: yesterday,
        updatedAt: yesterday
      }
    ];

    await queryInterface.bulkInsert('Matchmaking', matchmaking, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Matchmaking', null, {});
  }
};

export default migration; 