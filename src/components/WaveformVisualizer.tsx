import React from 'react';

interface WaveformVisualizerProps {
  waveformData: number[];
  progress: number;
  duration: number;
  currentTime: number;
  onSeek?: (time: number) => void;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  waveformData,
  progress,
  duration,
  currentTime,
  onSeek
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;
    onSeek(seekTime);
  };

  return (
    <div className="w-full h-16 bg-gray-900/50 rounded-lg p-2 cursor-pointer" onClick={handleClick}>
      <div className="flex items-end h-full gap-1">
        {waveformData.map((amplitude, index) => {
          const barProgress = (index / waveformData.length) * 100;
          const isPlayed = barProgress <= progress;
          const height = Math.max(amplitude * 100, 4);
          
          return (
            <div
              key={index}
              className={`flex-1 rounded-sm transition-colors duration-150 ${
                isPlayed 
                  ? 'bg-gradient-to-t from-cyan-400 to-purple-400' 
                  : 'bg-gray-600'
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div 
        className="relative -mt-16 h-16 pointer-events-none"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-0 w-0.5 h-full bg-white shadow-lg shadow-white/50" />
      </div>
      
      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};