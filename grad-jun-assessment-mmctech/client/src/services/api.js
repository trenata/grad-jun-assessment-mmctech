import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_URL;

export const fetchAllArtists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/artists`);
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
