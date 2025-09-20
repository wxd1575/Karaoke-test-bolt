import axios from 'axios';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

export const SpotifyAPI = {
  async searchSongs(query: string, token: string) {
    const res = await axios.get(`${SPOTIFY_BASE_URL}/search`, {
      params: { q: query, type: 'track', limit: 20 },
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.tracks.items;
  },
  async getTrackDetails(id: string, token: string) {
    const res = await axios.get(`${SPOTIFY_BASE_URL}/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  async getAudioFeatures(id: string, token: string) {
    const res = await axios.get(`${SPOTIFY_BASE_URL}/audio-features/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  },
  async getPreviewUrl(id: string, token: string) {
    const details = await SpotifyAPI.getTrackDetails(id, token);
    return details.preview_url;
  }
};
