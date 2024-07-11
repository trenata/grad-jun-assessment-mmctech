<template>
  <div v-if="results">
    <h1>Search Results</h1>
    
    <div class="card">
      <h2>Songs</h2>
      <div v-if="results.songs.length">
        <div v-for="song in results.songs" :key="song._id"  class="results-container">
          <router-link 
              :to="{ name: 'AlbumDetailsPage', params: { albumId: song.album } }"
              class="rlink">
              <span>{{ song.title }}</span> 
              <span> By {{ artistNamesSongs[song.album] }}</span>
            </router-link>
        </div>
      </div>
      <p v-else>No songs found.</p>

      <h2>Albums</h2>
      <div v-if="results.albums.length">
        <div v-for="album in results.albums" :key="album._id"  class="results-container">
          <router-link 
              :to="{ name: 'AlbumDetailsPage', params: { albumId: album._id } }"
              class="rlink">
            <span>{{ album.title }}</span> 
            <span> By {{ artistNames[album.artist] }}</span>
          </router-link>
        </div>
      </div>
      <p v-else>No albums found.</p>

      <h2>Artists</h2>
      <div v-if="results.artists.length">
        <div v-for="artist in results.artists" :key="artist._id"  class="results-container">
          <router-link 
              :to="{ name: 'ArtistDetailsPage', params: { artistId: artist._id } }"
              class="rlink">
            <span>{{ artist.name }}</span> 
          </router-link>
        </div>
      </div>
      <p v-else>No artists found.</p>
    </div> 
  </div>
</template>
  
<script> 
import { onBeforeMount, ref, watch } from 'vue';
import { fetchSearchResults, fetchArtist, fetchAlbum } from '@/services/api.js';
  
import { useRoute } from 'vue-router'
  
export default {
  name: 'SearchPage',
  props: {
    artistId: {
      type: String,
      required: true
    },
  },
  setup() {
    const route = useRoute();
    const results = ref(null);
    const artistNames = ref({});
    const artistNamesSongs = ref({});

    const fetchArtistName = async (artistId) => {
      if (!artistNames.value[artistId]) {
        const artist = await fetchArtist(artistId);
        artistNames.value[artistId] = artist.name;
      }
    };
    const fetchArtistNameSongs = async (albumId) => {
      if (!artistNamesSongs.value[albumId]) {
        const album = await fetchAlbum(albumId);
        const artist = await fetchArtist(album.artist);
        artistNamesSongs.value[albumId] = artist.name;
      }
    };

    watch(
      () => route.query.input,
      async () => {
        results.value = await fetchSearchResults(route.query.input);

        for (const album of results.value.albums) {
          await fetchArtistName(album.artist);
        }

        for (const song of results.value.songs) {
          await fetchArtistNameSongs(song.album);
        }
      }
    );

    onBeforeMount(async () => {
      results.value = await fetchSearchResults(route.query.input);

      for (const album of results.value.albums) {
        await fetchArtistName(album.artist);
      }

      for (const song of results.value.songs) {
        await fetchArtistNameSongs(song.album);
      }
    });

    return {
      results,
      artistNames,
      artistNamesSongs,
    };
}
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
  background-color: #e6f2ec;
  margin: 1rem 1rem 0 1rem;
  border-radius: 10px;
  padding: 1rem 0;
}

.description {
  text-align: left;
  margin: 40px;
}

.rlink {
  text-decoration: none;
  color: #0c3b2e;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  margin: 1rem 4rem;
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
  padding-left: 4rem;
  padding-top: 1rem;
  font-size: 30px;
  margin: 0;
}

span {
  color: #0c3b2e;
}

p {
  color: #0c3b2e;
  margin-left: 4rem;
}

</style>
