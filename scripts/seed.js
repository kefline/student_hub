import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import { User, Profile, Job } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

async function runSeeders() {
  try {
    // Get all seeder files
    const seedersPath = join(__dirname, '..', 'seeders');
    const files = await fs.readdir(seedersPath);
    const seederFiles = files
      .filter(file => file.endsWith('.js'))
      .sort();

    // Create SequelizeData table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "SequelizeData" (
        "name" character varying(255) NOT NULL,
        CONSTRAINT "SequelizeData_pkey" PRIMARY KEY ("name")
      );
    `);

    // Get executed seeders
    const [executedSeeders] = await sequelize.query(
      'SELECT name FROM "SequelizeData";'
    );
    const executedNames = executedSeeders.map(s => s.name);

    // Run pending seeders
    for (const file of seederFiles) {
      if (!executedNames.includes(file)) {
        console.log(`Running seeder: ${file}`);
        const seeder = await import(join(seedersPath, file));
        await seeder.default.up(sequelize.queryInterface, Sequelize);
        await sequelize.query(
          'INSERT INTO "SequelizeData" (name) VALUES (?)',
          {
            replacements: [file],
            type: Sequelize.QueryTypes.INSERT
          }
        );
        console.log(`Seeder ${file} executed successfully`);
      }
    }

    console.log('All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

const seedDatabase = async () => {
  try {
    // Create demo users
    const users = await Promise.all([
      // Student
      User.create({
        email: 'student@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'John',
        lastName: 'Student',
        role: 'student',
        isActive: true
      }),
      // Employer
      User.create({
        email: 'employer@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Jane',
        lastName: 'Employer',
        role: 'employer',
        isActive: true
      }),
      // Staff
      User.create({
        email: 'staff@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Bob',
        lastName: 'Staff',
        role: 'staff',
        isActive: true
      }),
      // Mentor
      User.create({
        email: 'mentor@example.com',
        password: await bcrypt.hash('password123', 10),
        firstName: 'Alice',
        lastName: 'Mentor',
        role: 'mentor',
        isActive: true
      })
    ]);

    // Create profiles for users
    await Promise.all(users.map(user => {
      return Profile.create({
        userId: user.id,
        bio: `${user.firstName} ${user.lastName} - ${user.role}`,
        location: 'New York, USA',
        phone: '+1234567890',
        website: `https://${user.role}.example.com`,
        socialLinks: {
          linkedin: `https://linkedin.com/in/${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`,
          github: `https://github.com/${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`
        },
        skills: ['JavaScript', 'React', 'Node.js'],
        education: [{
          institution: 'Example University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2018-09-01',
          endDate: '2022-06-01'
        }],
        experience: [{
          company: 'Tech Corp',
          position: 'Software Developer',
          startDate: '2022-07-01',
          endDate: null,
          current: true
        }]
      });
    }));

    // Create demo jobs
    const employer = users.find(u => u.role === 'employer');
    await Promise.all([
      Job.create({
        employerId: employer.id,
        title: 'Full Stack Developer',
        description: 'We are looking for a Full Stack Developer to join our team.',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '3+ years of experience with React and Node.js',
          'Strong problem-solving skills'
        ],
        type: 'full-time',
        location: 'New York, USA',
        salary: {
          min: 80000,
          max: 120000,
          currency: 'USD',
          period: 'yearly'
        },
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        deadline: '2024-12-31',
        status: 'published'
      }),
      Job.create({
        employerId: employer.id,
        title: 'UX/UI Designer Intern',
        description: 'Looking for a talented UX/UI Designer intern.',
        requirements: [
          'Currently pursuing a degree in Design or related field',
          'Strong portfolio showcasing UI/UX projects',
          'Familiarity with Figma and Adobe Creative Suite'
        ],
        type: 'internship',
        location: 'Remote',
        salary: {
          amount: 25,
          currency: 'USD',
          period: 'hourly'
        },
        skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD'],
        deadline: '2024-06-30',
        status: 'published'
      })
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

runSeeders();
seedDatabase(); 