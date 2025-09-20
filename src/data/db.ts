import Dexie, { Table } from 'dexie';
import { Song, LyricLine } from '../types/karaoke';

export class KaraokeDB extends Dexie {
  songs!: Table<Song, string>;
  lyrics!: Table<{ songId: string; lyrics: LyricLine[] }, string>;

  constructor() {
    super('KaraokeDB');
    this.version(1).stores({
      songs: 'id,title,artist,album,genre,year',
      lyrics: 'songId'
    });
  }
}

export const db = new KaraokeDB();
