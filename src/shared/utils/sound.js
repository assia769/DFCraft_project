class SoundManager {
  constructor() {
    this.sounds = {
      switchComplete: new Audio('/sounds/notification.wav'),
    };
    
    // Preload sounds
    Object.values(this.sounds).forEach(audio => {
      audio.load();
    });
  }

  play(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0; // Reset to start
      sound.play().catch(err => {
        console.error(`Failed to play ${soundName}:`, err);
      });
    }
  }

  setVolume(volume) {
    // volume: 0.0 to 1.0
    Object.values(this.sounds).forEach(audio => {
      audio.volume = volume;
    });
  }
}

export const soundManager = new SoundManager();