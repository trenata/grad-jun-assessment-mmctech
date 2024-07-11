<template>
  <div>
    <h1 v-if="album">{{ album.title }}</h1>
    <p v-if="artist" class="artist-text">By {{ artist.name }}</p>
    <div class="songs-button-container">
      <div class="container">
        <div class="left-side card">
          <div v-for="(song, index) in songs" :key="song._id" class="songs-container">
            <span>{{ index + 1 }}. {{ song.title }}</span>
            <div>
              <span class="song-length">{{ song.length }}</span>
              <button @click="clickedEditButton(song._id)" class="btn-icon">
                <pencil-icon class="icon"></pencil-icon>
              </button>
              <button @click="clickedDeleteButton(song._id, song.title)"  class="btn-icon">
                <trash-icon class="icon"></trash-icon>
              </button>
            </div> 
          </div>
        </div>
        <p v-if="album" class="description card"><b>Description:</b><br> {{ album.description }}</p>
      </div>
      <div class="btn-conainer">
        <button @click="clickedAddNewButton" class="add-button">Add New Song</button>
      </div>
    </div>

    <!-- Edit song modal -->
    <div v-if="showModalEdit" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModalEdit = false">&times;</span>
        <h2>Edit Song</h2>
        <form @submit.prevent="edit(chosenSongId)">
          <div class="form-group">
            <label for="title">Song title:</label>
            <input type="text" id="title" v-model="crudSong.title" class="form-control">
          </div>
          <div class="form-group">
            <label for="length">Song length:</label>
            <input type="text" id="length" v-model="crudSong.length" class="form-control">
          </div>
          <button type="submit" class="btn btn-primary">Edit</button>
        </form>
      </div>
    </div>

    <!-- Delete song modal -->
    <div v-if="showModalDelete" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModalDelete = false">&times;</span>
        <h2>Delete Song {{ chosenSongName }}?</h2>
        <form @submit.prevent="del(chosenSongId)">
          <button type="submit" class="btn btn-danger">Yes</button>
          <button type="button" @click="showModalDelete = false" class="btn btn-secondary">No</button>
        </form>
      </div>
    </div>

    <!-- Add new song modal -->
    <div v-if="showModalAddNew" class="modal">
    <div class="modal-content">
      <span class="close" @click="showModalAddNew = false">&times;</span>
      <h2>Add New Song</h2>
      <form @submit.prevent="addItem">
        <div class="form-group">
          <label for="title">Song title:</label>
          <input type="text" id="title" v-model="crudSong.title" required>
        </div>
        <div class="form-group">
          <label for="length">Song length:</label>
          <input type="text" id="length" v-model="crudSong.length" required>
        </div>
        <button type="submit" @click="add" class="btn btn-primary">Add</button>
      </form>
    </div>
  </div>

  </div>
</template>
  
<script>
import { onBeforeMount, ref, watch, reactive } from 'vue';
import { fetchAlbum, fetchSongsFromAlbum, fetchArtist, addNewSong, editSong, deleteSong } from '@/services/api.js';
import { useRoute } from 'vue-router'
import { TrashIcon, PencilIcon } from '@heroicons/vue/solid';


export default {
  name: 'AlbumDetailsPage',
  components: {
    TrashIcon,
    PencilIcon,
  },
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
    const showModalAddNew = ref(false);
    const showModalEdit = ref(false);
    const showModalDelete = ref(false);
    const chosenSongId = ref();
    const chosenSongName = ref();
    const missingData = ref(false);

    const crudSong = reactive({
      title: '',
      length: '',
      album: null,
    });

    watch(
      () => route.params.albumId,
      async () => {
        album.value = await fetchAlbum(props.albumId); 
        songs.value = await fetchSongsFromAlbum(props.albumId);
        artist.value = await fetchArtist(album.value.artist);
      }
    )

    const clickedAddNewButton = () => {
      showModalAddNew.value = true;
      crudSong.title = '';
      crudSong.length = '';
    }

    const clickedEditButton = (songId) => {
      showModalEdit.value = true;
      chosenSongId.value = songId;
      crudSong.title = '';
      crudSong.length = '';
    }

    const clickedDeleteButton = (songId, songTitle) => {
      chosenSongName.value = songTitle
      showModalDelete.value = true;
      crudSong.title = '';
      crudSong.length = '';
      chosenSongId.value = songId;
    }
    
    const add = async () => {
      if (!crudSong.title || !crudSong.length) {
        missingData.value = true;
        return;
      }

      await addNewSong(crudSong);
      songs.value = await fetchSongsFromAlbum(props.albumId); 
      showModalAddNew.value = false;
      missingData.value = false;
    };

    const edit = async (songId) => {
      await editSong(songId, crudSong);
      songs.value = await fetchSongsFromAlbum(props.albumId); 
      showModalEdit.value = false;
    };

    const del = async (songId) => {
      crudSong.title = '';
      crudSong.length = '';
      await deleteSong(songId);
      songs.value = await fetchSongsFromAlbum(props.albumId); 
      showModalDelete.value = false;
    };

    onBeforeMount(async () => {
      album.value = await fetchAlbum(props.albumId); 
      songs.value = await fetchSongsFromAlbum(props.albumId);
      artist.value = await fetchArtist(album.value.artist);
      crudSong.album = album.value._id;
    })

    return {
      album,
      songs,
      artist,
      showModalAddNew,
      showModalEdit,
      showModalDelete,
      chosenSongId,
      chosenSongName,
      crudSong,
      missingData,
      clickedAddNewButton,
      clickedEditButton,
      clickedDeleteButton,
      add,
      edit,
      del,
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.btn {
  background-color: #6d9773;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
  margin: 0.5rem 0
}


.add-button {
  background-color: #e6f2ec;
  border: none;
  color: 0c 3b 2e;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: white;
}

.song-length {
  padding-right: 1rem;
}
.btn-icon {
  align-items: center;
  background-color: #e6f2ec;
  border: none;
  padding: 10px 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.songs-button-container {
  display: flex;
  flex-direction: column;
}

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

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

h2 {
  margin-top: 0;
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