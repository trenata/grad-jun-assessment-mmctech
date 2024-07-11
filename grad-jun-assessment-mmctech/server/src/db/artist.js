import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: String,
});

const Artist = mongoose.model('Artist', artistSchema, 'artists');

export default Artist;