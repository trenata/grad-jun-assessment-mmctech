<template>
  <div v-if="albums">
    <h1>{{ artist.name }}</h1>
    
    <div v-for="album in albums" :key="album._id">
      <h2>{{ album.title }}</h2>
      <div class="container">
        <div class="left-side card">
          <div v-for="(song, index) in getAlbumSongs(album._id)" :key="song._id" class="songs-container">
            <span>{{ index + 1 }}. {{ song.title }}</span> 
            <span>{{ song.length }}</span>
          </div>
        </div>
        <p class="description card"><b>Description:</b><br> {{ album.description }}</p>
      </div>
    </div>
  </div>
</template>
  
<script> 
import { onBeforeMount, ref, watch } from 'vue';
import { fetchArtist, fetchArtistAlbums, fetchSongsFromAlbum } from '@/services/api.js';
import { useRoute } from 'vue-router'

export default {
  name: 'ArtistDetailsPage',
  props: {
    artistId: {
      type: String,
      required: true
    },
  },
  setup(props) {
  const route = useRoute()
  
  const artist = ref();
  const albums = ref();
  const songs = ref();
  const songsMap = ref(new Map());

  const loadArtistData = async (artistId) => {
    try {
      artist.value = await fetchArtist(artistId);
      albums.value = await fetchArtistAlbums(artistId);
      
      for (const album of albums.value) {
        const albumSongs = await fetchSongsFromAlbum(album._id);
        songsMap.value.set(album._id, albumSongs);
      }
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const getAlbumSongs = (albumId) => {
    return songsMap.value.get(albumId) || [];
  };

  watch(
    () => route.params.artistId,
    async () => {
      try {
        await loadArtistData(props.artistId);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  )
  
  onBeforeMount(async () => {
    try {
      await loadArtistData(props.artistId);
    } catch (err) {
      console.log('Error: ', err);
    }
  })

  return {
    artist,
    albums,
    songs,
    getAlbumSongs,
  }
}
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.left-side {
  flex: 2; 
  margin-right: 1rem; 
  padding-top: 1rem;
}

.songs-container {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  margin: 1rem 4rem;
  height: 2rem;
}

.description {
  flex: 1; 
  width: auto; 
  padding: 1rem 2rem;
  line-height: 150%;

  text-align: justify;
  text-justify: inter-word;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
  background-color: #e6f2ec;
  margin: 1rem 1rem 0 1rem;
  border-radius: 10px;
}

h1 {
  color: #0c3b2e;
  text-align: start;
  padding-left: 4rem;
  font-size: 50px;
  margin: 0;
}

h2 {
  color: #0c3b2e;
  text-align: start;
  padding-left: 4.4rem;
  padding-top: 2rem;
  font-size: 30px;
  margin: 0;
}

p {
  color: #0c3b2e;
  text-align: start;
  padding-left: 4.5rem;
  margin: 0;
}

span {
  color: #0c3b2e;
}

</style>