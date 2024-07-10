<template>
  <div>
    <input
      type="text"
      placeholder="Search songs, albums or srtists"
      v-model="searchInput"
      @input="performSearch"
      @keydown.up.prevent="navigateResults(-1)"
      @keydown.down.prevent="navigateResults(1)"
      @keydown.enter.prevent="selectResult"
    />
    <div v-if="results && searchInput.trim()">
      <h2>Songs</h2>
      <ul v-if="results.songs.length">
        <li
          v-for="(song, index) in results.songs"
          :key="song._id"
          :class="{ highlighted: isHighlighted(index) }"
          @mouseenter="highlightedIndex = index"
          @click.prevent="resultClicked(index)"
        >
          {{ song.title }}
        </li>
      </ul>
      <p v-else>No songs found.</p>

      <h2>Albums</h2>
      <ul v-if="results.albums.length">
        <li
          v-for="(album, index) in results.albums"
          :key="album._id"
          :class="{ highlighted: isHighlighted(index + results.songs.length) }"
          @mouseenter="highlightedIndex = index + results.songs.length"
          @click.prevent="resultClicked(index + results.songs.length)"
        >
          {{ album.title }}
        </li>
      </ul>
      <p v-else>No albums found.</p>

      <h2>Artists</h2>
      <ul v-if="results.artists.length">
        <li
          v-for="(artist, index) in results.artists"
          :key="artist._id"
          :class="{ highlighted: isHighlighted(index + results.songs.length + results.albums.length) }"
          @mouseenter="highlightedIndex = index + results.songs.length + results.albums.length"
          @click.prevent="resultClicked(index + results.songs.length + results.albums.length)"
        >
          {{ artist.name }}
        </li>
      </ul>
      <p v-else>No artists found.</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import debounce from 'lodash/debounce';
import { fetchSearchResults } from '@/services/api.js'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter();
    
    const searchInput = ref('');
    const results = ref(null);
    const highlightedIndex = ref(-1);

    const performSearch = debounce(async () => {
      if (searchInput.value.trim()) {
        try {
          results.value = await fetchSearchResults(searchInput.value);
          highlightedIndex.value = -1;
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        results.value = null;
        highlightedIndex.value = -1;
      }
    }, 300)

    const navigateResults = (step) => {
      if (!results.value) return;
      
      const totalSongs = results.value.songs.length;
      const totalAlbums = results.value.albums.length;
      const totalArtists = results.value.artists.length;
      const totalResults = totalSongs + totalAlbums + totalArtists;

      if (totalResults === 0) return;

      highlightedIndex.value = (highlightedIndex.value + step) % totalResults;

      if (highlightedIndex.value < totalSongs) {
        searchInput.value = results.value.songs[highlightedIndex.value].title
      } else if (highlightedIndex.value < totalSongs + totalAlbums) {
        searchInput.value = results.value.albums[highlightedIndex.value - totalSongs].title
      } else {
        console.log(results.value.artists, highlightedIndex.value )
        searchInput.value = results.value.artists[highlightedIndex.value - totalSongs - totalAlbums].name
      }
    }

    const selectResult = async () => {
      if (highlightedIndex.value === -1 || !results.value) {
        router.push({name: 'SearchPage', query: { input: searchInput.value } });
        return;
      }

      const totalSongs = results.value.songs.length;
      const totalAlbums = results.value.albums.length;

      if (highlightedIndex.value < totalSongs) {
        router.push({name: 'AlbumDetailsPage', params: { 
          albumId: results.value.songs[highlightedIndex.value].album 
        } });
      } else if (highlightedIndex.value < totalSongs + totalAlbums) {
        router.push({name: 'AlbumDetailsPage', params: { 
          albumId: results.value.albums[highlightedIndex.value - totalSongs]._id 
        } });
      } else {
        router.push({name: 'ArtistDetailsPage', params: { 
          artistId: results.value.artists[highlightedIndex.value - totalSongs - totalAlbums]._id 
        } });
      }
    }
    
    const resultClicked = (index) => {
      highlightedIndex.value = index;
      selectResult();
    }

    const isHighlighted = (index) => {
      return highlightedIndex.value === index;
    }
      
    return {
      searchInput,
      results,
      performSearch,
      navigateResults,
      selectResult,
      resultClicked,
      isHighlighted,
    }
  },
}
</script> 
<style scoped>
li.highlighted {
  background-color: #f0f0f0;
}
</style>
