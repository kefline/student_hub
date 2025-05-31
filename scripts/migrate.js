import { sequelize, syncDatabase } from '../config/database.js';

const migrate = async () => {
  try {
    // Sync all models without force
    await syncDatabase(false);
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

migrate(); 