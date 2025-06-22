import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Song } from '../types/karaoke';
import { SongCard } from './SongCard';

interface SongLibraryProps {
  songs: Song[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export const SongLibrary: React.FC<SongLibraryProps> = ({
  songs,
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  onPlay,
  onAddToQueue
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Karaoke Library
        </h1>
        <p className="text-gray-400">Choose your next performance</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search songs or artists..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-400 mb-4">
        {songs.length} song{songs.length !== 1 ? 's' : ''} found
      </div>

      {/* Song Grid */}
      <div className="grid gap-4">
        {songs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No songs found</div>
            <div className="text-gray-400">Try adjusting your search or filter</div>
          </div>
        ) : (
          songs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={onPlay}
              onAddToQueue={onAddToQueue}
            />
          ))
        )}
      </div>
    </div>
  );
};