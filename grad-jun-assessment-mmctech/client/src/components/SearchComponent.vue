<template>
  <div class="search-bar">
    <div class="search-container">
    <input
      type="text"
      placeholder="Search songs, albums or srtists"
      v-model="searchInput"
      @input="performSearch"
      @keydown.up.prevent="navigateResults(-1)"
      @keydown.down.prevent="navigateResults(1)"
      @keydown.enter.prevent="selectResult"
      @blur="shouldDeleteSearchInput = true"
      @focus="shouldDeleteSearchInput = false"
      />
    <search-icon class="search-icon"/>
  </div>
  <div v-if="results && searchInput.trim()" class="result-panel">
    <h3>Songs</h3>
    <div v-if="results.songs.length" class="result-container">
      <div
        v-for="(song, index) in limitElements(results.songs)"
        :key="song._id"
        :class="{ highlighted: isHighlighted(index) }"
        @mouseenter="highlightedIndex = index"
        @click.prevent="resultClicked(index)"
      >
        {{ song.title }}
      </div>
    </div>
    <p v-else>No songs found.</p>

    <h3>Albums</h3>
    <div v-if="results.albums.length" class="result-container">
      <div
        v-for="(album, index) in limitElements(results.albums)"
        :key="album._id"
        :class="{ highlighted: isHighlighted(index + Math.min(results.songs.length, 4)) }"
        @mouseenter="highlightedIndex = index + Math.min(results.songs.length, 4)"
        @click.prevent="resultClicked(index + Math.min(results.songs.length, 4))"
      >
        {{ album.title }}
      </div>
    </div>
    <p v-else>No albums found.</p>

    <h3>Artists</h3>
    <div v-if="results.artists.length" class="result-container">
      <div
        v-for="(artist, index) in limitElements(results.artists)"
        :key="artist._id"
        :class="{ highlighted: isHighlighted(index + Math.min(results.songs.length, 4) + Math.min(results.albums.length, 4)) }"
        @mouseenter="highlightedIndex = index + Math.min(results.songs.length, 4) + Math.min(results.albums.length, 4)"
        @click.prevent="resultClicked(index + Math.min(results.songs.length, 4) + Math.min(results.albums.length, 4))"
      >
        {{ artist.name }}
      </div>
    </div>
    <p v-else>No artists found.</p>
  </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';
import { fetchSearchResults } from '@/services/api.js'
import { useRouter } from 'vue-router'
import { SearchIcon } from '@heroicons/vue/solid';

export default {
  components: {
    SearchIcon,
  },
  setup() {
    const router = useRouter();
    
    const searchInput = ref('');
    const shouldDeleteSearchInput = ref(false);
    const results = ref(null);
    const highlightedIndex = ref(-1);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const performSearch = debounce(async () => {
      if (searchInput.value.trim()) {
        try {
          results.value = await fetchSearchResults(searchInput.value);
          highlightedIndex.value = -1;
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        results.value = null;
        highlightedIndex.value = -1;
      }
    }, 300)

    const navigateResults = (step) => {
      if (!results.value) return;
      
      const totalSongs = Math.min(results.value.songs.length, 4);
      const totalAlbums = Math.min(results.value.albums.length, 4);
      const totalArtists = Math.min(results.value.artists.length, 4);
      const totalResults = totalSongs + totalAlbums + totalArtists;

      if (totalResults === 0) return;

      highlightedIndex.value = (highlightedIndex.value + step + totalResults) % totalResults;

      if (highlightedIndex.value < totalSongs) {
        searchInput.value = results.value.songs[highlightedIndex.value].title
      } else if (highlightedIndex.value < totalSongs + totalAlbums) {
        searchInput.value = results.value.albums[highlightedIndex.value - totalSongs].title
      } else {
        searchInput.value = results.value.artists[highlightedIndex.value - totalSongs - totalAlbums].name
      }
    }

    const selectResult = async () => {
      if (highlightedIndex.value === -1 || !results.value) {
        router.push({name: 'SearchPage', query: { input: searchInput.value } });
        searchInput.value = '';
        return;
      }

      const totalSongs = Math.min(results.value.songs.length, 4);
      const totalAlbums = Math.min(results.value.albums.length, 4);

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
      searchInput.value = '';
    }
    
    const resultClicked = (index) => {
      highlightedIndex.value = index;
      selectResult();
    }

    const isHighlighted = (index) => {
      return highlightedIndex.value === index;
    }
      
    const limitElements = (list) => {
      return list.slice(0, 4);
    }

    watch(
      () => shouldDeleteSearchInput.value,
      async () => {
        if (shouldDeleteSearchInput.value) {
          try {
            await sleep(200);
            searchInput.value = '';
          } catch (err) {
            console.log('Error: ', err);
          }
        }
      }
    )

    return {
      searchInput,
      shouldDeleteSearchInput,
      results,
      performSearch,
      navigateResults,
      selectResult,
      resultClicked,
      isHighlighted,
      limitElements,
    }
  },
}
</script> 

<style scoped>
.result-container {
  margin-left: 1.5rem;
  cursor: pointer;
}

.search-container {
  position: relative;
  display: inline-block;
  margin-bottom: 3rem;
  margin-left: 4rem;
}

.search-icon {
  width: 20px;
  position: absolute;
  top: 8px;
  right: 12px;
}

.highlighted {
  background-color: #6d9773;
  border-radius: 5px;
    padding-left: 1rem;
}

input {
  width: 30rem;
  height: 2rem;
  border-radius: 50px;
  padding-left: 1rem;
  background: #e6f2ec;
}

.result-panel {
  position: absolute;
  left: 86px;
  top: 67px;
  background-color: #e6f2ec;
  width: 25.5rem;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 0 2rem 1rem 2rem;
  border-style: solid;
  border-width: 1px;
}

h3 {
  font-size: medium;
  margin-bottom: 0.5rem;
}

h3, p, div {
  color: #0c3b2e;
}
</style>
