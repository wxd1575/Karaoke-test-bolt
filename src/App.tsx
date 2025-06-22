import React, { useState } from 'react';
import { useEnhancedKaraoke } from './hooks/useEnhancedKaraoke';
import { EnhancedSongLibrary } from './components/EnhancedSongLibrary';
import { EnhancedKaraokePlayer } from './components/EnhancedKaraokePlayer';
import { QueueSidebar } from './components/QueueSidebar';
import { Menu, X } from 'lucide-react';

type ViewMode = 'library' | 'player';

function App() {
  const {
    state,
    songs,
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    genres,
    favorites,
    addToQueue,
    removeFromQueue,
    playSong,
    togglePlayPause,
    setVolume,
    setKeyAdjustment,
    setTempoAdjustment,
    skipSong,
    seekTo,
    toggleFavorite
  } = useEnhancedKaraoke();

  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePlaySong = (song: any) => {
    playSong(song);
    setViewMode('player');
  };

  const handleBackToLibrary = () => {
    setViewMode('library');
  };

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
                  >
                    <Menu className="w-5 h-5 text-white" />
                  </button>
                </div>

                <EnhancedSongLibrary
                  songs={songs}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedGenre={selectedGenre}
                  onGenreChange={setSelectedGenre}
                  genres={genres}
                  onPlay={handlePlaySong}
                  onAddToQueue={addToQueue}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            </div>
          ) : state.currentSong ? (
            <EnhancedKaraokePlayer
              song={state.currentSong}
              isPlaying={state.isPlaying}
              currentTime={state.currentTime}
              volume={state.volume}
              keyAdjustment={state.keyAdjustment}
              tempoAdjustment={state.tempoAdjustment}
              currentLyricIndex={state.currentLyricIndex}
              onTogglePlayPause={togglePlayPause}
              onSkip={skipSong}
              onVolumeChange={setVolume}
              onKeyChange={setKeyAdjustment}
              onTempoChange={setTempoAdjustment}
              onBack={handleBackToLibrary}
              onSeek={seekTo}
            />
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
    </div>
  );
}

export default App;