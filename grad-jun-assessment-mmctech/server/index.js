import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './src/routes.js';
import dbConnection from './db/dbConnection.js';
import importData from './db/dbCreation.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/', router);


dotenv.config();
const PORT = process.env.PORT || 9000;

dbConnection();
// importData();

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
})

