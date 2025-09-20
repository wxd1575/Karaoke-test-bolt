import React from 'react';
import { Mic, Volume2, Waves, Zap } from 'lucide-react';

interface VoiceEffectsPanelProps {
  currentEffect: string;
  reverbLevel: number;
  echoLevel: number;
  onEffectChange: (effect: string) => void;
  onReverbChange: (level: number) => void;
  onEchoChange: (level: number) => void;
}

const voiceEffects = [
  { id: 'none', name: 'Natural', icon: Mic, description: 'Your natural voice' },
  { id: 'reverb', name: 'Concert Hall', icon: Waves, description: 'Spacious reverb effect' },
  { id: 'echo', name: 'Echo Chamber', icon: Volume2, description: 'Classic echo effect' },
  { id: 'robot', name: 'Robot Voice', icon: Zap, description: 'Futuristic robot sound' }
];

export const VoiceEffectsPanel: React.FC<VoiceEffectsPanelProps> = ({
  currentEffect,
  reverbLevel,
  echoLevel,
  onEffectChange,
  onReverbChange,
  onEchoChange
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
        <Waves className="w-4 h-4 text-purple-400" />
        Voice Effects
      </h3>
      
      {/* Effect Selection */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {voiceEffects.map(effect => {
          const IconComponent = effect.icon;
          return (
            <button
              key={effect.id}
              onClick={() => onEffectChange(effect.id)}
              className={`p-3 rounded-lg border transition-all text-left ${
                currentEffect === effect.id
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-gray-700/30 border-gray-600/50 text-gray-300 hover:border-gray-500/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <IconComponent className="w-4 h-4" />
                <span className="font-medium text-sm">{effect.name}</span>
              </div>
              <p className="text-xs opacity-75">{effect.description}</p>
            </button>
          );
        })}
      </div>

      {/* Effect Controls */}
      {(currentEffect === 'reverb' || currentEffect === 'echo') && (
        <div className="space-y-3">
          {currentEffect === 'reverb' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reverb Level
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={reverbLevel}
                onChange={(e) => onReverbChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${reverbLevel}%, #374151 ${reverbLevel}%, #374151 100%)`
                }}
              />
              <div className="text-center text-xs text-gray-400 mt-1">
                {reverbLevel}%
              </div>
            </div>
          )}

          {currentEffect === 'echo' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Echo Level
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={echoLevel}
                onChange={(e) => onEchoChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${echoLevel}%, #374151 ${echoLevel}%, #374151 100%)`
                }}
              />
              <div className="text-center text-xs text-gray-400 mt-1">
                {echoLevel}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Effect Preview */}
      <div className="mt-4 p-2 bg-gray-900/50 rounded-lg">
        <div className="text-xs text-gray-400 mb-1">Current Effect:</div>
        <div className="text-sm text-white font-medium">
          {voiceEffects.find(e => e.id === currentEffect)?.name || 'Natural'}
        </div>
      </div>
    </div>
  );
};