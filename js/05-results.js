/* ĐIỂM CAO VÀ MÀN KẾT QUẢ.
   Chỉ lưu điểm và wave vào localStorage trên trình duyệt hiện tại; không gửi dữ liệu đi đâu.
   Nếu trình duyệt chặn lưu (đặc biệt khi mở qua file://), vẫn hiển thị kỷ lục trong phiên đang chơi. */
const RECORD_KEY = 'bachsi-dietkhuan-v1-record';
const heroNames = { doctor: 'Bác sĩ', nurse: 'Điều dưỡng', sanitizer: 'Khử khuẩn' };
let records = { bestScore: 0, bestWave: 0 };

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECORD_KEY) || '{}');
    if (Number.isSafeInteger(saved.bestScore) && saved.bestScore >= 0) records.bestScore = saved.bestScore;
    if (Number.isSafeInteger(saved.bestWave) && saved.bestWave >= 0) records.bestWave = saved.bestWave;
  } catch (_) { /* Vẫn chơi bình thường nếu trình duyệt không cho lưu. */ }
  showIntroRecords();
}

function showIntroRecords() {
  document.getElementById('intro-record').textContent = records.bestScore.toLocaleString('vi-VN');
  document.getElementById('intro-wave').textContent = records.bestWave;
}

function finishGame(victory = false) {
  const newRecord = score > records.bestScore;
  records.bestScore = Math.max(records.bestScore, score);
  records.bestWave = Math.max(records.bestWave, wave);
  try { localStorage.setItem(RECORD_KEY, JSON.stringify(records)); } catch (_) { /* Giữ trong bộ nhớ cho phiên này. */ }

  document.getElementById('final-score').textContent = score.toLocaleString('vi-VN');
  document.getElementById('final-wave').textContent = wave;
  document.getElementById('final-hero').textContent = heroNames[selectedHero];
  document.getElementById('final-record').textContent = records.bestScore.toLocaleString('vi-VN');
  document.getElementById('final-best-wave').textContent = records.bestWave;
  document.getElementById('new-record-badge').classList.toggle('hidden', !newRecord);
  showIntroRecords();
  if (victory) {
    document.getElementById('victory-hero').textContent = heroNames[selectedHero];
    document.getElementById('victory-score').textContent = score.toLocaleString('vi-VN');
    document.getElementById('victory-record').textContent = newRecord ? '🏆 Kỷ lục điểm mới!' : '';
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.remove('hidden');
  } else {
    document.getElementById('victory-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.remove('hidden');
  }
}

// Vẽ lại bằng khen bằng Canvas: tải được thành PNG mà không cần thư viện hoặc ảnh ngoài.
function downloadVictoryCertificate() {
  if (document.getElementById('victory-screen').classList.contains('hidden')) return;
  const card = document.createElement('canvas');card.width = 900;card.height = 1200;
  const g = card.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 900, 1200);
  bg.addColorStop(0, '#fef6da');bg.addColorStop(1, '#f1e3bc');
  g.fillStyle = bg;g.fillRect(0, 0, 900, 1200);
  g.strokeStyle = '#9c7239';g.lineWidth = 18;g.strokeRect(35, 35, 830, 1130);
  g.strokeStyle = '#c79d58';g.lineWidth = 4;g.strokeRect(55, 55, 790, 1090);
  g.textAlign = 'center';
  g.fillStyle = '#1c6655';g.font = 'bold 44px sans-serif';g.fillText('BIỆT ĐỘI Y TẾ', 450, 190);
  g.fillStyle = '#95602f';g.font = 'bold 116px serif';g.fillText('★', 450, 350);
  g.font = 'bold 94px serif';g.fillText('BẰNG KHEN', 450, 485);
  g.fillStyle = '#3c4d44';g.font = '35px sans-serif';g.fillText('Trao tặng người hùng chống dịch', 450, 590);
  g.fillStyle = '#116858';g.font = 'bold 65px sans-serif';g.fillText(heroNames[selectedHero], 450, 690);
  g.fillStyle = '#3c4d44';g.font = '31px sans-serif';
  g.fillText('Đã đánh bại Chúa Tể Đại Dịch', 450, 774);
  g.fillText('và bảo vệ vùng dịch trong trò chơi.', 450, 824);
  g.fillStyle = '#95602f';g.font = 'bold 38px sans-serif';
  g.fillText(`WAVE 52     ·     ${score.toLocaleString('vi-VN')} ĐIỂM`, 450, 940);
  g.fillStyle = '#69756d';g.font = '24px sans-serif';
  g.fillText('Thành tích trò chơi · không phải chứng nhận y tế', 450, 1080);
  const a = document.createElement('a');a.download = 'Bang_khen_dap_tat_dich.png';
  a.href = card.toDataURL('image/png');a.click();
}

loadRecords();
