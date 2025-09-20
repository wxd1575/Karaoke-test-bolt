import { useQuery } from '@tanstack/react-query';
import { MusixmatchAPI } from '../data/musixmatchApi';

export function useMusixmatchLyrics(trackId: string) {
  return useQuery({
    queryKey: ['musixmatch-lyrics', trackId],
    queryFn: async () => {
      if (!trackId) return '';
      const lyrics = await MusixmatchAPI.getLyrics(trackId);
      return lyrics;
    },
    enabled: !!trackId
  });
}

export function useMusixmatchSyncedLyrics(trackId: string) {
  return useQuery({
    queryKey: ['musixmatch-synced-lyrics', trackId],
    queryFn: async () => {
      if (!trackId) return '';
      const syncedLyrics = await MusixmatchAPI.getSyncedLyrics(trackId);
      return syncedLyrics;
    },
    enabled: !!trackId
  });
}
