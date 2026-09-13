/* HÌNH LÍNH CANVAS – lấy cảm hứng từ ảnh mẫu, không tải/cắt ảnh bên ngoài.
   5 nhóm × 2 biến thể (skin 0/1), không đổi hitbox/HP/kiểu bắn.
   Chỉnh hình: các hàm draw... bên dưới; chỉnh màu: ENEMY_TYPES ở 02-state.js.
   animTimer tăng trong update() 60Hz, không tăng trong render() để máy 120Hz
   không khiến lính chạy hoạt ảnh nhanh gấp đôi. Giới hạn nét vẽ mỗi hình.
*/

function soldierOval(x, y, rx, ry, fill, stroke = '#17344a', width = 1.5) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
}

function soldierLine(x1, y1, x2, y2, color = '#17344a', width = 1.6) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

function soldierFace(x, y, t, pupil = '#172033') {
  // Đôi mắt và nét cười đủ lớn để đọc trên màn hình điện thoại.
  const blink = t % 7.4 > 7.24;
  for (const side of [-1, 1]) {
    const cx = x + side * 4;
    if (blink) soldierLine(cx - 2, y, cx + 2, y, pupil, 1.5);
    else {
      soldierOval(cx, y, 2.7, 3.2, '#fff', pupil, 1);
      soldierOval(cx + .6, y + .3, 1.15, 1.5, pupil, pupil, .4);
    }
  }
  ctx.strokeStyle = pupil; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(x, y + 3.6, 2, .15, Math.PI - .15); ctx.stroke();
}

function soldierSpot(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

function drawBeanYellow(e) {
  const t = e.animTimer;
  ctx.save();
  ctx.translate(e.x, e.y + Math.sin(t * 1.7) * 1.5);
  ctx.rotate(Math.sin(t) * .09);
  if (e.skin === 0) { // Bầy cầu khuẩn vàng: các hạt con nhấp nhô quanh hạt mẹ.
    const orbit = Math.sin(t * 2) * 1.6;
    soldierOval(-11, -5 + orbit, 5, 5, '#fde68a', '#92400e');
    soldierOval(12, -7 - orbit, 5, 5, '#fbbf24', '#92400e');
    soldierOval(-8, 10 - orbit, 5, 5, '#fcd34d', '#92400e');
    soldierOval(11, 9 + orbit, 4.5, 5, '#fef08a', '#92400e');
    soldierOval(0, 1, 11, 10, e.color, '#92400e', 2);
    soldierOval(-4, -4, 4.6, 2.4, '#fef9c3', '#fef9c3', .3);
    soldierSpot(-6, 6, 1.3, '#fb923c'); soldierSpot(6, 6, 1.2, '#fb923c');
    soldierFace(0, 0, t);
  } else { // Chùm cầu khuẩn tím dạng nho.
    for (const [x, y, r] of [[-10,-7,5],[0,-11,5],[10,-7,5],[-11,5,5],[10,6,5],[0,10,6]]) {
      soldierOval(x, y + Math.sin(t * 1.5 + x) * .7, r, r, '#7c3aed', '#4c1d95', 1.3);
      soldierSpot(x - 1.3, y - 1.6, 1.4, '#c4b5fd');
    }
    soldierOval(0, 0, 9, 9, e.color, '#4c1d95', 1.8);
    soldierFace(0, -1, t);
  }
  ctx.restore();
}

function drawPinkTentacle(e) {
  const t = e.animTimer;
  ctx.save(); ctx.translate(e.x, e.y + Math.sin(t * 1.7) * 1.8);
  ctx.rotate(Math.sin(t * .7) * .075);
  if (e.skin === 0) { // Virus hồng gai dài, đầu gai đung đưa.
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI / 5;
      const wiggle = 1.7 * Math.sin(t * 2 + i);
      soldierLine(Math.cos(a) * 10, Math.sin(a) * 10,
        Math.cos(a) * (18 + wiggle), Math.sin(a) * (18 + wiggle), '#9d174d', 3);
      soldierSpot(Math.cos(a) * (18 + wiggle), Math.sin(a) * (18 + wiggle), 2.1, '#f9a8d4');
    }
    soldierOval(0, 0, 11.5, 11.5, e.color, '#831843', 2);
    soldierOval(-4, -5, 4, 2, '#fbcfe8', '#fbcfe8', .2);
    soldierSpot(6, 6, 1.3, '#f472b6');
    soldierFace(0, 0, t, '#701a75');
  } else { // Virus xanh lam với nút gai tròn.
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const wobble = 1 + Math.sin(t * 1.8 + i) * 1.1;
      soldierLine(Math.cos(a) * 10, Math.sin(a) * 10,
        Math.cos(a) * (15 + wobble), Math.sin(a) * (15 + wobble), '#155e99', 2.7);
      soldierSpot(Math.cos(a) * (15 + wobble), Math.sin(a) * (15 + wobble), 2.3, '#7dd3fc');
    }
    soldierOval(0, 0, 11.5, 11.5, e.color, '#075985', 2);
    soldierSpot(-6, 5, 1.6, '#a5f3fc'); soldierSpot(7, -6, 1.2, '#0e7490');
    soldierFace(0, -1, t, '#164e63');
  }
  ctx.restore();
}

function drawRodRed(e) {
  const t = e.animTimer;
  ctx.save(); ctx.translate(e.x, e.y + Math.sin(t * 1.4) * 1.3);
  if (e.skin === 0) { // Xoắn khuẩn cam: sống lưng lượn liên tục, mặt ở đầu trên.
    const sway = Math.sin(t * 2) * 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-12, 9);
    ctx.bezierCurveTo(-10, -5 + sway, -1, 13 - sway, 2, -3);
    ctx.bezierCurveTo(5, -15 + sway, 10, 2 - sway, 12, -10);
    ctx.strokeStyle = '#9a3412'; ctx.lineWidth = 7; ctx.stroke();
    ctx.strokeStyle = e.color; ctx.lineWidth = 4.6; ctx.stroke();
    soldierSpot(-10, 6, 1.4, '#fed7aa'); soldierSpot(3, -4, 1.4, '#fed7aa');
    soldierOval(12, -10, 3, 3, '#fdba74', '#9a3412', 1);
    soldierSpot(12, -11, 1, '#172033');
  } else { // Trực khuẩn xanh với lông rung và hai roi ở đuôi.
    ctx.rotate(-.22 + Math.sin(t * 1.2) * .07);
    for (let i = -2; i <= 2; i++) {
      soldierLine(i * 5, -7, i * 5 + Math.sin(t * 3 + i) * 2, -12, '#0891b2', 1.5);
      soldierLine(i * 5, 7, i * 5 + Math.sin(t * 3 - i) * 2, 12, '#0891b2', 1.5);
    }
    const tail = Math.sin(t * 2.3) * 4;
    soldierLine(12, -2, 22, -8 + tail, '#0e7490', 1.4);
    soldierLine(12, 3, 23, 10 + tail, '#0e7490', 1.4);
    soldierOval(0, 0, 15, 7.4, e.color, '#075985', 2);
    soldierOval(-6, -3, 6, 2, '#a5f3fc', '#a5f3fc', .2);
    soldierFace(-1, -1, t, '#164e63');
  }
  ctx.restore();
}

function drawWormPink(e) {
  const t = e.animTimer;
  ctx.save(); ctx.translate(e.x, e.y + Math.sin(t * 1.5) * 1.6);
  ctx.rotate(Math.sin(t * .9) * .11);
  if (e.skin === 0) { // Chuỗi khuẩn tím gai nhọn: mỗi đốt lắc lệch pha.
    for (let i = 0; i < 4; i++) {
      const x = -12 + i * 8, y = 6 - i * 4 + Math.sin(t * 2 + i) * 2;
      for (const dir of [-1, 1]) {
        ctx.fillStyle = '#a21caf';
        ctx.beginPath(); ctx.moveTo(x, y + dir * 5);
        ctx.lineTo(x - 2, y + dir * 10); ctx.lineTo(x + 3, y + dir * 6);
        ctx.fill();
      }
      soldierOval(x, y, 7, 6, i % 2 ? '#c026d3' : e.color, '#701a75', 1.7);
      soldierSpot(x - 2, y - 2, 1.6, '#f5d0fe');
      if (i === 3) soldierFace(x, y - 1, t, '#4a044e');
    }
  } else { // Trực khuẩn cong xanh lục: đuôi roi ve vẩy.
    const tip = Math.sin(t * 2.5) * 5;
    ctx.strokeStyle = '#365314'; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-12, 10);
    ctx.bezierCurveTo(-8, 4, -5, -12, 12, -8); ctx.stroke();
    ctx.strokeStyle = e.color; ctx.lineWidth = 10; ctx.stroke();
    soldierLine(-12, 10, -18 + tip, 19, '#65a30d', 1.7);
    soldierLine(-9, 12, -7 + tip, 20, '#65a30d', 1.7);
    soldierSpot(-6, 2, 1.4, '#fef08a'); soldierSpot(1, -7, 1.5, '#fef08a');
    soldierFace(7, -8, t, '#365314');
  }
  ctx.restore();
}

function drawHairyCyan(e) {
  const t = e.animTimer;
  ctx.save(); ctx.translate(e.x, e.y + Math.sin(t * 1.5) * 1.5);
  if (e.skin === 0) { // Amip xanh với thùy cơ thể và hai tay đung đưa.
    const swing = Math.sin(t * 2.2) * 3;
    soldierLine(-11, -3, -19, -10 + swing, '#0f766e', 3);
    soldierLine(11, 3, 19, 8 - swing, '#0f766e', 3);
    ctx.fillStyle = e.color; ctx.strokeStyle = '#0f766e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-13, -3);
    ctx.bezierCurveTo(-17, -12, -7, -15, -3, -12);
    ctx.bezierCurveTo(2, -17, 8, -12, 11, -7);
    ctx.bezierCurveTo(17, -2, 12, 5, 14, 10);
    ctx.bezierCurveTo(6, 16, -3, 13, -9, 15);
    ctx.bezierCurveTo(-14, 8, -17, 3, -13, -3);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    soldierSpot(-9, 7, 2.1, '#84cc16'); soldierSpot(7, 8, 2.3, '#a78bfa');
    soldierSpot(-6, -8, 1.2, '#cffafe'); soldierSpot(9, -5, 1.3, '#facc15');
    soldierFace(0, -1, t, '#134e4a');
  } else { // Lính giọt khuẩn xanh lá và các lông mao mềm.
    for (let i = 0; i < 6; i++) {
      const yy = -6 + i * 4;
      soldierLine(-11, yy, -17 + Math.sin(t * 2 + i) * 2, yy - 2, '#166534', 1.5);
      soldierLine(11, yy, 17 + Math.sin(t * 2 - i) * 2, yy - 2, '#166534', 1.5);
    }
    ctx.fillStyle = e.color; ctx.strokeStyle = '#166534'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -17);
    ctx.bezierCurveTo(8, -14, 15, -2, 13, 10);
    ctx.bezierCurveTo(6, 18, -6, 18, -13, 10);
    ctx.bezierCurveTo(-15, -2, -8, -14, 0, -17);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    soldierSpot(-6, 8, 1.5, '#bbf7d0'); soldierSpot(7, 9, 1.8, '#a3e635');
    soldierFace(0, -1, t, '#14532d');
  }
  ctx.restore();
}
