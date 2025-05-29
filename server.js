import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, syncDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database  has connected successfully.');

        await syncDatabase(false);
        console.log('Database has connected  successfully.');
    } catch (error) {
        console.error('Unable to connect or sync the database:', error);
    }
})();

app.get('/', (req, res) => {
    res.json({ message: 'Uniskills API is running.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
