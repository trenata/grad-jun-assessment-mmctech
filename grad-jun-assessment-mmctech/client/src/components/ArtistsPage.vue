<template>
  <div>
    <h1>Artists</h1>
    
    <div class="card-conatiner">
      <div v-for="artist in artists" :key="artist._id" class="card"> 
        <h2>{{ artist.name }}</h2>
        <div class="card-body">
          <p>Albums:</p>
          <div class="album-container">
            <div v-for="album in filteredAlbums(artist._id)" :key="album._id"> 
              <router-link 
                :to="{ name: 'AlbumDetailsPage', params: { albumId: album._id } }"
                class="rlink">
                {{ album.title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import { fetchAllArtists, fetchAllAlbums } from '@/services/api.js';

export default {
  name: 'ArtistsPage',
  setup() {
    const albums = ref();
    const artists = ref();

    const filteredAlbums = (artistId) => {
      if (albums.value) {
        return albums.value.filter(album => album.artist === artistId);
      }
    };

    onBeforeMount(async () => {
      try {
        albums.value = await fetchAllAlbums(); 
        artists.value = await fetchAllArtists(); 
      } catch (err) {
        console.log('Error: ', err);
      }
    });

    return {
      albums,
      artists,
      filteredAlbums,
    }
  }
}
</script>

<style scoped>
.album-container {
  text-align: start;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 16px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
  background-color: #e6f2ec;
  width: 200px;
  margin: 2rem 1rem 0 1rem;
  border-radius: 10px;
  padding-bottom: 16px;
  
}

.card-conatiner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 3rem;
  margin-top: 0;
}

.rlink {
  text-decoration: none;
  color: #0c3b2e;
}

.rlink:hover, .rlink:focus {
  text-decoration: none;
  color: #6d9773;
}

h1 {
  color: #0c3b2e;
  text-align: start;
  padding-left: 4rem;
  font-size: 50px;
  margin: 0;
}

h2 {
  background-color: #0c3b2e;
  color: #e6f2ec;
  padding: 16px;
  margin: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

p {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #0c3b2e;
}

</style>
