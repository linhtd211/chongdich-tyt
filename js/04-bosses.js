/* BOSS CANVAS – VẼ & HÀNH ĐỘNG.
   BOSS_TYPES (tên, họ, màu, kiểu đạn) ở 02-state.js.
   Mỗi boss có nét vẽ riêng ở 04-boss-art.js. Không dùng ảnh atlas nên giữ nét vẽ giống nhân vật.
   Đường đi của boss ở 04-movement.js; chiêu riêng tại buildBossSpecial(),
   thời gian báo trước trong updateBoss().
   Tất cả đạn đều theo cơ chế va chạm cũ, không tạo hiệu ứng mới mỗi frame. */

function bossOval(x, y, rx, ry, fill, stroke = '#172033') {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
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
    ctx.beginPath(); ctx.arc(0, 0, 62 + Math.sin(t * 18) * 3, 0, Math.PI * 2); ctx.stroke();
  }
  drawDistinctBossArt(b, t, blink); // 12 nét vẽ riêng tại 04-boss-art.js.
  if (b.phase === 2) {
    // Pha hai chỉ vẽ một vòng hào quang, tránh tạo particle mới mỗi frame.
    ctx.strokeStyle = `rgba(251, 113, 133, ${.45 + .2 * Math.sin(t * 7)})`;
    ctx.lineWidth = b.phaseTransition > 0 ? 5 : 2.5;
    ctx.beginPath(); ctx.arc(0, 0, 68 + Math.sin(t * 5) * 2, 0, Math.PI * 2); ctx.stroke();
    if (b.phaseTransition > 0) {
      ctx.fillStyle = '#fff7ed'; ctx.textAlign = 'center';
      ctx.font = 'bold 13px sans-serif'; ctx.fillText('PHA 2!', 0, -73);
    }
  }
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

// Chuyển pha đúng một lần ở 50% máu: dọn đạn cũ để người chơi có khoảng né,
// hủy chiêu đang nạp và dành 75 tick cho cảnh báo trước khi boss đánh tiếp.
function beginBossPhaseTwo(b) {
  b.phase = 2;
  b.phaseTransition = 75;
  b.windup = 0;
  b.specialShots = null;
  b.specialName = '';
  enemyBullets = [];
  const warning = document.getElementById('boss-attack-warning');
  warning.textContent = '⚠ PHA 2 · Boss tăng tốc, dùng chiêu riêng thường xuyên hơn!';
  warning.classList.remove('hidden');
}

function updateBoss(b, timeScale) {
  if (b.phase === 1 && b.hp <= b.maxHp / 2) beginBossPhaseTwo(b);
  if (b.phaseTransition > 0) {
    b.phaseTransition = Math.max(0, b.phaseTransition - timeScale);
    if (b.phaseTransition === 0) {
      document.getElementById('boss-attack-warning').classList.add('hidden');
      b.shootCooldown = 45;
    }
    return;
  }
  // Khi báo chiêu riêng, khóa cả hai trục để vạch vàng khớp đường đạn thật.
  if (!b.specialShots) updateBossPath(b, timeScale);
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
        b.shootCooldown = b.phase === 2 ? 70 : 85; // Vẫn có nhịp nghỉ sau chiêu.
      } else {
        fireBossAttack(b);
        b.shootCooldown = (55 + (b.variant % 3) * 10) * (b.phase === 2 ? .85 : 1);
      }
    }
  } else {
    b.shootCooldown -= timeScale;
    if (b.shootCooldown <= 0) {
      if ((b.attackCount + 1) % (b.phase === 2 ? 2 : 3) === 0) {
        const special = buildBossSpecial(b);
        b.specialShots = special.shots;
        b.specialName = special.name;
        b.windup = b.phase === 2 ? 60 : 65; // Pha hai vẫn báo trước đủ 1 giây.
        const warning = document.getElementById('boss-attack-warning');
        warning.textContent = `⚠ Sắp ra chiêu: ${special.name} · né khỏi vạch vàng!`;
        warning.classList.remove('hidden');
      } else b.windup = 25; // Đòn thường: 0,4 giây cảnh báo bằng vòng sáng.
      b.windupTotal = b.windup;
    }
  }
}
