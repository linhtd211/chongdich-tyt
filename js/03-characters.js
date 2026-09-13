/* NHÂN VẬT: các hàm draw...Hero vẽ hình; drawPlayer chọn hình và lá chắn; renderPreviews vẽ ảnh chọn; selectHero đổi nhân vật và mô tả.
   Các tệp JS phải được nạp đúng thứ tự khai báo trong index.html. */
    // --- 3. VẼ 3 NHÂN VẬT ---
    function drawDoctorHero(c, x, y) {
      c.save();
      c.translate(x, y);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.beginPath(); c.ellipse(16, 36, 13, 4, 0, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#1e293b';
      c.beginPath(); c.arc(16, 10, 11, Math.PI, 0); c.fill();
      c.fillRect(7, 8, 18, 5);

      c.fillStyle = '#fed7aa';
      c.beginPath(); c.arc(16, 14, 9, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(6, 14, 2.5, 0, Math.PI * 2); c.arc(26, 14, 2.5, 0, Math.PI * 2); c.fill();

      c.strokeStyle = '#0f172a';
      c.lineWidth = 1.8;
      c.beginPath(); c.arc(11, 12, 4.5, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(21, 12, 4.5, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(15.5, 12); c.lineTo(16.5, 12); c.stroke();

      c.fillStyle = '#0f172a';
      c.beginPath(); c.arc(11, 12, 2.2, 0, Math.PI * 2); c.arc(21, 12, 2.2, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(12, 11, 0.8, 0, Math.PI * 2); c.arc(22, 11, 0.8, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#2dd4bf';
      c.fillRect(8, 15, 16, 7);

      c.strokeStyle = '#334155';
      c.lineWidth = 1.6;
      c.beginPath(); c.arc(16, 22, 7, 0.2, Math.PI - 0.2); c.stroke();
      c.fillStyle = '#94a3b8';
      c.beginPath(); c.arc(16, 29, 2, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#14b8a6';
      c.fillRect(8, 22, 16, 11);
      c.fillStyle = '#0d9488';
      c.fillRect(9, 31, 5, 5); c.fillRect(18, 31, 5, 5);

      c.fillStyle = '#ffffff'; c.fillRect(23, 16, 3.5, 3.5);
      c.fillStyle = '#e2e8f0'; c.fillRect(24, 2, 2, 15);
      c.fillStyle = '#22c55e'; c.fillRect(23.5, 7, 3, 7);
      c.restore();
    }

    function drawNurseHero(c, x, y) {
      c.save();
      c.translate(x, y);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.beginPath(); c.ellipse(16, 36, 13, 4, 0, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#ffffff';
      c.fillRect(8, 1, 16, 6);
      c.fillStyle = '#ef4444';
      c.fillRect(14, 2.5, 4, 1.5); c.fillRect(15.2, 1.3, 1.6, 4);

      c.fillStyle = '#78350f';
      c.beginPath(); c.arc(16, 11, 10, Math.PI, 0); c.fill();
      c.beginPath(); c.arc(7, 14, 4, 0, Math.PI * 2); c.arc(25, 14, 4, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#fed7aa';
      c.beginPath(); c.arc(16, 14, 8.5, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#451a03';
      c.beginPath(); c.arc(12, 13, 2.5, 0, Math.PI * 2); c.arc(20, 13, 2.5, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#ffffff';
      c.beginPath(); c.arc(12.8, 12.2, 1, 0, Math.PI * 2); c.arc(20.8, 12.2, 1, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#f8fafc';
      c.fillRect(10, 16, 12, 5);

      c.fillStyle = '#ffffff';
      c.beginPath(); c.moveTo(11, 21); c.lineTo(21, 21); c.lineTo(23, 31); c.lineTo(9, 31); c.closePath(); c.fill();

      c.fillStyle = '#fed7aa';
      c.fillRect(11, 31, 3, 5); c.fillRect(18, 31, 3, 5);

      c.fillStyle = '#bae6fd';
      c.fillRect(4, 10, 8, 22);
      c.fillStyle = '#38bdf8'; c.fillRect(5, 14, 6, 14);
      c.fillStyle = '#0284c7'; c.fillRect(3, 30, 10, 3);
      c.fillStyle = '#94a3b8'; c.fillRect(7, 2, 2, 8);
      c.restore();
    }

    function drawSanitizerHero(c, x, y) {
      c.save();
      c.translate(x, y);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.beginPath(); c.ellipse(16, 36, 13, 4, 0, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#1e40af';
      c.fillRect(3, 14, 7, 16);

      c.fillStyle = '#f8fafc';
      c.beginPath(); c.arc(16, 11, 9.5, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#06b6d4';
      c.fillRect(11, 8, 11, 6);
      c.fillStyle = '#cffafe'; c.fillRect(13, 9, 3, 2);

      c.fillStyle = '#f8fafc';
      c.fillRect(8, 20, 16, 11);
      c.fillRect(9, 28, 5, 4); c.fillRect(18, 28, 5, 4);

      c.fillStyle = '#eab308';
      c.fillRect(8, 32, 6, 4); c.fillRect(18, 32, 6, 4);

      c.fillStyle = '#eab308';
      c.beginPath(); c.arc(24, 22, 2.5, 0, Math.PI * 2); c.fill();

      c.fillStyle = '#334155';
      c.fillRect(23, 6, 2.5, 18);
      c.fillStyle = '#94a3b8';
      c.fillRect(22, 4, 4.5, 3);
      c.restore();
    }

    function drawPlayer(x, y) {
      if (player.invincibleTime > 0 && Math.floor(player.invincibleTime / 4) % 2 === 0) return;

      if (player.shieldTime > 0) {
        const shieldAngle = Date.now() * 0.005;
        const gradShield = ctx.createRadialGradient(x + 16, y + 18, 16, x + 16, y + 18, 32);
        gradShield.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
        gradShield.addColorStop(0.8, 'rgba(56, 189, 248, 0.45)');
        gradShield.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
        ctx.fillStyle = gradShield;
        ctx.beginPath(); ctx.arc(x + 16, y + 18, 30, 0, Math.PI * 2); ctx.fill();

        for (let i = 0; i < 3; i++) {
          const a = shieldAngle + (i * Math.PI * 2 / 3);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(x + 16 + Math.cos(a) * 32, y + 18 + Math.sin(a) * 32, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (selectedHero === 'doctor') drawDoctorHero(ctx, x, y);
      else if (selectedHero === 'nurse') drawNurseHero(ctx, x, y);
      else drawSanitizerHero(ctx, x, y);
    }

    function renderPreviews() {
      const pDoc = document.getElementById('prev-doctor').getContext('2d');
      const pNur = document.getElementById('prev-nurse').getContext('2d');
      const pSan = document.getElementById('prev-sanitizer').getContext('2d');

      pDoc.clearRect(0,0,48,56); drawDoctorHero(pDoc, 8, 8);
      pNur.clearRect(0,0,48,56); drawNurseHero(pNur, 8, 8);
      pSan.clearRect(0,0,48,56); drawSanitizerHero(pSan, 8, 8);
    }
    setTimeout(renderPreviews, 100);

    function selectHero(hero) {
      selectedHero = hero;
      const cards = ['doctor', 'nurse', 'sanitizer'];
      cards.forEach(k => {
        const el = document.getElementById(`card-${k}`);
        if (k === hero) {
          el.className = "bg-slate-900/90 border-2 border-emerald-400 p-2 rounded-2xl flex flex-col items-center cursor-pointer transition-all scale-105 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
        } else {
          el.className = "bg-slate-900/90 border-2 border-slate-700 p-2 rounded-2xl flex flex-col items-center cursor-pointer transition-all opacity-70";
        }
      });

      const descEl = document.getElementById('hero-desc');
      if (hero === 'doctor') {
        descEl.innerHTML = "🩺 <strong>Bác Sĩ:</strong> Đồ scrubs xanh, kính tròn to. Bắn ra tia <strong>Laser Kim Tiêm Xuyên Thấu</strong> triệt hạ thẳng hàng.";
      } else if (hero === 'nurse') {
        descEl.innerHTML = "💉 <strong>Nữ Điều Dưỡng Chibi:</strong> Ôm ống tiêm to. Bắn ra <strong>Chùm Vắc-xin Nở Rộng</strong> nổ tung diện tích vừa.";
      } else {
        descEl.innerHTML = "🧪 <strong>Cán Bộ Khử Khuẩn:</strong> Bắn ra <strong>Bong Bóng Xà Phòng Diệt Khuẩn</strong> bay xa chạm nóc màn hình, ăn bonus để tăng số lượng bong bóng!";
      }
      AudioEngine.beep(600, 0.04);
    }

