/* ĐIỀU KHIỂN & KHỞI ĐỘNG: chạm đa điểm, chuột, bàn phím; startGame đặt lại dữ liệu.
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 8. ĐIỀU KHIỂN: ngón kéo và ngón bấm tuyệt kỹ hoạt động độc lập ---
    let movementPointerId = null;
    function updateTouchPosition(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * canvas.width / rect.width;
      const y = (clientY - rect.top) * canvas.height / rect.height;
      player.targetX = x - player.w / 2;
      player.targetY = y - player.h / 2;
    }

    canvas.addEventListener('pointerdown', e => {
      if (isPaused || isGameOver || bossIntroActive || bossRewardActive || !document.getElementById('char-select-screen').classList.contains('hidden')) return;
      // Chỉ ngón chạm canvas đầu tiên được điều khiển nhân vật.
      e.preventDefault();
      if (movementPointerId !== null) return;
      AudioEngine.init();
      movementPointerId = e.pointerId;
      canvas.setPointerCapture(e.pointerId);
      isTouching = true;
      updateTouchPosition(e.clientX, e.clientY);
      document.getElementById('mobile-guide').style.opacity = '0';
    });
    canvas.addEventListener('pointermove', e => {
      if (e.pointerId === movementPointerId && isTouching && !isPaused) updateTouchPosition(e.clientX, e.clientY);
    });
    function stopPointer(e) {
      if (e.pointerId !== movementPointerId) return;
      movementPointerId = null;
      isTouching = false;
    }
    canvas.addEventListener('pointerup', stopPointer);
    canvas.addEventListener('pointercancel', stopPointer);
    canvas.addEventListener('lostpointercapture', stopPointer);

    // Điện thoại có thể bỏ click khi ngón khác đang kéo canvas: nhận ngay pointerdown.
    // click detail=0 vẫn cho bàn phím và công cụ trợ năng, không kích hoạt hai lần.
    const ultimateButton = document.getElementById('ultimate-button');
    ultimateButton.addEventListener('pointerdown', e => {
      e.stopPropagation();
      if (e.button !== 0) return;
      e.preventDefault();
      activateUltimate();
    });
    ultimateButton.addEventListener('click', e => {
      e.stopPropagation();
      if (e.detail === 0) activateUltimate();
    });

    // Bàn phím: giữ phím để di chuyển liên tục; P/Escape tạm dừng.
    const heldKeys = new Set();
    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (['arrowleft','arrowright','arrowup','arrowdown',' ','enter'].includes(k)) e.preventDefault();
      if (bossRewardActive) {
        if (k === '1' || k === '2') {
          e.preventDefault();
          if (!e.repeat) chooseBossReward(k === '1' ? 'attack' : 'defense');
        }
        return;
      }
      if (bossIntroActive) {
        if ((k === 'enter' || k === ' ') && !e.repeat) closeBossIntro();
        return;
      }
      if ((k === 'p' || k === 'escape') && !e.repeat) { togglePause(); return; }
      if (k === 'b' && !e.repeat) { activateUltimate(); return; }
      if (!isPaused && !isGameOver && document.getElementById('char-select-screen').classList.contains('hidden')) {
        AudioEngine.init();
        heldKeys.add(k);
      }
    });
    window.addEventListener('keyup', e => {
      heldKeys.delete(e.key.toLowerCase());
    });
    window.addEventListener('blur', () => {
      heldKeys.clear();
      isTouching = false;
      movementPointerId = null;
      if (!isPaused && !isGameOver && !bossIntroActive && !bossRewardActive && document.getElementById('char-select-screen').classList.contains('hidden')) togglePause();
    });

    // Được gọi 60 lần/giây từ vòng game; 3px mỗi bước ≈ 180px/giây.
    function updateKeyboard() {
      const v = 3.2;
      if (heldKeys.has('arrowleft') || heldKeys.has('a')) player.targetX -= v;
      if (heldKeys.has('arrowright') || heldKeys.has('d')) player.targetX += v;
      if (heldKeys.has('arrowup') || heldKeys.has('w')) player.targetY -= v;
      if (heldKeys.has('arrowdown') || heldKeys.has('s')) player.targetY += v;
      player.targetX = Math.max(5, Math.min(canvas.width - player.w - 5, player.targetX));
      player.targetY = Math.max(200, Math.min(canvas.height - player.h - 10, player.targetY));
      return heldKeys.has(' ') || heldKeys.has('enter');
    }

    function togglePause() {
      if (isGameOver || bossIntroActive || bossRewardActive || !document.getElementById('char-select-screen').classList.contains('hidden')) return;
      isPaused = !isPaused;
      document.getElementById('pause-screen').classList.toggle('hidden', !isPaused);
      document.getElementById('pause-button').textContent = isPaused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
      updateUltimateHud();
      if (isPaused) {
        isTouching = false;
        movementPointerId = null;
        heldKeys.clear();
        cancelAnimationFrame(animationId);
        animationId = null;
      } else {
        lastFrameTime = 0;
        accumulatedTime = 0;
        animationId = requestAnimationFrame(gameLoop);
      }
    }

    function startGame() {
      AudioEngine.init();
      document.getElementById('char-select-screen').classList.add('hidden');
      
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
      bossRewardActive = false;
      document.getElementById('boss-reward-screen').classList.add('hidden');
      isTouching = false;
      movementPointerId = null;
      heldKeys.clear();
      isPaused = false;
      lastFrameTime = 0;
      accumulatedTime = 0;
      enemyDir = 1;
      enemySpeedX = 0.7;
      formationShiftX = 0;
      formationDropY = 0;
      formationTick = 0;
      noticeTicks = 0;
      bossIntroActive = false;
      document.getElementById('boss-intro-screen').classList.add('hidden');
      resetUltimate();
      document.getElementById('ultimate-effect').textContent = '';
      document.getElementById('pause-screen').classList.add('hidden');
      document.getElementById('pause-button').textContent = '⏸ Tạm dừng';
      document.getElementById('shield-hud').classList.add('hidden');
      document.getElementById('boss-hud').classList.add('hidden');
      document.getElementById('boss-attack-warning').classList.add('hidden');

      score = 0;
      hp = 3;
      wave = 1;
      player.gunLevel = 1;
      player.x = 145;
      player.y = 400;
      player.targetX = 145;
      player.targetY = 400;
      player.invincibleTime = 0;
      player.shieldTime = 0;
      player.shootCooldown = 0;
      isGameOver = false;

      document.getElementById('gun-text').innerText = 'CẤP 1';
      document.getElementById('score-text').innerText = '0';
      document.getElementById('wave-text').innerText = '1';
      document.getElementById('hp-text').innerText = '❤️❤️❤️';
      
      spawnWave();
      update();
      render();
      animationId = requestAnimationFrame(gameLoop);
    }

    function openCharSelect() {
      isTouching = false;
      movementPointerId = null;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      document.getElementById('gameover-screen').classList.add('hidden');
      document.getElementById('char-select-screen').classList.remove('hidden');
      bossIntroActive = false;
      document.getElementById('boss-intro-screen').classList.add('hidden');
      bossRewardActive = false;
      document.getElementById('boss-reward-screen').classList.add('hidden');
      updateUltimateHud();
      document.getElementById('boss-attack-warning').classList.add('hidden');
      renderPreviews();
    }

    function restartGame() {
      openCharSelect();
    }
