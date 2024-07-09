import express from 'express';
import Artist from '../db/artist.js';
import Album from '../db/album.js';
import Song from '../db/song.js';

const router = express.Router();

router.get('/artists', async (req, res) => {
  try {
    const artists = await Artist.find({});
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get('/artists/:artistId', async (req, res) => {
  try {
    const artists = await Artist.findOne({_id: req.params.artistId});
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get('/albums', async (req, res) => {
  try {
    const artists = await Album.find({});
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get('/albums/:albumId', async (req, res) => {
  try {
    const artists = await Album.findOne({_id: req.params.albumId});
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get('/artists/:artistId/albums', async (req, res) => {
  try {
    const artists = await Album.find({ artist: req.params.artistId });
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get('/songs', async (req, res) => {
  try {
    const artists = !req.query.albumId ? await Song.find({}) : await Song.find({ album: req.query.albumId});
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});


export default router;