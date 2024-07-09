import express from 'express';
import mongoose from "mongoose";
import Song from '../db/song.js';
import Album from '../db/album.js';

const router = express.Router();

// Create
router.post('/songs', async (req, res) => {
    const { title, length, album } = req.body;

    try {
        if (!title || !length || !album) {
            return res.status(400).json({ message: 'Title, length, and album are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(album)) {
            return res.status(400).json({ message: 'Invalid album' });
        }

        const songAlbum = await Album.findOne({ _id: album });
        if (!songAlbum) {
            return res.status(404).json({ message: 'Album not found' });
        }

        const song = new Song({ title, length, album });
        await song.save();

        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Read
router.get('/songs', async (req, res) => {
    const { albumId } = req.query;

    try {
        if (albumId) {
            if (!mongoose.Types.ObjectId.isValid(albumId)) {
                return res.status(400).json({ message: 'Invalid albumId' });
            }
            const songAlbum = await Album.findOne({ _id: albumId });
            if (!songAlbum) {
                return res.status(404).json({ message: 'Album not found' });
            }
        }

        const songs = !albumId ? await Song.find({}) : await Song.find({ album: albumId });

        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found' });
        }

        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get('/songs/:songId', async (req, res) => {
    const { songId } = req.params;

    try {
        if (songId && !mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ message: 'Invalid songId' });
        }

        const song = await Song.findOne({ _id: songId });

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Update
router.put('/songs/:songId', async (req, res) => {
    const { songId } = req.params;
    const { title, length } = req.body;
  
    try {
        if (songId && !mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ message: 'Invalid songId' });
        }

        const song = await Song.findByIdAndUpdate(songId, { title, length }, { new: true });

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

      res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Delete
router.delete('/songs/:songId', async (req, res) => {
    const { songId } = req.params;
  
    try {
        if (songId && !mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ message: 'Invalid songId' });
        }

        const song = await Song.findByIdAndDelete(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;