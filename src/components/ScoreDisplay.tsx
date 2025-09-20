import React from 'react';
import { Trophy, Target, Star, TrendingUp } from 'lucide-react';

interface ScoreDisplayProps {
  currentScore: number;
  pitchAccuracy: number[];
  isRecording: boolean;
  songDifficulty: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  currentScore,
  pitchAccuracy,
  isRecording,
  songDifficulty
}) => {
  const averageAccuracy = pitchAccuracy.length > 0 
    ? pitchAccuracy.reduce((a, b) => a + b, 0) / pitchAccuracy.length 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAccuracyBars = () => {
    return pitchAccuracy.slice(-20).map((accuracy, index) => (
      <div
        key={index}
        className={`w-2 rounded-full transition-all duration-300 ${
          accuracy >= 80 ? 'bg-green-400' :
          accuracy >= 60 ? 'bg-yellow-400' :
          accuracy >= 40 ? 'bg-orange-400' : 'bg-red-400'
        }`}
        style={{ height: `${Math.max(accuracy, 10)}%` }}
      />
    ));
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Performance Score
        </h3>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm">Recording</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Current Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(currentScore)} mb-1`}>
            {Math.round(currentScore)}
          </div>
          <div className="text-gray-400 text-sm">Current Score</div>
        </div>

        {/* Accuracy Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Pitch Accuracy</span>
            <span className={`text-sm font-medium ${getScoreColor(averageAccuracy)}`}>
              {Math.round(averageAccuracy)}%
            </span>
          </div>
          <div className="flex items-end gap-1 h-12 bg-gray-900/50 rounded-lg p-2">
            {getAccuracyBars()}
          </div>
        </div>

        {/* Difficulty Indicator */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Difficulty</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            songDifficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
            songDifficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {songDifficulty}
          </span>
        </div>

        {/* Performance Tips */}
        <div className="text-xs text-gray-500 bg-gray-900/30 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3" />
            <span>Tips:</span>
          </div>
          <ul className="space-y-1 ml-4">
            <li>• Stay close to the original pitch</li>
            <li>• Maintain steady rhythm</li>
            <li>• Project your voice clearly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};