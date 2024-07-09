import fs from 'fs';
import Artist from '../db/artist.js';
import Album from '../db/album.js';
import Song from '../db/song.js';

async function importData() {
  const data = JSON.parse(fs.readFileSync('./assets/data.json', 'utf8'));

  for (const artistData of data) {
    const newArtist = new Artist({ name: artistData.name });
    await newArtist.save();
    
    for (const albumData of artistData.albums) {
      const newAlbum = new Album({
        title: albumData.title,
        description: albumData.description,
        artist: newArtist._id, 
      });
      await newAlbum.save();

      for (const songData of albumData.songs) {
        const newSong = new Song({
          title: songData.title,
          length: songData.length,
          album: newAlbum._id,
        });
        await newSong.save();
      }
    }
  }
}

export default importData;