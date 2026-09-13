/* TUYỆT KỸ: thanh nạp, kích hoạt và hiệu ứng của ba nhân vật.
   Chỉnh ULTIMATE_CHARGE_PER_HIT, MEGA_BEAM_WIDTH, STORM_TICKS ở đây. */
const ULTIMATE_CHARGE_PER_HIT = 4; // 25 lần bắn trúng trực tiếp để đầy thanh.
const MEGA_BEAM_WIDTH = 84;        // Bề rộng luồng quét của Điều Dưỡng (pixel canvas).
const STORM_TICKS = 4 * 60;        // 4 giây ở mô phỏng 60 bước/giây.
let ultimateCharge = 0;
let stormTicks = 0;
let beamTicks = 0;
let beamX = 0;
let burstTicks = 0;

function updateUltimateHud() {
  const btn = document.getElementById('ultimate-button');
  const label = document.getElementById('ultimate-label');
  const bar = document.getElementById('ultimate-bar');
  const charge = document.getElementById('ultimate-charge');
  const names = { doctor: 'SỐC ĐIỆN TIM', nurse: 'ĐẠI TIÊM TRUYỀN', sanitizer: 'BÃO CLORAMIN B' };
  label.textContent = names[selectedHero];
  bar.style.width = `${ultimateCharge}%`;
  charge.textContent = `${ultimateCharge}%`;
  const available = ultimateCharge === 100 && !isPaused && !isGameOver &&
    document.getElementById('char-select-screen').classList.contains('hidden');
  // Không dùng thuộc tính disabled: nút mờ vẫn nhận pointerdown để chặn canvas bên dưới.
  btn.setAttribute('aria-disabled', String(!available));
  btn.style.setProperty('--charge', `${ultimateCharge}%`);
  btn.setAttribute('aria-label', `Tuyệt kỹ ${names[selectedHero]}, nạp ${ultimateCharge}%. Nhấn B hoặc chạm nút.`);
}

function gainUltimateCharge() {
  if (ultimateCharge >= 100) return;
  ultimateCharge = Math.min(100, ultimateCharge + ULTIMATE_CHARGE_PER_HIT);
  updateUltimateHud();
}

function resetUltimate() {
  ultimateCharge = 0;
  stormTicks = 0;
  beamTicks = 0;
  burstTicks = 0;
  updateUltimateHud();
}

function activateUltimate() {
  if (ultimateCharge < 100 || isPaused || isGameOver ||
      !document.getElementById('char-select-screen').classList.contains('hidden')) return false;
  AudioEngine.init();
  ultimateCharge = 0;
  if (selectedHero === 'doctor') {
    // Xóa mọi viên đạn độc, có thêm 1 giây né đạn mới xuất hiện.
    const cleared = enemyBullets.length;
    enemyBullets = [];
    player.invincibleTime = Math.max(player.invincibleTime, 60);
    burstTicks = 36;
    createImmunityShockwave(player.x + 16, player.y + 18);
    AudioEngine.beep(840, 0.35, 'sawtooth', 0.07);
  } else if (selectedHero === 'nurse') {
    // Một hàng dọc theo vị trí hiện tại, gây 5 sát thương/quái và 12 lên boss.
    beamX = player.x + player.w / 2;
    beamTicks = 36;
    for (const e of [...enemies]) {
      if (Math.abs(e.x - beamX) <= MEGA_BEAM_WIDTH / 2 + e.radius) {
        e.hp -= 5;
        createExplosion(e.x, e.y, '#fb7185', 8);
        defeatEnemy(e);
      }
    }
    if (boss && Math.abs(boss.x - beamX) <= MEGA_BEAM_WIDTH / 2 + boss.w / 2) {
      boss.hp -= 12;
      createExplosion(boss.x, boss.y, '#fb7185', 16);
      defeatBoss();
    }
    AudioEngine.beep(600, 0.4, 'sawtooth', 0.065);
  } else {
    // Làm chậm quái, boss, đạn độc và nhịp bắn còn 35% trong 4 giây.
    stormTicks = STORM_TICKS;
    createImmunityShockwave(player.x + 16, player.y + 18);
    AudioEngine.beep(300, 0.4, 'triangle', 0.07);
  }
  updateUltimateHud();
  return true;
}

// Gọi một lần mỗi bước mô phỏng, không giảm thời gian khi đang tạm dừng.
function tickUltimate() {
  if (stormTicks > 0) stormTicks--;
  if (beamTicks > 0) beamTicks--;
  if (burstTicks > 0) burstTicks--;
  const status = document.getElementById('ultimate-effect');
  if (stormTicks > 0) status.textContent = `❄ Quái chậm: ${(stormTicks / 60).toFixed(1)}s`;
  else if (beamTicks > 0) status.textContent = '💉 Đang quét khuẩn!';
  else if (burstTicks > 0) status.textContent = '⚡ Miễn nhiễm ngắn!';
  else status.textContent = '';
}

// Vẽ hiệu ứng trên canvas; không thêm hạt liên tục để giữ FPS ổn định.
function renderUltimate() {
  if (stormTicks > 0) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.075)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (beamTicks > 0) {
    const alpha = Math.min(0.75, beamTicks / 20);
    ctx.fillStyle = `rgba(251, 113, 133, ${alpha * 0.45})`;
    ctx.fillRect(beamX - MEGA_BEAM_WIDTH / 2, 0, MEGA_BEAM_WIDTH, canvas.height);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(beamX - 5, 0, 10, canvas.height);
  }
  if (burstTicks > 0) {
    ctx.strokeStyle = `rgba(52, 211, 153, ${burstTicks / 36})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(player.x + 16, player.y + 18, (36 - burstTicks) * 13, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Canh nút theo nhân vật (gần bên phải, sát mép thì đổi sang trái).
// Lấy đúng khung ảnh 320x460 được object-contain vẽ bên trong phần tử canvas.
function positionUltimateButton() {
  const frame = document.getElementById('game-frame').getBoundingClientRect();
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(rect.width / canvas.width, rect.height / canvas.height);
  const offsetX = rect.left - frame.left + (rect.width - canvas.width * scale) / 2;
  const offsetY = rect.top - frame.top + (rect.height - canvas.height * scale) / 2;
  const size = 58;
  const heroX = offsetX + (player.x + player.w / 2) * scale;
  const heroY = offsetY + (player.y + player.h / 2) * scale;
  const proposedRight = heroX + 27;
  const x = proposedRight + size > frame.width - 6 ? heroX - size - 27 : proposedRight;
  const button = document.getElementById('ultimate-button');
  button.style.left = `${Math.max(6, Math.min(frame.width - size - 6, x))}px`;
  button.style.top = `${Math.max(6, Math.min(frame.height - size - 6, heroY - size - 24))}px`;
}
