/* BOSS CANVAS – VẼ & HÀNH ĐỘNG.
   BOSS_TYPES (tên, họ, màu, kiểu đạn) ở 02-state.js.
   Mỗi họ hình có chuyển động riêng. Không dùng ảnh atlas nên giữ nét vẽ giống nhân vật.
   Chiêu riêng của 12 boss nằm tại buildBossSpecial(); thời gian báo trước trong updateBoss().
   Tất cả đạn đều theo cơ chế va chạm cũ, không tạo hiệu ứng mới mỗi frame. */

function bossOval(x, y, rx, ry, fill, stroke = '#172033') {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
}
function bossLine(x1, y1, x2, y2, color, width = 3) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
function bossEye(x, y, blink) {
  if (blink) { bossLine(x - 5, y, x + 5, y, '#0f172a', 2); return; }
  bossOval(x, y, 6.5, 7, '#f8fafc');
  bossOval(x + 1.5, y + 1, 3, 4, '#ef4444', '#0f172a');
  ctx.fillStyle = '#fff'; ctx.fillRect(x + 1, y - 2, 2, 2);
}
function bossMouth(open) {
  bossOval(0, 14, 15, open ? 10 : 5, '#260e25');
  ctx.fillStyle = '#fff';
  for (let x = -9; x <= 9; x += 6) {
    ctx.beginPath(); ctx.moveTo(x - 2, open ? 6 : 11);
    ctx.lineTo(x + 2, open ? 6 : 11); ctx.lineTo(x, open ? 12 : 14); ctx.fill();
  }
}

function drawVirusBoss(b, t, blink) {
  // Vòng gai nhấp nhô; hai mắt, miệng và lõi màu thay đổi theo từng boss.
  for (let i = 0; i < 14; i++) {
    const a = i * Math.PI * 2 / 14 + Math.sin(t * 2 + i) * .07;
    const r = 33 + Math.sin(t * 3 + i) * 3;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    bossLine(x, y, x + Math.cos(a) * 14, y + Math.sin(a) * 14, b.color, 5);
    bossOval(x + Math.cos(a) * 14, y + Math.sin(a) * 14, 3.8, 3.8, '#fca5a5');
  }
  if (b.variant === 4) { // Roi quẩn: ba râu dài quẫy quanh thân.
    for (let i = -1; i <= 1; i++) {
      bossLine(i * 18, 25, i * 26 + Math.sin(t * 3 + i) * 8, 51, '#d8b4fe', 3);
    }
  }
  bossOval(0, 0, 36, 34, b.color);
  bossOval(0, 4, 27, 25, '#334155', '#f8fafc');
  if (b.variant === 6) { // Vương miện Corona
    for (let i = -1; i <= 1; i++) {
      bossLine(i * 15, -25, i * 20, -45, '#fbbf24', 5);
      bossOval(i * 20, -45, 4, 4, '#fef08a');
    }
  }
  bossEye(-12, -6, blink); bossEye(12, -6, blink);
  bossMouth(b.windup > 0);
}
function drawSerpentBoss(b, t, blink) {
  // Thân nhiều đốt uốn lượn + ba đầu nhỏ (bầy khuẩn) / sừng lửa (rồng).
  const fiery = b.variant === 2 || b.variant === 7;
  for (let i = 4; i >= 0; i--) {
    const x = -35 + i * 14, y = 16 - Math.sin(t * 2 + i * .7) * 9 - i * 5;
    bossOval(x, y, 13 + i, 12 + i, i % 2 ? b.color : (fiery ? '#9a3412' : '#6d28d9'));
    bossOval(x - 4, y - 4, 3, 3, '#fef08a', b.color);
  }
  if (b.variant === 1) { // Bầy cầu khuẩn: hai đầu phụ thay phiên há miệng.
    for (let i = -1; i <= 1; i += 2) {
      bossOval(-22 + i * 11, -13 + i * 13 + Math.sin(t * 3 + i) * 4, 10, 9, '#7c3aed');
      bossOval(-19 + i * 11, -16 + i * 13, 2.5, 3, '#fff');
    }
  }
  if (b.variant === 7) { // Xoắn trùng: sọc xoắn dọc thân.
    for (let i = 0; i < 4; i++) bossLine(-29 + i * 14, 5 - i * 4, -20 + i * 14, 15 - i * 4, '#fed7aa', 3);
  }
  ctx.save(); ctx.translate(17, -13);
  bossOval(0, 0, 25, 22, b.color);
  for (const side of [-1, 1]) {
    bossLine(side * 15, -15, side * 22, -29 + Math.sin(t * 3 + side) * 3, fiery ? '#fb923c' : '#ddd6fe', 4);
  }
  bossEye(-8, -6, blink); bossEye(10, -6, blink); bossMouth(b.windup > 0);
  ctx.restore();
}
function drawMechBoss(b, t, blink) {
  // Chân máy và tay pháo giật theo nhịp bắn.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const y = -19 + i * 17, swing = Math.sin(t * 3 + i + side) * 5;
      bossLine(side * 22, y, side * (37 + swing), y + 7, '#94a3b8', 5);
      bossLine(side * (37 + swing), y + 7, side * 48, y + 24, '#e2e8f0', 3);
    }
  }
  bossOval(0, 0, 31, 30, '#334155');
  ctx.fillStyle = b.color;
  ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(26, -16); ctx.lineTo(28, 19);
  ctx.lineTo(0, 35); ctx.lineTo(-28, 19); ctx.lineTo(-26, -16); ctx.closePath();
  ctx.fill(); ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3; ctx.stroke();
  if (b.variant === 10) { // Lõi Retro: sáu tia năng lượng quay.
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 + t;
      bossLine(Math.cos(a) * 28, Math.sin(a) * 28, Math.cos(a) * 35, Math.sin(a) * 35, '#67e8f9', 3);
    }
  }
  bossOval(0, -2, 19, 16, '#0f172a', '#cbd5e1');
  bossEye(-9, -4, blink); bossEye(9, -4, blink);
  bossLine(-11, 17, 11, 17, '#f8fafc', b.windup > 0 ? 5 : 2);
  for (const side of [-1, 1]) {
    const kick = b.windup > 0 ? 5 : Math.sin(t * 4) * 2;
    bossLine(side * 29, 17, side * 40, 27 + kick, b.color, 8);
    bossOval(side * 40, 27 + kick, 7, 7, '#475569');
  }
}
function drawBeastBoss(b, t, blink) {
  // Cơ thể nghiêng, tai nhọn, vuốt và đuôi quẫy.
  bossLine(-19, 16, -43, 5 + Math.sin(t * 4) * 11, b.color, 9);
  for (const side of [-1, 1]) {
    bossLine(side * 19, 17, side * 27 + Math.sin(t * 3 + side) * 3, 38, '#475569', 9);
    bossLine(side * 27, 38, side * 33, 41, '#f8fafc', 4);
  }
  bossOval(0, 2, 32, 29, b.color);
  if (b.variant === 9) { // Dã Thú Hoại Tử: vệt đen trên lớp giáp, khác dáng chuột dịch.
    for (let i = -2; i <= 2; i++) bossOval(i * 11, -21, 7, 5, '#292524', '#fde68a');
    bossOval(-17, 7, 4, 5, '#3f1d22', '#ef4444');
    bossOval(17, 8, 4, 5, '#3f1d22', '#ef4444');
  }
  if (b.variant === 8) { // Chuột: râu mép rung.
    for (const side of [-1, 1]) for (let i = 0; i < 2; i++)
      bossLine(side * 15, 9 + i * 3, side * 34, 7 + i * 7 + Math.sin(t * 3) * 2, '#f8fafc', 1.5);
  }
  for (const side of [-1, 1]) {
    ctx.fillStyle = '#475569'; ctx.strokeStyle = '#172033'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(side * 18, -19); ctx.lineTo(side * 26, -42);
    ctx.lineTo(side * 4, -26); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  bossOval(0, 5, 24, 20, '#475569');
  bossEye(-11, -3, blink); bossEye(11, -3, blink);
  bossMouth(b.windup > 0);
  bossOval(0, 7, 5, 4, '#111827');
}
function drawQueenBoss(b, t, blink) {
  // Tám xúc tu chuyển động độc lập và lõi hình thoi.
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI * 2 / 8 + Math.sin(t * 2 + i) * .15;
    const x = Math.cos(a) * 45, y = Math.sin(a) * 38;
    bossLine(Math.cos(a) * 24, Math.sin(a) * 22, x, y, b.color, 7);
    bossOval(x, y, 5, 5, '#fda4af');
  }
  bossOval(0, 0, 31, 30, '#881337');
  ctx.fillStyle = b.color;
  ctx.beginPath(); ctx.moveTo(0, -32); ctx.lineTo(25, 0); ctx.lineTo(0, 32);
  ctx.lineTo(-25, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#fda4af'; ctx.lineWidth = 3; ctx.stroke();
  bossEye(-10, -5, blink); bossEye(10, -5, blink);
  bossMouth(b.windup > 0);
}

function drawBoss(b) {
  b.animTimer += .04;
  const t = b.animTimer;
  const blink = Math.floor(t * 5) % 31 === 0;
  ctx.save();
  ctx.translate(b.x, b.y + Math.sin(t * 2) * 3);
  // Vòng cảnh báo: boss há miệng/đỏ sáng trong lúc nạp đòn (khoảng 0,4 giây).
  if (b.windup > 0) {
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3 + Math.sin(t * 18) * 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 46 + Math.sin(t * 18) * 3, 0, Math.PI * 2); ctx.stroke();
  }
  if (b.family === 'mech') drawMechBoss(b, t, blink);
  else if (b.family === 'serpent') drawSerpentBoss(b, t, blink);
  else if (b.family === 'beast') drawBeastBoss(b, t, blink);
  else if (b.family === 'queen') drawQueenBoss(b, t, blink);
  else drawVirusBoss(b, t, blink);
  if (b.hitFlash > 0) {
    ctx.globalAlpha = b.hitFlash / 10;
    bossOval(0, 0, 30, 28, '#fff', '#fff');
  }
  ctx.restore();
}

// Tất cả vật thể đạn vẫn dùng định dạng hiện có của game; không tạo ảnh hay particle vô hạn.
function bossProjectile(b, type, vx, vy, xOffset = 0) {
  enemyBullets.push({ type, x: b.x + xOffset, y: b.y + 28, vx, vy,
    ...(type === 'split' ? { splitTimer: 45 } : {}) });
}

// Mỗi boss có một cách tung đòn riêng. Chụp vị trí nhân vật tại lúc BẮT ĐẦU
// báo chiêu: vạch cảnh báo trùng với đường đạn sẽ bay, kể cả khi nhân vật né.
// Tối đa 7 viên/đòn; đạn tách tối đa 3 viên trước khi phân nhánh.
function buildBossSpecial(b) {
  const x = b.x, y = b.y + 28;
  const target = player.x + player.w / 2;
  const aim = (origin, speed = 3.2) => Math.max(-1.8, Math.min(1.8,
    (target - origin) * speed / Math.max(100, player.y - y)));
  const shot = (offset, vx, vy, type = 'needle') =>
    ({ x: x + offset, y, vx, vy, type, ...(type === 'split' ? { splitTimer: 45 } : {}) });
  let name, shots;
  switch (b.variant) {
    case 0: name = 'Ba mũi điện truy dấu'; shots = [-22, 0, 22].map(o => shot(o, aim(x + o) + o / 65, 3.3)); break;
    case 1: name = 'Bầy khuẩn phân đàn'; shots = [-25, 0, 25].map(o => shot(o, o / 35, 2.5, 'split')); break;
    case 2: name = 'Cung máu bảy tia'; shots = [-3, -2, -1, 0, 1, 2, 3].map(n => shot(0, n * .55, 3)); break;
    case 3: name = 'Cơn hắt hơi chéo'; shots = [-2, -1, 0, 1, 2].map(n => shot(n * 12, 1.1 + n * .35, 3.1)); break;
    case 4: name = 'Mưa độc ba cột'; shots = [55, canvas.width / 2, canvas.width - 55].map(cx => shot(cx - x, 0, 2.7, 'split')); break;
    case 5: name = 'Vuốt dại chụm đích'; shots = [-35, -17, 0, 17, 35].map(o => shot(o, aim(x + o, 3.2), 3.2)); break;
    case 6: name = 'Vòng lây lan'; shots = [-2, -1, 0, 1, 2].map(n => shot(n * 14, n * .7, 2.9)); break;
    case 7: name = 'Xoắn khuẩn đan chéo'; shots = [-3, -2, -1, 0, 1, 2, 3].map(n => shot(n * 9, -n * .48, 3)); break;
    case 8: name = 'Hạch đen nứt vỡ'; shots = [-28, 0, 28].map(o => shot(o, -o / 42, 2.6, 'split')); break;
    case 9: name = 'Vệt hoại tử hội tụ'; shots = [-30, -10, 10, 30].map(o => shot(o, -o / 50, 3.4)); break;
    case 10: name = 'Lưới linh hồn'; shots = [-2, -1, 0, 1, 2].map(n => shot(n * 17, -n * .75, 3.1)); break;
    default: name = 'Huyết vũ truy đuổi'; shots = [-24, 0, 24].map(o => shot(o, aim(x + o, 2.5), 2.5, 'split'));
  }
  return { name, shots };
}

function drawBossTelegraph(b) {
  if (!b.specialShots || b.windup <= 0) return;
  const pulse = .45 + .25 * Math.sin(b.animTimer * 14);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, canvas.width, canvas.height); ctx.clip();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = `rgba(251, 191, 36, ${pulse})`;
  ctx.lineWidth = 3;
  for (const s of b.specialShots) {
    const ticks = Math.min(160, (canvas.height - s.y) / s.vy);
    if (s.type === 'split' && ticks > 45) {
      // Viên gốc dừng ở điểm tách; ba nhánh mới mới bay tiếp từ đây.
      const splitX = s.x + s.vx * 45, splitY = s.y + s.vy * 45;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(splitX, splitY); ctx.stroke();
      const remain = (canvas.height - splitY) / 2.8;
      for (const vx of [-1.2, 0, 1.2]) {
        ctx.beginPath(); ctx.moveTo(splitX, splitY);
        ctx.lineTo(splitX + vx * remain, canvas.height); ctx.stroke();
      }
    } else {
      ctx.beginPath(); ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + s.vx * ticks, s.y + s.vy * ticks); ctx.stroke();
    }
  }
  ctx.setLineDash([]);
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`⚠ ${b.specialName}`, canvas.width / 2, 178);
  ctx.restore();
}
function fireBossAttack(b) {
  b.attackCount++;
  if (b.attack === 'aimed') {
    const dx = Math.max(-1.7, Math.min(1.7, (player.x + 16 - b.x) / 85));
    for (const offset of [-18, 0, 18]) bossProjectile(b, 'needle', dx + offset / 30, 3, offset);
  } else if (b.attack === 'fan') {
    for (const vx of [-2, -1, 0, 1, 2]) bossProjectile(b, 'needle', vx * .8, 2.7 + Math.abs(vx) * .12);
  } else if (b.attack === 'split') {
    for (const offset of [-18, 18]) bossProjectile(b, 'split', offset / 24, 2.25, offset);
  } else { // spread: đợt đạn đổi hướng luân phiên
    const dir = b.attackCount % 2 ? 1 : -1;
    for (let i = -1; i <= 1; i++) bossProjectile(b, 'homing', dir * .4 + i * .6, 2.4, i * 18);
  }
}

function updateBoss(b, timeScale) {
  // Khóa vị trí khi báo chiêu để đường đạn thực tế luôn theo đúng vạch cảnh báo.
  if (!b.specialShots) b.x += b.vx * timeScale;
  if (b.x < 55) { b.x = 55; b.vx = Math.abs(b.vx); }
  else if (b.x > canvas.width - 55) { b.x = canvas.width - 55; b.vx = -Math.abs(b.vx); }
  if (b.hitFlash > 0) b.hitFlash--;
  if (b.windup > 0) {
    b.windup -= timeScale;
    if (b.windup <= 0) {
      b.windup = 0;
      if (b.specialShots) {
        enemyBullets.push(...b.specialShots);
        b.specialShots = null;
        b.specialName = '';
        b.attackCount++;
        document.getElementById('boss-attack-warning').classList.add('hidden');
        b.shootCooldown = 85; // Sau chiêu riêng có nhịp nghỉ cho người chơi né.
      } else {
        fireBossAttack(b);
        b.shootCooldown = 55 + (b.variant % 3) * 10;
      }
    }
  } else {
    b.shootCooldown -= timeScale;
    if (b.shootCooldown <= 0) {
      if ((b.attackCount + 1) % 3 === 0) {
        const special = buildBossSpecial(b);
        b.specialShots = special.shots;
        b.specialName = special.name;
        b.windup = 65; // Hơn 1 giây báo trước chiêu riêng.
        const warning = document.getElementById('boss-attack-warning');
        warning.textContent = `⚠ Sắp ra chiêu: ${special.name} · né khỏi vạch vàng!`;
        warning.classList.remove('hidden');
      } else b.windup = 25; // Đòn thường: 0,4 giây cảnh báo bằng vòng sáng.
      b.windupTotal = b.windup;
    }
  }
}
