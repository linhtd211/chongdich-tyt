/* ĐIỀU KHIỂN & KHỞI ĐỘNG: chạm, chuột, bàn phím; startGame đặt lại dữ liệu; openCharSelect mở màn chọn. Sửa phím ở keydown/keyup.
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 8. ĐIỀU KHIỂN: CHỈ CANVAS NHẬN CHẠM / CHUỘT ---
    function updateTouchPosition(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * canvas.width / rect.width;
      const y = (clientY - rect.top) * canvas.height / rect.height;
      player.targetX = x - player.w / 2;
      player.targetY = y - player.h / 2;
    }

    canvas.addEventListener('pointerdown', e => {
      if (isPaused || isGameOver || !document.getElementById('char-select-screen').classList.contains('hidden')) return;
      e.preventDefault();
      AudioEngine.init();
      canvas.setPointerCapture(e.pointerId);
      isTouching = true;
      updateTouchPosition(e.clientX, e.clientY);
      document.getElementById('mobile-guide').style.opacity = '0';
    });
    canvas.addEventListener('pointermove', e => {
      if (isTouching && !isPaused) updateTouchPosition(e.clientX, e.clientY);
    });
    function stopPointer(e) { isTouching = false; }
    canvas.addEventListener('pointerup', stopPointer);
    canvas.addEventListener('pointercancel', stopPointer);
    canvas.addEventListener('lostpointercapture', stopPointer);

    // Bàn phím: giữ phím để di chuyển liên tục; P/Escape tạm dừng.
    const heldKeys = new Set();
    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (['arrowleft','arrowright','arrowup','arrowdown',' ','enter'].includes(k)) e.preventDefault();
      if ((k === 'p' || k === 'escape') && !e.repeat) { togglePause(); return; }
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
      if (!isPaused && !isGameOver && document.getElementById('char-select-screen').classList.contains('hidden')) togglePause();
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
      if (isGameOver || !document.getElementById('char-select-screen').classList.contains('hidden')) return;
      isPaused = !isPaused;
      document.getElementById('pause-screen').classList.toggle('hidden', !isPaused);
      document.getElementById('pause-button').textContent = isPaused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
      if (isPaused) {
        isTouching = false;
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
      isTouching = false;
      heldKeys.clear();
      isPaused = false;
      lastFrameTime = 0;
      accumulatedTime = 0;
      enemyDir = 1;
      enemySpeedX = 0.7;
      noticeTicks = 0;
      document.getElementById('pause-screen').classList.add('hidden');
      document.getElementById('pause-button').textContent = '⏸ Tạm dừng';
      document.getElementById('shield-hud').classList.add('hidden');
      document.getElementById('boss-hud').classList.add('hidden');

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
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      document.getElementById('gameover-screen').classList.add('hidden');
      document.getElementById('char-select-screen').classList.remove('hidden');
      renderPreviews();
    }

    function restartGame() {
      openCharSelect();
    }
