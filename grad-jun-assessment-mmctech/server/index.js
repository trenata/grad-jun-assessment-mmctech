import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/db.js';

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 9000;

// Connect to MongoDB
db();

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

