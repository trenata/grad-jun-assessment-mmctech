import express from 'express';
import mongoose from "mongoose";
import Artist from '../db/artist.js';

const router = express.Router();

// Create
router.post('/artists', async (req, res) => {
    let { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        name = name.replace(/[^a-zA-Z0-9:\ ]/g, '');

        const artist = new Artist({ name });
        await artist.save();

        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Read
router.get('/artists', async (req, res) => {
    try {
        const artists = await Artist.find({});

        if (artists.length === 0) {
            return res.status(404).json({ message: 'No artists found' });
        }

        res.json(artists);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get('/artists/:artistId', async (req, res) => {
    let { artistId } = req.params;

    try {
        if (artistId && !mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: 'Invalid artistId' });
        }

        artistId = artistId.replace(/[^a-zA-Z0-9:\ ]/g, '');

        const artist = await Artist.findOne({ _id: artistId });

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Update
router.put('/artists/:artistId', async (req, res) => {
    let { artistId } = req.params;
    let { name } = req.body;
  
    try {
        if (artistId && !mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: 'Invalid artistId' });
        }

        artistId = artistId.replace(/[^a-zA-Z0-9:\ ]/g, '');
        name = name.replace(/[^a-zA-Z0-9:\ ]/g, '');

        const artist = await Artist.findByIdAndUpdate(artistId, { name }, { new: true });

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

      res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Delete
router.delete('/artists/:artistId', async (req, res) => {
    let { artistId } = req.params;
  
    try {
        if (artistId && !mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: 'Invalid artistId' });
        }

        artistId = artistId.replace(/[^a-zA-Z0-9:\ ]/g, '');

        const artist = await Artist.findByIdAndDelete(artistId);

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;