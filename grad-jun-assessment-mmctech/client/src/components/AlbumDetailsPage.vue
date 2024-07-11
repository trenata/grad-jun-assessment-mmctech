<template>
  <div>
    <h1 v-if="album">{{ album.title }}</h1>
    <p v-if="artist" class="artist-text">By {{ artist.name }}</p>
    
    <div class="container">
      <div class="left-side card">
        <div v-for="(song, index) in songs" :key="song._id" class="songs-container">
          <span>{{ index + 1 }}. {{ song.title }}</span> 
          <span>{{ song.length }}</span>
        </div>
      </div>
      <p v-if="album" class="description card"><b>Description:</b><br> {{ album.description }}</p>
    </div>
  </div>
</template>
  
<script>
import { onBeforeMount, ref, watch } from 'vue';
import { fetchAlbum, fetchSongsFromAlbum, fetchArtist } from '@/services/api.js';
import { useRoute } from 'vue-router'


export default {
  name: 'AlbumDetailsPage',
  props: {
    albumId: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const route = useRoute()
    
    const album = ref();
    const songs = ref();
    const artist = ref();

    watch(
      () => route.params.albumId,
      async () => {
        album.value = await fetchAlbum(props.albumId); 
        songs.value = await fetchSongsFromAlbum(props.albumId);
        artist.value = await fetchArtist(album.value.artist);
      }
    )
    
    onBeforeMount(async () => {
      album.value = await fetchAlbum(props.albumId); 
      songs.value = await fetchSongsFromAlbum(props.albumId);
      artist.value = await fetchArtist(album.value.artist);
    })

    return {
      album,
      songs,
      artist,
    }
  }
};
</script>

<style scoped>
.artist-text {
  font-weight: bold;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
  padding: 28px 0 16px 0;
  background-color: #e6f2ec;
  margin: 2rem 1rem 0 1rem;
  border-radius: 10px;
}

.left-side {
  flex: 2; 
  margin-right: 1rem; 
}

.songs-container {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
  margin: 1rem 4rem;
}

.description {
  flex: 1; 
  width: auto; 
  padding: 1rem 2rem;
  line-height: 150%;
  text-align: justify;
  text-justify: inter-word;
}

h1 {
  color: #0c3b2e;
  text-align: start;
  padding-left: 4rem;
  font-size: 50px;
  margin: 0;
}

p {
  color: #0c3b2e;
  text-align: start;
  padding-left: 4.1rem;
  margin: 0;
}

span {
  color: #0c3b2e;
}

</style>