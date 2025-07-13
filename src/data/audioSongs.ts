import { Song } from '../types/karaoke';

// Function to generate audio URLs for local development
export const generateLocalAudioUrl = (filename: string): string => {
  return `/audio/${filename}`;
};

// Sample royalty-free audio URLs (using placeholder audio for demo)
// In production, these would be your actual audio files
export const audioSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    genre: 'Rock',
    year: 1975,
    duration: 355,
    key: 'Bb Major',
    tempo: 72,
    difficulty: 'Hard',
    popularity: 95,
    coverImage: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=400',
    audioUrl: generateLocalAudioUrl('demo-song-1.mp3'),
    waveformData: Array.from({length: 100}, (_, i) => Math.sin(i * 0.1) * 0.5 + 0.5),
    lyrics: [
      { id: '1-1', text: 'Is this the real life?', startTime: 0, endTime: 3, type: 'verse' },
      { id: '1-2', text: 'Is this just fantasy?', startTime: 3, endTime: 6, type: 'verse' },
      { id: '1-3', text: 'Caught in a landslide', startTime: 6, endTime: 9, type: 'verse' },
      { id: '1-4', text: 'No escape from reality', startTime: 9, endTime: 12, type: 'verse' },
      { id: '1-5', text: 'Open your eyes', startTime: 12, endTime: 15, type: 'verse' },
      { id: '1-6', text: 'Look up to the skies and see', startTime: 15, endTime: 18, type: 'verse' },
      { id: '1-7', text: 'I\'m just a poor boy, I need no sympathy', startTime: 18, endTime: 22, type: 'verse' },
      { id: '1-8', text: 'Because I\'m easy come, easy go', startTime: 22, endTime: 25, type: 'chorus' },
    ]
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    genre: 'Pop',
    year: 2017,
    duration: 30, // Shortened for demo
    key: 'C# Minor',
    tempo: 96,
    difficulty: 'Medium',
    popularity: 92,
    coverImage: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    audioUrl: generateLocalAudioUrl('demo-song-2.mp3'),
    waveformData: Array.from({length: 100}, (_, i) => Math.abs(Math.sin(i * 0.15)) * 0.7 + 0.3),
    lyrics: [
      { id: '2-1', text: 'The club isn\'t the best place to find a lover', startTime: 0, endTime: 4, type: 'verse' },
      { id: '2-2', text: 'So the bar is where I go', startTime: 4, endTime: 7, type: 'verse' },
      { id: '2-3', text: 'Me and my friends at the table doing shots', startTime: 7, endTime: 11, type: 'verse' },
      { id: '2-4', text: 'Drinking fast and then we talk slow', startTime: 11, endTime: 15, type: 'verse' },
      { id: '2-5', text: 'Come over and start up a conversation with just me', startTime: 15, endTime: 19, type: 'verse' },
      { id: '2-6', text: 'And trust me I\'ll give it a chance now', startTime: 19, endTime: 23, type: 'verse' },
      { id: '2-7', text: 'I\'m in love with the shape of you', startTime: 23, endTime: 27, type: 'chorus' },
    ]
  },
  {
    id: '3',
    title: 'Demo Song - Instrumental',
    artist: 'Karaoke Demo',
    album: 'Test Album',
    genre: 'Demo',
    year: 2024,
    duration: 30,
    key: 'C Major',
    tempo: 120,
    difficulty: 'Easy',
    popularity: 80,
    coverImage: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=400',
    audioUrl: generateLocalAudioUrl('demo-song-3.mp3'),
    waveformData: Array.from({length: 100}, (_, i) => Math.pow(Math.sin(i * 0.08), 2) * 0.8 + 0.2),
    lyrics: [
      { id: '3-1', text: 'This is a demo song', startTime: 0, endTime: 3, type: 'verse' },
      { id: '3-2', text: 'For testing audio playback', startTime: 3, endTime: 6, type: 'verse' },
      { id: '3-3', text: 'With synchronized lyrics', startTime: 6, endTime: 9, type: 'verse' },
      { id: '3-4', text: 'And microphone input', startTime: 9, endTime: 12, type: 'verse' },
      { id: '3-5', text: 'Sing along now!', startTime: 12, endTime: 15, type: 'chorus' },
      { id: '3-6', text: 'Test your voice', startTime: 15, endTime: 18, type: 'chorus' },
      { id: '3-7', text: 'With the karaoke app', startTime: 18, endTime: 21, type: 'chorus' },
      { id: '3-8', text: 'Demo complete!', startTime: 21, endTime: 24, type: 'outro' },
    ]
  }
];

// Sample audio file names (you would place these in public/audio/)
export const sampleAudioFiles = [
  'demo-song-1.mp3',
  'demo-song-2.mp3',
  'demo-song-3.mp3'
];