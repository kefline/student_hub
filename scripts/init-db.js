import { sequelize, syncDatabase } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { User, Profile } from '../models/index.js';

const initializeDatabase = async () => {
  try {
    // Force sync all models
    await syncDatabase(true);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@uniskills.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    // Create admin profile
    await Profile.create({
      userId: admin.id,
      bio: 'System Administrator',
      location: 'System',
      skills: ['System Administration']
    });

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase(); 