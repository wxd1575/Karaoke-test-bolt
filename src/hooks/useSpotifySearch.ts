import { useQuery } from '@tanstack/react-query';
import { SpotifyAPI } from '../data/spotifyApi';
import { useKaraokeStore } from './useKaraokeStore';

export function useSpotifySearch(query: string, token: string) {
  return useQuery({
    queryKey: ['spotify-search', query],
    queryFn: async () => {
      if (!query) return [];
      const tracks = await SpotifyAPI.searchSongs(query, token);
      return tracks;
    },
    enabled: !!query && !!token
  });
}
