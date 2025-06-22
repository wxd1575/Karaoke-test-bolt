import React from 'react';
import { QueueItem, UserSession } from '../types/karaoke';
import { X, Music, Trophy, Target, Clock, Star } from 'lucide-react';

interface QueueSidebarProps {
  queue: QueueItem[];
  userProgress: UserSession;
  onRemoveFromQueue: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatSessionTime = (startTime: Date) => {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
};

export const QueueSidebar: React.FC<QueueSidebarProps> = ({
  queue,
  userProgress,
  onRemoveFromQueue,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const totalQueueTime = queue.reduce((total, item) => total + item.song.duration, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700/50 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } lg:relative lg:translate-x-0 lg:block`}>
        
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Session Dashboard
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* User Progress */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 mb-4 border border-gray-700/30">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Session Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Songs Completed</span>
                <span className="text-sm font-bold text-white">{userProgress.songsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Score</span>
                <span className="text-sm font-bold text-cyan-400">{userProgress.totalScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Session Time</span>
                <span className="text-sm font-bold text-purple-400">
                  {formatSessionTime(userProgress.startTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-cyan-400" />
              Queue ({queue.length})
            </h3>
            {queue.length > 0 && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(totalQueueTime)}
              </div>
            )}
          </div>
          
          {queue.length === 0 ? (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">Queue is empty</p>
              <p className="text-gray-500 text-sm">Add songs to get started</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 rounded-lg p-3 border border-gray-700/30 hover:border-cyan-500/30 transition-all group backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">{item.song.title}</h4>
                      <p className="text-cyan-300 text-xs truncate">{item.song.artist}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs">{formatDuration(item.song.duration)}</span>
                          {item.song.difficulty && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-300">
                              {item.song.difficulty}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveFromQueue(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700/50 rounded transition-all"
                        >
                          <X className="w-3 h-3 text-gray-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};