// TAMV Audio Module - Sistema de Sonidos de Notificación
// Efectos sonoros inmersivos y discretos para el ecosistema

export type SoundType = 
  | 'notification'
  | 'notification_success'
  | 'notification_warning'
  | 'bank_open'
  | 'bank_close'
  | 'message_receive'
  | 'message_send'
  | 'achievement'
  | 'level_up'
  | 'isabella_active'
  | 'xr_enter'
  | 'xr_exit';

interface AudioSettings {
  enabled: boolean;
  volume: number; // 0-1
  mutedTypes: SoundType[];
}

const STORAGE_KEY = 'tamv_audio_settings';

// Web Audio context for better performance
let audioContext: AudioContext | null = null;

// Pre-generated sound data (base64 encoded minimal sounds)
const SOUND_DATA: Record<SoundType, { frequency: number; duration: number; type: OscillatorType }> = {
  notification: { frequency: 880, duration: 0.15, type: 'sine' },
  notification_success: { frequency: 1047, duration: 0.2, type: 'sine' },
  notification_warning: { frequency: 440, duration: 0.3, type: 'triangle' },
  bank_open: { frequency: 660, duration: 0.1, type: 'sine' },
  bank_close: { frequency: 440, duration: 0.1, type: 'sine' },
  message_receive: { frequency: 1320, duration: 0.08, type: 'sine' },
  message_send: { frequency: 880, duration: 0.06, type: 'sine' },
  achievement: { frequency: 1047, duration: 0.4, type: 'sine' },
  level_up: { frequency: 1320, duration: 0.5, type: 'sine' },
  isabella_active: { frequency: 784, duration: 0.15, type: 'sine' },
  xr_enter: { frequency: 523, duration: 0.3, type: 'triangle' },
  xr_exit: { frequency: 392, duration: 0.2, type: 'triangle' }
};

class TAMVAudioSystem {
  private settings: AudioSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): AudioSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse errors
    }
    return {
      enabled: true,
      volume: 0.3, // Low volume by default
      mutedTypes: []
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore storage errors
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!audioContext && typeof AudioContext !== 'undefined') {
      try {
        audioContext = new AudioContext();
      } catch {
        console.warn('[TAMV Audio] AudioContext not available');
        return null;
      }
    }
    return audioContext;
  }

  /**
   * Play a synthesized sound
   */
  play(type: SoundType): void {
    if (!this.settings.enabled) return;
    if (this.settings.mutedTypes.includes(type)) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const soundConfig = SOUND_DATA[type];
    if (!soundConfig) return;

    try {
      // Create oscillator
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = soundConfig.type;
      oscillator.frequency.setValueAtTime(soundConfig.frequency, ctx.currentTime);

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.settings.volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + soundConfig.duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + soundConfig.duration);

      // Achievement and level up get a second tone
      if (type === 'achievement' || type === 'level_up') {
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(soundConfig.frequency * 1.5, ctx.currentTime);
          gain2.gain.setValueAtTime(0, ctx.currentTime);
          gain2.gain.linearRampToValueAtTime(this.settings.volume * 0.7, ctx.currentTime + 0.01);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.2);
        }, 100);
      }
    } catch (err) {
      console.warn('[TAMV Audio] Error playing sound:', err);
    }
  }

  /**
   * Enable or disable audio
   */
  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  /**
   * Set global volume (0-1)
   */
  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  /**
   * Mute a specific sound type
   */
  muteType(type: SoundType): void {
    if (!this.settings.mutedTypes.includes(type)) {
      this.settings.mutedTypes.push(type);
      this.saveSettings();
    }
  }

  /**
   * Unmute a specific sound type
   */
  unmuteType(type: SoundType): void {
    this.settings.mutedTypes = this.settings.mutedTypes.filter(t => t !== type);
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  getSettings(): AudioSettings {
    return { ...this.settings };
  }
}

// Singleton instance
const audioSystem = new TAMVAudioSystem();

// Export convenience functions
export function playNotificationSound(): void {
  audioSystem.play('notification');
}

export function playSuccessSound(): void {
  audioSystem.play('notification_success');
}

export function playWarningSound(): void {
  audioSystem.play('notification_warning');
}

export function playBankOpenSound(): void {
  audioSystem.play('bank_open');
}

export function playBankCloseSound(): void {
  audioSystem.play('bank_close');
}

export function playMessageReceiveSound(): void {
  audioSystem.play('message_receive');
}

export function playMessageSendSound(): void {
  audioSystem.play('message_send');
}

export function playAchievementSound(): void {
  audioSystem.play('achievement');
}

export function playLevelUpSound(): void {
  audioSystem.play('level_up');
}

export function playIsabellaActiveSound(): void {
  audioSystem.play('isabella_active');
}

export function playXREnterSound(): void {
  audioSystem.play('xr_enter');
}

export function playXRExitSound(): void {
  audioSystem.play('xr_exit');
}

export function setAudioEnabled(enabled: boolean): void {
  audioSystem.setEnabled(enabled);
}

export function setAudioVolume(volume: number): void {
  audioSystem.setVolume(volume);
}

export function getAudioSettings(): AudioSettings {
  return audioSystem.getSettings();
}

export { audioSystem };
