import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface MicrophoneControlsProps {
  microphoneEnabled: boolean;
  microphoneVolume: number;
  onToggleMicrophone: () => void;
  onMicrophoneVolumeChange: (volume: number) => void;
}

export const MicrophoneControls: React.FC<MicrophoneControlsProps> = ({
  microphoneEnabled,
  microphoneVolume,
  onToggleMicrophone,
  onMicrophoneVolumeChange
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
        <Mic className="w-4 h-4" />
        Microphone
      </h3>
      
      <div className="space-y-3">
        {/* Microphone Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Enable Microphone</span>
          <button
            onClick={onToggleMicrophone}
            className={`p-2 rounded-lg transition-colors ${
              microphoneEnabled 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {microphoneEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Microphone Volume */}
        {microphoneEnabled && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Microphone Volume
            </label>
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={microphoneVolume}
                onChange={(e) => onMicrophoneVolumeChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #8b5cf6 ${microphoneVolume}%, #374151 ${microphoneVolume}%, #374151 100%)`
                }}
              />
              <span className="text-gray-400 text-sm w-8">{microphoneVolume}</span>
            </div>
          </div>
        )}

        {/* Microphone Status */}
        <div className="text-xs text-gray-500">
          {microphoneEnabled ? (
            <span className="text-green-400">🎤 Microphone active - sing along!</span>
          ) : (
            <span>Click to enable microphone for singing</span>
          )}
        </div>
      </div>
    </div>
  );
};