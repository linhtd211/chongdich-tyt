/* VŨ KHÍ & HIỆU ỨNG: shootBullet quyết định số đạn, độ lan và thời gian bắn;
   phần dưới vẽ lọ vắc xin và hiệu ứng. Lính được vẽ ở 04-enemy-sprites.js.
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 4. HỆ THỐNG ĐẠN ---
    // Cân bằng v1.16.1: giảm tốc độ và nhịp bắn của nhân vật để vi khuẩn có thêm thời gian phản công.
    const PLAYER_PROJECTILE_SPEED_SCALE = 0.72;
    function shootBullet() {
      if (player.shootCooldown > 0) return;

      const px = player.x + 16;
      const py = player.y - 4;

      if (selectedHero === 'doctor') {
        AudioEngine.shootLaser();
        const beamCount = player.gunLevel;
        const spacing = 6;
        const startX = px - ((beamCount - 1) * spacing) / 2;
        for (let k = 0; k < beamCount; k++) {
          bullets.push({
            hero: 'doctor',
            x: startX + k * spacing,
            y: py,
            vx: 0,
            vy: -10 * PLAYER_PROJECTILE_SPEED_SCALE,
            w: 3.5,
            h: 18,
            pierce: player.gunLevel >= 3 ? 2 : 1,
            color: '#14b8a6'
          });
        }
        player.shootCooldown = 12;
      }
      else if (selectedHero === 'nurse') {
        AudioEngine.shootBurst();
        const spreadCount = 1 + player.gunLevel;
        const baseAngle = -Math.PI / 2;
        const arcSpread = 0.28 + player.gunLevel * 0.05;
        for (let k = 0; k < spreadCount; k++) {
          const ang = baseAngle - arcSpread / 2 + (k / (spreadCount - 1 || 1)) * arcSpread;
          bullets.push({
            hero: 'nurse',
            x: px,
            y: py,
            vx: Math.cos(ang) * 8 * PLAYER_PROJECTILE_SPEED_SCALE,
            vy: Math.sin(ang) * 8 * PLAYER_PROJECTILE_SPEED_SCALE,
            w: 6,
            h: 6,
            color: '#f43f5e'
          });
        }
        player.shootCooldown = 14;
      }
      else {
        AudioEngine.shootBubble();
        const bubbleCount = player.gunLevel;
        const spacing = 12;
        const startX = px - ((bubbleCount - 1) * spacing) / 2;

        for (let k = 0; k < bubbleCount; k++) {
          const spreadAngle = (bubbleCount === 1) ? 0 : ((k - (bubbleCount - 1) / 2) * 0.12);
          bullets.push({
            hero: 'sanitizer',
            x: startX + k * spacing,
            y: py,
            vx: Math.sin(spreadAngle) * 7.5 * PLAYER_PROJECTILE_SPEED_SCALE,
            vy: -Math.cos(spreadAngle) * 7.5 * PLAYER_PROJECTILE_SPEED_SCALE,
            radius: 8 + (k % 2 === 0 ? 1 : 0),
            color: 'rgba(56, 189, 248, 0.65)'
          });
        }
        player.shootCooldown = 12; // Bong bóng đi chậm hơn nhưng có vùng va chạm rộng.
      }
    }

    // --- 5. SPRITE LÍNH ---
    // Nét vẽ và hoạt ảnh đã chuyển sang 04-enemy-sprites.js.
    // Đổi màu/biến thể ở ENEMY_TYPES (02-state.js), không cần sửa logic vũ khí.

    function drawPowerUp(p) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x + 2, p.y + 4, 12, 14);
      ctx.fillStyle = p.color; ctx.fillRect(p.x + 3, p.y + 5, 10, 12);
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(p.x + 4, p.y, 8, 4);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(p.x + 7, p.y + 8, 2, 6); ctx.fillRect(p.x + 5, p.y + 10, 6, 2);
    }

    function createExplosion(x, y, color, count = 10) {
      // Giữ hiệu ứng rõ nét nhưng không để hạt tích lũy vô hạn khi nhiều quái chết cùng lúc.
      const freeSlots = Math.max(0, 240 - particles.length);
      for (let i = 0; i < Math.min(count, freeSlots); i++) {
        particles.push({
          x: x, y: y,
          vx: (Math.random() - 0.5) * 5.5,
          vy: (Math.random() - 0.5) * 5.5,
          radius: 1.5 + Math.random() * 2,
          life: 20, color: color
        });
      }
    }

    function createImmunityShockwave(x, y) {
      shockwaves.push({ x: x, y: y, radius: 5, alpha: 1.0 });
    }
