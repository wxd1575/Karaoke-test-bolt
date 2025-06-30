import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioEngineState {
  isLoaded: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  keyAdjustment: number;
  tempoAdjustment: number;
  microphoneEnabled: boolean;
  microphoneVolume: number;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startTime: number = 0;
  private pauseTime: number = 0;
  private isPlaying: boolean = false;
  private microphoneStream: MediaStream | null = null;
  private microphoneGain: GainNode | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private pitchShiftNode: GainNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create audio nodes
      this.gainNode = this.audioContext.createGain();
      this.analyserNode = this.audioContext.createAnalyser();
      this.pitchShiftNode = this.audioContext.createGain();
      
      // Connect nodes
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.pitchShiftNode);
      this.pitchShiftNode.connect(this.audioContext.destination);
      
      // Configure analyser
      this.analyserNode.fftSize = 2048;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async loadAudio(url: string): Promise<boolean> {
    if (!this.audioContext) return false;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      return true;
    } catch (error) {
      console.error('Failed to load audio:', error);
      return false;
    }
  }

  async play(): Promise<void> {
    if (!this.audioContext || !this.audioBuffer || !this.gainNode) return;

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Stop current playback if any
    this.stop();

    // Create new source node
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.gainNode);

    // Start playback
    const offset = this.pauseTime;
    this.sourceNode.start(0, offset);
    this.startTime = this.audioContext.currentTime - offset;
    this.isPlaying = true;
  }

  pause(): void {
    if (this.sourceNode && this.isPlaying) {
      this.pauseTime = this.getCurrentTime();
      this.sourceNode.stop();
      this.sourceNode = null;
      this.isPlaying = false;
    }
  }

  stop(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }
    this.isPlaying = false;
    this.pauseTime = 0;
    this.startTime = 0;
  }

  getCurrentTime(): number {
    if (!this.audioContext) return 0;
    
    if (this.isPlaying && this.startTime) {
      return this.audioContext.currentTime - this.startTime;
    }
    return this.pauseTime;
  }

  getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = volume / 100;
    }
  }

  seekTo(time: number): void {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.pauseTime = Math.max(0, Math.min(time, this.getDuration()));
    
    if (wasPlaying) {
      this.play();
    }
  }

  async enableMicrophone(): Promise<boolean> {
    if (!this.audioContext) return false;

    try {
      this.microphoneStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      this.microphoneSource = this.audioContext.createMediaStreamSource(this.microphoneStream);
      this.microphoneGain = this.audioContext.createGain();
      
      // Connect microphone to output with lower volume
      this.microphoneSource.connect(this.microphoneGain);
      this.microphoneGain.connect(this.audioContext.destination);
      this.microphoneGain.gain.value = 0.7; // Default mic volume
      
      return true;
    } catch (error) {
      console.error('Failed to enable microphone:', error);
      return false;
    }
  }

  disableMicrophone(): void {
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
      this.microphoneStream = null;
    }
    
    if (this.microphoneSource) {
      this.microphoneSource.disconnect();
      this.microphoneSource = null;
    }
    
    if (this.microphoneGain) {
      this.microphoneGain.disconnect();
      this.microphoneGain = null;
    }
  }

  setMicrophoneVolume(volume: number): void {
    if (this.microphoneGain) {
      this.microphoneGain.gain.value = volume / 100;
    }
  }

  // Basic pitch shifting (simplified - real implementation would need more complex processing)
  setKeyAdjustment(semitones: number): void {
    if (this.pitchShiftNode) {
      // This is a simplified approach - real pitch shifting requires more complex processing
      const pitchRatio = Math.pow(2, semitones / 12);
      this.pitchShiftNode.gain.value = 1 / pitchRatio; // Inverse for basic compensation
    }
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  cleanup(): void {
    this.stop();
    this.disableMicrophone();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const useAudioEngine = () => {
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const [state, setState] = useState<AudioEngineState>({
    isLoaded: false,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 70,
    keyAdjustment: 0,
    tempoAdjustment: 0,
    microphoneEnabled: false,
    microphoneVolume: 70
  });

  // Initialize audio engine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
    
    return () => {
      audioEngineRef.current?.cleanup();
    };
  }, []);

  // Update current time
  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(() => {
      if (audioEngineRef.current) {
        const currentTime = audioEngineRef.current.getCurrentTime();
        const duration = audioEngineRef.current.getDuration();
        
        setState(prev => ({
          ...prev,
          currentTime,
          duration
        }));

        // Auto-stop when song ends
        if (currentTime >= duration && duration > 0) {
          setState(prev => ({ ...prev, isPlaying: false }));
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state.isPlaying]);

  const loadAudio = useCallback(async (url: string) => {
    if (!audioEngineRef.current) return false;
    
    const loaded = await audioEngineRef.current.loadAudio(url);
    if (loaded) {
      const duration = audioEngineRef.current.getDuration();
      setState(prev => ({ ...prev, isLoaded: true, duration, currentTime: 0 }));
    }
    return loaded;
  }, []);

  const play = useCallback(async () => {
    if (!audioEngineRef.current) return;
    
    await audioEngineRef.current.play();
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.stop();
    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.setVolume(volume);
    setState(prev => ({ ...prev, volume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.seekTo(time);
    setState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setKeyAdjustment = useCallback((semitones: number) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.setKeyAdjustment(semitones);
    setState(prev => ({ ...prev, keyAdjustment: semitones }));
  }, []);

  const enableMicrophone = useCallback(async () => {
    if (!audioEngineRef.current) return false;
    
    const enabled = await audioEngineRef.current.enableMicrophone();
    setState(prev => ({ ...prev, microphoneEnabled: enabled }));
    return enabled;
  }, []);

  const disableMicrophone = useCallback(() => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.disableMicrophone();
    setState(prev => ({ ...prev, microphoneEnabled: false }));
  }, []);

  const setMicrophoneVolume = useCallback((volume: number) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.setMicrophoneVolume(volume);
    setState(prev => ({ ...prev, microphoneVolume: volume }));
  }, []);

  const getFrequencyData = useCallback(() => {
    return audioEngineRef.current?.getFrequencyData() || new Uint8Array(0);
  }, []);

  return {
    state,
    loadAudio,
    play,
    pause,
    stop,
    setVolume,
    seekTo,
    setKeyAdjustment,
    enableMicrophone,
    disableMicrophone,
    setMicrophoneVolume,
    getFrequencyData
  };
};