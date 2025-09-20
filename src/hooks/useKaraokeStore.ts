import { create } from 'zustand';
import { Song, QueueItem, UserSession } from '../types/karaoke';

interface KaraokeState {
  songs: Song[];
  queue: QueueItem[];
  favorites: string[];
  userSession: UserSession | null;
  setSongs: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (id: string) => void;
  toggleFavorite: (songId: string) => void;
  setUserSession: (session: UserSession) => void;
}

export const useKaraokeStore = create<KaraokeState>((set, get) => ({
  songs: [],
  queue: [],
  favorites: [],
  userSession: null,
  setSongs: (songs) => set({ songs }),
  addToQueue: (song) => set((state) => ({
    queue: [...state.queue, { song, id: `${song.id}-${Date.now()}`, addedAt: new Date(), position: state.queue.length }]
  })),
  removeFromQueue: (id) => set((state) => ({
    queue: state.queue.filter(item => item.id !== id)
  })),
  toggleFavorite: (songId) => set((state) => ({
    favorites: state.favorites.includes(songId)
      ? state.favorites.filter(id => id !== songId)
      : [...state.favorites, songId]
  })),
  setUserSession: (session) => set({ userSession: session })
}));
