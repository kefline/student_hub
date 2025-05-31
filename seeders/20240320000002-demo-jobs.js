'use strict';

import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
const migration = {
  async up(queryInterface, Sequelize) {
    // Get employer user ID
    const [employer] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE role = \'employer\' LIMIT 1;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!employer) {
      console.log('No employer found, skipping job seeding');
      return;
    }

    const now = new Date();
    const jobs = [
      {
        id: uuidv4(),
        employerId: employer.id,
        title: 'Full Stack Web Developer Needed',
        description: 'Looking for a skilled full stack developer to build a responsive web application. Experience with React and Node.js required.',
        category: 'Web Development',
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        budget: JSON.stringify({
          amount: 5000,
          currency: 'USD',
          type: 'fixed'
        }),
        duration: '3 months',
        location: 'Remote',
        status: 'active',
        isInviteOnly: false,
        proposals: JSON.stringify([]),
        timeTracking: JSON.stringify({
          totalHours: 0,
          logs: []
        }),
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        employerId: employer.id,
        title: 'Mobile App UI/UX Designer',
        description: 'Seeking a talented UI/UX designer for our mobile app project. Must have experience with Figma and mobile design principles.',
        category: 'Design',
        skills: ['UI Design', 'UX Design', 'Figma', 'Mobile Design'],
        budget: JSON.stringify({
          amount: 45,
          currency: 'USD',
          type: 'hourly'
        }),
        duration: '2 months',
        location: 'Remote',
        status: 'active',
        isInviteOnly: false,
        proposals: JSON.stringify([]),
        timeTracking: JSON.stringify({
          totalHours: 0,
          logs: []
        }),
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        employerId: employer.id,
        title: 'Data Analysis Project',
        description: 'Need a data analyst to help analyze and visualize customer behavior data. Experience with Python and data visualization tools required.',
        category: 'Data Analysis',
        skills: ['Python', 'Pandas', 'Data Visualization', 'SQL'],
        budget: JSON.stringify({
          amount: 3000,
          currency: 'USD',
          type: 'fixed'
        }),
        duration: '1 month',
        location: 'Remote',
        status: 'active',
        isInviteOnly: false,
        proposals: JSON.stringify([]),
        timeTracking: JSON.stringify({
          totalHours: 0,
          logs: []
        }),
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('Jobs', jobs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jobs', null, {});
  }
};

export default migration; 