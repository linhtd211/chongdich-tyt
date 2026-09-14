/* TRẬN CUỐI: hộ vệ là vật thể riêng, chắn đạn khi thật sự chạm vào chúng.
   Không dùng lính thường hoặc hình tải ngoài. Tối đa ba hộ vệ mỗi lần gọi;
   tuyệt kỹ Điều dưỡng quét qua được cả hộ vệ và trùm. */
const FINAL_WAVE = 39;
const FINAL_GUARD_HP = 4;

function finalGuardPosition(b, guard) {
  const t = b.pathTicks * .035;
  return {
    x: b.x + [-39, 0, 39][guard.slot] + Math.sin(t * 1.5 + guard.slot * 2) * 5,
    y: b.y + [35, 49, 35][guard.slot] + Math.sin(t * 2 + guard.slot) * 5
  };
}

function summonFinalGuards(b) {
  if (b.phase !== 2) return;
  // Chỉ bổ sung vị trí trống; không hồi máu hộ vệ còn sống giữa đợt.
  for (let slot = 0; slot < 3; slot++) {
    if (b.guards.some(g => g.slot === slot)) continue;
    b.guards.push({ slot, art: (b.summonCount * 2 + slot) % 4,
      hp: FINAL_GUARD_HP, radius: 14 });
  }
  b.summonCount++;
  createImmunityShockwave(b.x, b.y + 40);
}

// Pha 2: hộ vệ báo sáng trước 0,45 giây rồi cùng bắn nhắm nơi nhân vật đang đứng.
// Tối đa ba viên mỗi đợt, dùng nhịp mô phỏng để Bão Cloramin B vẫn làm chậm chúng.
function updateFinalGuardianAttacks(b, timeScale) {
  if (b.phase !== 2 || !b.guards.length || b.phaseTransition > 0) return;
  b.guardVolleyTimer -= timeScale;
  if (b.guardVolleyTimer > 0) return;
  const aimX = player.x + player.w / 2;
  for (const guard of b.guards) {
    const { x, y } = finalGuardPosition(b, guard);
    const vx = Math.max(-1.3, Math.min(1.3, (aimX - x) * 2.6 / Math.max(130, player.y - y)));
    enemyBullets.push({ type: guard.slot === 1 ? 'homing' : 'needle', x, y: y + 15, vx, vy: 2.7 });
  }
  b.guardVolleyTimer = 115;
}

// Ba dạng đạn thường luân phiên ở pha 1; pha 3 bắn thành đợt dày hơn.
function fireFinalRegular(b) {
  const cycle = b.attackCount % 3;
  if (b.phase === 3) {
    if (cycle === 0) {
      for (const o of [-34, 0, 34]) bossProjectile(b, 'split', o / 47, 2.8, o);
    } else if (cycle === 1) {
      for (let i = -3; i <= 3; i++) bossProjectile(b, 'needle', i * .57, 3.35, i * 7);
    } else {
      for (const o of [-26, 0, 26]) bossProjectile(b, 'homing', o / 75, 2.8, o);
    }
  } else if (cycle === 0) {
    for (const o of [-25, 25]) bossProjectile(b, 'split', o / 36, 2.3, o);
  } else if (cycle === 1) {
    for (const o of [-28, 0, 28]) bossProjectile(b, 'homing', o / 80, 2.3, o);
  } else {
    for (const vx of [-1.4, -.7, 0, .7, 1.4]) bossProjectile(b, 'needle', vx, 3.0);
  }
}

function strikeFinalGuard(b, guard, damage, x, y) {
  if (!b.guards.includes(guard)) return;
  guard.hp -= damage;
  createExplosion(x, y, '#a8e8d0', guard.hp <= 0 ? 9 : 3);
  if (guard.hp <= 0) {
    b.guards.splice(b.guards.indexOf(guard), 1);
    score += 30;
    document.getElementById('score-text').innerText = score;
    AudioEngine.explode();
  } else AudioEngine.hit();
}

function renderFinalGuards(b) {
  for (const guard of b.guards) {
    const pos = finalGuardPosition(b, guard);
    if (b.phase === 2 && b.guardVolleyTimer <= 27) {
      ctx.strokeStyle = '#ffd48d';ctx.lineWidth = 2.5;
      ctx.beginPath();ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);ctx.stroke();
    }
    // Ánh viền và thanh máu đủ rõ ở cỡ 30–40 px trên điện thoại.
    ctx.strokeStyle = '#a2f3df';ctx.lineWidth = 1.5;
    ctx.beginPath();ctx.arc(pos.x, pos.y, 17, 0, Math.PI * 2);ctx.stroke();
    drawGuardian(ctx, guard.art, b.animTimer, pos.x, pos.y, .32);
    ctx.fillStyle = '#132831';ctx.fillRect(pos.x - 15, pos.y - 24, 30, 4);
    ctx.fillStyle = '#72e7c4';ctx.fillRect(pos.x - 15, pos.y - 24, 30 * guard.hp / FINAL_GUARD_HP, 4);
  }
}

function buildFinalSpecial(b) {
  const target = player.x + player.w / 2;
  const y = b.y + 32;
  const shot = (x, vx, vy, type = 'needle') => ({ x, y, vx, vy, type,
    ...(type === 'split' ? { splitTimer: 45 } : {}) });
  // Pha 1/3 tập trung vào làn đạn; chỉ pha 2 mới có quyền gọi hộ vệ.
  const cycle = Math.floor(b.attackCount / 2) % 4;
  if (b.phase === 2 && (b.guards.length === 0 || cycle === 0 && b.guards.length < 2)) {
    return { name: 'Triệu hồi Khiên Khuẩn', shots: [], kind: 'summon' };
  }
  if (cycle === 1) {
    const lane = Math.max(28, Math.min(canvas.width - 28, target));
    return { name: 'Cột dịch khóa đường', kind: 'shots',
      shots: [lane - 35, lane, lane + 35].map(x => shot(x, 0, b.phase === 3 ? 3.9 : 3.1)) };
  }
  if (cycle === 2) {
    return { name: 'Mưa bào tử phân nhánh', kind: 'shots',
      shots: [-32, 0, 32].map(o => shot(b.x + o, o / 55, b.phase === 3 ? 2.9 : 2.35, 'split')) };
  }
  return { name: 'Vòng nanh hội tụ', kind: 'shots',
    shots: [-3, -2, -1, 0, 1, 2, 3].map(i => shot(b.x + i * 13, (target - b.x) / 145 + i * .38, b.phase === 3 ? 3.65 : 3.05)) };
}

function finishFinalBoss(b) {
  AudioEngine.explode();
  score += 2000;
  document.getElementById('score-text').innerText = score;
  createExplosion(b.x, b.y, '#fbbf87', 55);
  isGameOver = true;
  if (animationId !== null) { cancelAnimationFrame(animationId); animationId = null; }
  bullets = []; enemyBullets = []; powerUps = []; enemies = [];
  b.guards = []; boss = null;
  isTouching = false; movementPointerId = null; heldKeys.clear();
  document.getElementById('boss-hud').classList.add('hidden');
  document.getElementById('boss-attack-warning').classList.add('hidden');
  finishGame(true);
}
