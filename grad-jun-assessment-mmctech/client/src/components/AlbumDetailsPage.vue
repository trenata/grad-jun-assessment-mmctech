<template>
  <div>
    <h1>Album Details</h1>
    <p v-if="album">Album Name: {{ album.title }}</p>
    <p v-if="album">Album Description: {{ album.description }}</p>
    <ol>
      <li v-for="song in songs" :key="song._id">{{ song.title }} {{ song.length }}</li>
    </ol>
  </div>
</template>
  
<script>
import { onBeforeMount, ref, watch } from 'vue';
import { fetchAlbum, fetchSongsFromAlbum } from '@/services/api.js';
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

    watch(
      () => route.params.albumId,
      async () => {
        album.value = await fetchAlbum(props.albumId); 
        songs.value = await fetchSongsFromAlbum(props.albumId);
      }
    )
    
    onBeforeMount(async () => {
      album.value = await fetchAlbum(props.albumId); 
      songs.value = await fetchSongsFromAlbum(props.albumId); 
    })

    return {
      album,
      songs,
    }
  }
};
</script>