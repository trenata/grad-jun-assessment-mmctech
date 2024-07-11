import mongoose from 'mongoose';
const { Schema } = mongoose;

const albumSchema = new mongoose.Schema({
    title: String, 
    description: String,
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
});

const Album = mongoose.model('Album', albumSchema, 'albums');

export default Album;