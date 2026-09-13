/* CHUYỂN ĐỘNG LÍNH & BOSS.
   Sửa biên độ/nhịp của boss trong BOSS_PATHS; sửa 10/9/7 px bên dưới để
   chỉnh mức lượn của lính, 52 px cho lính lao ra. Hitbox đi theo tọa độ thật.
   Tất cả tính theo bước mô phỏng, dừng khi pause và chậm lại dưới Bão Cloramin B.
*/

const BOSS_PATHS = {
  mech:    { width: 88, height: 32, speedX: .026, speedY: .046 },
  serpent: { width: 93, height: 36, speedX: .033, speedY: .055 },
  virus:   { width: 84, height: 35, speedX: .037, speedY: .047 },
  beast:   { width: 92, height: 37, speedX: .044, speedY: .060 },
  queen:   { width: 80, height: 34, speedX: .025, speedY: .043 }
};

function updateBossPath(b, timeScale) {
  const path = BOSS_PATHS[b.family] || BOSS_PATHS.virus;
  const variation = 1 + (b.variant % 3 - 1) * .08;
  b.pathTicks += timeScale * (b.phase === 2 ? 1.2 : 1);
  // Hai tần số khác nhau tạo quỹ đạo cong, có đoạn tiến chéo rồi quay lên.
  // Công thức bắt đầu đúng x=giữa sân, y=67: boss không giật khi vừa vào trận.
  const maxWidth = Math.max(0, canvas.width / 2 - 55);
  b.x = canvas.width / 2 + Math.min(path.width, maxWidth) *
    Math.sin(b.pathTicks * path.speedX * variation);
  b.y = 67 + path.height *
    (1 - Math.cos(b.pathTicks * path.speedY / variation));
}

function updateEnemyFormation(timeScale) {
  if (!enemies.length) return false;
  formationTick += timeScale;
  formationShiftX += enemyDir * enemySpeedX * timeScale;

  // Chừa 10px mỗi mép cho lính lượn ngang, tránh chạm/lọt khỏi Canvas.
  // Tính theo lính còn sống: đội hình được phép đi xa hơn khi một cột mất hết.
  let leftEdge = Infinity, rightEdge = -Infinity;
  for (const e of enemies) {
    leftEdge = Math.min(leftEdge, e.baseX - e.radius);
    rightEdge = Math.max(rightEdge, e.baseX + e.radius);
  }
  const minShift = 12 - leftEdge;
  const maxShift = canvas.width - 12 - rightEdge;
  let bounced = false;
  if (formationShiftX < minShift) {
    formationShiftX = minShift;
    enemyDir = 1;
    bounced = true;
  } else if (formationShiftX > maxShift) {
    formationShiftX = maxShift;
    enemyDir = -1;
    bounced = true;
  }
  // Đoạn đường ngang ngắn hơn do lượn rộng: xuống 8px mỗi lần để tốc độ
  // tiến về nhân vật gần tương đương v1.11 (12px với đoạn đường ngang dài).
  if (bounced) formationDropY += 8;

  // Tăng biên độ dần trong 40 tick đầu wave để lính không nhảy vị trí lúc xuất hiện.
  const ease = Math.min(1, formationTick / 40);
  let bottomRow = -1;
  let bottomCount = 0;
  for (const e of enemies) {
    if (e.row > bottomRow) { bottomRow = e.row; bottomCount = 1; }
    else if (e.row === bottomRow) bottomCount++;
  }
  // Mỗi ~3,7 giây, một lính hàng dưới tách đội hình, lao xuống rồi quay về.
  // Luân phiên qua các lính còn sống, không sinh thêm quái hay đạn.
  const divePeriod = 220, diveStart = 45, diveDuration = 115;
  const cycle = Math.floor(formationTick / divePeriod);
  const diveTime = formationTick % divePeriod;
  const divePhase = Math.max(0, Math.min(1, (diveTime - diveStart) / diveDuration));
  const diveStrength = diveTime >= diveStart && diveTime <= diveStart + diveDuration
    ? Math.sin(divePhase * Math.PI) ** 2 : 0;
  const diverIndex = cycle % bottomCount;
  let bottomIndex = 0;
  for (const e of enemies) {
    e.animTimer += .045 * timeScale;
    e.x = e.baseX + formationShiftX +
      Math.sin(formationTick * .072 + e.motionPhase) * 10 * ease;
    e.y = e.baseY + formationDropY +
      Math.sin(formationTick * .082 + e.motionPhase) * 9 * ease +
      Math.sin(formationTick * .029 + e.row * .85) * 7 * ease;
    e.diving = false;
    if (e.row === bottomRow) {
      if (bottomIndex === diverIndex && diveTime >= 10 && diveTime <= diveStart + diveDuration) {
        e.diving = true; // Vòng cảnh báo nổi bật trước khi lính lao xuống.
        if (diveStrength > 0) {
          // Không để cú lao bất ngờ đè lên vùng nhân vật khi người chơi né lên cao.
          const safeDive = Math.max(0, Math.min(52, player.y - e.radius - 22 - e.y));
          e.y += safeDive * diveStrength;
        }
      }
      bottomIndex++;
    }
    if (bounced && e.y >= player.y - 12) {
      takeHit();
      enemyBullets = [];
      if (!isGameOver) spawnWave(); // Giữ nguyên wave khi lính vượt tuyến.
      return true;
    }
  }
  return false;
}
