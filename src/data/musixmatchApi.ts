import axios from 'axios';

const MUSIXMATCH_BASE_URL = 'https://api.musixmatch.com/ws/1.1';
const API_KEY = 'YOUR_MUSIXMATCH_API_KEY'; // Replace with your key

export const MusixmatchAPI = {
  async getLyrics(trackId: string) {
    const res = await axios.get(`${MUSIXMATCH_BASE_URL}/track.lyrics.get`, {
      params: { track_id: trackId, apikey: API_KEY }
    });
    return res.data.message.body.lyrics.lyrics_body;
  },
  async getSyncedLyrics(trackId: string) {
    const res = await axios.get(`${MUSIXMATCH_BASE_URL}/track.subtitle.get`, {
      params: { track_id: trackId, apikey: API_KEY }
    });
    return res.data.message.body.subtitle.subtitle_body;
  }
};
