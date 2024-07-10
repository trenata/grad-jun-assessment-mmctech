import express from 'express';
import mongoose from "mongoose";
import Album from '../db/album.js';
import Artist from '../db/artist.js';
import Song from '../db/song.js';

const router = express.Router();

router.get('/search', async (req, res) => {
    const { input } = req.query;

    try {
        if (!input) {
            return res.status(400).json({ message: 'Search input is required' });
        }
        
        const artists = await Artist.find({ name: new RegExp(input, 'i') });
        const albums = await Album.find({ title: new RegExp(input, 'i') });
        const songs = await Song.find({ title: new RegExp(input, 'i') });

        
        const results = {
            artists,
            albums,
            songs,
        };

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;