import React from 'react';
import { Song } from '../types/karaoke';
import { Play, Plus, Clock, Star } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-400 bg-green-400/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
    case 'Hard': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

export const SongCard: React.FC<SongCardProps> = ({ song, onPlay, onAddToQueue }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={song.coverImage}
            alt={`${song.title} cover`}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <button
            onClick={() => onPlay(song)}
            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-6 h-6 text-white" fill="white" />
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg mb-1 truncate">{song.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{song.artist}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
              {song.genre}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(song.difficulty)}`}>
              <Star className="w-3 h-3 inline mr-1" />
              {song.difficulty}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(song.duration)}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onAddToQueue(song)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Add to queue"
              >
                <Plus className="w-4 h-4 text-gray-300" />
              </button>
              <button
                onClick={() => onPlay(song)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
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