import { useState, useEffect, useCallback } from 'react';
import { Song, QueueItem, KaraokeState, UserProgress } from '../types/karaoke';
import { sampleSongs } from '../data/sampleSongs';

const initialUserProgress: UserProgress = {
  songsCompleted: 0,
  totalScore: 0,
  favoriteGenres: [],
  recentSongs: []
};

export const useKaraoke = () => {
  const [state, setState] = useState<KaraokeState>({
    currentSong: null,
    queue: [],
    isPlaying: false,
    currentTime: 0,
    volume: 70,
    currentLyricIndex: 0,
    userProgress: initialUserProgress
  });

  const [songs] = useState<Song[]>(sampleSongs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Filter songs based on search and genre
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Get unique genres
  const genres = ['All', ...Array.from(new Set(songs.map(song => song.genre)))];

  const addToQueue = useCallback((song: Song) => {
    const queueItem: QueueItem = {
      song,
      id: `queue-${Date.now()}-${Math.random()}`,
      addedAt: new Date()
    };
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, queueItem]
    }));
  }, []);

  const removeFromQueue = useCallback((queueItemId: string) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter(item => item.id !== queueItemId)
    }));
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
        isPlaying: true
      };
    });
  }, []);

  const playSong = useCallback((song: Song) => {
    setState(prev => ({
      ...prev,
      currentSong: song,
      currentTime: 0,
      currentLyricIndex: 0,
      isPlaying: true
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
  }, []);

  const skipSong = useCallback(() => {
    playNext();
  }, [playNext]);

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
              userProgress: {
                ...prev.userProgress,
                songsCompleted: prev.userProgress.songsCompleted + 1,
                totalScore: prev.userProgress.totalScore + 100
              }
            };
          } else {
            return {
              ...prev,
              currentSong: null,
              isPlaying: false,
              currentTime: 0,
              currentLyricIndex: 0,
              userProgress: {
                ...prev.userProgress,
                songsCompleted: prev.userProgress.songsCompleted + 1,
                totalScore: prev.userProgress.totalScore + 100
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
          currentLyricIndex: Math.max(0, currentLyricIndex)
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
    addToQueue,
    removeFromQueue,
    playSong,
    togglePlayPause,
    setVolume,
    skipSong,
    playNext
  };
};