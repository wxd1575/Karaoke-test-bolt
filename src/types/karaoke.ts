export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  year?: number;
  duration: number; // in seconds
  key?: string;
  tempo?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  popularity?: number;
  lyrics: LyricLine[];
  coverImage?: string;
  audioUrl?: string;
  waveformData?: number[];
  syncedLyrics?: string | { id: string; text: string; startTime: number; endTime: number; type?: string }[];
}

export interface LyricWord {
  text: string;
  startTime: number;
  endTime: number;
}

export interface LyricLine {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  type?: 'verse' | 'chorus' | 'bridge' | 'outro';
  words?: LyricWord[]; // Optional word-level timing
}

export interface QueueItem {
  song: Song;
  id: string;
  addedAt: Date;
  position: number;
}

export interface UserSession {
  id: string;
  startTime: Date;
  songsCompleted: number;
  totalScore: number;
  favoriteGenres: string[];
  recentSongs: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  volume: number;
  keyAdjustment: number;
  tempoAdjustment: number;
  lyricsSize: 'small' | 'medium' | 'large';
  theme: 'dark' | 'neon' | 'classic';
  autoAdvance: boolean;
  showBackgroundVideo: boolean;
  enableParticleEffects: boolean;
  voiceEffects: 'none' | 'reverb' | 'echo' | 'robot';
}

export interface KaraokeState {
  currentSong: Song | null;
  queue: QueueItem[];
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  keyAdjustment: number;
  tempoAdjustment: number;
  currentLyricIndex: number;
  userSession: UserSession;
  waveformProgress: number;
  recordingMode: boolean;
  currentScore: number;
  pitchAccuracy: number[];
}

export interface AudioSettings {
  volume: number;
  keyShift: number;
  tempoChange: number;
  vocalsEnabled: boolean;
  instrumentalsEnabled: boolean;
  voiceEffects: string;
  reverbLevel: number;
  echoLevel: number;
}

export interface ScoreData {
  songId: string;
  score: number;
  accuracy: number;
  timestamp: Date;
  difficulty: string;
}

export interface PlaylistData {
  id: string;
  name: string;
  songs: string[];
  createdAt: Date;
  isPublic: boolean;
}