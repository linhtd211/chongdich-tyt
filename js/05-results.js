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

function finishGame() {
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
  document.getElementById('gameover-screen').classList.remove('hidden');
}

loadRecords();
