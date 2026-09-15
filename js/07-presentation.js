/* v1.19.1 — Intro/tutorial + Canvas-native medical evacuation.
   Không dùng emoji/icon cho nhân vật phụ, cáng, bệnh nhân hay xe cứu thương.
   Bệnh nhân trên cáng dùng CHÍNH renderer của selectedHero trong js/03-characters.js. */
const TUTORIAL_KEY = 'bachsi-dietkhuan-tutorial-v119-seen';
let tutorialPage = 0;
let deathSequenceRAF = null, deathSequenceStart = 0, deathSceneSnapshot = null;
const tutorialPages = [
  {icon:'🦠', kicker:'BÁO ĐỘNG DỊCH BỆNH!', title:'BIỆT ĐỘI Y TẾ XUẤT KÍCH', body:'Vi khuẩn đang xâm nhập vùng dịch!<br>Đội ngũ y tế đã được điều động.<br><br><strong class="text-emerald-300">Nhiệm vụ:</strong> tiêu diệt vi khuẩn, vượt qua 3 Wave và đánh bại Boss của từng chặng.'},
  {icon:'🎮', kicker:'HƯỚNG DẪN ĐIỀU KHIỂN', title:'DI CHUYỂN · BẮN · ULTIMATE', body:'<div class="grid grid-cols-2 gap-2 text-left"><div class="rounded-lg bg-slate-800 p-2"><b>⌨️ WASD / ←↑↓→</b><br><span class="text-slate-400">Di chuyển</span></div><div class="rounded-lg bg-slate-800 p-2"><b>SPACE / Kéo chạm</b><br><span class="text-slate-400">Bắn</span></div><div class="rounded-lg bg-slate-800 p-2 col-span-2"><b>⚡ B / nút Ultimate</b><br><span class="text-slate-400">Chỉ dùng khi thanh năng lượng đã đầy</span></div></div>'},
  {icon:'🚨', kicker:'LUẬT CHƠI', title:'3 WAVE → BOSS → NÂNG CẤP', body:'🦠 <b>Wave 1:</b> đội hình Xâm nhập<br>🧬 <b>Wave 2:</b> Elite Đột biến<br>🚨 <b>Wave 3:</b> sự kiện ngẫu nhiên<br>👾 <b>Boss:</b> kết thúc chặng<br>⭐ Hạ Boss để chọn 1 trong 3 nâng cấp.<br><span class="text-amber-300">Hoàn thành nhiệm vụ phụ để nhận thêm lợi thế.</span>'}
];
function renderTutorial(){const p=tutorialPages[tutorialPage];document.getElementById('tutorial-icon').textContent=p.icon;document.getElementById('tutorial-kicker').textContent=p.kicker;document.getElementById('tutorial-title').textContent=p.title;document.getElementById('tutorial-body').innerHTML=p.body;document.querySelectorAll('.tutorial-dot').forEach((d,i)=>d.classList.toggle('active',i===tutorialPage));document.getElementById('tutorial-next').textContent=tutorialPage===tutorialPages.length-1?'BẮT ĐẦU NHIỆM VỤ ▶':'TIẾP THEO ▶'}
function openTutorial(force=false){tutorialPage=0;renderTutorial();document.getElementById('tutorial-screen').classList.remove('hidden');document.getElementById('tutorial-skip').textContent=force?'ĐÓNG':'Bỏ qua'}
function nextTutorial(){if(tutorialPage<tutorialPages.length-1){tutorialPage++;renderTutorial()}else closeTutorial()}
function closeTutorial(){document.getElementById('tutorial-screen').classList.add('hidden');try{localStorage.setItem(TUTORIAL_KEY,'1')}catch(_){}}
function showTutorialOnFirstVisit(){let seen=false;try{seen=localStorage.getItem(TUTORIAL_KEY)==='1'}catch(_){}if(!seen)openTutorial(false)}

const DTAU=Math.PI*2;
const dclamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const dsmooth=v=>{v=dclamp(v);return v*v*(3-2*v)};
const dease=v=>1-Math.pow(1-dclamp(v),3);
function dLine(c,x1,y1,x2,y2,col='#183042',w=2){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.stroke()}
function dCirc(c,x,y,r,fill,stroke='#183042',w=1.5){c.beginPath();c.arc(x,y,r,0,DTAU);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke()}}
function dRR(c,x,y,w,h,r,fill,stroke='#183042',lw=1.5){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke()}}
function drawCurrentHeroCanvas(c,x,y,scale=1,rotation=0){
  c.save();c.translate(x,y);c.rotate(rotation);c.scale(scale,scale);
  // Các renderer gốc vẽ nhân vật trong hộp 32x40. Dịch tâm về (0,0) để xoay/nằm trên cáng.
  if(selectedHero==='doctor')drawDoctorHero(c,-16,-20);
  else if(selectedHero==='nurse')drawNurseHero(c,-16,-20);
  else drawSanitizerHero(c,-16,-20);
  c.restore();
}
function drawMedicCanvas(c,x,y,phase,flip=1,carry=false){
  c.save();c.translate(x,y);c.scale(flip,1);const bob=Math.sin(phase*DTAU)*1.8,leg=Math.sin(phase*DTAU)*5;c.translate(0,bob);
  dLine(c,-4,12,-5+leg*.35,28,'#12616a',5);dLine(c,4,12,5-leg*.35,28,'#12616a',5);dCirc(c,-6+leg*.35,29,3,'#172b38',null);dCirc(c,6-leg*.35,29,3,'#172b38',null);
  dRR(c,-9,-10,18,24,5,'#f0f4ed','#183042',1.3);c.fillStyle='#32a6a0';c.fillRect(-8,5,16,6);
  dCirc(c,0,-19,8.5,'#efbd96','#183042',1.3);dRR(c,-7,-19,14,5,2,'#b8dfda','#42636a',.8);
  c.beginPath();c.arc(0,-23,8.5,Math.PI,DTAU);c.fillStyle='#f7f5eb';c.fill();c.strokeStyle='#183042';c.lineWidth=1.2;c.stroke();c.fillStyle='#d94f55';c.fillRect(-1,-29,2,6);c.fillRect(-4,-27,8,2);
  const hy=carry?0:3;dLine(c,-8,-5,-14,hy,'#f0f4ed',4);dLine(c,8,-5,14,hy,'#f0f4ed',4);dCirc(c,-14,hy,2.2,'#efbd96',null);dCirc(c,14,hy,2.2,'#efbd96',null);c.restore();
}
function drawStretcherCanvas(c,x,y,bob=0,withHero=true){
  c.save();c.translate(x,y+bob);dLine(c,-28,3,-20,17,'#a8b5af',2);dLine(c,28,3,20,17,'#a8b5af',2);dLine(c,-20,17,20,17,'#a8b5af',2);dCirc(c,-21,19,4,'#20313c','#a8b5af',1);dCirc(c,21,19,4,'#20313c','#a8b5af',1);dRR(c,-35,-4,70,8,3,'#dce5df','#183042',1.2);dRR(c,-31,-9,62,6,3,'#72aaa6','#183042',1);
  if(withHero)drawCurrentHeroCanvas(c,0,-16,.72,Math.PI/2);c.restore();
}
function drawAmbulanceCanvas(c,x,y,door=0,phase=0){
  c.save();c.translate(x,y);c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,27,59,8,0,0,DTAU);c.fill();
  dRR(c,-57,-34,101,55,8,'#eef2ec','#183042',1.8);c.beginPath();c.moveTo(44,-27);c.lineTo(61,-13);c.lineTo(61,21);c.lineTo(36,21);c.lineTo(36,-27);c.closePath();c.fillStyle='#eef2ec';c.fill();c.strokeStyle='#183042';c.lineWidth=1.8;c.stroke();
  c.fillStyle='#d95055';c.fillRect(-56,-5,115,9);dRR(c,40,-23,14,14,2,'#527b89','#183042',1);
  c.fillStyle='#d95055';c.fillRect(-21,-25,8,22);c.fillRect(-28,-18,22,8);c.font='bold 7px system-ui';c.fillStyle='#263b46';c.fillText('CỨU THƯƠNG',0,-11);
  // Cửa sau có bản lề và mở/đóng thật.
  c.save();c.translate(-56,-6);c.rotate(-door*.9);dRR(c,-2,-27,19,42,2,'#edf1eb','#183042',1.2);dRR(c,3,-22,10,13,2,'#527b89','#183042',.8);c.restore();
  for(const wx of [-34,40]){dCirc(c,wx,22,10,'#1d2c36','#0c171d',1.5);dCirc(c,wx,22,4.5,'#87958f','#183042',1);const a=phase*7;dLine(c,wx+Math.cos(a)*4,22+Math.sin(a)*4,wx-Math.cos(a)*4,22-Math.sin(a)*4,'#263b46',1)}
  const flash=Math.sin(phase*13)>0;dRR(c,-22,-40,15,5,2,flash?'#ef5258':'#733d43','#183042',.7);dRR(c,-5,-40,15,5,2,!flash?'#52a9d8':'#395a76','#183042',.7);c.restore();
}
function drawDeathCaption(c,msg){c.save();c.textAlign='center';c.font='bold 16px VT323, monospace';c.fillStyle='#fecdd3';c.strokeStyle='#7f1d1d';c.lineWidth=3;c.strokeText(msg,160,58);c.fillText(msg,160,58);c.restore()}
function deathFrame(now){
  const t=(now-deathSequenceStart)/1000;c=ctx;
  c.clearRect(0,0,canvas.width,canvas.height);if(deathSceneSnapshot)c.drawImage(deathSceneSnapshot,0,0);
  c.fillStyle='rgba(2,6,23,.12)';c.fillRect(0,0,320,460);
  const px=player.x+16, py=player.y+20;
  if(t<.65){const p=dsmooth(t/.65);drawCurrentHeroCanvas(c,px,py+4*p,1,p*Math.PI/2);drawDeathCaption(c,p<.42?'TRÚNG ĐÒN CUỐI!':'ỐI...');}
  else if(t<1.55){const p=dease((t-.65)/.9),sx=350-p*170,ph=t*3.4;drawCurrentHeroCanvas(c,px,py+4,1,Math.PI/2);drawStretcherCanvas(c,sx,394,Math.sin(ph*DTAU),false);drawMedicCanvas(c,sx-45,385,ph,1,false);drawMedicCanvas(c,sx+45,385,ph,-1,false);drawDeathCaption(c,'ĐỘI CẤP CỨU ĐANG TỚI!');}
  else if(t<2.25){const p=dsmooth((t-1.55)/.7),sx=180;drawStretcherCanvas(c,sx,394,0,p>.48);if(p<=.48)drawCurrentHeroCanvas(c,px+(sx-px)*p*2,py+(362-py)*p*2,1-.28*p,Math.PI/2);drawMedicCanvas(c,sx-45,385,t*2.5,1,true);drawMedicCanvas(c,sx+45,385,t*2.5,-1,true);drawDeathCaption(c,'ĐƯA BỆNH NHÂN LÊN CÁNG');}
  else if(t<3.55){const p=dease((t-2.25)/1.3),sx=180+p*55,ph=t*3.4;drawAmbulanceCanvas(c,286,374,.95,t);drawStretcherCanvas(c,sx,394,Math.sin(ph*DTAU)*1.4,true);drawMedicCanvas(c,sx-45,385,ph,1,true);drawMedicCanvas(c,sx+45,385,ph,-1,true);drawDeathCaption(c,'KHẨN TRƯƠNG ĐƯA LÊN XE!');}
  else if(t<4.45){const p=dsmooth((t-3.55)/.9),sx=235+p*47,ph=t*2.6;drawAmbulanceCanvas(c,286,374,1,t);c.save();c.beginPath();c.rect(0,0,260,460);c.clip();drawStretcherCanvas(c,sx,394,0,true);drawMedicCanvas(c,sx-45,385,ph,1,true);c.restore();drawMedicCanvas(c,190,385,ph,1,true);drawDeathCaption(c,'ĐƯA VÀO XE CỨU THƯƠNG');}
  else if(t<6.05){const close=dsmooth((t-4.45)/.38),move=dease((t-4.95)/1.1),ax=286+move*155;drawAmbulanceCanvas(c,ax,374+Math.sin(t*25)*(move<.08?1.5:0),1-close,t);if(move>0){c.save();c.globalAlpha=1-move*.6;for(let i=0;i<4;i++)dCirc(c,ax-60-i*10,407+i%2*2,6+i*2,'#b8c0b6',null);c.restore()}drawDeathCaption(c,move<.05?'ĐÓNG CỬA...':'XE CỨU THƯƠNG RỜI HIỆN TRƯỜNG');}
  else {completeDeathSequence();return}
  deathSequenceRAF=requestAnimationFrame(deathFrame);
}
function startDeathSequence(){
  if(deathSequenceRAF)cancelAnimationFrame(deathSequenceRAF);
  // Vẽ lại battlefield mà KHÔNG có player rồi mới chụp snapshot. Nếu chụp trực tiếp
  // canvas cuối trận thì player đứng vẫn nằm trong bitmap nền và sẽ bị nhân đôi
  // khi chính renderer player được vẽ lại trên cáng.
  if (typeof render === 'function') render(true);
  deathSceneSnapshot=document.createElement('canvas');deathSceneSnapshot.width=canvas.width;deathSceneSnapshot.height=canvas.height;deathSceneSnapshot.getContext('2d').drawImage(canvas,0,0);
  // v1.19.3: lớp an toàn chống nhân đôi cho TẤT CẢ hero.
  // Không phụ thuộc renderer của doctor/nurse/sanitizer: xóa vùng sprite gốc khỏi snapshot
  // rồi dựng lại nền lưới tại đúng vùng đó. Nhân vật duy nhất sau đây là instance
  // do deathFrame điều khiển (ngã -> cáng -> xe).
  {
    const sc=deathSceneSnapshot.getContext('2d');
    const pad=12, rx=Math.max(0,Math.floor(player.x-pad)), ry=Math.max(0,Math.floor(player.y-pad));
    const rw=Math.min(canvas.width-rx,32+pad*2), rh=Math.min(canvas.height-ry,42+pad*2);
    sc.save();sc.beginPath();sc.rect(rx,ry,rw,rh);sc.clip();
    sc.fillStyle='#02120e';sc.fillRect(rx,ry,rw,rh);
    sc.strokeStyle='rgba(6, 78, 59, 0.35)';sc.lineWidth=1;
    for(let gx=Math.floor(rx/24)*24;gx<=rx+rw;gx+=24){sc.beginPath();sc.moveTo(gx,ry);sc.lineTo(gx,ry+rh);sc.stroke()}
    for(let gy=Math.floor(ry/24)*24;gy<=ry+rh;gy+=24){sc.beginPath();sc.moveTo(rx,gy);sc.lineTo(rx+rw,gy);sc.stroke()}
    sc.restore();
  }
  document.getElementById('death-sequence').classList.remove('hidden');deathSequenceStart=performance.now();deathSequenceRAF=requestAnimationFrame(deathFrame);
}
function completeDeathSequence(){if(deathSequenceRAF){cancelAnimationFrame(deathSequenceRAF);deathSequenceRAF=null}document.getElementById('death-sequence').classList.add('hidden');finishGame()}
function skipDeathSequence(){completeDeathSequence()}
window.addEventListener('keydown',e=>{const el=document.getElementById('death-sequence');if(el&&!el.classList.contains('hidden')&&(e.code==='Space'||e.code==='Enter')){e.preventDefault();skipDeathSequence()}});
window.addEventListener('load',showTutorialOnFirstVisit);
