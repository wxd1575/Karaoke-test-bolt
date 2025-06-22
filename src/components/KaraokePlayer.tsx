import React from 'react';
import { Song, LyricLine } from '../types/karaoke';
import { Play, Pause, SkipForward, Volume2, ArrowLeft } from 'lucide-react';

interface KaraokePlayerProps {
  song: Song;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  currentLyricIndex: number;
  onTogglePlayPause: () => void;
  onSkip: () => void;
  onVolumeChange: (volume: number) => void;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const KaraokePlayer: React.FC<KaraokePlayerProps> = ({
  song,
  isPlaying,
  currentTime,
  volume,
  currentLyricIndex,
  onTogglePlayPause,
  onSkip,
  onVolumeChange,
  onBack
}) => {
  const progress = (currentTime / song.duration) * 100;

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Library
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{song.title}</h2>
          <p className="text-purple-300">{song.artist}</p>
        </div>
        
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Lyrics Display */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-4xl w-full text-center">
          {song.lyrics.length > 0 ? (
            <div className="space-y-4">
              {song.lyrics.map((lyric, index) => (
                <div
                  key={lyric.id}
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-500 ${
                    index === currentLyricIndex
                      ? 'text-white scale-110 drop-shadow-2xl'
                      : index < currentLyricIndex
                      ? 'text-purple-300/60 scale-95'
                      : 'text-gray-500/40 scale-90'
                  }`}
                  style={{
                    textShadow: index === currentLyricIndex ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none'
                  }}
                >
                  {lyric.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-xl">No lyrics available</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-4 text-white text-sm mb-2">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{formatTime(song.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/20 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            onClick={onTogglePlayPause}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            )}
          </button>
          
          <button
            onClick={onSkip}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
          >
            <SkipForward className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${volume}%, #374151 ${volume}%, #374151 100%)`
            }}
          />
          <span className="text-gray-400 text-sm w-8">{volume}</span>
        </div>
      </div>
    </div>
  );
};