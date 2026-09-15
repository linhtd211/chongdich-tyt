/* v1.18.2: Phần thưởng sau Boss. Sửa khiên/hồi máu và duy trì perk qua các chặng. */
let upgradeStacks={damage:0,fire:0,armor:0,ultimate:0,shield:0};

function refreshHpHud(){
  const maxHp=player.maxHp||3;
  hp=Math.max(0,Math.min(maxHp,hp));
  document.getElementById('hp-text').innerText='❤️'.repeat(hp)+'🖤'.repeat(Math.max(0,maxHp-hp));
}
function grantPostBossShield(){
  if(player.postBossShield){
    player.shieldTime=Math.max(player.shieldTime||0,480); // 8 giây ở 60 FPS
    const hud=document.getElementById('shield-hud');
    if(hud) hud.classList.remove('hidden');
    const sec=document.getElementById('shield-seconds');
    if(sec) sec.textContent=(player.shieldTime/60).toFixed(1);
  }
}
const UPGRADES=[
 {id:'damage',icon:'💉',name:'Kháng sinh tăng cường',rarity:'COMMON',max:3,desc:'+10% sát thương (tối đa 3)',apply(){player.damageBonus=(player.damageBonus||0)+.10}},
 {id:'fire',icon:'⚡',name:'Phản xạ nhanh',rarity:'COMMON',max:3,desc:'+8% tốc độ bắn (tối đa 3)',apply(){player.fireBonus=(player.fireBonus||0)+.08}},
 {id:'armor',icon:'🛡️',name:'Đồ bảo hộ',rarity:'RARE',max:2,desc:'+1 máu tối đa và hồi ngay 1 máu',apply(){player.maxHp=(player.maxHp||3)+1;hp=Math.min(player.maxHp,hp+1);refreshHpHud()}},
 {id:'ultimate',icon:'🧬',name:'Tế bào ghi nhớ',rarity:'RARE',max:2,desc:'Ultimate nạp nhanh hơn 10%',apply(){player.ultimateBonus=(player.ultimateBonus||0)+.10}},
 {id:'shield',icon:'🔬',name:'Màng bảo hộ',rarity:'EPIC',max:1,desc:'Sau MỖI Boss: nhận khiên 8 giây ở đầu chặng kế tiếp',apply(){player.postBossShield=true}}
];
function emergencyHealUpgrade(i){return {id:'heal'+i,icon:'❤️',name:'Hồi phục khẩn cấp',rarity:'COMMON',max:99,desc:'Hồi ngay 1 máu + 100 điểm',apply(){const before=hp;hp=Math.min(player.maxHp||3,hp+1);score+=100;refreshHpHud();document.getElementById('score-text').innerText=score; if(hp===before) score+=0}}}
function showBossReward(downed){
  bossRewardActive=true;isTouching=false;movementPointerId=null;heldKeys.clear();bullets=[];enemyBullets=[];
  document.getElementById('boss-hud').classList.add('hidden');
  document.getElementById('reward-boss-name').textContent=`${stageTheme()} · ${downed.name}`;
  const pool=UPGRADES.filter(u=>(upgradeStacks[u.id]||0)<u.max).sort(()=>Math.random()-.5).slice(0,3);
  while(pool.length<3)pool.push(emergencyHealUpgrade(pool.length));
  const box=document.getElementById('upgrade-options');box.innerHTML='';
  pool.forEach((u,i)=>{const b=document.createElement('button');b.className='text-left rounded-2xl border-2 border-sky-400 bg-slate-900/90 p-3 active:scale-95';b.innerHTML=`<strong class="block text-amber-200">${i+1}. ${u.icon} ${u.name}</strong><span class="text-[9px] text-fuchsia-300">${u.rarity}</span><span class="block text-xs text-slate-200">${u.desc}</span>`;b.onclick=()=>chooseUpgrade(u);box.appendChild(b)});
  document.getElementById('boss-reward-screen').classList.remove('hidden');updateUltimateHud();
}
function chooseUpgrade(u){
  if(!bossRewardActive)return;
  if(UPGRADES.includes(u))upgradeStacks[u.id]=(upgradeStacks[u.id]||0)+1;
  u.apply();
  // Perk Màng bảo hộ là perk vĩnh viễn trong ván: sau mọi Boss đều kích hoạt lại.
  grantPostBossShield();
  bossRewardActive=false;document.getElementById('boss-reward-screen').classList.add('hidden');
  wave++;enemySpeedX=Math.min(1.35,.48+wave*.065);document.getElementById('wave-text').innerText=wave;spawnWave();
  // spawnWave không được xóa khiên vừa nhận.
  refreshHpHud();lastFrameTime=0;accumulatedTime=0;updateUltimateHud();
  if(animationId===null&&!isPaused&&!isGameOver&&!bossIntroActive)animationId=requestAnimationFrame(gameLoop);
}
