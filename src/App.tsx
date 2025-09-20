import React, { useState, useEffect } from 'react';
import { useEnhancedKaraokeWithAudio } from './hooks/useEnhancedKaraokeWithAudio';
import { EnhancedSongLibrary } from './components/EnhancedSongLibrary';
import { EnhancedKaraokePlayerWithAudio } from './components/EnhancedKaraokePlayerWithAudio';
import { QueueSidebar } from './components/QueueSidebar';
<<<<<<< HEAD
import { Menu } from 'lucide-react';
import { useKaraokeStore } from './hooks/useKaraokeStore';
import { useSpotifySearch } from './hooks/useSpotifySearch';
import Dexie from 'dexie';
import { useMusixmatchLyrics, useMusixmatchSyncedLyrics } from './hooks/useMusixmatchLyrics';

// Dexie.js setup for offline caching
class KaraokeDB extends Dexie {
  songs: Dexie.Table<any, string>;
  constructor() {
    super('karaoke-db');
    this.version(1).stores({ songs: 'id,title,artist,album,genre,year' });
    this.songs = this.table('songs');
  }
}
const db = new KaraokeDB();
=======
import { PlaylistManager } from './components/PlaylistManager';
import { ScoreDisplay } from './components/ScoreDisplay';
import { VoiceEffectsPanel } from './components/VoiceEffectsPanel';
import { Menu, X } from 'lucide-react';
>>>>>>> origin/audio-playback

type ViewMode = 'library' | 'player' | 'playlists';

function App() {
  // Spotify token (for dev, replace with OAuth in production)
  const [spotifyToken, setSpotifyToken] = useState('');
  const { songs, setSongs, favorites } = useKaraokeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: spotifyResults } = useSpotifySearch(searchTerm, spotifyToken);

  useEffect(() => {
    if (spotifyResults) {
      setSongs(spotifyResults);
      db.songs.bulkPut(spotifyResults); // Cache for offline
    }
  }, [spotifyResults, setSongs]);

  const {
    state,
    isLoadingAudio,
    playlists,
    voiceEffect,
    reverbLevel,
    echoLevel,
    addToQueue,
    removeFromQueue,
    playSong,
    togglePlayPause,
    setVolume,
    setKeyAdjustment,
    setTempoAdjustment,
    skipSong,
    seekTo,
<<<<<<< HEAD
=======
    toggleFavorite,
    toggleRecording,
    createPlaylist,
    deletePlaylist,
    playPlaylist,
    setVoiceEffectSettings,
>>>>>>> origin/audio-playback
    toggleMicrophone,
    setMicrophoneVolume,
    getFrequencyData,
    audioEngineState
  } = useEnhancedKaraokeWithAudio();

  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePlaySong = (song: any) => {
    playSong(song);
    setViewMode('player');
  };

  const handleBackToLibrary = () => {
    setViewMode('library');
  };

<<<<<<< HEAD
  // Fix toggleFavorite prop type mismatch
  const handleToggleFavorite = (song: any) => {
    useKaraokeStore.getState().toggleFavorite(song.id);
  };

  // Lyrics integration for selected song
  const currentTrackId = state.currentSong?.id || '';
  const { data: lyrics } = useMusixmatchLyrics(currentTrackId);
  const { data: syncedLyrics } = useMusixmatchSyncedLyrics(currentTrackId);

  useEffect(() => {
    if (lyrics && currentTrackId) {
      db.songs.update(currentTrackId, { lyrics }); // Cache lyrics offline
    }
    if (syncedLyrics && currentTrackId) {
      db.songs.update(currentTrackId, { syncedLyrics }); // Cache synced lyrics offline
    }
  }, [lyrics, syncedLyrics, currentTrackId]);

=======
  const handleShowPlaylists = () => {
    setViewMode('playlists');
  };

>>>>>>> origin/audio-playback
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/30">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'library' ? (
            <div className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Mobile Header */}
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

<<<<<<< HEAD
                {/* Spotify Token Input (for dev/testing) */}
                <div className="p-4 bg-gray-900 text-white rounded-lg mb-6">
                  <label className="block mb-2">Spotify API Token:</label>
                  <input
                    type="text"
                    value={spotifyToken}
                    onChange={e => setSpotifyToken(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4"
                    placeholder="Paste your Spotify token here"
                  />
=======
                {/* Navigation */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setViewMode('library')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === 'library'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    Song Library
                  </button>
                  <button
                    onClick={handleShowPlaylists}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === 'playlists'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    My Playlists
                  </button>
>>>>>>> origin/audio-playback
                </div>

                <EnhancedSongLibrary
                  songs={songs}
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
              </div>
            </div>
          ) : viewMode === 'playlists' ? (
            <div className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    KaraokeFlow
                  </h1>
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700"
                  >
                    <Menu className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setViewMode('library')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === 'library'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    Song Library
                  </button>
                  <button
                    onClick={handleShowPlaylists}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === 'playlists'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    My Playlists
                  </button>
                </div>

                <PlaylistManager
                  playlists={playlists}
                  songs={songs}
                  onCreatePlaylist={createPlaylist}
                  onDeletePlaylist={deletePlaylist}
                  onAddToPlaylist={(playlistId, songId) => {}}
                  onRemoveFromPlaylist={(playlistId, songId) => {}}
                  onPlayPlaylist={playPlaylist}
                />
              </div>
            </div>
          ) : state.currentSong ? (
<<<<<<< HEAD
            <EnhancedKaraokePlayerWithAudio
              song={{ ...state.currentSong, lyrics: syncedLyrics || lyrics || [] }}
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
=======
            <div className="flex h-full">
              <div className="flex-1">
                <EnhancedKaraokePlayerWithAudio
                  song={state.currentSong}
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
              
              {/* Performance Panel - Desktop Only */}
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
>>>>>>> origin/audio-playback
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

        {/* Queue Sidebar - Desktop */}
        <div className="hidden lg:block">
          <QueueSidebar
            queue={state.queue}
            userProgress={state.userSession}
            onRemoveFromQueue={removeFromQueue}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* Queue Sidebar - Mobile */}
        <QueueSidebar
          queue={state.queue}
          userProgress={state.userSession}
          onRemoveFromQueue={removeFromQueue}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Floating Queue Button - Mobile */}
      {viewMode === 'library' && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-xl flex items-center justify-center lg:hidden hover:shadow-2xl transition-all hover:scale-105"
        >
          <Menu className="w-6 h-6 text-white" />
          {state.queue.length > 0 && (
            <span className="absolute -top-2 -right-2 w-7 h-7 bg-pink-500 rounded-full text-white text-sm flex items-center justify-center font-bold shadow-lg">
              {state.queue.length}
            </span>
          )}
        </button>
      )}

      {/* Audio Loading Indicator */}
      {isLoadingAudio && (
        <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700 z-50">
          <div className="flex items-center gap-2 text-cyan-400">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading audio...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;