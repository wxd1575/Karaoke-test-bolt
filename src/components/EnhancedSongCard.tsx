import React from 'react';
import { Song } from '../types/karaoke';
import { Play, Plus, Clock, Star, Music, Calendar, Zap } from 'lucide-react';

interface EnhancedSongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (song: Song) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-400 bg-green-400/20 border-green-400/30';
    case 'Medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
    case 'Hard': return 'text-red-400 bg-red-400/20 border-red-400/30';
    default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
  }
};

const getPopularityStars = (popularity: number = 0) => {
  const stars = Math.round((popularity / 100) * 5);
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
    />
  ));
};

export const EnhancedSongCard: React.FC<EnhancedSongCardProps> = ({ 
  song, 
  onPlay, 
  onAddToQueue,
  isFavorite = false,
  onToggleFavorite
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={song.coverImage}
            alt={`${song.title} cover`}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <button
            onClick={() => onPlay(song)}
            className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
            <Play className="w-8 h-8 text-white" fill="white" />
          </button>
          
          {/* Popularity indicator */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{song.popularity}</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-white text-lg mb-1 truncate">{song.title}</h3>
              <p className="text-cyan-300 text-sm font-medium">{song.artist}</p>
              {song.album && (
                <p className="text-gray-400 text-xs">{song.album}</p>
              )}
            </div>
            
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(song)}
                className={`p-1 rounded-full transition-colors ${
                  isFavorite ? 'text-pink-400' : 'text-gray-500 hover:text-pink-400'
                }`}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-pink-400' : ''}`} />
              </button>
            )}
          </div>
          
          {/* Song metadata */}
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
            {song.year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{song.year}</span>
              </div>
            )}
            {song.key && (
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3" />
                <span>{song.key}</span>
              </div>
            )}
            {song.tempo && (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{song.tempo} BPM</span>
              </div>
            )}
          </div>
          
          {/* Tags and ratings */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600">
              {song.genre}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(song.difficulty)}`}>
              {song.difficulty}
            </span>
            <div className="flex items-center gap-1">
              {getPopularityStars(song.popularity)}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(song.duration)}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onAddToQueue(song)}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors border border-gray-600 hover:border-gray-500"
                title="Add to queue"
              >
                <Plus className="w-4 h-4 text-gray-300" />
              </button>
              <button
                onClick={() => onPlay(song)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};