/* NHÁP HỘ VỆ TRÙM CUỐI: 4 hình dáng riêng, lớp màu và cử động riêng.
   drawGuardian(ctx, id, t, x, y, size) dùng đường cong Canvas; id 0..3.
   Sprite dự kiến 30–40 px trong sân 320 px, chi tiết lớn nằm ở mắt và viền dáng. */
(function(root){
  'use strict';
  const T=Math.PI*2,INK='#29263c';
  function fill(c,build,color,stroke=null,w=2){c.beginPath();build(c);if(color){c.fillStyle=color;c.fill()}if(stroke){c.lineWidth=w;c.strokeStyle=stroke;c.lineJoin='round';c.lineCap='round';c.stroke()}}
  function line(c,build,col,w=2){fill(c,build,null,col,w)}
  function oval(c,x,y,rx,ry,col,stroke=null,w=2){c.beginPath();c.ellipse(x,y,rx,ry,0,0,T);c.fillStyle=col;c.fill();if(stroke){c.lineWidth=w;c.strokeStyle=stroke;c.stroke()}}
  function grad(c,a,b,d,e,stops){const z=c.createLinearGradient(a,b,d,e);stops.forEach(([p,v])=>z.addColorStop(p,v));return z}
  function rad(c,x,y,r,stops){const z=c.createRadialGradient(x,y,1,x,y,r);stops.forEach(([p,v])=>z.addColorStop(p,v));return z}
  function pupil(c,x,y,s=1,gaze=0){oval(c,x,y,6*s,8*s,'#fff4d9',INK,1.5);oval(c,x+gaze*s,y+1*s,2.8*s,4.6*s,'#4a6378');oval(c,x+gaze*s-1,y-1*s,1.1*s,1.8*s,'#fff')}
  function sign(c,x=0,y=25){fill(c,p=>{p.moveTo(x,y-8);p.quadraticCurveTo(x+7,y-6,x+6,y+2);p.quadraticCurveTo(x+1,y+11,x,y+12);p.quadraticCurveTo(x-7,y+3,x-6,y-3);p.closePath()},'#8de1ce','#e5fcce',1.3);oval(c,x,y,2.3,3.6,'#fae6a5')}
  function claws(c,side,x,y,fold){c.save();c.scale(side,1);c.translate(x,y);c.rotate(fold);
    fill(c,p=>{p.moveTo(-4,-6);p.quadraticCurveTo(10,-20,28,-22);p.quadraticCurveTo(46,-15,42,6);
      p.quadraticCurveTo(27,-2,19,5);p.quadraticCurveTo(5,13,-4,-6);p.closePath()},
      grad(c,0,-22,42,16,[[0,'#67b5c6'],[.52,'#9b73bb'],[1,'#ed92a4']]),INK,2.8);
    fill(c,p=>{p.moveTo(23,6);p.quadraticCurveTo(35,9,46,25);p.quadraticCurveTo(29,26,19,14);p.closePath()},'#ed9fa5',INK,2.2);
    fill(c,p=>{p.moveTo(41,6);p.quadraticCurveTo(51,5,55,11);p.quadraticCurveTo(48,10,45,17);p.closePath()},'#fff0c6',INK,1.4);
    c.restore()}
  function armor(c,t){const pulse=Math.sin(t*2.3);
    // Rounded, weighted carapace and three crown arcs. No ragged freehand blob.
    for(const s of [-1,1]){c.save();c.scale(s,1);
      fill(c,p=>{p.moveTo(12,-27);p.quadraticCurveTo(24,-50,33,-55);
        p.quadraticCurveTo(35,-28,23,-19);p.closePath()},'#a572b5',INK,2.2);
      fill(c,p=>{p.moveTo(19,17);p.quadraticCurveTo(37,11,43,27);
        p.quadraticCurveTo(37,33,19,31);p.closePath()},'#865f9d',INK,2.3);
      c.restore()}
    fill(c,p=>{p.moveTo(-28,-34);p.quadraticCurveTo(0,-49,28,-34);p.bezierCurveTo(39,-24,39,5,26,23);
      p.quadraticCurveTo(0,47,-26,23);p.bezierCurveTo(-39,5,-39,-24,-28,-34);p.closePath()},
      grad(c,-33,-39,35,42,[[0,'#8bc4cb'],[.5,'#8154a8'],[1,'#51367f']]),INK,3.5);
    fill(c,p=>{p.moveTo(-24,-26);p.quadraticCurveTo(0,-40,24,-26);
      p.quadraticCurveTo(32,-6,19,12);p.quadraticCurveTo(0,22,-19,12);p.quadraticCurveTo(-33,-5,-24,-26);p.closePath()},
      '#72488d','#d0a7c5',2);
    // Two symmetrical folding plates move on their hinge.
    for(const s of [-1,1]){c.save();c.scale(s,1);c.translate(12,-16);c.rotate(s*pulse*.08);
      fill(c,p=>{p.moveTo(0,-10);p.quadraticCurveTo(21,-25,22,-2);
        p.quadraticCurveTo(19,12,8,22);p.quadraticCurveTo(2,9,0,-10);p.closePath()},
        grad(c,0,-15,23,23,[[0,'#e39ebc'],[.55,'#8bc8ca'],[1,'#5977a4']]),INK,2.4);
      line(c,p=>{p.moveTo(7,-8);p.quadraticCurveTo(16,-11,16,2)},'#e7f2d4',1.2);c.restore()}
    for(const s of [-1,1]){c.save();c.scale(s,1);pupil(c,12,-7,.78,Math.sin(t)*.7);
      line(c,p=>{p.moveTo(4,-16);p.quadraticCurveTo(14,-20,19,-15)},'#362e4d',2.5);c.restore()}
    line(c,p=>{p.moveTo(-7,14);p.quadraticCurveTo(0,18,7,14)},'#352542',1.8);
    sign(c,0,27);
  }
  function twins(c,t){
    // Two deliberate organic heads supported by one armored chest.
    for(const s of [-1,1]){c.save();c.scale(s,1);
      fill(c,p=>{p.moveTo(3,5);p.bezierCurveTo(14,-11,20,-19,39,-22);
        p.quadraticCurveTo(45,8,24,26);p.quadraticCurveTo(13,22,3,5);p.closePath()},'#657ab0',INK,2.5);
      const bob=Math.sin(t*2.7+s)*2.2;c.translate(20,bob-15);
      fill(c,p=>{p.moveTo(-25,-15);p.bezierCurveTo(-25,-37,15,-40,27,-19);
        p.bezierCurveTo(35,-1,18,18,0,18);p.bezierCurveTo(-21,15,-34,-1,-25,-15);p.closePath()},
        grad(c,-25,-30,30,20,[[0,s<0?'#9ebddd':'#d9a1ca'],[1,s<0?'#6474ae':'#965eaa']]),INK,2.8);
      fill(c,p=>{p.moveTo(-18,-15);p.quadraticCurveTo(1,-29,21,-14);
        p.quadraticCurveTo(12,-10,2,-14);p.quadraticCurveTo(-8,-10,-18,-15);p.closePath()},'#394260',null);
      pupil(c,-4,-6,.8,-s*Math.sin(t)*.6);pupil(c,15,-7,.75,-s*Math.sin(t)*.6);
      const gape=2+Math.sin(t*3.1+s*2)*2.5;
      fill(c,p=>{p.moveTo(-8,5);p.quadraticCurveTo(3,0,16,5);
        p.quadraticCurveTo(12,12+gape,3,13+gape);p.quadraticCurveTo(-5,10+gape,-8,5);p.closePath()},'#37263b','#efb4ad',1.5);
      for(let j=0;j<2;j++)fill(c,p=>{p.moveTo(-3+j*10,5);p.lineTo(2+j*10,5);p.lineTo(j*10,10);p.closePath()},'#fff5d5');
      c.restore()}
    // Middle clasp marks them as a protective pair, not two generic enemies.
    oval(c,0,22,23,14,'#503d75',INK,2.6);
    fill(c,p=>{p.moveTo(-17,20);p.quadraticCurveTo(0,7,17,20);p.quadraticCurveTo(8,29,0,33);
      p.quadraticCurveTo(-8,30,-17,20);p.closePath()},'#b78ebc','#e6c6c3',1.7);
    sign(c,0,21);
  }
  function halo(c,t){
    // Eight aligned shield petals orbit a hollow center; not a spiky ball.
    for(let i=0;i<8;i++){
      const a=i*T/8+t*.28;c.save();c.rotate(a);c.translate(0,-38);
      fill(c,p=>{p.moveTo(-10,8);p.quadraticCurveTo(-14,-10,0,-24);
        p.quadraticCurveTo(14,-10,10,8);p.closePath()},
        grad(c,0,-24,0,8,[[0,i%2?'#94d0d5':'#df98c2'],[1,'#705395']]),INK,2.3);
      line(c,p=>{p.moveTo(0,-15);p.lineTo(0,2)},'#d5f4e3',1.3);c.restore()}
    oval(c,0,0,26,26,'#2a324f','#b794bc',3.5);
    oval(c,0,0,17,19,rad(c,0,-3,24,[[0,'#a8ece1'],[.5,'#c476aa'],[1,'#623769']]),'#ffe2be',1.6);
    pupil(c,0,-3,1.3,Math.sin(t*1.4)*1.4);
    fill(c,p=>{p.moveTo(-8,12);p.quadraticCurveTo(0,18,8,12)},null,'#3d2d50',2);
    // Split lash protects the center on a slow alternating rhythm.
    for(const s of [-1,1]){c.save();c.scale(s,1);
      fill(c,p=>{p.moveTo(18,-22);p.quadraticCurveTo(41,-12,30,7);
        p.quadraticCurveTo(28,-7,16,-13);p.closePath()},'#88a8c8',INK,1.8);c.restore()}
    sign(c,0,27);
  }
  function crab(c,t){
    const flex=Math.sin(t*2.6)*.12;
    // Four jointed legs frame the central head; foreclaws are the wide silhouette.
    for(const s of [-1,1]){c.save();c.scale(s,1);
      line(c,p=>{p.moveTo(16,19);p.quadraticCurveTo(34,34,36,48)},'#ae83bd',6);
      line(c,p=>{p.moveTo(13,11);p.quadraticCurveTo(27,17,41,29)},'#c793bc',5);
      claws(c,1,26,-4,flex);c.restore()}
    fill(c,p=>{p.moveTo(-25,-31);p.bezierCurveTo(-4,-49,21,-46,29,-25);
      p.bezierCurveTo(43,8,30,33,1,39);p.bezierCurveTo(-31,38,-45,12,-33,-16);
      p.closePath()},grad(c,-36,-38,37,42,[[0,'#93c4d2'],[.5,'#b679b7'],[1,'#674f8e']]),INK,3.5);
    fill(c,p=>{p.moveTo(-23,-23);p.quadraticCurveTo(-5,-37,21,-23);
      p.quadraticCurveTo(13,-11,-6,-12);p.quadraticCurveTo(-19,-9,-23,-23);p.closePath()},'#d594bc','#ffd6d1',1.4);
    for(const s of [-1,1]){c.save();c.scale(s,1);
      pupil(c,13,-7,1,Math.sin(t)*.5);
      line(c,p=>{p.moveTo(4,-16);p.quadraticCurveTo(16,-19,22,-14)},'#3d314b',2.8);c.restore()}
    fill(c,p=>{p.moveTo(-16,13);p.quadraticCurveTo(0,7,16,13);
      p.quadraticCurveTo(10,26,0,25);p.quadraticCurveTo(-9,26,-16,13);p.closePath()},'#2a2235','#f4b4ad',1.8);
    for(let j=0;j<4;j++)fill(c,p=>{const x=-12+j*8;p.moveTo(x,12);p.lineTo(x+5,12);p.lineTo(x+2,19);p.closePath()},'#fff0ce');
    sign(c,0,29);
  }
  const art=[armor,twins,halo,crab];
  function drawGuardian(c,id,t,x,y,s=1){if(id<0||id>3)return;c.save();c.translate(x,y+Math.sin(t*2.4+id)*2.2);
    c.scale(s,s);art[id](c,t);c.restore()}
  root.drawGuardian=drawGuardian;
})(typeof window==='undefined'?globalThis:window);
