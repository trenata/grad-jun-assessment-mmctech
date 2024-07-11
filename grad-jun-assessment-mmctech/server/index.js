import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import dbConnection from './src/db/dbConnection.js';
import importData from './src/db/dbCreation.js';
import albums from './src/routes/albums.js';
import artists from './src/routes/artists.js';
import songs from './src/routes/songs.js';
import search from './src/routes/search.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/', songs);
app.use('/', albums);
app.use('/', artists);
app.use('/', search);


dotenv.config();
const PORT = process.env.PORT || 9000;

dbConnection();
importData();

mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
})

