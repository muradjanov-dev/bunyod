// ==========================================================================
// BUNYOD PLATFORMASI - XOTIRJAMLIK VA NAFAS MASHQI (BOX BREATHING)
// ==========================================================================

import { i18nManager } from './i18n.js';

class BreathingManager {
  constructor() {
    this.currentPhaseIndex = 0;
    this.countdown = 4;
    this.timer = null;
    this.isRunning = false;
    this.cyclesCompleted = 0;
    this.soundEnabled = true;
    this.audioCtx = null;
  }

  getPhases() {
    const lang = i18nManager.getLang();
    const phaseNames = {
      uz: ["Nafas oling", "Nafasni ushlang", "Nafas chiqaring", "Pauza / Xotirjamlik"],
      uz_cyrl: ["Нафас олинг", "Нафасни ушланг", "Нафас чиқаринг", "Пауза / Хотиржамлик"],
      ru: ["Вдох", "Задержка дыхания", "Выдох", "Покой / Пауза"],
      en: ["Inhale", "Hold", "Exhale", "Rest / Pause"]
    };

    const names = phaseNames[lang] || phaseNames.uz;
    return [
      { name: names[0], actionClass: "expand", duration: 4 },
      { name: names[1], actionClass: "hold", duration: 4 },
      { name: names[2], actionClass: "contract", duration: 4 },
      { name: names[3], actionClass: "contract", duration: 4 }
    ];
  }

  init() {
    this.orbCore = document.getElementById('breathOrbCore');
    this.phaseTitle = document.getElementById('breathPhaseTitle');
    this.timerCount = document.getElementById('breathTimerCount');
    this.startBtn = document.getElementById('startBreathBtn');
    this.cycleCountEl = document.getElementById('breathCycleCount');
    this.soundToggleBtn = document.getElementById('breathSoundToggle');

    if (!this.startBtn) return;

    this.startBtn.addEventListener('click', () => this.toggleExercise());

    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggleBtn.textContent = this.soundEnabled ? i18nManager.t('sound_on') : i18nManager.t('sound_off');
      });
    }

    i18nManager.onLanguageChange(() => {
      if (!this.isRunning) {
        if (this.phaseTitle) this.phaseTitle.textContent = i18nManager.t('breath_ready');
        if (this.startBtn) this.startBtn.textContent = i18nManager.t('btn_start_breath');
      } else {
        const phases = this.getPhases();
        if (this.phaseTitle) this.phaseTitle.textContent = phases[this.currentPhaseIndex].name;
        if (this.startBtn) this.startBtn.textContent = i18nManager.t('btn_stop_breath');
      }
      if (this.soundToggleBtn) {
        this.soundToggleBtn.textContent = this.soundEnabled ? i18nManager.t('sound_on') : i18nManager.t('sound_off');
      }
    });
  }

  playGentleTone(freq = 432) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 2.6);
    } catch (e) {
      // Audio fallback
    }
  }

  toggleExercise() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isRunning = true;
    this.startBtn.textContent = i18nManager.t('btn_stop_breath');
    this.startBtn.classList.add('active');
    this.currentPhaseIndex = 0;
    const phases = this.getPhases();
    this.countdown = phases[0].duration;
    this.applyPhase();

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.timerCount) this.timerCount.textContent = this.countdown;

      if (this.countdown <= 0) {
        const p = this.getPhases();
        this.currentPhaseIndex = (this.currentPhaseIndex + 1) % p.length;
        if (this.currentPhaseIndex === 0) {
          this.cyclesCompleted++;
          if (this.cycleCountEl) this.cycleCountEl.textContent = this.cyclesCompleted;
          window.addXP?.(15);
        }
        this.countdown = p[this.currentPhaseIndex].duration;
        this.applyPhase();
      }
    }, 1000);
  }

  applyPhase() {
    const phases = this.getPhases();
    const phase = phases[this.currentPhaseIndex];
    if (this.phaseTitle) this.phaseTitle.textContent = phase.name;
    if (this.timerCount) this.timerCount.textContent = this.countdown;

    if (this.orbCore) {
      this.orbCore.className = `breathing-orb-core ${phase.actionClass}`;
    }

    const tones = [432, 528, 396, 432];
    this.playGentleTone(tones[this.currentPhaseIndex]);
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.timer);
    this.startBtn.textContent = i18nManager.t('btn_start_breath');
    this.startBtn.classList.remove('active');
    if (this.phaseTitle) this.phaseTitle.textContent = i18nManager.t('breath_ready');
    if (this.timerCount) this.timerCount.textContent = "4";
    if (this.orbCore) this.orbCore.className = "breathing-orb-core";
  }
}

export const breathingManager = new BreathingManager();
