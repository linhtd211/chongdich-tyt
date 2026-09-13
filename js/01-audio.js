/* ÂM THANH: tạo tiếng bắn, trúng đạn, nổ và nhặt vật phẩm. Chỉnh âm lượng trong beep(vol).
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 1. ÂM THANH CHIPTUNE ---
    const AudioEngine = {
      ctx: null,
      lastEffect: {},
      // Va chạm liên tiếp có thể tạo hàng chục oscillator/giây; giới hạn mỗi loại tiếng.
      playLimited(name, interval, action) {
        const now = performance.now();
        if (now - (this.lastEffect[name] ?? -Infinity) < interval) return;
        this.lastEffect[name] = now;
        action();
      },
      init() {
        if (!this.ctx) {
          const Cls = window.AudioContext || window.webkitAudioContext;
          if (Cls) this.ctx = new Cls();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      },
      beep(freq, duration = 0.05, type = 'square', vol = 0.06) {
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(vol, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
      },
      shootLaser() { this.beep(950, 0.04, 'sawtooth', 0.04); },
      shootBurst() { this.beep(650, 0.05, 'triangle', 0.06); },
      shootBubble() { this.beep(420, 0.06, 'sine', 0.05); },
      hit() { this.playLimited('hit', 45, () => this.beep(280, 0.03, 'sine', 0.03)); },
      explode() { this.playLimited('explode', 100, () => this.beep(85, 0.18, 'sawtooth', 0.07)); },
      bossRoar() { this.beep(55, 0.55, 'sawtooth', 0.18); },
      powerUp() {
        this.beep(523, 0.08); setTimeout(() => this.beep(659, 0.08), 80); setTimeout(() => this.beep(1046, 0.2), 160);
      },
      shieldAbsorb() { this.playLimited('shield', 80, () => this.beep(950, 0.08, 'sine', 0.06)); },
      hurt() { this.beep(120, 0.25, 'sawtooth', 0.12); }
    };

