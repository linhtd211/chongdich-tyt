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

    // Chu kỳ chuẩn: 3 wave lính thường rồi 1 boss. 12 boss thường ở wave 4..48; trùm cuối ở wave 52.
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
      bullets=[]; enemyBullets=[]; enemies=[]; boss=null; formationShiftX=0; formationDropY=0; formationTick=0;
      document.getElementById('boss-attack-warning').classList.add('hidden'); noticeTicks=150; waveEntryTicks=50; waveClearTicks=0;
      const isBossWave=wave%4===0, bossType=isBossWave?BOSS_TYPES[Math.min(wave/4-1,BOSS_TYPES.length-1)]:null;
      const notice=document.getElementById('wave-notice');
      notice.textContent=bossType?`⚠ ${stageTheme().toUpperCase()} · ${bossType.name}`:`WAVE ${wave} · ${['XÂM NHẬP','ĐỘT BIẾN','BÁO ĐỘNG ĐỎ'][waveSlot()-1]} · ${stageTheme()}`;
      notice.classList.toggle('boss-announcement',!!bossType);notice.classList.remove('hidden');
      if(bossType){AudioEngine.bossRoar();const bossRank=wave/4-1,bossHp=wave===52?1800:45+12*bossRank+Math.floor(.75*bossRank*bossRank);boss={name:bossType.name,family:bossType.family,color:bossType.color,attack:bossType.attack,variant:Math.min(bossRank,BOSS_TYPES.length-1),final:wave===52,guards:[],summonCount:0,guardVolleyTimer:65,melee:null,meleeCooldown:100,meleeAttackCount:0,secondGuardScheduled:false,attackCount:2,windup:0,windupTotal:0,specialShots:null,specialName:'',hitFlash:0,phase:1,phaseTransition:0,x:160,y:67,w:wave===52?100:92,h:86,hp:bossHp,maxHp:bossHp,pathTicks:0,shootCooldown:wave===52?72:120,animTimer:0};showBossIntro(bossType,wave);return}
      const slot=waveSlot(), formations=['v','wings','arc','columns','surround']; const formation=formations[(stageIndex()+wave)%formations.length];
      let rows=4, cols=6;
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){let type=ENEMY_TYPES[(r+c+stageIndex())%ENEMY_TYPES.length];let x=24+c*(cols===7?42:46), y=38+r*37;
        if(formation==='v')y+=Math.abs(c-(cols-1)/2)*10; else if(formation==='arc')y+=Math.pow(c-(cols-1)/2,2)*3; else if(formation==='wings')y+=(c===0||c===cols-1)?28:0; else if(formation==='columns')x+=((r%2)*8);
        const skin=(c+r*2+wave)%6,e=makeEnemy(type,x,y,r,c,skin);enemies.push(e)}
      if(slot===2){const count=1+Math.floor(Math.random()*3);const kinds=Object.keys(ELITE_META);for(let i=0;i<count;i++){const pool=enemies.filter(e=>!e.elite);if(pool.length)applyElite(pool[Math.floor(Math.random()*pool.length)],kinds[Math.floor(Math.random()*kinds.length)])}}
      if(slot===3){const events=['swarm','armored','crossfire','mutation','rush','blackout'];waveEvent=events[Math.floor(Math.random()*events.length)];if(waveEvent==='swarm'){for(const e of enemies){e.hp=e.maxHp=Math.max(.75,e.hp*.65);e.radius*=.88}announceEvent('SWARM ATTACK','Đông hơn · máu thấp hơn')}else if(waveEvent==='armored'){enemies.filter(()=>Math.random()<.7).forEach(e=>applyElite(e,'shield'));announceEvent('ARMORED OUTBREAK','Phần lớn vi khuẩn có giáp')}else if(waveEvent==='crossfire'){enemies.forEach((e,i)=>{e.baseX=i%2?22:canvas.width-22;e.x=e.baseX});announceEvent('CROSSFIRE','Địch ép từ hai cánh')}else if(waveEvent==='mutation'){enemies.filter(()=>Math.random()<.3).forEach(e=>applyElite(e,Object.keys(ELITE_META)[Math.floor(Math.random()*6)]));announceEvent('MUTATION','Nhiều Elite đột biến')}else if(waveEvent==='rush'){enemies.filter(()=>Math.random()<.45).forEach(e=>applyElite(e,'rusher'));announceEvent('RUSH HOUR','Từng vi khuẩn lao xuống liên tiếp · nhịp nhanh')}else announceEvent('BLACKOUT','Tầm nhìn bị thu hẹp')}
      beginWaveSystems();
    }

    let enemyDir = 1;
    let enemySpeedX = 0.48;
    let formationShiftX = 0;
    let formationDropY = 0;
    let formationTick = 0;
