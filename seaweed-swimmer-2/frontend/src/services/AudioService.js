// AudioService - same as original but with SW2 keys
class AudioService {
  constructor() {
    this.audioContext = null;
    this.musicGainNode = null;
    this.sfxGainNode = null;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicNodes = [];
    this.isPlaying = false;
    this.scheduledTimeouts = [];
    
    this.swimSoundReady = false;
    this.collisionSoundReady = false;
    
    const savedMusicPref = localStorage.getItem('seaweedSwimmer2Music');
    const savedSfxPref = localStorage.getItem('seaweedSwimmer2Sfx');
    
    this.musicEnabled = savedMusicPref !== null ? savedMusicPref === 'true' : true;
    this.sfxEnabled = savedSfxPref !== null ? savedSfxPref === 'true' : true;
  }

  initialize() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.connect(this.audioContext.destination);
      this.musicGainNode.gain.value = this.musicEnabled ? 0.25 : 0;
      
      this.sfxGainNode = this.audioContext.createGain();
      this.sfxGainNode.connect(this.audioContext.destination);
      this.sfxGainNode.gain.value = this.sfxEnabled ? 0.35 : 0;
      
      this.swimSoundReady = true;
      this.collisionSoundReady = true;
      
      console.log('✅ AudioService initialized');
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  startMusic() {
    if (!this.audioContext || this.isPlaying) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    if (this.musicGainNode && this.musicEnabled) {
      const now = this.audioContext.currentTime;
      this.musicGainNode.gain.cancelScheduledValues(now);
      this.musicGainNode.gain.setValueAtTime(0.25, now);
    }
    
    this.isPlaying = true;
    this.createUnderwaterAmbience();
  }

  stopMusic() {
    if (!this.audioContext) return;
    
    this.isPlaying = false;
    
    this.scheduledTimeouts.forEach(timeout => clearTimeout(timeout));
    this.scheduledTimeouts = [];
    
    this.musicNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.musicNodes = [];
    
    if (this.musicGainNode) {
      const now = this.audioContext.currentTime;
      this.musicGainNode.gain.cancelScheduledValues(now);
      this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, now);
      this.musicGainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    }
  }

  createUnderwaterAmbience() {
    if (!this.audioContext || !this.musicEnabled) return;

    const now = this.audioContext.currentTime;
    this.createThemeMelody(now);
    this.createMelodicBassLine(now);
    this.createChordPads(now);
    this.createArpeggio(now);
    this.createSoftDrums(now);
    this.createAmbientPad(now);
  }

  createThemeMelody(startTime) {
    if (!this.audioContext) return;
    
    const theme = [
      { note: 440, duration: 0.5 }, { note: 494, duration: 0.5 },
      { note: 554, duration: 0.5 }, { note: 659, duration: 0.5 },
      { note: 740, duration: 0.75 }, { note: 659, duration: 0.25 },
      { note: 554, duration: 1.0 }, { note: 494, duration: 0.5 },
      { note: 554, duration: 0.5 }, { note: 659, duration: 0.5 },
      { note: 740, duration: 0.5 }, { note: 880, duration: 1.0 },
      { note: 740, duration: 0.5 }, { note: 659, duration: 0.5 },
      { note: 554, duration: 0.5 }, { note: 494, duration: 0.5 },
      { note: 440, duration: 0.5 }, { note: 494, duration: 0.5 },
      { note: 554, duration: 0.75 }, { note: 659, duration: 0.25 },
      { note: 740, duration: 1.0 }, { note: 659, duration: 0.5 },
      { note: 554, duration: 0.5 }, { note: 494, duration: 0.5 },
      { note: 440, duration: 0.5 }, { note: 330, duration: 1.5 },
      { note: 0, duration: 0.5 }
    ];
    
    const playTheme = (time) => {
      if (!this.isPlaying) return;
      
      let currentTime = 0;
      
      theme.forEach((note) => {
        if (note.note === 0) {
          currentTime += note.duration;
          return;
        }
        
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.value = note.note;
        
        const vibrato = this.audioContext.createOscillator();
        const vibratoGain = this.audioContext.createGain();
        vibrato.frequency.value = 5;
        vibratoGain.gain.value = 3;
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(time + currentTime);
        vibrato.stop(time + currentTime + note.duration);
        
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        filter.Q.value = 1;
        
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0.18, time + currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.15, time + currentTime + note.duration - 0.05);
        gainNode.gain.linearRampToValueAtTime(0, time + currentTime + note.duration);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGainNode);
        
        osc.start(time + currentTime);
        osc.stop(time + currentTime + note.duration);
        
        currentTime += note.duration;
      });
      
      const patternDuration = theme.reduce((sum, note) => sum + note.duration, 0);
      const nextTime = time + patternDuration;
      
      if (nextTime - this.audioContext.currentTime < 60 && this.isPlaying) {
        const timeout = setTimeout(() => playTheme(nextTime), (patternDuration - 0.1) * 1000);
        this.scheduledTimeouts.push(timeout);
      }
    };
    
    playTheme(startTime);
  }

  createMelodicBassLine(startTime) {
    if (!this.audioContext) return;
    
    const bassLine = [
      { note: 110, duration: 2.0 }, { note: 164.81, duration: 2.0 },
      { note: 123.47, duration: 2.0 }, { note: 146.83, duration: 2.0 },
      { note: 110, duration: 2.0 }, { note: 164.81, duration: 2.0 },
      { note: 123.47, duration: 2.0 }, { note: 82.41, duration: 2.0 }
    ];
    
    const playBass = (time) => {
      if (!this.isPlaying) return;
      
      let currentTime = 0;
      
      bassLine.forEach((note) => {
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.value = note.note;
        
        filter.type = 'lowpass';
        filter.frequency.value = 250;
        
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0.15, time + currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.15, time + currentTime + note.duration - 0.1);
        gainNode.gain.linearRampToValueAtTime(0, time + currentTime + note.duration);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGainNode);
        
        osc.start(time + currentTime);
        osc.stop(time + currentTime + note.duration);
        
        currentTime += note.duration;
      });
      
      const patternDuration = bassLine.reduce((sum, note) => sum + note.duration, 0);
      const nextTime = time + patternDuration;
      
      if (nextTime - this.audioContext.currentTime < 60 && this.isPlaying) {
        const timeout = setTimeout(() => playBass(nextTime), (patternDuration - 0.1) * 1000);
        this.scheduledTimeouts.push(timeout);
      }
    };
    
    playBass(startTime);
  }

  createChordPads(startTime) {
    if (!this.audioContext) return;
    
    const chordProgression = [
      { notes: [220, 277.18, 329.63, 440], duration: 4 },
      { notes: [164.81, 207.65, 246.94, 329.63], duration: 4 },
      { notes: [123.47, 155.56, 185, 246.94], duration: 4 },
      { notes: [146.83, 185, 220, 293.66], duration: 4 }
    ];
    
    const playPad = (chordIndex, time) => {
      if (!this.isPlaying) return;
      
      const chord = chordProgression[chordIndex];
      
      chord.notes.forEach((freq) => {
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.5;
        
        gainNode.gain.value = 0;
        gainNode.gain.linearRampToValueAtTime(0.04, time + 0.5);
        gainNode.gain.linearRampToValueAtTime(0.04, time + chord.duration - 0.5);
        gainNode.gain.linearRampToValueAtTime(0, time + chord.duration);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.musicGainNode);
        
        osc.start(time);
        osc.stop(time + chord.duration);
      });
      
      const nextIndex = (chordIndex + 1) % chordProgression.length;
      const nextTime = time + chord.duration;
      
      if (nextTime - this.audioContext.currentTime < 60 && this.isPlaying) {
        const timeout = setTimeout(() => playPad(nextIndex, nextTime), (chord.duration - 0.2) * 1000);
        this.scheduledTimeouts.push(timeout);
      }
    };
    
    playPad(0, startTime);
  }

  createArpeggio(startTime) {
    if (!this.audioContext) return;
    
    const arpeggioPattern = [440, 554, 659, 554];
    const noteInterval = 0.2;
    
    const playArp = (noteIndex, time) => {
      if (!this.isPlaying) return;
      
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = arpeggioPattern[noteIndex];
      
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 2;
      
      gainNode.gain.value = 0.06;
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + noteInterval);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGainNode);
      
      osc.start(time);
      osc.stop(time + noteInterval);
      
      const nextIndex = (noteIndex + 1) % arpeggioPattern.length;
      const nextTime = time + noteInterval;
      
      if (nextTime - this.audioContext.currentTime < 60 && this.isPlaying) {
        const timeout = setTimeout(() => playArp(nextIndex, nextTime), (noteInterval - 0.05) * 1000);
        this.scheduledTimeouts.push(timeout);
      }
    };
    
    playArp(0, startTime);
  }

  createSoftDrums(startTime) {
    if (!this.audioContext) return;
    
    const beatInterval = 0.5;
    
    const playDrum = (time, isAccent) => {
      if (!this.isPlaying) return;
      
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = 80;
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.05);
      
      filter.type = 'lowpass';
      filter.frequency.value = 150;
      
      const volume = isAccent ? 0.12 : 0.06;
      gainNode.gain.value = volume;
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGainNode);
      
      osc.start(time);
      osc.stop(time + 0.15);
      
      const nextTime = time + beatInterval;
      const nextIsAccent = !isAccent;
      
      if (nextTime - this.audioContext.currentTime < 60 && this.isPlaying) {
        const timeout = setTimeout(() => playDrum(nextTime, nextIsAccent), (beatInterval - 0.05) * 1000);
        this.scheduledTimeouts.push(timeout);
      }
    };
    
    playDrum(startTime, true);
  }

  createAmbientPad(startTime) {
    if (!this.audioContext) return;
    
    const padNotes = [220, 277.18, 329.63];
    
    padNotes.forEach((freq) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      
      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(0.03, startTime + 2);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGainNode);
      
      osc.start(startTime);
      
      this.musicNodes.push(osc);
    });
  }

  playSwimSound() {
    if (!this.sfxEnabled || !this.audioContext || !this.swimSoundReady) return;
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playCollisionSound() {
    if (!this.sfxEnabled || !this.audioContext || !this.collisionSoundReady) return;
    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.value = 100;
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
    
    gainNode.gain.value = 0.15;
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    localStorage.setItem('seaweedSwimmer2Music', enabled.toString());
    
    if (this.musicGainNode) {
      const now = this.audioContext.currentTime;
      this.musicGainNode.gain.cancelScheduledValues(now);
      this.musicGainNode.gain.setValueAtTime(this.musicGainNode.gain.value, now);
      this.musicGainNode.gain.linearRampToValueAtTime(enabled ? 0.25 : 0, now + 0.1);
    }
    
    if (enabled && !this.isPlaying) {
      this.startMusic();
    } else if (!enabled && this.isPlaying) {
      this.stopMusic();
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    localStorage.setItem('seaweedSwimmer2Sfx', enabled.toString());
    
    if (this.sfxGainNode) {
      const now = this.audioContext.currentTime;
      this.sfxGainNode.gain.cancelScheduledValues(now);
      this.sfxGainNode.gain.setValueAtTime(this.sfxGainNode.gain.value, now);
      this.sfxGainNode.gain.linearRampToValueAtTime(enabled ? 0.35 : 0, now + 0.05);
    }
  }

  getMusicEnabled() {
    return this.musicEnabled;
  }

  getSfxEnabled() {
    return this.sfxEnabled;
  }
}

export default AudioService;
