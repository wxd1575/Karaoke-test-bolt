import React, { useState } from 'react';
import { Plus, Music, Trash2, Edit3, Share, Lock, Unlock } from 'lucide-react';
import { Song, PlaylistData } from '../types/karaoke';

interface PlaylistManagerProps {
  playlists: PlaylistData[];
  songs: Song[];
  onCreatePlaylist: (name: string, songIds: string[]) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onPlayPlaylist: (playlist: PlaylistData) => void;
  onRenamePlaylist: (playlistId: string, newName: string) => void;
  onTogglePublic: (playlistId: string) => void;
  onReorderSongs: (playlistId: string, fromIdx: number, toIdx: number) => void;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  songs,
  onCreatePlaylist,
  onDeletePlaylist,
  onPlayPlaylist,
  onRenamePlaylist,
  onTogglePublic,
  onReorderSongs
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [reorderPlaylistId, setReorderPlaylistId] = useState<string | null>(null);
  const [draggedSongIdx, setDraggedSongIdx] = useState<number | null>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim(), selectedSongs);
      setNewPlaylistName('');
      setSelectedSongs([]);
      setShowCreateForm(false);
    }
  };

  const getSongById = (songId: string) => songs.find(song => song.id === songId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-cyan-400" />
          My Playlists
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all"
          title="Create Playlist"
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Playlist</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              title="Playlist Name"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Songs (optional)
              </label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {songs.slice(0, 10).map(song => (
                  <label key={song.id} className="flex items-center gap-3 p-2 hover:bg-gray-700/30 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSongs([...selectedSongs, song.id]);
                        } else {
                          setSelectedSongs(selectedSongs.filter(id => id !== song.id));
                        }
                      }}
                      className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
                      title={`Select ${song.title}`}
                    />
                    <div>
                      <div className="text-white text-sm">{song.title}</div>
                      <div className="text-gray-400 text-xs">{song.artist}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-medium transition-colors"
                title="Create Playlist"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlaylistName('');
                  setSelectedSongs([]);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-medium transition-colors"
                title="Cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlists Grid */}
      <div className="grid gap-4">
        {playlists.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
            <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No playlists yet</p>
            <p className="text-gray-500 text-sm">Create your first playlist to get started</p>
          </div>
        ) : (
          playlists.map(playlist => (
            <div key={playlist.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/50 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  {editingPlaylistId === playlist.id ? (
                    <div className="flex items-center gap-2">
                      <label htmlFor={`rename-input-${playlist.id}`} className="sr-only">Rename Playlist</label>
                      <input
                        id={`rename-input-${playlist.id}`}
                        className="px-2 py-1 rounded bg-gray-900 border border-cyan-500 text-white text-lg font-semibold focus:outline-none"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            onRenamePlaylist(playlist.id, renameValue.trim() || playlist.name);
                            setEditingPlaylistId(null);
                          } else if (e.key === 'Escape') {
                            setEditingPlaylistId(null);
                          }
                        }}
                        autoFocus
                        title="Rename Playlist"
                        placeholder="Rename playlist..."
                      />
                      <button
                        className="px-2 py-1 bg-cyan-500 rounded text-white font-medium hover:bg-cyan-600"
                        onClick={() => {
                          onRenamePlaylist(playlist.id, renameValue.trim() || playlist.name);
                          setEditingPlaylistId(null);
                        }}
                        title="Save Playlist Name"
                      >Save</button>
                      <button
                        className="px-2 py-1 bg-gray-600 rounded text-white font-medium hover:bg-gray-500"
                        onClick={() => setEditingPlaylistId(null)}
                        title="Cancel Rename"
                      >Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{playlist.name}</h3>
                      <button
                        className="p-1 hover:bg-cyan-500/20 rounded text-gray-400 hover:text-cyan-400 transition-colors"
                        title="Rename Playlist"
                        onClick={() => {
                          setEditingPlaylistId(playlist.id);
                          setRenameValue(playlist.name);
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-gray-400 text-sm">{playlist.songs.length} songs</p>
                  <p className="text-gray-500 text-xs">
                    Created {new Date(playlist.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTogglePublic(playlist.id)}
                    className="p-1 rounded hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                    title={playlist.isPublic ? 'Make Private' : 'Make Public'}
                  >
                    {playlist.isPublic ? (
                      <Unlock className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeletePlaylist(playlist.id)}
                    className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Song Preview & Reorder UI */}
              <div className="space-y-1 mb-4">
                {reorderPlaylistId === playlist.id ? (
                  <div>
                    <ul>
                      {playlist.songs.map((songId, idx) => {
                        const song = getSongById(songId);
                        return song ? (
                          <li
                            key={songId}
                            className={`flex items-center gap-2 p-2 rounded-lg bg-gray-900/40 mb-1 cursor-move border border-gray-700 ${draggedSongIdx === idx ? 'ring-2 ring-cyan-400' : ''}`}
                            draggable
                            onDragStart={() => setDraggedSongIdx(idx)}
                            onDragOver={e => { e.preventDefault(); }}
                            onDrop={e => {
                              e.preventDefault();
                              if (draggedSongIdx !== null && draggedSongIdx !== idx) {
                                onReorderSongs(playlist.id, draggedSongIdx, idx);
                              }
                              setDraggedSongIdx(null);
                            }}
                            onDragEnd={() => setDraggedSongIdx(null)}
                            title={`Move ${song.title}`}
                          >
                            <span className="text-gray-400 font-mono w-6">{idx + 1}</span>
                            <span className="flex-1 text-gray-300 truncate">{song.title} - {song.artist}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                    <button
                      className="mt-2 px-3 py-1 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-xs font-medium"
                      onClick={() => setReorderPlaylistId(null)}
                      title="Done Reordering"
                    >Done</button>
                  </div>
                ) : (
                  <>
                    {playlist.songs.slice(0, 3).map(songId => {
                      const song = getSongById(songId);
                      return song ? (
                        <div key={songId} className="text-sm text-gray-300 truncate">
                          {song.title} - {song.artist}
                        </div>
                      ) : null;
                    })}
                    {playlist.songs.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{playlist.songs.length - 3} more songs
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onPlayPlaylist(playlist)}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:from-cyan-600 hover:to-purple-600 transition-all"
                  title="Play All Songs"
                >
                  Play All
                </button>
                <button
                  className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 text-sm transition-colors"
                  onClick={() => setReorderPlaylistId(reorderPlaylistId === playlist.id ? null : playlist.id)}
                  title="Reorder Songs"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="ml-1">Reorder</span>
                </button>
                <button className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 text-sm transition-colors" title="Share Playlist">
                  <Share className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};