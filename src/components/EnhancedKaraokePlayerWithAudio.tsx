import React from 'react';
import { Song } from '../types/karaoke';
import { Play, Pause, SkipForward, Volume2, ArrowLeft, Settings, Mic, MicOff, Loader } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { AudioVisualizer } from './AudioVisualizer';
import { MicrophoneControls } from './MicrophoneControls';

interface EnhancedKaraokePlayerWithAudioProps {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  keyAdjustment: number;
  tempoAdjustment: number;
  currentLyricIndex: number;
  microphoneEnabled: boolean;
  microphoneVolume: number;
  isLoadingAudio: boolean;
  frequencyData: Uint8Array;
  onTogglePlayPause: () => void;
  onSkip: () => void;
  onVolumeChange: (volume: number) => void;
  onKeyChange: (key: number) => void;
  onTempoChange: (tempo: number) => void;
  onBack: () => void;
  onSeek?: (time: number) => void;
  onToggleMicrophone: () => void;
  onMicrophoneVolumeChange: (volume: number) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const EnhancedKaraokePlayerWithAudio: React.FC<EnhancedKaraokePlayerWithAudioProps> = ({
  song,
  isPlaying,
  currentTime,
  volume,
  keyAdjustment,
  tempoAdjustment,
  currentLyricIndex,
  microphoneEnabled,
  microphoneVolume,
  isLoadingAudio,
  frequencyData,
  onTogglePlayPause,
  onSkip,
  onVolumeChange,
  onKeyChange,
  onTempoChange,
  onBack,
  onSeek,
  onToggleMicrophone,
  onMicrophoneVolumeChange
}) => {
  const progress = (currentTime / song.duration) * 100;
  const [showSettings, setShowSettings] = React.useState(false);

  const getLyricTypeColor = (type?: string) => {
    switch (type) {
      case 'chorus': return 'text-cyan-300';
      case 'bridge': return 'text-purple-300';
      case 'outro': return 'text-pink-300';
      default: return 'text-white';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-purple-900/50 to-cyan-900/50 flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm border-b border-gray-700/50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Library
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{song.title}</h2>
          <p className="text-cyan-300 font-medium">{song.artist}</p>
          {song.album && <p className="text-gray-400 text-sm">{song.album}</p>}
          {isLoadingAudio && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Loader className="w-4 h-4 animate-spin text-cyan-400" />
              <span className="text-sm text-cyan-400">Loading audio...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMicrophone}
            className={`p-2 rounded-lg transition-colors ${
              microphoneEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {microphoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="relative z-20 bg-black/40 backdrop-blur-sm border-b border-gray-700/50 p-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Key Adjustment</label>
              <input
                type="range"
                min="-12"
                max="12"
                value={keyAdjustment}
                onChange={(e) => onKeyChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                {keyAdjustment > 0 ? '+' : ''}{keyAdjustment} semitones
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tempo Adjustment</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={tempoAdjustment}
                onChange={(e) => onTempoChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center text-sm text-gray-400 mt-1">
                {tempoAdjustment > 0 ? '+' : ''}{tempoAdjustment}%
              </div>
            </div>
            
            <MicrophoneControls
              microphoneEnabled={microphoneEnabled}
              microphoneVolume={microphoneVolume}
              onToggleMicrophone={onToggleMicrophone}
              onMicrophoneVolumeChange={onMicrophoneVolumeChange}
            />
          </div>
        </div>
      )}

      {/* Audio Visualizer */}
      <div className="relative z-10 h-20 bg-black/20 backdrop-blur-sm border-b border-gray-700/50">
        <AudioVisualizer
          frequencyData={frequencyData}
          isPlaying={isPlaying}
          className="opacity-80"
        />
      </div>

      {/* Lyrics Display */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8 overflow-hidden">
        <div className="max-w-6xl w-full text-center">
          {song.lyrics.length > 0 ? (
            <div className="space-y-6">
              {song.lyrics.map((lyric, index) => {
                const isActive = index === currentLyricIndex;
                const isPast = index < currentLyricIndex;

                // Word-level highlighting logic
                let activeWordIndex = -1;
                if (isActive && lyric.words && lyric.words.length > 0) {
                  activeWordIndex = lyric.words.findIndex(
                    (word, i) =>
                      currentTime >= word.startTime &&
                      (i === (lyric.words?.length ?? 0) - 1 || currentTime < (lyric.words?.[i + 1]?.startTime ?? Infinity))
                  );
                }

                // Use type color for active line
                const typeColor = isActive ? getLyricTypeColor(lyric.type) : '';

                return (
                  <div
                    key={lyric.id}
                    className={[
                      'transition-all duration-700 ease-out relative',
                      isActive && 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold scale-110 drop-shadow-2xl text-white',
                      isActive && 'bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-cyan-900/40 rounded-xl py-2 px-4 mx-auto shadow-lg ring-2 ring-cyan-400/30 animate-glow',
                      isPast && 'text-2xl sm:text-3xl md:text-4xl text-gray-400/60 scale-95 opacity-60',
                      !isActive && !isPast && 'text-xl sm:text-2xl md:text-3xl text-gray-600/40 scale-90 opacity-40',
                      typeColor
                    ].filter(Boolean).join(' ')}
                    aria-live={isActive ? 'polite' : undefined}
                    aria-atomic={isActive ? 'true' : undefined}
                  >
                    {isActive && lyric.words && lyric.words.length > 0 ? (
                      <span className="inline-block">
                        {lyric.words.map((word, wIdx) => {
                          // Animation classes for active word
                          const isWordActive = wIdx === activeWordIndex;
                          const isWordPast = wIdx < activeWordIndex;
                          const isWordFuture = wIdx > activeWordIndex;
                          return (
                            <span
                              key={wIdx}
                              className={[
                                'inline-block transition-all duration-200 mx-1',
                                isWordActive && 'text-cyan-300 font-extrabold scale-125 underline underline-offset-4 decoration-cyan-400 drop-shadow-[0_0_16px_rgba(34,211,238,0.8)] animate-pulse',
                                isWordPast && 'text-gray-300/70 font-semibold',
                                isWordFuture && 'text-white/60',
                              ].filter(Boolean).join(' ')}
                              aria-current={isWordActive ? 'true' : undefined}
                            >
                              {word.text}
                            </span>
                          );
                        })}
                      </span>
                    ) : (
                      lyric.text
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-400 text-2xl">No lyrics available</div>
          )}
        </div>
      </div>

      {/* Waveform Visualizer */}
      <div className="relative z-10 px-6 mb-4">
        {song.waveformData && (
          <WaveformVisualizer
            waveformData={song.waveformData}
            progress={progress}
            duration={song.duration}
            currentTime={currentTime}
            onSeek={onSeek}
          />
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm p-6 border-t border-gray-700/50">
        <div className="max-w-4xl mx-auto">
          {/* Main Controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={onTogglePlayPause}
              disabled={isLoadingAudio}
              className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAudio ? (
                <Loader className="w-10 h-10 text-white animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-10 h-10 text-white" fill="white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              )}
            </button>
            
            <button
              onClick={onSkip}
              className="w-14 h-14 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-colors border border-gray-600"
            >
              <SkipForward className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #8b5cf6 ${volume}%, #374151 ${volume}%, #374151 100%)`
              }}
            />
            <span className="text-gray-400 text-sm w-8">{volume}</span>
          </div>

          {/* Time Display */}
          <div className="flex justify-center mt-4">
            <span className="text-gray-400 text-sm">
              {formatTime(currentTime)} / {formatTime(song.duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};