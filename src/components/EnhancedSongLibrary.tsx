import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Grid, List, Star, TrendingUp } from 'lucide-react';
import { Song } from '../types/karaoke';
import { EnhancedSongCard } from './EnhancedSongCard';

interface EnhancedSongLibraryProps {
  songs: Song[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  favorites: string[];
  onToggleFavorite: (song: Song) => void;
}

type SortOption = 'popularity' | 'title' | 'artist' | 'year' | 'duration';
type ViewMode = 'grid' | 'list';

export const EnhancedSongLibrary: React.FC<EnhancedSongLibraryProps> = ({
  songs,
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  onPlay,
  onAddToQueue,
  favorites,
  onToggleFavorite
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDecade, setSelectedDecade] = useState('All');

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const decades = ['All', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const filteredAndSortedSongs = React.useMemo(() => {
    let filtered = songs.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           song.album?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
      const matchesDifficulty = selectedDifficulty === 'All' || song.difficulty === selectedDifficulty;
      const matchesDecade = selectedDecade === 'All' || 
        (song.year && getDecade(song.year) === selectedDecade);
      
      return matchesSearch && matchesGenre && matchesDifficulty && matchesDecade;
    });

    // Sort songs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'year':
          return (b.year || 0) - (a.year || 0);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    return filtered;
  }, [songs, searchTerm, selectedGenre, selectedDifficulty, selectedDecade, sortBy]);

  const getDecade = (year: number): string => {
    const decade = Math.floor(year / 10) * 10;
    return `${decade}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          Professional Karaoke Library
        </h1>
        <p className="text-gray-400 text-lg">Discover your next performance</p>
      </div>

      {/* Search and Controls */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search songs, artists, or albums..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              showFilters 
                ? 'bg-cyan-500 border-cyan-500 text-white' 
                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Decade Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Era</label>
              <select
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {decades.map(decade => (
                  <option key={decade} value={decade}>{decade}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="popularity">Popularity</option>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="year">Year</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>{filteredAndSortedSongs.length} song{filteredAndSortedSongs.length !== 1 ? 's' : ''} found</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span>{favorites.length} favorites</span>
        </div>
      </div>

      {/* Song Grid/List */}
      <div className={viewMode === 'grid' ? 'grid gap-4' : 'space-y-4'}>
        {filteredAndSortedSongs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-2">No songs found</div>
            <div className="text-gray-400">Try adjusting your search or filters</div>
          </div>
        ) : (
          filteredAndSortedSongs.map(song => (
            <EnhancedSongCard
              key={song.id}
              song={song}
              onPlay={onPlay}
              onAddToQueue={onAddToQueue}
              isFavorite={favorites.includes(song.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
};