// Define sound IDs for easier management
export enum SoundEffect {
  CORRECT = 'correct',
  WRONG = 'wrong',
}

// Simple beep sound generator
function createBeepSound(frequency: number = 440, duration: number = 300, volume: number = 0.5): () => void {
  return () => {
    try {
      // Using Web Audio API for more reliable sound generation
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = volume;
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      oscillator.start();
      
      // Stop after duration
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, duration);
    } catch (error) {
      console.warn("Error playing beep sound:", error);
    }
  };
}

// Create sound functions
const playCorrectSound = createBeepSound(880, 200, 0.3); // Higher pitch for correct
const playWrongSound = createBeepSound(220, 300, 0.3);   // Lower pitch for wrong

// Sound manager utility with simplified API
export const SoundManager = {
  // Play a sound effect
  play(sound: SoundEffect): void {
    try {
      if (sound === SoundEffect.CORRECT) {
        playCorrectSound();
      } else if (sound === SoundEffect.WRONG) {
        playWrongSound();
      }
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  },

  // These methods are kept for API compatibility but simplified
  stop(_sound: SoundEffect): void {
    // Not needed for beep sounds (they auto-stop)
  },

  setVolume(_sound: SoundEffect, _volume: number): void {
    // Volume is set at creation time
  },

  setMute(_mute: boolean): void {
    // Simplified API doesn't support muting
  }
};