/* PHẦN THƯỞNG SAU BOSS – tạm dừng trận và cho chọn đúng một lần.
   Chỉnh quyền lợi hai nhánh tại chooseBossReward(); chỉnh lời hiển thị tại showBossReward().
   Nhịp chơi tiếp theo phải qua spawnWave() để xóa mọi đạn từ trận trước. */
function showBossReward(downed) {
  bossRewardActive = true;
  isTouching = false;
  movementPointerId = null;
  heldKeys.clear();
  bullets = [];
  enemyBullets = [];
  document.getElementById('boss-hud').classList.add('hidden');
  document.getElementById('reward-boss-name').textContent = downed.name;
  document.getElementById('reward-attack-detail').textContent = player.gunLevel < 5
    ? `Đạn cấp ${player.gunLevel} → ${player.gunLevel + 1} (tối đa cấp 5)`
    : 'Đạn đã tối đa: nạp đầy tuyệt kỹ và thêm 200 điểm';
  document.getElementById('reward-defense-detail').textContent = hp < 3
    ? `Hồi 1 máu (${hp} → ${hp + 1}) và lá chắn 5 giây`
    : 'Đã đầy máu: nhận lá chắn 5 giây';
  document.getElementById('boss-reward-screen').classList.remove('hidden');
  updateUltimateHud();
}

function chooseBossReward(kind) {
  if (!bossRewardActive || (kind !== 'attack' && kind !== 'defense')) return false;
  if (kind === 'attack') {
    if (player.gunLevel < 5) {
      player.gunLevel++;
      const labels = ['CẤP 1', 'CẤP 2', 'CẤP 3', 'CẤP 4', 'MAX POWER'];
      document.getElementById('gun-text').innerText = labels[player.gunLevel - 1];
    } else {
      ultimateCharge = 100;
      score += 200;
      document.getElementById('score-text').innerText = score;
    }
  } else {
    hp = Math.min(3, hp + 1);
    document.getElementById('hp-text').innerText = '❤️'.repeat(hp);
    player.shieldTime = Math.max(player.shieldTime, 300);
  }
  bossRewardActive = false;
  document.getElementById('boss-reward-screen').classList.add('hidden');
  // Wave mới bắt đầu sau khi chọn; không có đạn cũ hay vật phẩm boss tự rơi.
  wave++;
  enemySpeedX = Math.min(2.4, 0.7 + wave * .15);
  document.getElementById('wave-text').innerText = wave;
  spawnWave();
  lastFrameTime = 0;
  accumulatedTime = 0;
  updateUltimateHud();
  if (animationId === null && !isPaused && !isGameOver && !bossIntroActive) {
    animationId = requestAnimationFrame(gameLoop);
  }
  return true;
}

// Nhận pointerdown ngay cả khi người chơi vẫn giữ ngón kia trên màn hình;
// click detail=0 cho bàn phím/trợ năng, tránh nhận hai lần từ cùng cú chạm.
for (const [id, kind] of [['reward-attack', 'attack'], ['reward-defense', 'defense']]) {
  const button = document.getElementById(id);
  button.addEventListener('pointerdown', e => {
    e.stopPropagation();
    if (e.button !== 0) return;
    e.preventDefault();
    chooseBossReward(kind);
  });
  button.addEventListener('click', e => {
    e.stopPropagation();
    if (e.detail === 0) chooseBossReward(kind);
  });
}
