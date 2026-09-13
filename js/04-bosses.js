/* BOSS CANVAS – VẼ & HÀNH ĐỘNG.
   BOSS_TYPES (tên, họ, màu, kiểu đạn) ở 02-state.js.
   Mỗi họ hình có chuyển động riêng. Không dùng ảnh atlas nên giữ nét vẽ giống nhân vật.
   Tốc độ, thời gian báo trước và số đạn chỉnh trong updateBoss()/fireBossAttack(). */

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
  if (b.variant === 10) { // Pháo đài: thêm hai tấm giáp bên và nòng pháo.
    for (const side of [-1, 1]) {
      ctx.fillStyle = '#475569'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
      ctx.fillRect(side < 0 ? -42 : 27, -18, 15, 35);
      ctx.strokeRect(side < 0 ? -42 : 27, -18, 15, 35);
    }
  }
  if (b.variant === 11) { // Lõi Retro: sáu tia năng lượng quay.
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
  if (b.variant === 9) { // Thiết giáp: vảy trên lưng.
    for (let i = -2; i <= 2; i++) bossOval(i * 11, -21, 7, 5, '#475569', '#fef08a');
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
  b.x += b.vx * timeScale;
  if (b.x < 55) { b.x = 55; b.vx = Math.abs(b.vx); }
  else if (b.x > canvas.width - 55) { b.x = canvas.width - 55; b.vx = -Math.abs(b.vx); }
  if (b.hitFlash > 0) b.hitFlash--;
  if (b.windup > 0) {
    b.windup -= timeScale;
    if (b.windup <= 0) {
      b.windup = 0;
      fireBossAttack(b);
      b.shootCooldown = 48 + (b.variant % 3) * 10;
    }
  } else {
    b.shootCooldown -= timeScale;
    if (b.shootCooldown <= 0) b.windup = 25; // báo trước 25 tick (~0,4 giây).
  }
}
