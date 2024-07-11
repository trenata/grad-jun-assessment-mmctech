import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_URL;

// Fetch data
export const fetchAllArtists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/artists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all artists:', error);
    throw error;
  }
};

export const fetchArtist = async (artistId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/artists/${artistId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all artists:', error);
    throw error;
  }
};

export const fetchAllAlbums = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all albums:', error);
    throw error;
  }
};

export const fetchArtistAlbums = async (artistId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums`, { params: { artistId: artistId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all albums:', error);
    throw error;
  }
};

export const fetchAlbum = async (albumId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching album:', error);
    throw error;
  }
};

export const fetchSongsFromAlbum = async (albumId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs?albumId=${albumId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching songs from album:', error);
    throw error;
  }
};

export const fetchSearchResults = async (searchInput) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, { params: { input: searchInput } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all artists:', error);
    throw error;
  }
};

// CRUD songs
export const addNewSong = async (newSong) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/songs`, newSong);
    return response.data;
  } catch (error) {
    console.error('Error fetching songs from album:', error);
    throw error;
  }
};

export const editSong = async (songId, newSong) => {
  try {
    const dataToSend = {};
    if (newSong.title) {
      dataToSend.title = newSong.title;
    }
    if (newSong.length) {
      dataToSend.length = newSong.length;
    }
    const response = await axios.put(`${API_BASE_URL}/songs/${songId}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error fetching songs from album:', error);
    throw error;
  }
};

export const deleteSong = async (songId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/songs/${songId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching songs from album:', error);
    throw error;
  }
};
