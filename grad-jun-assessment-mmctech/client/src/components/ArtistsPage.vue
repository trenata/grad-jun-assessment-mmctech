<template>
  <div>
    <ul>
      <li v-for="artist in artists" :key="artist._id"> 
        <h1>{{ artist.name }}</h1>
        <ol>
          <li v-for="album in filteredAlbums(artist._id)" :key="album._id"> 
            <router-link :to="{ name: 'AlbumDetailsPage', params: { albumId: album._id } }">
              {{ album.title }}
            </router-link>
          </li>
        </ol>
      </li>
    </ul>
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
      albums.value = await fetchAllAlbums(); 
      artists.value = await fetchAllArtists(); 
    });

    return {
      albums,
      artists,
      filteredAlbums,
    }
  }
}
</script>
