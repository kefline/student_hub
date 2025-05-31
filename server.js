import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize, syncDatabase } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import paymentRoutes from './routes/payments.js';
import matchmakingRoutes from './routes/matchmaking.js';
import { errorHandler } from './middlewares/error.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/matchmaking', matchmakingRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database has connected successfully.');
    
    // Sync database with force: true for development
    // IMPORTANT: Remove force: true in production!
    const isDevelopment = process.env.NODE_ENV === 'development';
    await syncDatabase(isDevelopment); // This will use force: true in development
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect or sync the database:', error);
    process.exit(1);
  }
};

startServer();