/* v1.19.0 — Intro/tutorial và hoạt cảnh cấp cứu khi Game Over. */
const TUTORIAL_KEY = 'bachsi-dietkhuan-tutorial-v119-seen';
let tutorialPage = 0;
let deathSequenceTimer = null;
const tutorialPages = [
  {icon:'🦠', kicker:'BÁO ĐỘNG DỊCH BỆNH!', title:'BIỆT ĐỘI Y TẾ XUẤT KÍCH', body:'Vi khuẩn đang xâm nhập vùng dịch!<br>Đội ngũ y tế đã được điều động.<br><br><strong class="text-emerald-300">Nhiệm vụ:</strong> tiêu diệt vi khuẩn, vượt qua 3 Wave và đánh bại Boss của từng chặng.'},
  {icon:'🎮', kicker:'HƯỚNG DẪN ĐIỀU KHIỂN', title:'DI CHUYỂN · BẮN · ULTIMATE', body:'<div class="grid grid-cols-2 gap-2 text-left"><div class="rounded-lg bg-slate-800 p-2"><b>⌨️ WASD / ←↑↓→</b><br><span class="text-slate-400">Di chuyển</span></div><div class="rounded-lg bg-slate-800 p-2"><b>SPACE / Kéo chạm</b><br><span class="text-slate-400">Bắn</span></div><div class="rounded-lg bg-slate-800 p-2 col-span-2"><b>⚡ B / nút Ultimate</b><br><span class="text-slate-400">Chỉ dùng khi thanh năng lượng đã đầy</span></div></div>'},
  {icon:'🚨', kicker:'LUẬT CHƠI', title:'3 WAVE → BOSS → NÂNG CẤP', body:'🦠 <b>Wave 1:</b> đội hình Xâm nhập<br>🧬 <b>Wave 2:</b> Elite Đột biến<br>🚨 <b>Wave 3:</b> sự kiện ngẫu nhiên<br>👾 <b>Boss:</b> kết thúc chặng<br>⭐ Hạ Boss để chọn 1 trong 3 nâng cấp.<br><span class="text-amber-300">Hoàn thành nhiệm vụ phụ để nhận thêm lợi thế.</span>'}
];
function renderTutorial(){
  const p=tutorialPages[tutorialPage];
  document.getElementById('tutorial-icon').textContent=p.icon;
  document.getElementById('tutorial-kicker').textContent=p.kicker;
  document.getElementById('tutorial-title').textContent=p.title;
  document.getElementById('tutorial-body').innerHTML=p.body;
  document.querySelectorAll('.tutorial-dot').forEach((d,i)=>d.classList.toggle('active',i===tutorialPage));
  document.getElementById('tutorial-next').textContent=tutorialPage===tutorialPages.length-1?'BẮT ĐẦU NHIỆM VỤ ▶':'TIẾP THEO ▶';
}
function openTutorial(force=false){
  tutorialPage=0; renderTutorial(); document.getElementById('tutorial-screen').classList.remove('hidden');
  if(force) document.getElementById('tutorial-skip').textContent='ĐÓNG';
  else document.getElementById('tutorial-skip').textContent='Bỏ qua';
}
function nextTutorial(){ if(tutorialPage<tutorialPages.length-1){tutorialPage++;renderTutorial()}else closeTutorial(); }
function closeTutorial(){
  document.getElementById('tutorial-screen').classList.add('hidden');
  try{localStorage.setItem(TUTORIAL_KEY,'1')}catch(_){}
}
function showTutorialOnFirstVisit(){
  let seen=false; try{seen=localStorage.getItem(TUTORIAL_KEY)==='1'}catch(_){}
  if(!seen) openTutorial(false);
}
function startDeathSequence(){
  if(deathSequenceTimer) clearTimeout(deathSequenceTimer);
  const el=document.getElementById('death-sequence');
  el.classList.remove('hidden');
  // Khởi động lại CSS animation nếu người chơi chết nhiều lần.
  el.querySelectorAll('.medical-team,.ambulance,.ambulance-light,.ambulance-smoke,.death-hero').forEach(n=>{n.style.animation='none';void n.offsetWidth;n.style.animation=''});
  deathSequenceTimer=setTimeout(()=>completeDeathSequence(),4300);
}
function completeDeathSequence(){
  if(deathSequenceTimer){clearTimeout(deathSequenceTimer);deathSequenceTimer=null}
  document.getElementById('death-sequence').classList.add('hidden');
  finishGame();
}
function skipDeathSequence(){completeDeathSequence()}
window.addEventListener('keydown',e=>{
  if(!document.getElementById('death-sequence').classList.contains('hidden')&&(e.code==='Space'||e.code==='Enter')){e.preventDefault();skipDeathSequence()}
});
window.addEventListener('load',showTutorialOnFirstVisit);
