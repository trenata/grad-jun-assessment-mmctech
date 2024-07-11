import express from 'express';
import mongoose from "mongoose";
import Album from '../db/album.js';
import Artist from '../db/artist.js';

const router = express.Router();

// Create
router.post('/albums', async (req, res) => {
    let { title, description, artist } = req.body;

    try {
        if (!title || !description || !artist) {
            return res.status(400).json({ message: 'Title, description, and artist are required' });
        }

        title = title.replace(/[^a-zA-Z0-9:\ ]/g, '');
        description = description.replace(/[^a-zA-Z0-9:\ ]/g, '');
        artist = artist.replace(/[^a-zA-Z0-9:\ ]/g, '');

        if (!mongoose.Types.ObjectId.isValid(artist)) {
            return res.status(400).json({ message: 'Invalid artist' });
        }

        const albumArtist = await Artist.findOne({ _id: artist });
        if (!albumArtist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        const album = new Album({ title, description, artist });
        await album.save();

        res.json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Read
router.get('/albums', async (req, res) => {
    let { artistId } = req.query;

    try {
        if (artistId) {
            artistId.replace(/[^a-zA-Z0-9:\ ]/g, '');

            if (!mongoose.Types.ObjectId.isValid(artistId)) {
                return res.status(400).json({ message: 'Invalid artistId' });
            }
            const albumArtist = await Artist.findOne({ _id: artistId });
            if (!albumArtist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
        }

        const albums = !artistId ? await Album.find({}) : await Album.find({ artist: artistId });

        if (albums.length === 0) {
            return res.status(404).json({ message: 'No albums found' });
        }

        res.json(albums);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get('/albums/:albumId', async (req, res) => {
    let { albumId } = req.params;

    try {
        if (albumId && !mongoose.Types.ObjectId.isValid(albumId)) {
            return res.status(400).json({ message: 'Invalid albumId' });
        }

        albumId = albumId.replace(/[^a-zA-Z0-9:\ ]/g, '');

        const album = await Album.findOne({ _id: albumId });

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        res.json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Update
router.put('/albums/:albumId', async (req, res) => {
    let { albumId } = req.params;
    let { title, description } = req.body;
  
    try {
        if (albumId && !mongoose.Types.ObjectId.isValid(albumId)) {
            return res.status(400).json({ message: 'Invalid albumId' });
        }

        albumId = albumId.replace(/[^a-zA-Z0-9:\ ]/g, '');
        title = title.replace(/[^a-zA-Z0-9:\ ]/g, '');
        description = description.replace(/[^a-zA-Z0-9:\ ]/g, '');

        const album = await Album.findByIdAndUpdate(albumId, { title, description }, { new: true });

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

      res.json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Delete
router.delete('/albums/:albumId', async (req, res) => {
    let { albumId } = req.params;
  
    try {
        if (albumId && !mongoose.Types.ObjectId.isValid(albumId)) {
            return res.status(400).json({ message: 'Invalid albumId' });
        }

        albumId = albumId.replace(/[^a-zA-Z0-9:\ ]/g, '');

        const album = await Album.findByIdAndDelete(albumId);

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        res.json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;