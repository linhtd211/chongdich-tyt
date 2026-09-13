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

    // BOSS CANVAS: 12 boss luân phiên, 5 họ hình dáng, nhiều kiểu tấn công.
    // Boss bệnh than được giữ lại một lần: Dã Thú Hoại Tử.
    const BOSS_TYPES = [
      { name: 'Cơ Giáp Thực Khuẩn', family: 'mech', color: '#38bdf8', attack: 'aimed' },
      { name: 'Bầy Phế Cầu', family: 'serpent', color: '#c084fc', attack: 'split' },
      { name: 'Chúa Tể Ebola', family: 'serpent', color: '#fb923c', attack: 'fan' },
      { name: 'Trùm Sổ Mũi', family: 'virus', color: '#f472b6', attack: 'spread' },
      { name: 'Trùm Tiêu Chảy', family: 'virus', color: '#e879f9', attack: 'aimed' },
      { name: 'Chúa Tể Phát Dại', family: 'beast', color: '#a3e635', attack: 'fan' },
      { name: 'F0 Bất Tử', family: 'virus', color: '#fb923c', attack: 'split' },
      { name: 'Xoắn Khuẩn Vương', family: 'serpent', color: '#f97316', attack: 'aimed' },
      { name: 'Hắc Hạch Yêu Vương', family: 'beast', color: '#84cc16', attack: 'split' },
      { name: 'Dã Thú Hoại Tử', family: 'beast', color: '#facc15', attack: 'spread' },
      { name: 'Linh Hồn Sa Ngã', family: 'mech', color: '#38bdf8', attack: 'spread' },
      { name: 'Huyết Ký Sinh Vương', family: 'queen', color: '#fb7185', attack: 'split' },
    ];

    function spawnWave() {
      // Chuyển wave hoặc chơi lại wave sau khi quái vượt tuyến:
      // xóa toàn bộ đạn cũ, giữ powerUps để vẫn nhặt được vật phẩm boss rơi.
      bullets = [];
      enemyBullets = [];
      enemies = [];
      boss = null;
      document.getElementById('boss-attack-warning').classList.add('hidden');

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
          name: bossType.name, family: bossType.family, color: bossType.color, attack: bossType.attack,
          variant: (wave / 3 - 1) % BOSS_TYPES.length, attackCount: 2,
          windup: 0, windupTotal: 0, specialShots: null, specialName: '', hitFlash: 0,
          phase: 1, phaseTransition: 0,
          x: 160, y: 67,
          w: 92, h: 86,
          hp: bossHp, maxHp: bossHp,
          vx: 1.5, shootCooldown: 120, animTimer: 0
        };
        showBossIntro(bossType, wave);
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
