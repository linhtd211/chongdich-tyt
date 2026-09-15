/* BẢN NHÁP CHÚA TỂ ĐẠI DỊCH – Canvas thuần, không dùng ảnh ngoài.
   drawFinalBossScene(ctx, time) nhận thời gian tính bằng giây; vẽ ở 320×460.
   Cánh, cánh tay, vuốt, hàm, đuôi và lõi dùng nhịp khác nhau để không cứng như sprite tĩnh. */
(function(root){
  'use strict';
  const TAU=Math.PI*2;
  const DARK='#251b38', EDGE='#372344', LIGHT='#ffc399';
  function oval(c,x,y,rx,ry,fill,stroke=null,lw=1.8){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=lw;c.strokeStyle=stroke;c.stroke()}}
  function curve(c,build,fill,stroke=null,lw=2){c.beginPath();build(c);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';c.stroke()}}
  function stroke(c,build,col,lw=2){curve(c,build,null,col,lw)}
  function gradient(c,x0,y0,x1,y1,pairs){let g=c.createLinearGradient(x0,y0,x1,y1);pairs.forEach(([p,v])=>g.addColorStop(p,v));return g}
  function radial(c,x,y,r,pairs){let g=c.createRadialGradient(x,y,1,x,y,r);pairs.forEach(([p,v])=>g.addColorStop(p,v));return g}
  function point(c,x,y,r,col){oval(c,x,y,r,r,col)}
  function horn(c,side){c.save();c.scale(side,1);
    curve(c,p=>{p.moveTo(25,-72);p.bezierCurveTo(42,-111,61,-103,72,-126);
      p.bezierCurveTo(65,-93,49,-77,35,-54);p.closePath()},
      gradient(c,25,-65,72,-126,[[0,'#4a3165'],[.52,'#a660b4'],[1,'#ffbc85']]),EDGE,2.5);
    stroke(c,p=>{p.moveTo(37,-83);p.bezierCurveTo(52,-99,63,-105,67,-115)},'#f1b8ce',2);
    c.restore()}
  function wing(c,side,t){const lift=Math.sin(t*2.8+side*.6)*.07;
    c.save();c.scale(side,1);c.translate(45,-21);c.rotate(lift);
    curve(c,p=>{p.moveTo(-10,-32);p.bezierCurveTo(34,-104,80,-92,101,-78);
      p.bezierCurveTo(86,-65,92,-47,109,-32);p.bezierCurveTo(93,-31,81,-23,85,-4);
      p.bezierCurveTo(53,13,13,19,-3,15);p.closePath()},
      gradient(c,-10,-40,103,10,[[0,'#466998'],[.5,'#8b6fbb'],[1,'#e66a8e']]),'#3c294d',3);
    curve(c,p=>{p.moveTo(3,-18);p.bezierCurveTo(33,-83,72,-82,92,-75);
      p.bezierCurveTo(79,-49,82,-38,96,-30);p.bezierCurveTo(69,-31,56,-22,69,-5);
      p.bezierCurveTo(43,8,13,11,4,7);p.closePath()},'#6879b6','#c9daf0',1.6);
    stroke(c,p=>{p.moveTo(0,-8);p.bezierCurveTo(34,-52,61,-70,91,-74);p.moveTo(18,1);
      p.bezierCurveTo(48,-27,76,-30,95,-30);p.moveTo(26,7);p.bezierCurveTo(60,0,72,-5,87,-10)},'#bce8ecaa',1.9);
    for(const [x,y] of [[35,-47],[60,-34],[73,-7]])point(c,x,y,2.2,'#f0c68d');
    c.restore()}
  function tail(c,side,t){c.save();c.scale(side,1);
    const sway=Math.sin(t*2.2+side)*11;
    stroke(c,p=>{p.moveTo(28,59);p.bezierCurveTo(53,91,103+sway,102,97+sway,133)},'#4f3270',15);
    stroke(c,p=>{p.moveTo(33,62);p.bezierCurveTo(61,92,100+sway,102,97+sway,132)},'#c45c92',6);
    curve(c,p=>{p.moveTo(97+sway,128);p.quadraticCurveTo(112+sway,132,119+sway,148);
      p.quadraticCurveTo(98+sway,146,93+sway,135);p.closePath()},'#f39f87',EDGE,2);
    c.restore()}
  function foot(c,side,t){c.save();c.scale(side,1);let swing=Math.sin(t*2.5+side*1.3)*2;
    curve(c,p=>{p.moveTo(19,55);p.bezierCurveTo(39,61,49,84,47,102+swing);
      p.bezierCurveTo(52,113,74,109,76,120);p.quadraticCurveTo(52,127,34,115);
      p.bezierCurveTo(23,99,13,81,13,65);p.closePath()},
      gradient(c,20,55,77,121,[[0,'#8b4ea2'],[.55,'#673b78'],[1,'#3c2951']]),EDGE,3);
    for(let i=0;i<3;i++){
      const x=51+i*10;curve(c,p=>{p.moveTo(x,115);p.quadraticCurveTo(x+4,125,x+8,128);
        p.quadraticCurveTo(x+4,132,x-1,124);p.closePath()},'#f4be9d',EDGE,1);
    }c.restore()}
  function arm(c,side,t,windup){c.save();c.scale(side,1);
    const ang=Math.sin(t*2+side*.9)*.09+(windup?.08:0);
    c.translate(54,-23);c.rotate(ang);
    curve(c,p=>{p.moveTo(-8,-9);p.bezierCurveTo(10,-25,27,-16,38,7);
      p.bezierCurveTo(57,25,49,44,31,54);p.bezierCurveTo(15,58,9,32,-5,26);
      p.closePath()},gradient(c,0,-20,58,50,[[0,'#b36ab8'],[.52,'#8650a3'],[1,'#563a81']]),EDGE,3);
    curve(c,p=>{p.moveTo(23,-12);p.bezierCurveTo(36,-3,43,13,37,20);
      p.bezierCurveTo(23,23,16,10,16,-6);p.closePath()},'#e185bc','#fbb7bd',1.4);
    oval(c,40,37,13,12,'#c269a5',EDGE,2);
    c.save();c.translate(43,41);c.rotate(Math.sin(t*3.1+side)*.12);
    // Two curved, jointed pincers and a smaller middle talon.
    curve(c,p=>{p.moveTo(-8,-2);p.bezierCurveTo(6,0,18,3,26,15);
      p.quadraticCurveTo(29,30,20,36);p.quadraticCurveTo(18,19,4,18);
      p.quadraticCurveTo(-12,17,-8,-2);p.closePath()},'#a964aa',EDGE,2.6);
    curve(c,p=>{p.moveTo(-3,13);p.quadraticCurveTo(8,27,6,42);p.quadraticCurveTo(20,35,27,24);
      p.quadraticCurveTo(22,49,5,52);p.quadraticCurveTo(-13,41,-3,13);p.closePath()},'#cf75aa',EDGE,2.6);
    curve(c,p=>{p.moveTo(20,35);p.quadraticCurveTo(24,42,22,49);p.lineTo(33,48);p.quadraticCurveTo(24,53,16,52);p.closePath()},'#fff0bf',EDGE,1);
    c.restore();c.restore()}
  function body(c,t,windup){
    const b=Math.sin(t*2.5)*2.5;
    // Uneven armor lobes, but balanced left-right mass.
    curve(c,p=>{p.moveTo(0,-63);p.bezierCurveTo(40,-72,70,-44,63,-1);
      p.bezierCurveTo(57,38,44,73,12,80);p.quadraticCurveTo(-23,87,-45,57);
      p.bezierCurveTo(-69,18,-72,-39,-35,-60);p.quadraticCurveTo(-16,-71,0,-63);p.closePath()},
      gradient(c,-60,-60,65,80,[[0,'#78a1bc'],[.42,'#7650a8'],[1,'#3c2b63']]),EDGE,4);
    // Warm muscle under translucent shell.
    curve(c,p=>{p.moveTo(-53,-22);p.bezierCurveTo(-30,-42,30,-41,52,-21);
      p.quadraticCurveTo(60,31,27,64);p.quadraticCurveTo(0,79,-27,59);
      p.bezierCurveTo(-61,27,-65,-1,-53,-22);p.closePath()},'#583778','#a775b9',2);
    for(const side of [-1,1]){c.save();c.scale(side,1);
      curve(c,p=>{p.moveTo(20,-47);p.quadraticCurveTo(52,-50,57,-18);
        p.quadraticCurveTo(51,-5,37,1);p.bezierCurveTo(24,-8,22,-23,20,-47);p.closePath()},'#87bac8','#e4e6d4',2);
      curve(c,p=>{p.moveTo(36,12);p.bezierCurveTo(54,7,57,27,48,48);
        p.quadraticCurveTo(38,62,21,61);p.bezierCurveTo(33,35,27,24,36,12);p.closePath()},'#8f50a2','#bd87b9',2);
      for(let j=0;j<3;j++)stroke(c,p=>{let y=j*14-3;p.moveTo(24,y);p.quadraticCurveTo(40,y+2,43,y+10)},'#edb298',3.2);
      c.restore()}
    // Exposure of a saturated living core (the later weak point).
    oval(c,0,17,31,42,'#281c3e','#ffad9c',3);
    let core=radial(c,0,15,39,[[0,'#ffe9b6'],[.3,windup?'#ff6f73':'#ff9d7c'],[.7,'#dc497e'],[1,'#722e76']]);
    oval(c,0,17,23+b*.1,33+b*.1,core,'#ffccaa',2);
    curve(c,p=>{p.moveTo(-6,-7);p.bezierCurveTo(7,4,2,9,12,18);
      p.bezierCurveTo(4,26,5,33,-1,40);p.bezierCurveTo(-12,30,-6,25,-15,17);p.closePath()},'#ffe2b1','#ee7c84',1.2);
    for(const side of [-1,1]){c.save();c.scale(side,1);
      for(let j=0;j<3;j++){const y=-6+j*18;
        stroke(c,p=>{p.moveTo(29,y);p.bezierCurveTo(16,y+1,21,y+11,15,y+13)},'#ffb8ae',3.3)}c.restore()}
    // Imprinted infection dots/striations, anchored to shell (no random allocations).
    for(const side of [-1,1]){c.save();c.scale(side,1);
      for(const [x,y,r] of [[48,-28,3],[55,-3,2.5],[47,29,3.5],[30,53,2]]){
        point(c,x,y,r,'#aee6a3');point(c,x-1,y-1,1,'#eff8b7')}
      c.restore()}
  }
  function face(c,t,windup){
    // Head is a smooth organic mask with brow and flexible lower jaw.
    curve(c,p=>{p.moveTo(-40,-61);p.bezierCurveTo(-48,-91,-21,-107,0,-98);
      p.bezierCurveTo(25,-110,49,-83,42,-52);p.quadraticCurveTo(36,-29,1,-22);
      p.bezierCurveTo(-29,-26,-45,-39,-40,-61);p.closePath()},
      gradient(c,-40,-102,45,-22,[[0,'#8a4c9e'],[.44,'#48305e'],[1,'#292139']]),EDGE,3.5);
    curve(c,p=>{p.moveTo(-30,-82);p.bezierCurveTo(-16,-105,14,-105,30,-86);
      p.quadraticCurveTo(18,-95,5,-89);p.quadraticCurveTo(-14,-97,-30,-82);p.closePath()},'#d58cc5','#f3c3c9',1.3);
    // Third, smaller infection eye lights during the windup.
    oval(c,0,-85,5,8,windup?'#ffeb93':'#e88293','#f5b89b',1.5);
    for(const side of [-1,1]){c.save();c.scale(side,1);
      curve(c,p=>{p.moveTo(8,-70);p.quadraticCurveTo(24,-80,35,-66);
        p.quadraticCurveTo(25,-57,9,-61);p.closePath()},'#1a2634','#bd769b',1.5);
      curve(c,p=>{p.moveTo(10,-68);p.quadraticCurveTo(23,-76,31,-66);
        p.quadraticCurveTo(22,-60,10,-65);p.closePath()},windup?'#ffdb82':'#8df4c3');
      oval(c,21,-67,2,3,windup?'#fc6678':'#325c57');
      curve(c,p=>{p.moveTo(31,-48);p.quadraticCurveTo(43,-45,49,-37);
        p.quadraticCurveTo(35,-35,29,-41);p.closePath()},'#f5c5aa',EDGE,1.4);
      c.restore()}
    const gape=7+Math.sin(t*4.5)*3+(windup?5:0);
    curve(c,p=>{p.moveTo(-24,-47);p.quadraticCurveTo(-1,-36,24,-47);
      p.quadraticCurveTo(18,-29+gape,0,-32+gape);
      p.quadraticCurveTo(-18,-27+gape,-24,-47);p.closePath()},'#190d27','#f3989f',2);
    for(let i=0;i<5;i++){
      let x=-19+i*9;curve(c,p=>{p.moveTo(x,-42);p.lineTo(x+5,-41);p.lineTo(x+2,-34);p.closePath()},'#fff1cf');
    }
    for(let i=0;i<4;i++){let x=-15+i*9;
      curve(c,p=>{p.moveTo(x,-31+gape);p.lineTo(x+5,-30+gape);p.lineTo(x+3,-37+gape);p.closePath()},'#fff0d0')}
  }
  function drawBoss(c,t,windup){
    c.save();c.translate(160,209+Math.sin(t*2.4)*2.8);
    const halo=radial(c,0,0,145,[[0,windup?'#f46a8477':'#a862c255'],[1,'#a862c200']]);
    c.fillStyle=halo;c.fillRect(-150,-145,300,290);
    for(const side of [-1,1])tail(c,side,t);
    for(const side of [-1,1])wing(c,side,t);
    for(const side of [-1,1])horn(c,side);
    for(const side of [-1,1])foot(c,side,t);
    body(c,t,windup);
    for(const side of [-1,1])arm(c,side,t,windup);
    face(c,t,windup);
    // Sparse orbiting spores indicate the boss's summon ability, without screen clutter.
    for(let i=0;i<5;i++){
      const a=i*TAU/5+t*.65,xx=Math.cos(a)*119,yy=Math.sin(a)*72-4;
      oval(c,xx,yy,3.2,3.2,'#ef9cd1','#fff1c4',.9);
      point(c,xx-1,yy-1,1,'#ffefd6');
    }
    c.restore();
  }
  function stage(c,t){
    c.fillStyle='#06171d';c.fillRect(0,0,320,460);
    c.lineWidth=.5;c.strokeStyle='#24534d88';for(let x=0;x<320;x+=24){c.beginPath();c.moveTo(x,0);c.lineTo(x,460);c.stroke()}
    for(let y=0;y<460;y+=24){c.beginPath();c.moveTo(0,y);c.lineTo(320,y);c.stroke()}
    c.fillStyle=radial(c,160,217,194,[[0,'#773a8055'],[1,'#773a8000']]);c.fillRect(0,31,320,352);
    c.textAlign='center';c.font='bold 12px sans-serif';c.fillStyle='#ffcfb3';c.fillText('WAVE 52  ·  CHÚA TỂ ĐẠI DỊCH',160,20);
    // Three-part health bar mirrors final-boss concept. Only show a hint of the special.
    const bar=['#e4a37f','#d16694','#9f60b2'];for(let i=0;i<3;i++){
      c.fillStyle=bar[i];c.fillRect(11+i*100,33,96,7)}
    const windup=(t%3.2)>2.07;
    if(windup){c.strokeStyle='#ffd18b99';c.lineWidth=2.5;c.setLineDash([6,5]);
      c.beginPath();c.arc(160,207,125,0,TAU);c.stroke();c.setLineDash([]);
      c.fillStyle='#fff1cf';c.font='bold 11px sans-serif';c.fillText('⚠ ĐANG TRIỆU HỒI KHIÊN KHUẨN',160,349)}
    drawBoss(c,t,windup);
    // In-game scale actor and familiar ultimate: enough room left to dodge.
    oval(c,89,400,10,11,'#f1d2b3','#345361',1.4);
    curve(c,p=>{p.moveTo(79,410);p.lineTo(97,410);p.lineTo(103,439);p.lineTo(75,439);p.closePath()},'#e8f9ee','#477789',1.5);
    c.fillStyle='#de5f75';c.fillRect(88,415,5,13);c.fillRect(84,419,13,5);
    oval(c,279,424,23,23,'#153544','#6fe0e0',2);c.fillStyle='#ecfdf8';c.font='bold 18px sans-serif';c.fillText('⚡',279,431);
    c.fillStyle='#a4c2be';c.font='10px sans-serif';c.fillText('BẢN PHÁC THẢO HOẠT ẢNH',160,454);
  }
  // Trong game: giữ cùng hình phác thảo nhưng thu về khoảng 130 px trên sân 320 px.
  root.drawFinalBossActor=function(c,t,x,y,windup=false){
    c.save();c.translate(x-160*.46,y-209*.46);c.scale(.46,.46);
    drawBoss(c,t,windup);c.restore();
  };
  root.drawFinalBossScene=stage;
})(typeof window==='undefined'?globalThis:window);
