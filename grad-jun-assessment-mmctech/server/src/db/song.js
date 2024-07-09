import mongoose from 'mongoose';
const { Schema } = mongoose;

const songSchema = new mongoose.Schema({
    title: String, 
    length: String,
    album: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
});

const Song = mongoose.model('Song', songSchema, 'songs');

export default Song;