/* GIỚI THIỆU BOSS.
   BOSS_FACTS cùng thứ tự với BOSS_TYPES trong 02-state.js.
   Chỉ mô tả tác nhân liên quan và bệnh có thể gây ra; boss là nhân vật tưởng tượng.
   Các nguồn dưới đây là CDC, WHO và NHGRI (NIH), truy cập trong màn giới thiệu. */
const BOSS_FACTS = [
  {
    agent: 'Thực khuẩn thể (bacteriophage)',
    fact: 'Thực khuẩn thể là virus nhiễm vào vi khuẩn, không phải tác nhân trực tiếp gây bệnh ở người. Con boss cơ giáp này hoàn toàn là hư cấu.',
    source: 'https://www.genome.gov/genetics-glossary/Virus'
  },
  {
    agent: 'Phế cầu khuẩn (Streptococcus pneumoniae)',
    fact: 'Phế cầu có thể gây viêm phổi, viêm tai giữa, viêm màng não hoặc nhiễm khuẩn huyết.',
    source: 'https://www.cdc.gov/pneumococcal/about/index.html'
  },
  {
    agent: 'Virus Ebola',
    fact: 'Bệnh do virus Ebola có thể gây sốt, đau mỏi, nôn, tiêu chảy và đôi khi xuất huyết; bệnh nặng có thể đe dọa tính mạng.',
    source: 'https://www.cdc.gov/ebola/about/index.html'
  },
  {
    agent: 'Virus cúm (influenza)',
    fact: 'Virus cúm gây bệnh đường hô hấp với sốt, ho, đau mỏi; một số trường hợp diễn biến nặng.',
    source: 'https://www.cdc.gov/flu/about/index.html'
  },
  {
    agent: 'Vi khuẩn E. coli',
    fact: 'Phần lớn E. coli vô hại; một số chủng gây tiêu chảy, nhiễm trùng tiết niệu hoặc bệnh nặng khác.',
    source: 'https://www.cdc.gov/ecoli/about/index.html'
  },
  {
    agent: 'Virus dại',
    fact: 'Virus dại tấn công hệ thần kinh trung ương. Bệnh có thể truyền qua vết cắn, cào của động vật mắc dại và rất nguy hiểm khi đã xuất hiện triệu chứng.',
    source: 'https://www.cdc.gov/rabies/about/index.html'
  },
  {
    agent: 'Virus SARS-CoV-2',
    fact: 'SARS-CoV-2 gây COVID-19, chủ yếu ảnh hưởng đường hô hấp; trường hợp nặng có thể dẫn đến suy hô hấp và biến chứng toàn thân.',
    source: 'https://www.who.int/news-room/fact-sheets/detail/coronavirus-disease-(covid-19)'
  },
  {
    agent: 'Xoắn khuẩn giang mai (Treponema pallidum)',
    fact: 'Giang mai có thể gây vết loét và phát ban. Nếu không được điều trị, bệnh có thể ảnh hưởng thần kinh và các cơ quan khác.',
    source: 'https://www.cdc.gov/syphilis/about/index.html'
  },
  {
    agent: 'Vi khuẩn dịch hạch (Yersinia pestis)',
    fact: 'Yersinia pestis gây dịch hạch, một bệnh nhiễm khuẩn nghiêm trọng; người có thể nhiễm qua bọ chét mang mầm bệnh từ loài gặm nhấm.',
    source: 'https://www.cdc.gov/plague/about/index.html'
  },
  {
    agent: 'Vi khuẩn than (Bacillus anthracis)',
    fact: 'Bệnh than qua da thường gây tổn thương có tâm màu đen; thể hít phải bào tử có thể rất nặng.',
    source: 'https://www.cdc.gov/anthrax/about/index.html'
  },
  {
    agent: 'Virus HIV',
    fact: 'HIV làm suy yếu hệ miễn dịch; nếu không điều trị, nhiễm HIV có thể tiến triển đến AIDS và tăng nguy cơ nhiễm trùng khác.',
    source: 'https://www.who.int/news-room/fact-sheets/detail/hiv-aids'
  },
  {
    agent: 'Ký sinh trùng sốt rét Plasmodium falciparum',
    fact: 'P. falciparum gây sốt rét, thường có sốt, đau đầu, rét run; bệnh có thể nhanh chóng trở nặng nếu không điều trị.',
    source: 'https://www.who.int/news-room/fact-sheets/detail/malaria'
  }
];

let bossIntroActive = false;
function showBossIntro(type, waveNumber) {
  const index = BOSS_TYPES.indexOf(type);
  const info = BOSS_FACTS[index];
  if (!info) return;
  bossIntroActive = true;
  isTouching = false;
  const screen = document.getElementById('boss-intro-screen');
  document.getElementById('boss-intro-wave').textContent = `WAVE ${waveNumber} · BOSS`;
  document.getElementById('boss-intro-name').textContent = type.name;
  document.getElementById('boss-intro-agent').textContent = info.agent;
  document.getElementById('boss-intro-fact').textContent = info.fact;
  document.getElementById('boss-intro-source').href = info.source;
  noticeTicks = 0;
  document.getElementById('wave-notice').classList.add('hidden');
  screen.classList.remove('hidden');
}
function closeBossIntro() {
  if (!bossIntroActive) return;
  bossIntroActive = false;
  document.getElementById('boss-intro-screen').classList.add('hidden');
  lastFrameTime = 0;
  accumulatedTime = 0;
  if (animationId === null && !isPaused && !isGameOver) animationId = requestAnimationFrame(gameLoop);
}
