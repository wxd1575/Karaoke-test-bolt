import React, { useState, useEffect } from 'react';
import { useEnhancedKaraokeWithAudio } from './hooks/useEnhancedKaraokeWithAudio';
import { EnhancedSongLibrary } from './components/EnhancedSongLibrary';
import { EnhancedKaraokePlayerWithAudio } from './components/EnhancedKaraokePlayerWithAudio';
import { QueueSidebar } from './components/QueueSidebar';
import { PlaylistManager } from './components/PlaylistManager';
import { ScoreDisplay } from './components/ScoreDisplay';
import { VoiceEffectsPanel } from './components/VoiceEffectsPanel';
import { Menu, X } from 'lucide-react';
import { useKaraokeStore } from './hooks/useKaraokeStore';
import { useSpotifySearch } from './hooks/useSpotifySearch';
import Dexie from 'dexie';
import { useMusixmatchLyrics, useMusixmatchSyncedLyrics } from './hooks/useMusixmatchLyrics';
import { UserUpload } from './components/UserUpload';
import { Song, PlaylistData } from './types/karaoke';
import { UserAuthProvider, useUserAuth } from './context/UserAuthContext';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

// Dexie.js setup for offline caching
class KaraokeDB extends Dexie {
  songs: Dexie.Table<Song, string>;
  constructor() {
    super('karaoke-db');
    this.version(1).stores({ songs: 'id,title,artist,album,genre,year' });
    this.songs = this.table('songs');
  }
}
const db = new KaraokeDB();

type ViewMode = 'library' | 'player' | 'playlists';

function AuthGate({ children, navSlot }: { children: React.ReactNode; navSlot?: (logout: () => void) => React.ReactNode }) {
  const { user, logout } = useUserAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/30">
        <div className="bg-gray-900/80 p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">KaraokeFlow</h1>
          {showLogin ? (
            <>
              <Login onSuccess={() => setShowLogin(false)} />
              <div className="mt-4 text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <button className="text-cyan-400 underline" onClick={() => { setShowLogin(false); setShowRegister(true); }}>Register</button>
              </div>
            </>
          ) : showRegister ? (
            <>
              <Register onSuccess={() => setShowRegister(false)} />
              <div className="mt-4 text-center">
                <span className="text-gray-400">Already have an account? </span>
                <button className="text-cyan-400 underline" onClick={() => { setShowRegister(false); setShowLogin(true); }}>Login</button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold" onClick={() => setShowLogin(true)}>Login</button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg font-bold" onClick={() => setShowRegister(true)}>Register</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {navSlot && navSlot(logout)}
      {children}
    </>
  );
}

function App() {
  const [spotifyToken, setSpotifyToken] = useState('');
  const { songs, setSongs, favorites } = useKaraokeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: spotifyResults } = useSpotifySearch(searchTerm, spotifyToken);

  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [deleteFeedback, setDeleteFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleUserUpload = async (audioFile: File, lyricsFile: File) => {
    if (!audioFile || !lyricsFile) return;
    try {
      const lyricsText = await lyricsFile.text();
      let lyrics;
      if (lyricsFile.name.endsWith('.json')) {
        lyrics = JSON.parse(lyricsText);
      } else {
        lyrics = parseLRC(lyricsText);
      }
      const audioUrl = URL.createObjectURL(audioFile);
      setUserSongs((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          title: audioFile.name.replace(/\.[^/.]+$/, ''),
          artist: 'User Upload',
          album: '',
          genre: 'User',
          year: new Date().getFullYear(),
          duration: 0,
          key: '',
          tempo: 0,
          difficulty: 'Easy',
          lyrics,
          coverImage: '',
          audioUrl,
          waveformData: [],
        },
      ]);
    } catch {
      alert('Failed to parse lyrics file. Please upload a valid LRC or JSON file.');
    }
  };

  const handleDeleteUserSong = (songId: string) => {
    setUserSongs((prev) => {
      if (!prev.some((song) => song.id === songId)) {
        setDeleteFeedback({ type: 'error', message: 'Song not found.' });
        return prev;
      }
      setDeleteFeedback({ type: 'success', message: 'Song deleted.' });
      setTimeout(() => setDeleteFeedback(null), 2000);
      return prev.filter((song) => song.id !== songId);
    });
  };

  const handleDeleteUserLyrics = (songId: string) => {
    setUserSongs((prev) => {
      const song = prev.find((s) => s.id === songId);
      if (!song) {
        setDeleteFeedback({ type: 'error', message: 'Song not found.' });
        return prev;
      }
      if (song.lyrics.length === 0) {
        setDeleteFeedback({ type: 'error', message: 'No lyrics to delete.' });
        return prev;
      }
      setDeleteFeedback({ type: 'success', message: 'Lyrics deleted.' });
      setTimeout(() => setDeleteFeedback(null), 2000);
      return prev.map((s) =>
        s.id === songId ? { ...s, lyrics: [] } : s
      );
    });
  };

  function parseLRC(lrc: string) {
    const lines = lrc.split(/\r?\n/);
    const result = [];
    const wordTagRegex = /<([0-9]+):([0-9]+)(?:\.([0-9]+))?>([^<\s]+)/g;
    for (const line of lines) {
      const match = line.match(/\[(\d+):(\d+)(?:\.(\d+))?\](.*)/);
      if (match) {
        const min = parseInt(match[1], 10);
        const sec = parseInt(match[2], 10);
        const ms = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
        let text = match[4].trim();
        let words = undefined;
        if (text.includes('<')) {
          words = [];
          let wordMatch;
          let prevWord = null;
          while ((wordMatch = wordTagRegex.exec(text)) !== null) {
            const wMin = parseInt(wordMatch[1], 10);
            const wSec = parseInt(wordMatch[2], 10);
            const wMs = wordMatch[3] ? parseInt(wordMatch[3].padEnd(3, '0'), 10) : 0;
            const wText = wordMatch[4];
            const wordObj = {
              text: wText,
              startTime: wMin * 60 + wSec + wMs / 1000,
              endTime: 0
            };
            words.push(wordObj);
            if (prevWord) {
              prevWord.endTime = wordObj.startTime;
            }
            prevWord = wordObj;
          }
          text = text.replace(wordTagRegex, '').replace(/\s+/g, ' ').trim();
        }
        result.push({
          id: `${min}:${sec}.${ms}`,
          text,
          startTime: min * 60 + sec + ms / 1000,
          endTime: 0,
          words,
        });
      }
    }
    for (let i = 0; i < result.length - 1; i++) {
      const nextStart = result[i + 1].startTime;
      result[i].endTime = Math.max(nextStart, result[i].startTime + 1);
    }
    if (result.length) {
      result[result.length - 1].endTime = result[result.length - 1].startTime + 5;
    }
    for (const line of result) {
      if (line.words && line.words.length > 0) {
        for (let i = 0; i < line.words.length - 1; i++) {
        }
        line.words[line.words.length - 1].endTime = line.endTime;
      }
    }
    return result;
  }

  useEffect(() => {
    if (spotifyResults) {
      setSongs(spotifyResults);
      db.songs.bulkPut(spotifyResults);
    }
  }, [spotifyResults, setSongs]);

  const {
    state,
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
    toggleMicrophone,
    setMicrophoneVolume,
    getFrequencyData,
    audioEngineState,
    setVoiceEffectSettings,
    voiceEffect,
    reverbLevel,
    echoLevel
  } = useEnhancedKaraokeWithAudio();

  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLibrary = viewMode === 'library';
  const isPlaylists = viewMode === 'playlists';

  const handlePlaySong = (song: Song) => {
    playSong(song);
    setViewMode('player');
  };

  const handleBackToLibrary = () => {
    setViewMode('library');
  };

  const handleShowPlaylists = () => {
    setViewMode('playlists');
  };

  const handleToggleFavorite = (song: Song) => {
    useKaraokeStore.getState().toggleFavorite(song.id);
  };

  const currentTrackId = state.currentSong?.id || '';
  const { data: lyrics } = useMusixmatchLyrics(currentTrackId);
  const { data: syncedLyrics } = useMusixmatchSyncedLyrics(currentTrackId);

  useEffect(() => {
    if (lyrics && currentTrackId) {
      db.songs.update(currentTrackId, { lyrics });
    }
    if (syncedLyrics && currentTrackId) {
      db.songs.update(currentTrackId, { syncedLyrics });
    }
  }, [lyrics, syncedLyrics, currentTrackId]);

  const navSlot = (logout: () => void) => (
    <div className="container mx-auto px-4 max-w-6xl flex items-center justify-end mt-4 mb-2">
      <UserProfile />
      <button
        className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition"
        onClick={() => { logout(); setViewMode('library'); }}
      >
        Logout
      </button>
    </div>
  );

  const { user } = useUserAuth();
  const [userPlaylists, setUserPlaylists] = useState<PlaylistData[]>([]);

  // Load playlists for the current user from localStorage
  useEffect(() => {
    if (user) {
      const all = JSON.parse(localStorage.getItem('karaoke_playlists') || '{}');
      setUserPlaylists((all[user.id] || []).map((p: PlaylistData) => ({
        ...p,
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        isPublic: p.isPublic ?? false
      })));
    } else {
      setUserPlaylists([]);
    }
  }, [user]);

  // Save playlists for the current user to localStorage
  const saveUserPlaylists = (playlists: PlaylistData[]) => {
    setUserPlaylists(playlists);
    if (!user) return;
    const all = JSON.parse(localStorage.getItem('karaoke_playlists') || '{}');
    all[user.id] = playlists;
    localStorage.setItem('karaoke_playlists', JSON.stringify(all));
  };

  // Playlist CRUD handlers
  const handleCreatePlaylist = (name: string, songIds: string[] = []) => {
    const newList = [
      ...userPlaylists,
      {
        id: `pl-${Date.now()}`,
        name,
        songs: songIds,
        createdAt: new Date(),
        isPublic: false
      }
    ];
    saveUserPlaylists(newList);
  };
  const handleDeletePlaylist = (playlistId: string) => {
    const newList = userPlaylists.filter(p => p.id !== playlistId);
    saveUserPlaylists(newList);
  };
  const handleAddToPlaylist = (playlistId: string, songId: string) => {
    const newList = userPlaylists.map(p =>
      p.id === playlistId && !p.songs.includes(songId)
        ? { ...p, songs: [...p.songs, songId] }
        : p
    );
    saveUserPlaylists(newList);
  };
  const handleRemoveFromPlaylist = (playlistId: string, songId: string) => {
    const newList = userPlaylists.map(p =>
      p.id === playlistId
        ? { ...p, songs: p.songs.filter((id: string) => id !== songId) }
        : p
    );
    saveUserPlaylists(newList);
  };
  const handlePlayPlaylist = (playlist: PlaylistData) => {
    if (playlist && playlist.songs.length > 0) {
      const playlistSongs = playlist.songs
        .map(songId => songs.find(s => s.id === songId))
        .filter(Boolean) as Song[];
      if (playlistSongs.length > 0) {
        handlePlaySong(playlistSongs[0]);
        // Optionally add the rest to queue
        playlistSongs.slice(1).forEach(song => addToQueue(song));
      }
    }
  };

// --- Playlist Enhancements ---
// 1. Allow renaming playlists
const handleRenamePlaylist = (playlistId: string, newName: string) => {
  const newList = userPlaylists.map(p =>
    p.id === playlistId ? { ...p, name: newName } : p
  );
  saveUserPlaylists(newList);
};

// 2. Allow toggling playlist public/private
const handleTogglePublic = (playlistId: string) => {
  const newList = userPlaylists.map(p =>
    p.id === playlistId ? { ...p, isPublic: !p.isPublic } : p
  );
  saveUserPlaylists(newList);
};

// 3. Allow reordering songs in a playlist
const handleReorderSongs = (playlistId: string, fromIdx: number, toIdx: number) => {
  const newList = userPlaylists.map(p => {
    if (p.id !== playlistId) return p;
    const songs = [...p.songs];
    const [moved] = songs.splice(fromIdx, 1);
    songs.splice(toIdx, 0, moved);
    return { ...p, songs };
  });
  saveUserPlaylists(newList);
};

  return (
    <UserAuthProvider>
      <AuthGate navSlot={navSlot}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/30">
          <div className="flex h-screen">
            <div className="flex-1 overflow-hidden">
              {isLibrary ? (
                <div className="h-full overflow-y-auto">
                  <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        KaraokeFlow
                      </h1>
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700"
                        title="Open Queue Sidebar"
                      >
                        <Menu className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setViewMode('library')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          isLibrary
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        Song Library
                      </button>
                      <button
                        onClick={handleShowPlaylists}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          isPlaylists
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        My Playlists
                      </button>
                    </div>
                    <div className="p-4 bg-gray-900 text-white rounded-lg mb-6">
                      <label className="block mb-2">Spotify API Token:</label>
                      <input
                        type="text"
                        value={spotifyToken}
                        onChange={e => setSpotifyToken(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
                        placeholder="Paste your Spotify token here"
                      />
                    </div>
                    <EnhancedSongLibrary
                      songs={[...songs, ...userSongs]}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      selectedGenre={'All'}
                      onGenreChange={() => {}}
                      genres={['All']}
                      onPlay={handlePlaySong}
                      onAddToQueue={addToQueue}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                    <UserUpload onUpload={handleUserUpload} />
                    {deleteFeedback && (
                      <div className={`mt-2 text-${deleteFeedback.type === 'success' ? 'green' : 'red'}-400 font-medium`}>{deleteFeedback.message}</div>
                    )}
                    {userSongs.length > 0 && (
                      <div className="mt-6 bg-gray-900/60 rounded-xl p-4 border border-gray-700">
                        <h3 className="text-white font-semibold mb-2">Your Uploaded Songs</h3>
                        <ul className="space-y-2">
                          {userSongs.map((song) => (
                            <li key={song.id} className="flex items-center justify-between bg-gray-800/60 rounded-lg px-4 py-2">
                              <div>
                                <span className="text-cyan-300 font-medium">{song.title}</span>
                                <span className="text-gray-400 text-xs ml-2">({song.lyrics.length} lyrics lines)</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDeleteUserLyrics(song.id)}
                                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-bold transition"
                                  title="Delete lyrics for this song"
                                  disabled={song.lyrics.length === 0}
                                >
                                  Delete Lyrics
                                </button>
                                <button
                                  onClick={() => handleDeleteUserSong(song.id)}
                                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition"
                                  title="Delete this uploaded song"
                                >
                                  Delete Song
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : isPlaylists ? (
                <div className="h-full overflow-y-auto">
                  <div className="container mx-auto px-4 py-6 max-w-6xl">
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        KaraokeFlow
                      </h1>
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700"
                        title="Open Queue Sidebar"
                      >
                        <Menu className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setViewMode('library')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          isLibrary
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        Song Library
                      </button>
                      <button
                        onClick={handleShowPlaylists}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          isPlaylists
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        My Playlists
                      </button>
                    </div>
                    <PlaylistManager
                      playlists={userPlaylists}
                      songs={songs}
                      onCreatePlaylist={handleCreatePlaylist}
                      onDeletePlaylist={handleDeletePlaylist}
                      onAddToPlaylist={handleAddToPlaylist}
                      onRemoveFromPlaylist={handleRemoveFromPlaylist}
                      onPlayPlaylist={handlePlayPlaylist}
                      onRenamePlaylist={handleRenamePlaylist}
                      onTogglePublic={handleTogglePublic}
                      onReorderSongs={handleReorderSongs}
                    />
                  </div>
                </div>
              ) : state.currentSong ? (
                <div className="flex h-full">
                  <div className="flex-1">
                    <EnhancedKaraokePlayerWithAudio
                      song={{
                        ...state.currentSong,
                        lyrics:
                          (syncedLyrics && syncedLyrics.length > 0)
                            ? syncedLyrics
                            : (lyrics && lyrics.length > 0)
                            ? lyrics
                            : state.currentSong.lyrics || []
                      }}
                      isPlaying={state.isPlaying}
                      currentTime={state.currentTime}
                      volume={state.volume}
                      keyAdjustment={state.keyAdjustment}
                      tempoAdjustment={state.tempoAdjustment}
                      currentLyricIndex={state.currentLyricIndex}
                      microphoneEnabled={audioEngineState.microphoneEnabled}
                      microphoneVolume={audioEngineState.microphoneVolume}
                      isLoadingAudio={isLoadingAudio}
                      frequencyData={getFrequencyData()}
                      onTogglePlayPause={togglePlayPause}
                      onSkip={skipSong}
                      onVolumeChange={setVolume}
                      onKeyChange={setKeyAdjustment}
                      onTempoChange={setTempoAdjustment}
                      onBack={handleBackToLibrary}
                      onSeek={seekTo}
                      onToggleMicrophone={toggleMicrophone}
                      onMicrophoneVolumeChange={setMicrophoneVolume}
                    />
                  </div>
                  <div className="hidden xl:block w-80 bg-black/20 backdrop-blur-sm border-l border-gray-700/50 p-4 space-y-4">
                    <ScoreDisplay
                      currentScore={state.currentScore}
                      pitchAccuracy={state.pitchAccuracy}
                      isRecording={state.recordingMode}
                      songDifficulty={state.currentSong.difficulty}
                    />
                    <VoiceEffectsPanel
                      currentEffect={voiceEffect}
                      reverbLevel={reverbLevel}
                      echoLevel={echoLevel}
                      onEffectChange={(effect) => setVoiceEffectSettings(effect, reverbLevel, echoLevel)}
                      onReverbChange={(level) => setVoiceEffectSettings(voiceEffect, level, echoLevel)}
                      onEchoChange={(level) => setVoiceEffectSettings(voiceEffect, reverbLevel, level)}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">No song selected</h2>
                    <p className="text-gray-400 mb-6">Choose a song from the library to start your karaoke session</p>
                    <button
                      onClick={handleBackToLibrary}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                    >
                      Browse Library
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <QueueSidebar
                queue={state.queue}
                userProgress={state.userSession}
                onRemoveFromQueue={removeFromQueue}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
            <QueueSidebar
              queue={state.queue}
              userProgress={state.userSession}
              onRemoveFromQueue={removeFromQueue}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
          {isLibrary && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-xl flex items-center justify-center lg:hidden hover:shadow-2xl transition-all hover:scale-105"
              title="Open Queue Sidebar"
            >
              <Menu className="w-6 h-6 text-white" />
              {state.queue.length > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-pink-500 rounded-full text-white text-sm flex items-center justify-center font-bold shadow-lg">
                  {state.queue.length}
                </span>
              )}
            </button>
          )}
          {isLoadingAudio && (
            <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700 z-50">
              <div className="flex items-center gap-2 text-cyan-400">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading audio...</span>
              </div>
            </div>
          )}
        </div>
      </AuthGate>
    </UserAuthProvider>
  );
}

export default App;