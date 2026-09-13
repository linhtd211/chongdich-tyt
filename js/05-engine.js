/* VÒNG CHƠI: update xử lý di chuyển, đạn, va chạm, điểm, qua màn và vẽ canvas; takeHit trừ máu và kết thúc. Đổi tốc độ quái tại enemySpeedX; đổi tỉ lệ vật phẩm tại Math.random() < 0.05.
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 6. VÒNG LẶP ENGINE ĐÃ BỌC AN TOÀN TRÁNH TYPEERROR ---
    // Hạ quái một lần duy nhất; dùng chung cho đạn trực tiếp và sát thương lan.
    function defeatEnemy(e) {
      const index = enemies.indexOf(e);
      if (index < 0 || e.hp > 0) return;
      AudioEngine.explode();
      createExplosion(e.x, e.y, e.color, 14);
      score += e.score;
      document.getElementById('score-text').innerText = score;
      if (Math.random() < 0.05 && (e.type === 'pink_tentacle' || e.type === 'hairy_cyan')) {
        powerUps.push({ x: e.x - 8, y: e.y, w: 16, h: 18, vy: 1.4, color: '#38bdf8' });
        createImmunityShockwave(e.x, e.y);
      }
      enemies.splice(index, 1);
    }

    // Boss có thể bị hạ bởi đạn thường hoặc tuyệt kỹ. Chỉ ghi điểm/rơi vật phẩm một lần.
    function defeatBoss() {
      if (!boss || boss.hp > 0) return;
      const downed = boss;
      AudioEngine.explode();
      createExplosion(downed.x, downed.y, '#84cc16', 45);
      score += 400;
      document.getElementById('score-text').innerText = score;
      powerUps.push({ x: downed.x - 8, y: downed.y, w: 16, h: 18, vy: 1.4, color: '#facc15' });
      createImmunityShockwave(downed.x, downed.y);
      boss = null;
    }

    // Điều Dưỡng: khi đạn trúng, các quái trong phạm vi 30px nhận 1 sát thương.
    function applyNurseSplash(x, y, directTarget) {
      const nearby = enemies.filter(e => e !== directTarget && Math.hypot(e.x - x, e.y - y) <= 30);
      for (const e of nearby) {
        e.hp--;
        createExplosion(e.x, e.y, '#fb7185', 3);
        defeatEnemy(e);
      }
      shockwaves.push({ x, y, radius: 4, alpha: 0.85 });
    }

    function update() {
      if (isGameOver || isPaused) return;

      player.x += (player.targetX - player.x) * 0.35;
      player.y += (player.targetY - player.y) * 0.35;

      player.x = Math.max(5, Math.min(canvas.width - player.w - 5, player.x));
      player.y = Math.max(200, Math.min(canvas.height - player.h - 10, player.y));

      if (updateKeyboard() || isTouching) shootBullet();
      if (player.shootCooldown > 0) player.shootCooldown--;
      if (player.invincibleTime > 0) player.invincibleTime--;
      if (player.shieldTime > 0) player.shieldTime--;
      tickUltimate();
      const enemyTimeScale = stormTicks > 0 ? 0.35 : 1;
      if (noticeTicks > 0 && --noticeTicks === 0) document.getElementById('wave-notice').classList.add('hidden');
      const shieldHud = document.getElementById('shield-hud');
      shieldHud.classList.toggle('hidden', player.shieldTime <= 0);
      if (player.shieldTime > 0) document.getElementById('shield-seconds').textContent = (player.shieldTime / 60).toFixed(1);

      for (let cell of bloodCells) {
        cell.y += cell.speed;
        if (cell.y > canvas.height + cell.radius) {
          cell.y = -cell.radius;
          cell.x = Math.random() * canvas.width;
        }
      }

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 2.2;
        sw.alpha -= 0.035;
        if (sw.alpha <= 0) shockwaves.splice(i, 1);
      }

      // Xử lý đạn người chơi và va chạm
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (!b) continue;

        b.x += b.vx;
        b.y += b.vy;

        if (b.y < -25 || b.x < -10 || b.x > canvas.width + 10) {
          bullets.splice(i, 1);
          continue;
        }

        // Bắn trúng Boss
        if (boss && Math.hypot(b.x - boss.x, b.y - boss.y) < boss.w / 2 + 4 && !(b.hitTargets && b.hitTargets.has(boss))) {
          if (b.hero === 'doctor') {
            if (!b.hitTargets) b.hitTargets = new WeakSet();
            b.hitTargets.add(boss);
          }
          boss.hp--;
          gainUltimateCharge(); // Chỉ đạn thường bắn trúng mới nạp, tuyệt kỹ không tự nạp lại.
          AudioEngine.hit();
          createExplosion(b.x, b.y, '#84cc16', 2);

          if (b.hero !== 'doctor' || !b.pierce || --b.pierce <= 0) {
            bullets.splice(i, 1);
          }

          defeatBoss();
          continue;
        }

        // Bắn trúng vi khuẩn thường
        let bulletRemoved = false;
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (!e || !enemies.includes(e)) continue;

          const hitDist = (b.hero === 'sanitizer') ? (e.radius + b.radius) : (e.radius + 5);

          if (Math.hypot(b.x - e.x, b.y - e.y) < hitDist && !(b.hitTargets && b.hitTargets.has(e))) {
            if (b.hero === 'doctor') {
              if (!b.hitTargets) b.hitTargets = new WeakSet();
              b.hitTargets.add(e);
            }
            e.hp--;
            gainUltimateCharge();
            AudioEngine.hit();

            if (b.hero === 'nurse') {
              createExplosion(b.x, b.y, '#f43f5e', 6);
              applyNurseSplash(b.x, b.y, e);
            } else if (b.hero === 'sanitizer') {
              createExplosion(b.x, b.y, '#38bdf8', 4);
            }

            if (b.hero !== 'doctor' || !b.pierce || --b.pierce <= 0) {
              bullets.splice(i, 1);
              bulletRemoved = true;
            }

            defeatEnemy(e);
            if (bulletRemoved) break;
          }
        }
      }

      // Hiển thị lượng máu boss và báo hiệu trước khi vào màn boss.
      const bossHud = document.getElementById('boss-hud');
      bossHud.classList.toggle('hidden', !boss);
      if (boss) {
        document.getElementById('boss-name').textContent = boss.name;
        document.getElementById('boss-hp').textContent = `${boss.hp}/${boss.maxHp}`;
        document.getElementById('boss-bar').style.width = `${Math.max(0, boss.hp / boss.maxHp * 100)}%`;
      }
      // Boss ra đòn
      if (boss) {
        boss.x += boss.vx * enemyTimeScale;
        if (boss.x < 55 || boss.x > canvas.width - 55) boss.vx *= -1;

        boss.shootCooldown -= enemyTimeScale;
        if (boss.shootCooldown <= 0) {
          boss.shootCooldown = 42;
          enemyBullets.push({ type: 'needle', x: boss.x - 14, y: boss.y + 20, vx: -1.0, vy: 3.2 });
          enemyBullets.push({ type: 'split',  x: boss.x,      y: boss.y + 20, vx: 0,    vy: 2.5, splitTimer: 40 });
          enemyBullets.push({ type: 'needle', x: boss.x + 14, y: boss.y + 20, vx: 1.0,  vy: 3.2 });
        }
      }

      // Vi khuẩn thường xả đạn
      if (!boss && Math.random() < 0.035 * enemyTimeScale && enemies.length > 0) {
        const shooters = enemies.filter(en => en && en.shootType);
        if (shooters.length > 0) {
          const s = shooters[Math.floor(Math.random() * shooters.length)];
          if (s) {
            if (s.shootType === 'needle') {
              enemyBullets.push({ type: 'needle', x: s.x, y: s.y + s.radius, vx: 0, vy: 3.6 });
            } else if (s.shootType === 'homing') {
              enemyBullets.push({ type: 'homing', x: s.x, y: s.y + s.radius, vx: 0, vy: 2.0 });
            } else if (s.shootType === 'split') {
              enemyBullets.push({ type: 'split', x: s.x, y: s.y + s.radius, vx: 0, vy: 2.2, splitTimer: 40 });
            } else {
              enemyBullets.push({ type: 'drip', x: s.x, y: s.y + s.radius, vx: 0, vy: 2.7 });
            }
          }
        }
      }

      // Cập nhật đạn độc
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i];
        if (!eb) continue;

        if (eb.type === 'homing') {
          const targetCenter = player.x + 16;
          if (eb.x < targetCenter - 4) eb.vx = Math.min(1.6, (eb.vx || 0) + 0.08);
          else if (eb.x > targetCenter + 4) eb.vx = Math.max(-1.6, (eb.vx || 0) - 0.08);
          eb.x += eb.vx * enemyTimeScale;
          eb.y += eb.vy * enemyTimeScale;
        } else if (eb.type === 'split') {
          eb.x += (eb.vx || 0) * enemyTimeScale;
          eb.y += eb.vy * enemyTimeScale;
          eb.splitTimer -= enemyTimeScale;
          if (eb.splitTimer <= 0) {
            enemyBullets.splice(i, 1);
            enemyBullets.push({ type: 'drip', x: eb.x, y: eb.y, vx: -1.2, vy: 2.8 });
            enemyBullets.push({ type: 'drip', x: eb.x, y: eb.y, vx: 0, vy: 2.8 });
            enemyBullets.push({ type: 'drip', x: eb.x, y: eb.y, vx: 1.2, vy: 2.8 });
            createExplosion(eb.x, eb.y, '#c084fc', 6);
            continue;
          }
        } else {
          eb.x += (eb.vx || 0) * enemyTimeScale;
          eb.y += eb.vy * enemyTimeScale;
        }

        if (player.shieldTime > 0 && Math.hypot(eb.x - (player.x + 16), eb.y - (player.y + 18)) < 34) {
          AudioEngine.shieldAbsorb();
          createExplosion(eb.x, eb.y, '#38bdf8', 4);
          enemyBullets.splice(i, 1);
          continue;
        }

        if (player.invincibleTime <= 0 &&
            eb.x > player.x && eb.x < player.x + player.w &&
            eb.y > player.y && eb.y < player.y + player.h) {
          enemyBullets.splice(i, 1);
          takeHit();
          continue;
        }

        if (eb.y > canvas.height + 15) enemyBullets.splice(i, 1);
      }

      // Lấy vắc xin
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i];
        if (!pu) continue;

        pu.y += pu.vy;

        if (pu.x < player.x + player.w && pu.x + pu.w > player.x &&
            pu.y < player.y + player.h && pu.y + pu.h > player.y) {
          AudioEngine.powerUp();
          powerUps.splice(i, 1);

          player.shieldTime = 300;

          if (player.gunLevel < 5) {
            player.gunLevel++;
            const labels = ["CẤP 1", "CẤP 2", "CẤP 3", "CẤP 4", "MAX POWER"];
            document.getElementById('gun-text').innerText = labels[player.gunLevel - 1];
          } else {
            if (hp < 3) {
              hp++;
              document.getElementById('hp-text').innerText = '❤️'.repeat(hp);
            }
          }
          continue;
        }

        if (pu.y > canvas.height + 20) powerUps.splice(i, 1);
      }

      // Đàn quái chạm biên
      if (!boss) {
        let hitWall = false;
        for (let e of enemies) {
          if (!e) continue;
          e.x += enemyDir * enemySpeedX * enemyTimeScale;
          if (e.x < e.radius + 2 || e.x > canvas.width - e.radius - 2) hitWall = true;
        }

        if (hitWall) {
          enemyDir *= -1;
          for (let e of enemies) {
            if (!e) continue;
            e.y += 12;
            if (e.y >= player.y - 12) {
              takeHit();
              enemyBullets = [];
              if (!isGameOver) spawnWave(); // Giữ nguyên wave khi quái vượt tuyến.
              break;
            }
          }
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }

      if (!boss && enemies.length === 0) {
        wave++;
        enemySpeedX = Math.min(2.4, 0.7 + wave * 0.15);
        document.getElementById('wave-text').innerText = wave;
        spawnWave();
      }

    }

    // Chỉ vẽ một lần cho mỗi khung hình màn hình, kể cả khi phải mô phỏng nhiều bước.
    function render() {
      // --- 7. RENDER RA MÀN HÌNH ---
      ctx.fillStyle = '#02120e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(6, 78, 59, 0.35)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      for (let cell of bloodCells) {
        ctx.fillStyle = `rgba(239, 68, 68, ${cell.alpha})`;
        ctx.beginPath(); ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2); ctx.fill();
      }

      for (let sw of shockwaves) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${sw.alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2); ctx.stroke();
      }

      for (let b of bullets) {
        if (!b) continue;
        if (b.hero === 'doctor') {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x - 1.5, b.y, b.w, b.h);
          ctx.fillStyle = '#ffffff'; ctx.fillRect(b.x - 0.5, b.y - 2, 1.5, 4);
        } else if (b.hero === 'nurse') {
          ctx.fillStyle = b.color;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.w / 2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(b.x - 1, b.y - 1, 1.5, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = b.color;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.28, 0, Math.PI * 2); ctx.fill();
        }
      }

      for (let eb of enemyBullets) {
        if (!eb) continue;
        if (eb.type === 'needle') {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath(); ctx.ellipse(eb.x, eb.y, 2, 6, 0, 0, Math.PI * 2); ctx.fill();
        } else if (eb.type === 'homing') {
          ctx.fillStyle = '#ea580c';
          ctx.beginPath(); ctx.arc(eb.x, eb.y, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fde047';
          ctx.beginPath(); ctx.arc(eb.x, eb.y, 1.8, 0, Math.PI * 2); ctx.fill();
        } else if (eb.type === 'split') {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath(); ctx.arc(eb.x, eb.y, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(eb.x, eb.y, 2, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath(); ctx.arc(eb.x, eb.y, 3.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#86efac';
          ctx.beginPath(); ctx.arc(eb.x, eb.y - 1, 1.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      for (let pu of powerUps) {
        if (pu) drawPowerUp(pu);
      }

      // BỌC KIỂM TRA TRÁNH CRASH TẠI DÒNG VẼ QUÁI
      for (let e of enemies) {
        if (!e || !e.type) continue;
        if (e.type === 'bean_yellow') drawBeanYellow(e);
        else if (e.type === 'pink_tentacle') drawPinkTentacle(e);
        else if (e.type === 'rod_red') drawRodRed(e);
        else if (e.type === 'worm_pink') drawWormPink(e);
        else if (e.type === 'hairy_cyan') drawHairyCyan(e);
      }

      if (boss) drawBoss(boss);

      for (let p of particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      }

      drawPlayer(player.x, player.y);
      renderUltimate();

    }

    // Dồn thời gian qua từng khung hình; tối đa 5 bước để tránh máy lag tạo bước nhảy lớn.
    function gameLoop(time) {
      if (isPaused || isGameOver) return;
      if (!lastFrameTime) lastFrameTime = time;
      accumulatedTime = Math.min(accumulatedTime + Math.min(time - lastFrameTime, 250), STEP_MS * 5);
      lastFrameTime = time;
      let steps = 0;
      while (accumulatedTime >= STEP_MS && !isGameOver && !isPaused) {
        update();
        accumulatedTime -= STEP_MS;
        steps++;
      }
      if (!isGameOver && !isPaused) {
        if (steps > 0) render();
        animationId = requestAnimationFrame(gameLoop);
      }
    }

    function takeHit() {
      AudioEngine.hurt();
      hp--;
      player.invincibleTime = 60;
      if (player.gunLevel > 1) {
        player.gunLevel--;
        const labels = ["CẤP 1", "CẤP 2", "CẤP 3", "CẤP 4", "MAX POWER"];
        document.getElementById('gun-text').innerText = labels[player.gunLevel - 1];
      }

      document.getElementById('hp-text').innerText = '❤️'.repeat(Math.max(0, hp));
      createExplosion(player.x + 16, player.y + 18, '#ef4444', 18);

      if (hp <= 0) {
        isGameOver = true;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        bullets = [];
        enemyBullets = [];
        powerUps = [];
        particles = [];
        shockwaves = [];
        enemies = [];
        boss = null;
        isTouching = false;

        document.getElementById('boss-hud').classList.add('hidden');
        document.getElementById('shield-hud').classList.add('hidden');
        document.getElementById('wave-notice').classList.add('hidden');
        updateUltimateHud();
        document.getElementById('ultimate-effect').textContent = '';
        finishGame();
      }
    }

