/* TRẬN CUỐI: hộ vệ là vật thể riêng, chắn đạn khi thật sự chạm vào chúng.
   Không dùng lính thường hoặc hình tải ngoài. Tối đa ba hộ vệ mỗi lần gọi;
   tuyệt kỹ Điều dưỡng quét qua được cả hộ vệ và trùm. */
const FINAL_WAVE = 39;
const FINAL_GUARD_HP = 12; // Máu thật sau khi phá giáp.
const FINAL_GUARD_ARMOR = 6; // Giáp nhận sát thương trước máu.

function finalGuardBasePosition(b, guard) {
  const t = b.pathTicks * .035;
  return {
    x: b.x + [-39, 0, 39][guard.slot] + Math.sin(t * 1.5 + guard.slot * 2) * 5,
    y: b.y + [35, 49, 35][guard.slot] + Math.sin(t * 2 + guard.slot) * 5
  };
}

function finalGuardPosition(b, guard) {
  const base = finalGuardBasePosition(b, guard);
  if (!b.melee || b.melee.guard !== guard || b.melee.windup > 0) return base;
  const progress = Math.sin(Math.PI * Math.min(1, b.melee.age / 48));
  return { x: base.x + (b.melee.targetX - base.x) * progress,
    y: base.y + (b.melee.targetY - base.y) * progress };
}

function summonFinalGuards(b) {
  if (b.phase !== 2) return;
  // Đội đầu bắn tầm xa; sau khi hạ cả đội, đội được gọi lại sẽ lao cận chiến.
  const mode = b.summonCount === 0 ? 'ranged' : 'melee';
  for (let slot = 0; slot < 3; slot++) {
    if (b.guards.some(g => g.slot === slot)) continue;
    b.guards.push({ slot, art: (b.summonCount * 2 + slot) % 4,
      hp: FINAL_GUARD_HP, armor: FINAL_GUARD_ARMOR, mode, radius: 17 });
  }
  b.summonCount++;
  b.guardVolleyTimer = 65;
  b.meleeCooldown = mode === 'melee' ? 30 : 100;
  createImmunityShockwave(b.x, b.y + 40);
}

// Lượt đầu bắn theo nhịp đều, tối đa ba viên mỗi đợt.
// Lượt sau báo vạch đỏ ~0,75 giây rồi một hộ vệ lao đến điểm đã khóa;
// né khỏi vòng đích trước lúc nó đến sẽ không trúng. Mỗi cú lao gây tối đa một hit.
function updateFinalGuardianAttacks(b, timeScale) {
  if (b.phase !== 2 || !b.guards.length || b.phaseTransition > 0) return;
  if (b.guards[0].mode === 'ranged') {
    b.guardVolleyTimer -= timeScale;
    if (b.guardVolleyTimer > 0) return;
    const aimX = player.x + player.w / 2;
    for (const guard of b.guards) {
      const { x, y } = finalGuardPosition(b, guard);
      const vx = Math.max(-1.3, Math.min(1.3, (aimX - x) * 2.6 / Math.max(130, player.y - y)));
      enemyBullets.push({ type: guard.slot === 1 ? 'homing' : 'needle', x, y: y + 15, vx, vy: 2.8 });
    }
    b.guardVolleyTimer = 55;
    return;
  }
  if (!b.melee) {
    b.meleeCooldown -= timeScale;
    if (b.meleeCooldown > 0) return;
    const guard = b.guards[b.meleeAttackCount % b.guards.length];
    b.meleeAttackCount++;
    b.melee = { guard, windup: 38, age: 0,
      targetX: Math.max(20, Math.min(canvas.width - 20, player.x + player.w / 2)),
      targetY: Math.max(210, Math.min(canvas.height - 25, player.y + player.h / 2)), hit: false };
    return;
  }
  const attack = b.melee;
  if (!b.guards.includes(attack.guard)) { b.melee = null; b.meleeCooldown = 70; return; }
  if (attack.windup > 0) { attack.windup = Math.max(0, attack.windup - timeScale); return; }
  attack.age += timeScale;
  if (!attack.hit && attack.age >= 8 && attack.age <= 40) {
    const pos = finalGuardPosition(b, attack.guard);
    if (Math.hypot(pos.x - (player.x + player.w / 2), pos.y - (player.y + player.h / 2)) < attack.guard.radius + 12) {
      attack.hit = true;
      if (player.shieldTime > 0) { AudioEngine.shieldAbsorb(); createExplosion(pos.x, pos.y, '#38bdf8', 7); }
      else if (player.invincibleTime <= 0) takeHit();
    }
  }
  if (attack.age >= 48) { b.melee = null; b.meleeCooldown = 70; }
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
  const absorbed = Math.min(guard.armor, damage);
  guard.armor -= absorbed;
  guard.hp -= damage - absorbed;
  createExplosion(x, y, '#a8e8d0', guard.hp <= 0 ? 9 : 3);
  if (guard.hp <= 0) {
    if (b.melee?.guard === guard) { b.melee = null; b.meleeCooldown = 70; }
    b.guards.splice(b.guards.indexOf(guard), 1);
    score += 30;
    document.getElementById('score-text').innerText = score;
    AudioEngine.explode();
  } else AudioEngine.hit();
}

function renderFinalGuards(b) {
  if (b.melee && b.melee.windup > 0 && b.guards.includes(b.melee.guard)) {
    const origin = finalGuardBasePosition(b, b.melee.guard);
    ctx.save();ctx.strokeStyle = '#ff8c77';ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);ctx.beginPath();ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(b.melee.targetX, b.melee.targetY);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.arc(b.melee.targetX, b.melee.targetY, 19, 0, Math.PI * 2);ctx.stroke();
    ctx.fillStyle = '#ffd7a8';ctx.font = 'bold 11px sans-serif';ctx.textAlign = 'center';
    ctx.fillText('⚠ HỘ VỆ LAO TỚI', canvas.width / 2, Math.min(250, b.melee.targetY - 38));
    ctx.restore();
  }
  for (const guard of b.guards) {
    const pos = finalGuardPosition(b, guard);
    if (guard.mode === 'ranged' && b.guardVolleyTimer <= 18) {
      ctx.strokeStyle = '#ffd48d';ctx.lineWidth = 2.5;
      ctx.beginPath();ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);ctx.stroke();
    }
    // Ánh viền và thanh máu đủ rõ ở cỡ 30–40 px trên điện thoại.
    ctx.strokeStyle = guard.armor > 0 ? '#a2f3df' : '#fba887';ctx.lineWidth = guard.armor > 0 ? 2.5 : 1.5;
    ctx.beginPath();ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);ctx.stroke();
    drawGuardian(ctx, guard.art, b.animTimer, pos.x, pos.y, .32);
    ctx.fillStyle = '#132831';ctx.fillRect(pos.x - 15, pos.y - 29, 30, 4);
    ctx.fillStyle = '#89e8e2';ctx.fillRect(pos.x - 15, pos.y - 29, 30 * guard.armor / FINAL_GUARD_ARMOR, 4);
    ctx.fillStyle = '#132831';ctx.fillRect(pos.x - 15, pos.y - 24, 30, 4);
    ctx.fillStyle = '#fb928f';ctx.fillRect(pos.x - 15, pos.y - 24, 30 * guard.hp / FINAL_GUARD_HP, 4);
    ctx.fillStyle = guard.mode === 'ranged' ? '#adf8ec' : '#ffb6a6';
    ctx.font = 'bold 9px sans-serif';ctx.textAlign = 'center';
    ctx.fillText(guard.mode === 'ranged' ? 'BẮN' : 'LAO', pos.x, pos.y + 28);
  }
}

function buildFinalSpecial(b) {
  const target = player.x + player.w / 2;
  const y = b.y + 32;
  const shot = (x, vx, vy, type = 'needle') => ({ x, y, vx, vy, type,
    ...(type === 'split' ? { splitTimer: 45 } : {}) });
  // Pha 1/3 tập trung vào làn đạn; chỉ pha 2 mới có quyền gọi hộ vệ.
  const cycle = Math.floor(b.attackCount / 2) % 4;
  if (b.phase === 2 && b.guards.length === 0) {
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
