import { useState, useEffect, useCallback } from 'react';
import { Song, QueueItem, KaraokeState, UserSession, UserPreferences } from '../types/karaoke';
import { enhancedSongs } from '../data/enhancedSongs';

const initialUserPreferences: UserPreferences = {
  volume: 70,
  keyAdjustment: 0,
  tempoAdjustment: 0,
  lyricsSize: 'medium',
  theme: 'dark',
  autoAdvance: true
};

const initialUserSession: UserSession = {
  id: `session-${Date.now()}`,
  startTime: new Date(),
  songsCompleted: 0,
  totalScore: 0,
  favoriteGenres: [],
  recentSongs: [],
  preferences: initialUserPreferences
};

export const useEnhancedKaraoke = () => {
  const [state, setState] = useState<KaraokeState>({
    currentSong: null,
    queue: [],
    isPlaying: false,
    currentTime: 0,
    volume: 70,
    keyAdjustment: 0,
    tempoAdjustment: 0,
    currentLyricIndex: 0,
    userSession: initialUserSession,
    waveformProgress: 0
  });

  const [songs] = useState<Song[]>(enhancedSongs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter songs based on search and genre
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.album?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Get unique genres
  const genres = ['All', ...Array.from(new Set(songs.map(song => song.genre)))];

  const addToQueue = useCallback((song: Song) => {
    const queueItem: QueueItem = {
      song,
      id: `queue-${Date.now()}-${Math.random()}`,
      addedAt: new Date(),
      position: state.queue.length
    };
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, queueItem]
    }));
  }, [state.queue.length]);

  const removeFromQueue = useCallback((queueItemId: string) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter(item => item.id !== queueItemId)
    }));
  }, []);

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    setState(prev => {
      const result = Array.from(prev.queue);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update positions
      return {
        ...prev,
        queue: result.map((item, index) => ({ ...item, position: index }))
      };
    });
  }, []);

  const playNext = useCallback(() => {
    setState(prev => {
      if (prev.queue.length === 0) {
        return { ...prev, currentSong: null, isPlaying: false };
      }
      
      const nextItem = prev.queue[0];
      return {
        ...prev,
        currentSong: nextItem.song,
        queue: prev.queue.slice(1),
        currentTime: 0,
        currentLyricIndex: 0,
        isPlaying: true,
        waveformProgress: 0
      };
    });
  }, []);

  const playSong = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      currentSong: song,
      currentTime: 0,
      currentLyricIndex: 0,
      isPlaying: true,
      waveformProgress: 0,
      userSession: {
        ...prev.userSession,
        recentSongs: [song.id, ...prev.userSession.recentSongs.slice(0, 9)]
      }
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({
      ...prev,
      volume,
      userSession: {
        ...prev.userSession,
        preferences: { ...prev.userSession.preferences, volume }
      }
    }));
  }, []);

  const setKeyAdjustment = useCallback((keyAdjustment: number) => {
    setState(prev => ({
      ...prev,
      keyAdjustment,
      userSession: {
        ...prev.userSession,
        preferences: { ...prev.userSession.preferences, keyAdjustment }
      }
    }));
  }, []);

  const setTempoAdjustment = useCallback((tempoAdjustment: number) => {
    setState(prev => ({
      ...prev,
      tempoAdjustment,
      userSession: {
        ...prev.userSession,
        preferences: { ...prev.userSession.preferences, tempoAdjustment }
      }
    }));
  }, []);

  const skipSong = useCallback(() => {
    playNext();
  }, [playNext]);

  const seekTo = useCallback((time: number) => {
    setState(prev => {
      if (!prev.currentSong) return prev;
      
      const clampedTime = Math.max(0, Math.min(time, prev.currentSong.duration));
      const newLyricIndex = prev.currentSong.lyrics.findIndex(
        lyric => clampedTime >= lyric.startTime && clampedTime < lyric.endTime
      );
      
      return {
        ...prev,
        currentTime: clampedTime,
        currentLyricIndex: Math.max(0, newLyricIndex),
        waveformProgress: (clampedTime / prev.currentSong.duration) * 100
      };
    });
  }, []);

  const toggleFavorite = useCallback((song: Song) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(song.id);
      if (isFavorite) {
        return prev.filter(id => id !== song.id);
      } else {
        return [...prev, song.id];
      }
    });
  }, []);

  // Simulate time progression when playing
  useEffect(() => {
    if (!state.isPlaying || !state.currentSong) return;

    const interval = setInterval(() => {
      setState(prev => {
        if (!prev.currentSong) return prev;
        
        const newTime = prev.currentTime + 1;
        if (newTime >= prev.currentSong.duration) {
          // Song finished, play next
          if (prev.queue.length > 0) {
            const nextItem = prev.queue[0];
            return {
              ...prev,
              currentSong: nextItem.song,
              queue: prev.queue.slice(1),
              currentTime: 0,
              currentLyricIndex: 0,
              waveformProgress: 0,
              userSession: {
                ...prev.userSession,
                songsCompleted: prev.userSession.songsCompleted + 1,
                totalScore: prev.userSession.totalScore + 100
              }
            };
          } else {
            return {
              ...prev,
              currentSong: null,
              isPlaying: false,
              currentTime: 0,
              currentLyricIndex: 0,
              waveformProgress: 0,
              userSession: {
                ...prev.userSession,
                songsCompleted: prev.userSession.songsCompleted + 1,
                totalScore: prev.userSession.totalScore + 100
              }
            };
          }
        }

        // Update current lyric index
        const currentLyricIndex = prev.currentSong.lyrics.findIndex(
          lyric => newTime >= lyric.startTime && newTime < lyric.endTime
        );

        return {
          ...prev,
          currentTime: newTime,
          currentLyricIndex: Math.max(0, currentLyricIndex),
          waveformProgress: (newTime / prev.currentSong.duration) * 100
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.currentSong]);

  return {
    state,
    songs: filteredSongs,
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    genres,
    favorites,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    playSong,
    togglePlayPause,
    setVolume,
    setKeyAdjustment,
    setTempoAdjustment,
    skipSong,
    seekTo,
    toggleFavorite,
    playNext
  };
};