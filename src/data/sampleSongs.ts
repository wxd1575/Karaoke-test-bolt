import { Song } from '../types/karaoke';

export const sampleSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    genre: 'Rock',
    duration: 355,
    difficulty: 'Hard',
    coverImage: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '1-1', text: 'Is this the real life?', startTime: 0, endTime: 3 },
      { id: '1-2', text: 'Is this just fantasy?', startTime: 3, endTime: 6 },
      { id: '1-3', text: 'Caught in a landslide', startTime: 6, endTime: 9 },
      { id: '1-4', text: 'No escape from reality', startTime: 9, endTime: 12 },
      { id: '1-5', text: 'Open your eyes', startTime: 12, endTime: 15 },
      { id: '1-6', text: 'Look up to the skies and see', startTime: 15, endTime: 18 },
    ]
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    genre: 'Pop',
    duration: 263,
    difficulty: 'Medium',
    coverImage: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '2-1', text: 'The club isn\'t the best place to find a lover', startTime: 0, endTime: 4 },
      { id: '2-2', text: 'So the bar is where I go', startTime: 4, endTime: 7 },
      { id: '2-3', text: 'Me and my friends at the table doing shots', startTime: 7, endTime: 11 },
      { id: '2-4', text: 'Drinking fast and then we talk slow', startTime: 11, endTime: 15 },
      { id: '2-5', text: 'Come over and start up a conversation with just me', startTime: 15, endTime: 19 },
    ]
  },
  {
    id: '3',
    title: 'Rolling in the Deep',
    artist: 'Adele',
    genre: 'Soul',
    duration: 228,
    difficulty: 'Medium',
    coverImage: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '3-1', text: 'There\'s a fire starting in my heart', startTime: 0, endTime: 4 },
      { id: '3-2', text: 'Reaching a fever pitch, it\'s bringing me out the dark', startTime: 4, endTime: 8 },
      { id: '3-3', text: 'Finally I can see you crystal clear', startTime: 8, endTime: 12 },
      { id: '3-4', text: 'Go ahead and sell me out and I\'ll lay your ship bare', startTime: 12, endTime: 16 },
    ]
  },
  {
    id: '4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Synthpop',
    duration: 200,
    difficulty: 'Easy',
    coverImage: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '4-1', text: 'Yeah, I\'ve been tryna call', startTime: 0, endTime: 3 },
      { id: '4-2', text: 'I\'ve been on my own for long enough', startTime: 3, endTime: 6 },
      { id: '4-3', text: 'Maybe you can show me how to love, maybe', startTime: 6, endTime: 10 },
      { id: '4-4', text: 'I feel like I\'m just missing something when you\'re gone', startTime: 10, endTime: 14 },
    ]
  },
  {
    id: '5',
    title: 'Imagine',
    artist: 'John Lennon',
    genre: 'Rock',
    duration: 183,
    difficulty: 'Easy',
    coverImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '5-1', text: 'Imagine there\'s no heaven', startTime: 0, endTime: 4 },
      { id: '5-2', text: 'It\'s easy if you try', startTime: 4, endTime: 8 },
      { id: '5-3', text: 'No hell below us', startTime: 8, endTime: 12 },
      { id: '5-4', text: 'Above us only sky', startTime: 12, endTime: 16 },
    ]
  },
  {
    id: '6',
    title: 'Sweet Caroline',
    artist: 'Neil Diamond',
    genre: 'Pop',
    duration: 201,
    difficulty: 'Easy',
    coverImage: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '6-1', text: 'Where it began, I can\'t begin to knowing', startTime: 0, endTime: 4 },
      { id: '6-2', text: 'But then I know it\'s growing strong', startTime: 4, endTime: 8 },
      { id: '6-3', text: 'Was in the spring', startTime: 8, endTime: 11 },
      { id: '6-4', text: 'And spring became the summer', startTime: 11, endTime: 15 },
    ]
  },
  {
    id: '7',
    title: 'Don\'t Stop Believin\'',
    artist: 'Journey',
    genre: 'Rock',
    duration: 251,
    difficulty: 'Medium',
    coverImage: 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '7-1', text: 'Just a small town girl', startTime: 0, endTime: 3 },
      { id: '7-2', text: 'Living in a lonely world', startTime: 3, endTime: 6 },
      { id: '7-3', text: 'She took the midnight train going anywhere', startTime: 6, endTime: 10 },
      { id: '7-4', text: 'Just a city boy', startTime: 10, endTime: 13 },
    ]
  },
  {
    id: '8',
    title: 'Happy',
    artist: 'Pharrell Williams',
    genre: 'Pop',
    duration: 232,
    difficulty: 'Easy',
    coverImage: 'https://images.pexels.com/photos/1389994/pexels-photo-1389994.jpeg?auto=compress&cs=tinysrgb&w=400',
    lyrics: [
      { id: '8-1', text: 'It might seem crazy what I\'m about to say', startTime: 0, endTime: 4 },
      { id: '8-2', text: 'Sunshine she\'s here, you can take a break', startTime: 4, endTime: 8 },
      { id: '8-3', text: 'I\'m a hot air balloon that could go to space', startTime: 8, endTime: 12 },
      { id: '8-4', text: 'With the air, like I don\'t care baby by the way', startTime: 12, endTime: 16 },
    ]
  }
];