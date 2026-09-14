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
    let waveEntryTicks = 0; // Nhịp vào màn: quái hiện ra trước khi bắt đầu tấn công.
    let waveClearTicks = 0; // Khoảng nghỉ ngắn sau khi dọn sạch một wave thường.
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
    let bossRewardActive = false;

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
      // color / altColor chỉ đổi dáng và màu; hp, score, radius và shootType giữ nguyên.
      { type: 'bean_yellow', hp: 1, color: '#facc15', altColor: '#a855f7', score: 10, radius: 12, shootType: 'drip' },
      { type: 'pink_tentacle', hp: 3, color: '#ec4899', altColor: '#38bdf8', score: 35, radius: 14, shootType: 'split' },
      { type: 'rod_red',      hp: 1, color: '#fb923c', altColor: '#38bdf8', score: 15, radius: 10, shootType: 'needle' },
      { type: 'worm_pink',    hp: 2, color: '#d946ef', altColor: '#a3e635', score: 25, radius: 11, shootType: 'homing' },
      { type: 'hairy_cyan',   hp: 4, color: '#2dd4bf', altColor: '#22c55e', score: 50, radius: 15, shootType: 'needle' }
    ];

    // 12 boss thường và trùm cuối ở wave 39; hạ trùm cuối là kết thúc ván thắng.
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
      { name: 'Chúa Tể Đại Dịch', family: 'final', color: '#d86b9f', attack: 'fan' },
    ];

    function spawnWave() {
      // Chuyển wave hoặc chơi lại wave sau khi quái vượt tuyến:
      // xóa toàn bộ đạn cũ, giữ powerUps do lính thường rơi để vẫn nhặt được.
      bullets = [];
      enemyBullets = [];
      enemies = [];
      boss = null;
      formationShiftX = 0;
      formationDropY = 0;
      formationTick = 0;
      document.getElementById('boss-attack-warning').classList.add('hidden');

      noticeTicks = 150; // Thông báo màn hiển thị 2,5 giây.
      waveEntryTicks = 50; // ~0,83 giây chuyển cảnh trước khi đội hình bắt đầu di chuyển/bắn.
      waveClearTicks = 0;
      const isBossWave = wave % 3 === 0;
      const bossType = isBossWave ? BOSS_TYPES[Math.min(wave / 3 - 1, BOSS_TYPES.length - 1)] : null;
      const notice = document.getElementById('wave-notice');
      notice.textContent = bossType ? `⚠ WAVE ${wave} · ${bossType.name}` : `WAVE ${wave}`;
      notice.classList.toggle('boss-announcement', !!bossType);
      notice.classList.remove('hidden');
      if (bossType) {
        AudioEngine.bossRoar();
        // Mỗi 3 wave là 1 boss. Wave 3 = 45 HP, wave 36 = 267 HP (trước là 705).
        // Chỉnh 12 và 0.75 để cân bằng tăng trưởng đầu/cuối mà không chặn vô tận.
        const bossRank = wave / 3 - 1;
        // Ba cột máu nối tiếp, mỗi cột 600 HP; thứ tự pha 1 → 2 → 3.
        const bossHp = wave === 39 ? 1800 : 45 + 12 * bossRank + Math.floor(.75 * bossRank * bossRank);
        boss = {
          name: bossType.name, family: bossType.family, color: bossType.color, attack: bossType.attack,
          variant: Math.min(bossRank, BOSS_TYPES.length - 1), final: wave === 39,
          guards: [], summonCount: 0, guardVolleyTimer: 65,
          melee: null, meleeCooldown: 100, meleeAttackCount: 0,
          secondGuardScheduled: false, attackCount: 2,
          windup: 0, windupTotal: 0, specialShots: null, specialName: '', hitFlash: 0,
          phase: 1, phaseTransition: 0,
          x: 160, y: 67,
          w: wave === 39 ? 100 : 92, h: 86,
          hp: bossHp, maxHp: bossHp,
          pathTicks: 0, shootCooldown: wave === 39 ? 72 : 120, animTimer: 0
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

          // 6 skin cho mỗi họ lính: 2 mẫu gốc + 4 mẫu mới = 30 mẫu tổng cộng.
          // Phân bố theo hàng/cột/wave để một màn có nhiều ngoại hình khác nhau.
          const skin = (c + r * 2 + wave) % 6;
          enemies.push({
            x: 24 + c * 46,
            y: 35 + r * 36,
            baseX: 24 + c * 46, baseY: 35 + r * 36,
            motionPhase: c * .63 + r * 1.17, row: r,
            radius: type.radius,
            hp: type.hp, maxHp: type.hp,
            color: skin ? type.altColor : type.color, score: type.score,
            type: type.type, skin, shootType: type.shootType,
            animTimer: Math.random() * 100
          });
        }
      }
    }

    let enemyDir = 1;
    let enemySpeedX = 0.48;
    let formationShiftX = 0;
    let formationDropY = 0;
    let formationTick = 0;
