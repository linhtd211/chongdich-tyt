/* TRẠNG THÁI & CẤU HÌNH: điểm, máu, màn, vị trí nhân vật, loại quái và đội hình từng màn. Chỉnh thông số quái tại ENEMY_TYPES; chỉnh số hàng/cột tại spawnWave().
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 2. GAME STATE & SETUP ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let score = 0;
    let hp = 3;
    let wave = 1;
    // Bước mô phỏng cố định 60 lần/giây: máy 120Hz và 60Hz chơi cùng tốc độ.
    const STEP_MS = 1000 / 60;
    let lastFrameTime = 0;
    let accumulatedTime = 0;
    let isPaused = false;
    let noticeTicks = 0;
    let isGameOver = false;
    let selectedHero = 'doctor';
    let animationId = null;

    const player = {
      x: 145,
      y: 400,
      w: 32,
      h: 40,
      gunLevel: 1,
      invincibleTime: 0,
      shieldTime: 0,
      shootCooldown: 0,
      targetX: 145,
      targetY: 400
    };

    let isTouching = false;
    let bullets = [];
    let enemyBullets = [];
    let enemies = [];
    let powerUps = [];
    let particles = [];
    let shockwaves = [];
    let bloodCells = [];
    let boss = null;

    for (let i = 0; i < 14; i++) {
      bloodCells.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 8 + Math.random() * 14,
        speed: 0.2 + Math.random() * 0.4,
        alpha: 0.15 + Math.random() * 0.2
      });
    }

    const ENEMY_TYPES = [
      { type: 'bean_yellow', hp: 1, color: '#facc15', score: 10, radius: 12, shootType: 'drip' },
      { type: 'pink_tentacle', hp: 3, color: '#d946ef', score: 35, radius: 14, shootType: 'split' },
      { type: 'rod_red',      hp: 1, color: '#ef4444', score: 15, radius: 10, shootType: 'needle' },
      { type: 'worm_pink',    hp: 2, color: '#f43f5e', score: 25, radius: 11, shootType: 'homing' },
      { type: 'hairy_cyan',   hp: 4, color: '#22d3ee', score: 50, radius: 15, shootType: 'needle' }
    ];

    // THƯ VIỆN BOSS: thứ tự mỗi 3 wave; hết danh sách thì quay vòng.
    // src = [x, y, rộng, cao] trên assets/boss-atlas.png (ảnh nền trong suốt).
    // Tên là danh xưng hư cấu trong game, không phải tên chẩn đoán bệnh.
    const BOSS_TYPES = [
      { name: 'Cơ Giáp Thực Khuẩn', src: [22, 5, 329, 266], glow: '#38bdf8' },
      { name: 'Bầy Cầu Khuẩn Tím', src: [361, 12, 301, 260], glow: '#c084fc' },
      { name: 'Rồng Sợi Lửa', src: [660, 7, 293, 265], glow: '#fb923c' },
      { name: 'Chúa Cúm Gai', src: [963, 20, 195, 243], glow: '#f472b6' },
      { name: 'Bạo Chúa Roi Quẩn', src: [1170, 18, 226, 250], glow: '#e879f9' },
      { name: 'Dã Thú Nanh Độc', src: [1458, 21, 226, 240], glow: '#a3e635' },
      { name: 'Vương Miện Corona', src: [38, 304, 371, 268], glow: '#fb923c' },
      { name: 'Xoắn Trùng Hung Bạo', src: [477, 317, 393, 260], glow: '#f97316' },
      { name: 'Chuột Bóng Dịch', src: [918, 304, 349, 277], glow: '#84cc16' },
      { name: 'Dã Thú Thiết Giáp', src: [1292, 309, 394, 268], glow: '#facc15' },
      { name: 'Pháo Đài Gai Than', src: [27, 630, 442, 275], glow: '#fb923c' },
      { name: 'Lõi Retro Chiến Đấu', src: [554, 637, 283, 250], glow: '#38bdf8' },
      { name: 'Nữ Hoàng Ký Sinh', src: [1295, 634, 389, 269], glow: '#fb7185' }
    ];

    function spawnWave() {
      // Chuyển wave hoặc chơi lại wave sau khi quái vượt tuyến:
      // xóa toàn bộ đạn cũ, giữ powerUps để vẫn nhặt được vật phẩm boss rơi.
      bullets = [];
      enemyBullets = [];
      enemies = [];
      boss = null;

      noticeTicks = 120; // Thông báo màn hiển thị 2 giây.
      const isBossWave = wave % 3 === 0;
      const bossType = isBossWave ? BOSS_TYPES[(wave / 3 - 1) % BOSS_TYPES.length] : null;
      const notice = document.getElementById('wave-notice');
      notice.textContent = bossType ? `⚠ WAVE ${wave} · ${bossType.name}` : `WAVE ${wave}`;
      notice.classList.toggle('boss-announcement', !!bossType);
      notice.classList.remove('hidden');
      if (bossType) {
        AudioEngine.bossRoar();
        const bossHp = 45 + (wave - 3) * 20;
        boss = {
          name: bossType.name, src: bossType.src, glow: bossType.glow,
          x: 160, y: 67,
          w: 92, h: 86,
          hp: bossHp, maxHp: bossHp,
          vx: 1.5, shootCooldown: 120, animTimer: 0
        };
        return;
      }

      const rows = 3 + Math.min(wave, 3);
      const cols = 6;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let type = ENEMY_TYPES[0];
          if (r === 0) type = (wave >= 4) ? ENEMY_TYPES[4] : ENEMY_TYPES[1];
          else if (r === 1) type = ENEMY_TYPES[1];
          else if (r === 2) type = ENEMY_TYPES[3];
          else type = (c % 2 === 0) ? ENEMY_TYPES[0] : ENEMY_TYPES[2];

          enemies.push({
            x: 24 + c * 46,
            y: 35 + r * 36,
            radius: type.radius,
            hp: type.hp, maxHp: type.hp,
            color: type.color, score: type.score,
            type: type.type, shootType: type.shootType,
            animTimer: Math.random() * 100
          });
        }
      }
    }

    let enemyDir = 1;
    let enemySpeedX = 0.7;

