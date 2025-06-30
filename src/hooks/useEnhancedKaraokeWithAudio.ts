import { useState, useEffect, useCallback } from 'react';
import { Song, QueueItem, KaraokeState, UserSession, UserPreferences } from '../types/karaoke';
import { audioSongs } from '../data/audioSongs';
import { useAudioEngine } from './useAudioEngine';

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

export const useEnhancedKaraokeWithAudio = () => {
  const audioEngine = useAudioEngine();
  
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

  const [songs] = useState<Song[]>(audioSongs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Sync audio engine state with component state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isPlaying: audioEngine.state.isPlaying,
      currentTime: audioEngine.state.currentTime,
      volume: audioEngine.state.volume,
      keyAdjustment: audioEngine.state.keyAdjustment
    }));
  }, [audioEngine.state]);

  // Update lyrics based on current time
  useEffect(() => {
    if (!state.currentSong) return;

    const currentLyricIndex = state.currentSong.lyrics.findIndex(
      lyric => state.currentTime >= lyric.startTime && state.currentTime < lyric.endTime
    );

    if (currentLyricIndex !== -1 && currentLyricIndex !== state.currentLyricIndex) {
      setState(prev => ({ ...prev, currentLyricIndex }));
    }
  }, [state.currentTime, state.currentSong, state.currentLyricIndex]);

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

  const playSong = useCallback(async (song: Song) => {
    if (!song.audioUrl) {
      console.warn('No audio URL provided for song:', song.title);
      return;
    }

    setIsLoadingAudio(true);
    
    try {
      // Stop current playback
      audioEngine.stop();
      
      // Load new audio
      const loaded = await audioEngine.loadAudio(song.audioUrl);
      
      if (loaded) {
        setState(prev => ({
          ...prev,
          currentSong: song,
          currentTime: 0,
          currentLyricIndex: 0,
          userSession: {
            ...prev.userSession,
            recentSongs: [song.id, ...prev.userSession.recentSongs.slice(0, 9)]
          }
        }));
        
        // Start playback
        await audioEngine.play();
      } else {
        console.error('Failed to load audio for song:', song.title);
      }
    } catch (error) {
      console.error('Error playing song:', error);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [audioEngine]);

  const togglePlayPause = useCallback(async () => {
    if (audioEngine.state.isPlaying) {
      audioEngine.pause();
    } else {
      await audioEngine.play();
    }
  }, [audioEngine]);

  const setVolume = useCallback((volume: number) => {
    audioEngine.setVolume(volume);
    setState(prev => ({
      ...prev,
      volume,
      userSession: {
        ...prev.userSession,
        preferences: { ...prev.userSession.preferences, volume }
      }
    }));
  }, [audioEngine]);

  const setKeyAdjustment = useCallback((keyAdjustment: number) => {
    audioEngine.setKeyAdjustment(keyAdjustment);
    setState(prev => ({
      ...prev,
      keyAdjustment,
      userSession: {
        ...prev.userSession,
        preferences: { ...prev.userSession.preferences, keyAdjustment }
      }
    }));
  }, [audioEngine]);

  const setTempoAdjustment = useCallback((tempoAdjustment: number) => {
    // Note: Tempo adjustment would require more complex audio processing
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
    if (state.queue.length > 0) {
      const nextItem = state.queue[0];
      setState(prev => ({
        ...prev,
        queue: prev.queue.slice(1),
        userSession: {
          ...prev.userSession,
          songsCompleted: prev.userSession.songsCompleted + 1,
          totalScore: prev.userSession.totalScore + 100
        }
      }));
      playSong(nextItem.song);
    } else {
      audioEngine.stop();
      setState(prev => ({
        ...prev,
        currentSong: null,
        userSession: {
          ...prev.userSession,
          songsCompleted: prev.userSession.songsCompleted + 1,
          totalScore: prev.userSession.totalScore + 100
        }
      }));
    }
  }, [state.queue, playSong, audioEngine]);

  const seekTo = useCallback((time: number) => {
    audioEngine.seekTo(time);
  }, [audioEngine]);

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

  const toggleMicrophone = useCallback(async () => {
    if (audioEngine.state.microphoneEnabled) {
      audioEngine.disableMicrophone();
    } else {
      await audioEngine.enableMicrophone();
    }
  }, [audioEngine]);

  const setMicrophoneVolume = useCallback((volume: number) => {
    audioEngine.setMicrophoneVolume(volume);
  }, [audioEngine]);

  return {
    state: {
      ...state,
      isPlaying: audioEngine.state.isPlaying,
      currentTime: audioEngine.state.currentTime,
      waveformProgress: audioEngine.state.duration > 0 ? (audioEngine.state.currentTime / audioEngine.state.duration) * 100 : 0
    },
    songs: filteredSongs,
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    genres,
    favorites,
    isLoadingAudio,
    addToQueue,
    removeFromQueue,
    playSong,
    togglePlayPause,
    setVolume,
    setKeyAdjustment,
    setTempoAdjustment,
    skipSong,
    seekTo,
    toggleFavorite,
    // Audio-specific functions
    toggleMicrophone,
    setMicrophoneVolume,
    getFrequencyData: audioEngine.getFrequencyData,
    audioEngineState: audioEngine.state
  };
};