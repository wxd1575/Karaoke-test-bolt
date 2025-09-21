import React, { useRef, useState } from 'react';

interface UserUploadProps {
  onUpload: (audioFile: File, lyricsFile: File) => void;
}

export const UserUpload: React.FC<UserUploadProps> = ({ onUpload }) => {
  const audioRef = useRef<HTMLInputElement>(null);
  const lyricsRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const clearInputs = () => {
    if (audioRef.current) audioRef.current.value = '';
    if (lyricsRef.current) lyricsRef.current.value = '';
  };

  const validateFiles = (audioFile?: File, lyricsFile?: File) => {
    if (!audioFile || !lyricsFile) {
      setError('Please select both audio and lyrics files.');
      return false;
    }
    if (!['audio/mp3', 'audio/mpeg'].includes(audioFile.type)) {
      setError('Audio file must be an MP3.');
      return false;
    }
    if (audioFile.size > 20 * 1024 * 1024) {
      setError('Audio file must be less than 20MB.');
      return false;
    }
    if (!lyricsFile.name.match(/\.(lrc|json)$/i)) {
      setError('Lyrics file must be .lrc or .json.');
      return false;
    }
    if (lyricsFile.size > 1 * 1024 * 1024) {
      setError('Lyrics file must be less than 1MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleUpload = () => {
    const audioFile = audioRef.current?.files?.[0];
    const lyricsFile = lyricsRef.current?.files?.[0];
    if (!validateFiles(audioFile, lyricsFile)) return;
    onUpload(audioFile!, lyricsFile!);
    setSuccess('Song uploaded successfully!');
    clearInputs();
    setTimeout(() => setSuccess(''), 3000);
  };

  // Drag-and-drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(f => ['audio/mp3', 'audio/mpeg'].includes(f.type));
    const lyricsFile = files.find(f => f.name.match(/\.(lrc|json)$/i));
    if (!validateFiles(audioFile, lyricsFile)) return;
    onUpload(audioFile!, lyricsFile!);
    setSuccess('Song uploaded successfully!');
    clearInputs();
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div
      className={`bg-gray-800 p-4 rounded-xl flex flex-col gap-4 border border-gray-700 relative ${dragActive ? 'ring-4 ring-cyan-400' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <label className="text-white font-medium">Upload Audio (MP3):</label>
      <input ref={audioRef} type="file" accept="audio/mp3,audio/mpeg" className="text-white" title="Select an MP3 audio file" />
      <label className="text-white font-medium">Upload Lyrics (LRC/JSON):</label>
      <input ref={lyricsRef} type="file" accept=".lrc,.json" className="text-white" title="Select a lyrics file (.lrc or .json)" />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-cyan-500 rounded-lg text-white font-bold hover:bg-cyan-600 transition"
      >
        Upload Song
      </button>
      {success && <div className="mt-2 text-green-400 font-medium">{success}</div>}
      {error && <div className="mt-2 text-red-400 font-medium">{error}</div>}
      <div className="text-xs text-gray-400 mt-2">Drag and drop your audio (MP3) and lyrics (LRC/JSON) files here.</div>
    </div>
  );
};
