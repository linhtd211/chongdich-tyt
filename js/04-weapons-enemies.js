/* VŨ KHÍ & HÌNH QUÁI: shootBullet quyết định số đạn, độ lan và thời gian bắn; các hàm draw... vẽ vi khuẩn, boss, vật phẩm và hiệu ứng.
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 4. HỆ THỐNG ĐẠN ---
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
            vy: -10,
            w: 3.5,
            h: 18,
            pierce: player.gunLevel >= 3 ? 2 : 1,
            color: '#14b8a6'
          });
        }
        player.shootCooldown = 9;
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
            vx: Math.cos(ang) * 8,
            vy: Math.sin(ang) * 8,
            w: 6,
            h: 6,
            color: '#f43f5e'
          });
        }
        player.shootCooldown = 11;
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
            vx: Math.sin(spreadAngle) * 7.5,
            vy: -Math.cos(spreadAngle) * 7.5,
            radius: 8 + (k % 2 === 0 ? 1 : 0),
            color: 'rgba(56, 189, 248, 0.65)'
          });
        }
        player.shootCooldown = 9; // Bong bóng đi chậm hơn nhưng có vùng va chạm rộng.
      }
    }

    // --- 5. VI KHUẨN & BOSS ---
    function drawBeanYellow(e) {
      e.animTimer += 0.05;
      ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(Math.sin(e.animTimer) * 0.15);
      ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, -12); ctx.bezierCurveTo(8, -14, 14, -2, 10, 10);
      ctx.bezierCurveTo(6, 16, -6, 14, -10, 4); ctx.bezierCurveTo(-14, -2, -14, -8, -10, -12);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#1e3a8a';
      [[-12, -4], [-8, 12], [8, -12], [11, 4]].forEach(s => {
        ctx.beginPath(); ctx.arc(s[0], s[1], 1.8, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(2, -4, 2.5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(-2, 6, 1.5, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }

    function drawRodRed(e) {
      e.animTimer += 0.05;
      ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(-0.25 + Math.sin(e.animTimer) * 0.1);
      ctx.fillStyle = '#ef4444'; ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.rect(-14, -6, 28, 12);
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    function drawWormPink(e) {
      e.animTimer += 0.08;
      const t = e.animTimer;
      ctx.save(); ctx.translate(e.x, e.y);
      ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-6, -12);
      ctx.bezierCurveTo(4, -6 + Math.sin(t) * 3, -8, 4 + Math.sin(t) * 3, 4, 12); ctx.stroke();
      ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.moveTo(-6, -12);
      ctx.bezierCurveTo(4, -6 + Math.sin(t) * 3, -8, 4 + Math.sin(t) * 3, 4, 12); ctx.stroke();
      ctx.restore();
    }

    function drawPinkTentacle(e) {
      e.animTimer += 0.05;
      const t = e.animTimer;
      ctx.save(); ctx.translate(e.x, e.y);
      ctx.strokeStyle = '#a21caf'; ctx.lineWidth = 2.5;
      [-2.6, -1.8, -0.9, 0, 0.9, 1.8, 2.6].forEach((ang, i) => {
        const len = e.radius + 7 + Math.sin(t * 3 + i) * 2.5;
        const tx = Math.cos(ang) * len, ty = Math.sin(ang) * len;
        ctx.beginPath(); ctx.moveTo(Math.cos(ang) * (e.radius - 2), Math.sin(ang) * (e.radius - 2)); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.fillStyle = '#c026d3'; ctx.beginPath(); ctx.arc(tx, ty, 3.5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#d946ef'; ctx.beginPath(); ctx.ellipse(0, 0, e.radius * 1.1, e.radius * 0.9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-4, -4, 4, 0, Math.PI * 2); ctx.arc(4, -4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.arc(-3, -4, 2, 0, Math.PI * 2); ctx.arc(3, -4, 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#000000'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-8, -9); ctx.lineTo(0, -6); ctx.lineTo(8, -9); ctx.stroke();
      ctx.fillStyle = '#701a75'; ctx.beginPath(); ctx.arc(0, 4, 6, 0.2, Math.PI - 0.2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-3, 3, 2.5, 2.5); ctx.fillRect(1, 3, 2.5, 2.5);
      ctx.restore();
    }

    function drawHairyCyan(e) {
      e.animTimer += 0.05;
      const t = e.animTimer;
      ctx.save(); ctx.translate(e.x, e.y);
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1;
      for (let i = 0; i < 28; i++) {
        const ang = (i / 28) * Math.PI * 2;
        const hLen = e.radius + 3 + (i % 2 === 0 ? 2 : 0) + Math.sin(t * 4 + i) * 1.5;
        ctx.beginPath(); ctx.moveTo(Math.cos(ang) * (e.radius - 1), Math.sin(ang) * (e.radius - 1)); ctx.lineTo(Math.cos(ang) * hLen, Math.sin(ang) * hLen); ctx.stroke();
      }
      ctx.fillStyle = '#22d3ee'; ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -e.radius * 1.1);
      ctx.bezierCurveTo(e.radius * 1.2, -e.radius * 0.4, e.radius * 1.1, e.radius * 0.9, 0, e.radius * 1.05);
      ctx.bezierCurveTo(-e.radius * 1.1, e.radius * 0.9, -e.radius * 1.2, -e.radius * 0.4, 0, -e.radius * 1.1);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-4, -3, 4.5, 0, Math.PI * 2); ctx.arc(4, -1, 3.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#065f46'; ctx.beginPath(); ctx.arc(-3.5, -3, 2.2, 0, Math.PI * 2); ctx.arc(4.5, -1, 1.9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-7, -8); ctx.lineTo(-2, -6); ctx.moveTo(2, -5); ctx.lineTo(7, -6); ctx.stroke();
      ctx.fillStyle = '#854d0e'; ctx.fillRect(-7, 4, 14, 6);
      ctx.fillStyle = '#fef08a'; ctx.fillRect(-5, 4, 2, 2.5); ctx.fillRect(0, 4, 2, 2.5); ctx.fillRect(3, 4, 2, 2.5);
      ctx.restore();
    }

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

