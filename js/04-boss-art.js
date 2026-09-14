/* 12 DÁNG BOSS CANVAS – BẢN NHÁP 2 ĐÃ ĐƯỢC DUYỆT.
   Thứ tự 0–11 khớp BOSS_TYPES trong 02-state.js. Mỗi vị trí của draw[]
   dựng một đường viền riêng; enrich[] thêm mắt, giáp, vũ khí đặc trưng.
   drawDistinctBossArt() thu nhỏ về hitbox 92×86 của game; phần chuyển động
   ở bossMotion() chỉ vẽ theo nhịp, không tạo vật thể/ảnh mới mỗi khung hình.
   Sửa mặt và hình dáng tại draw[]/enrich[], nhịp chuyển động tại bossMotion(). */
(function () {
  'use strict';
  const g = ctx;
  const OUT = '#142531';
function path(points,fill,stroke=OUT,lw=3){g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.lineWidth=lw;g.strokeStyle=stroke;g.lineJoin='round';g.stroke()}}
function oval(x,y,rx,ry,fill,stroke=OUT,lw=3){g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=fill;g.fill();if(stroke){g.lineWidth=lw;g.strokeStyle=stroke;g.stroke()}}
function line(coords,color=OUT,w=3){g.beginPath();coords.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokeStyle=color;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.stroke()}
function curve(cmd,fill,stroke=OUT,lw=3){g.beginPath();cmd(g);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.lineJoin='round';g.lineCap='round';g.stroke()}}
function eye(x,y,scale=1,iris='#203448'){oval(x,y,6*scale,7*scale,'#fff',OUT,2);oval(x+1.2*scale,y+.7*scale,2.6*scale,3.4*scale,iris,null);oval(x+.2*scale,y-1*scale,1*scale,1*scale,'#fff',null)}
function shine(x,y,rx,ry){oval(x,y,rx,ry,'#ffffff7d',null)}
function dot(x,y,r,col){oval(x,y,r,r,col,null)}
function mouth(x,y,r=7){curve(p=>{p.moveTo(x-r,y);p.quadraticCurveTo(x,y+r,x+r,y)},null,OUT,2)}
function dashedArc(x,y,r,color){g.beginPath();g.arc(x,y,r,-2.3,.3);g.strokeStyle=color;g.lineWidth=2;g.setLineDash([3,4]);g.stroke();g.setLineDash([])}

const draw=[
  // 01 A tall phage mech: hard geometry, mechanical legs, faceted head.
  ()=>{for(const s of [-1,1]){line([[s*10,17],[s*35,28],[s*44,47]],OUT,4);line([[s*12,22],[s*31,39],[s*35,53]],OUT,3);line([[s*9,27],[s*23,50],[s*15,60]],OUT,3)}
    path([[-11,12],[11,12],[7,36],[-7,36]],'#6b87a4');line([[0,35],[0,55]],OUT,3);path([[-25,-49],[0,-61],[25,-49],[31,-17],[0,8],[-31,-17]],'#3dc4e2');path([[-25,-49],[0,-61],[0,8],[-31,-17]],'#7fe5f4','#32677a',2);path([[0,-61],[25,-49],[31,-17],[0,8]],'#329cbf','#32677a',2);path([[-19,-25],[-5,-29],[-2,-15],[-18,-13]],'#9bffad',OUT,2);path([[19,-25],[5,-29],[2,-15],[18,-13]],'#9bffad',OUT,2);dot(0,-44,5,'#c9ff91');oval(-13,31,4,3,'#a3ffcf',null);oval(13,31,4,3,'#a3ffcf',null)},
  // 02 Multiple unattached distinct orbs; no continuous worm.
  ()=>{[[1,-44,16],[-27,-32,18],[30,-25,16],[-31,6,22],[24,8,23],[-12,33,22],[8,-12,25]].forEach(([x,y,r],j)=>{oval(x,y,r,r*(j%3===0?.92:1),'#805bc4');oval(x-4,y-4,r*.7,r*.7,j%2?'#a989ed':'#bb9cf0',null);dot(x+7,y+8,3,'#674eab')});eye(-17,31,.7);eye(-5,31,.7);eye(7,-14,.75);eye(20,-13,.75);mouth(1,40,5);shine(-37,-3,4,2)},
  // 03 Single long curved filament ending in flame/rattles.
  ()=>{curve(p=>{p.moveTo(-40,30);p.bezierCurveTo(-59,-28,-9,-56,26,-38);p.bezierCurveTo(63,-18,44,26,14,14);p.bezierCurveTo(4,9,11,-3,23,-4);p.bezierCurveTo(41,-3,41,-31,19,-26);p.bezierCurveTo(-2,-23,-27,-29,-29,17);p.closePath()},'#f6934b');curve(p=>{p.moveTo(-44,27);p.bezierCurveTo(-50,-14,-10,-47,18,-36);p.bezierCurveTo(41,-33,49,-10,33,4)},null,'#ffd38c',4);for(let i=0;i<5;i++)path([[-29+i*12,-25-(i%2)*9],[-25+i*12,-36-(i%2)*10],[-19+i*12,-28-(i%2)*8]],'#f8cf52');eye(27,-18,.9,'#bd3240');path([[11,12],[24,14],[17,23]],'#fff');line([[-38,31],[-47,45],[-40,53]],'#d16339',4);dot(7,-34,3,'#ef513c')},
  // 04 Pear-shape runny nose with long clear droplets.
  ()=>{curve(p=>{p.moveTo(0,-58);p.bezierCurveTo(-8,-39,-41,-17,-38,15);p.bezierCurveTo(-35,48,-9,54,8,37);p.bezierCurveTo(35,63,50,34,35,3);p.bezierCurveTo(27,-15,12,-35,0,-58);p.closePath()},'#f38dbd');curve(p=>{p.moveTo(-29,35);p.bezierCurveTo(-30,61,-24,69,-17,58);p.lineTo(-13,40);p.moveTo(21,40);p.bezierCurveTo(19,64,30,66,29,46)},null,'#ed62a9',5);eye(-12,9);eye(12,9);path([[-7,21],[2,19],[9,22],[0,26]],'#e3589d');shine(-15,-17,7,14);dot(32,55,4,'#9be9ec')},
  // 05 Wide top heavy puddle with drips, big bubbles.
  ()=>{curve(p=>{p.moveTo(-39,-14);p.bezierCurveTo(-37,-46,12,-46,37,-19);p.bezierCurveTo(53,-1,44,23,30,28);p.lineTo(28,52);p.quadraticCurveTo(22,62,16,49);p.lineTo(12,31);p.lineTo(-7,33);p.lineTo(-12,57);p.quadraticCurveTo(-22,65,-23,51);p.lineTo(-26,27);p.bezierCurveTo(-50,18,-49,-2,-39,-14);p.closePath()},'#bc8be5');oval(-25,-42,12,12,'#d5a3f3');oval(2,-49,9,9,'#d5a3f3');oval(24,-42,13,13,'#c396ea');eye(-12,-5);eye(15,-6);curve(p=>{p.moveTo(-8,15);p.quadraticCurveTo(3,6,15,16)},null,OUT,2);for(const [x,y] of [[-32,17],[27,13],[5,-31]])dot(x,y,4,'#9163c5');shine(-29,-17,7,3)},
  // 06 Angular wolf head, jaw and two side claws.
  ()=>{path([[-34,-12],[-42,-54],[-16,-36],[-3,-46],[16,-38],[40,-57],[35,-9]],'#7cc44e');path([[-36,-15],[-12,-32],[20,-28],[42,-8],[26,16],[3,10],[-12,28],[-42,14]],'#b1e265');path([[6,10],[31,4],[40,-7],[41,26],[8,34],[-6,25]],'#4b9c58');path([[13,16],[34,17],[31,26],[12,26]],'#182735');for(const x of [15,23,31])path([[x,17],[x+4,17],[x+2,24]],'#f9f5df',OUT,1);eye(-22,-8,.88,'#ed6648');eye(2,-9,.88,'#ed6648');line([[-33,-20],[-14,-15]],OUT,3);line([[-1,-20],[13,-15]],OUT,3);path([[-29,29],[-43,42],[-24,37]],'#7cc44e');path([[14,32],[30,47],[34,33]],'#7cc44e')},
  // 07 Crown-shaped shield and broken core, asymmetric radii.
  ()=>{path([[-43,2],[-45,-38],[-23,-24],[-8,-58],[5,-27],[26,-49],[30,-23],[48,-32],[42,17],[19,37],[-23,37]],'#ffb365');path([[-38,4],[-32,-25],[-13,-8],[-5,-40],[4,-12],[24,-32],[20,1],[38,-18],[36,13],[14,29],[-18,29]],'#ea7848');path([[-12,-6],[4,-17],[17,-4],[10,16],[-8,16],[-20,6]],'#f6d18a',OUT,2);line([[6,-16],[-1,-3],[8,4],[2,14]],'#b53b44',3);eye(-29,5,.65,'#912f41');eye(27,5,.65,'#912f41');dot(-43,25,5,'#ffdd8b');dot(39,31,4,'#ffdd8b')},
  // 08 Skinny upright drill, exposed orange spiral.
  ()=>{path([[-10,-53],[0,-64],[10,-53],[23,-38],[17,17],[0,50],[-17,17],[-23,-38]],'#f7ad57');curve(p=>{p.moveTo(-16,-42);p.bezierCurveTo(35,-25,24,-12,-14,-22);p.bezierCurveTo(-38,-28,-18,-6,16,-8);p.bezierCurveTo(35,-6,24,11,-15,8);p.bezierCurveTo(-30,8,-17,27,9,22)},null,'#b9503a',7);path([[-17,16],[0,50],[17,16],[10,44],[0,62],[-10,44]],'#da7242');eye(-6,-42,.56);eye(7,-40,.56);line([[0,62],[0,70]],'#f6ce72',3)},
  // 09 Rat profile with looped tail, buboes and one huge ear.
  ()=>{curve(p=>{p.moveTo(-33,18);p.bezierCurveTo(-65,-4,-69,24,-48,42);p.bezierCurveTo(-18,72,2,22,-18,8)},null,'#779d54',7);oval(-2,7,36,28,'#9dd472');oval(9,-29,20,24,'#7fbd70');oval(9,-29,12,17,'#d29fc0',OUT,1.5);path([[12,0],[38,-13],[49,-1],[33,11]],'#b7e884');eye(31,-3,.62,'#d63354');dot(48,-2,3,'#e5849e');for(const [x,y,r] of [[-26,8,6],[-14,22,5],[-5,-7,4],[7,15,6]])oval(x,y,r,r,'#384950');path([[-25,28],[-35,42],[-22,38]],'#7bb567');path([[9,30],[21,43],[23,30]],'#7bb567')},
  // 10 Low boar with high plated back and horizontally protruding tusk.
  ()=>{path([[-47,-8],[-32,-42],[-21,-29],[-7,-49],[7,-29],[22,-43],[41,-12],[43,17],[19,29],[-28,24]],'#b4a85a');path([[-40,-8],[-22,-27],[4,-32],[27,-22],[38,10],[-5,21],[-33,10]],'#e8c85d');line([[-24,-24],[-14,16]],'#84734d',3);line([[1,-30],[6,20]],'#84734d',3);oval(29,9,21,18,'#e7c67a');path([[35,17],[48,30],[38,27],[31,17]],'#fff2d1');path([[14,16],[10,31],[22,22]],'#fff2d1');eye(25,-5,.64,'#d84642');oval(43,8,4,3,'#83574b',null);for(const x of [-30,-11,12])path([[x,20],[x-4,37],[x+5,37],[x+8,21]],'#886a4a');for(const [x,y] of [[-20,-17],[1,-21]])dot(x,y,5,'#3c4a45')},
  // 11 Hooded ghost cloak with asymmetrical torn hem and hollow mask.
  ()=>{curve(p=>{p.moveTo(0,-55);p.bezierCurveTo(30,-54,39,-31,35,-11);p.lineTo(34,25);p.lineTo(49,39);p.lineTo(22,34);p.lineTo(12,54);p.lineTo(-3,37);p.lineTo(-21,48);p.lineTo(-20,28);p.lineTo(-44,36);p.lineTo(-32,10);p.bezierCurveTo(-47,-24,-21,-53,0,-55);p.closePath()},'#79d5ed');curve(p=>{p.moveTo(-30,13);p.bezierCurveTo(-23,-18,-18,-40,0,-45);p.bezierCurveTo(24,-43,29,-22,26,11);p.lineTo(17,25);p.lineTo(-16,25);p.closePath()},'#405f77');path([[-19,-8],[-4,-14],[-7,-1],[-18,3]],'#d5ffff',null);path([[19,-8],[4,-14],[7,-1],[18,3]],'#d5ffff',null);path([[0,5],[-6,17],[6,17]],'#b4fbfa',null);line([[-14,34],[-9,44]],'#caf9fa',2);dashedArc(5,-10,52,'#a9eff4')},
  // 12 Wide manta/jellyfish queen with long separate crimson tentacles.
  ()=>{for(const [x,dx] of [[-29,-12],[-16,8],[0,-4],[17,11],[30,-7]])curve(p=>{p.moveTo(x,16);p.bezierCurveTo(x+dx,37,x-dx,47,x+dx,67)},null,'#b84969',5);curve(p=>{p.moveTo(-50,-11);p.quadraticCurveTo(-30,-4,-24,-27);p.quadraticCurveTo(-4,-50,19,-30);p.quadraticCurveTo(29,-10,51,-14);p.quadraticCurveTo(36,23,0,26);p.quadraticCurveTo(-36,27,-50,-11);p.closePath()},'#f291a6');path([[-17,-28],[-15,-49],[-3,-35],[2,-56],[12,-32],[21,-43],[17,-23]],'#e0a854');oval(0,-8,19,14,'#c65377');eye(-9,-8,.72);eye(9,-8,.72);mouth(0,4,5);for(const x of [-41,-31,31,41])dot(x,-7,3,'#ffe0ae');shine(-30,-18,6,2)}
];

// Second-pass sketch: boss-specific menace and anatomy layered over unique silhouettes.
function glare(x,y,s=1,col='#e5ffbd'){
  path([[x-9*s,y-6*s],[x+8*s,y-2*s],[x+5*s,y+5*s],[x-7*s,y+3*s]],col,OUT,2);
  path([[x-2*s,y-4*s],[x+3*s,y-3*s],[x+2*s,y+4*s],[x-1*s,y+3*s]],'#a93544',null);
}
function fangs(x,y,w=24,h=12){
  curve(p=>{p.moveTo(x-w/2,y);p.quadraticCurveTo(x,y+5,x+w/2,y);p.lineTo(x+w/2-4,y+h);p.quadraticCurveTo(x,y+h+5,x-w/2+4,y+h);p.closePath()},'#26313b',OUT,2);
  for(let k=0;k<4;k++)path([[x-w/2+4+k*(w-7)/4,y+1],[x-w/2+8+k*(w-7)/4,y+1],[x-w/2+6+k*(w-7)/4,y+6]],'#fff1cf',null);
}
function slash(x,y,x2,y2,c='#fbe0a0',w=3){line([[x,y],[x2,y2]],c,w)}
const enrich=[
  ()=>{ // phage: separate artillery silhouette + luminous core
    path([[-21,15],[-43,1],[-52,9],[-50,20],[-24,27]],'#637e99');path([[21,15],[43,1],[52,9],[50,20],[24,27]],'#637e99');
    for(const s of [-1,1]){oval(s*51,14,6,10,'#243b53');dot(s*55,14,3,'#c5fff4');line([[s*22,18],[s*41,18]],'#8bf7e5',2)}
    path([[-17,-25],[-4,-31],[-5,-18],[-18,-14]],'#bbffce',OUT,2);path([[17,-25],[4,-31],[5,-18],[18,-14]],'#bbffce',OUT,2);
    path([[-8,-6],[0,4],[8,-6],[2,3],[0,18],[-2,3]],'#155b79');dot(0,12,4,'#f0ffb0');slash(-21,-41,-7,-47,'#d9fff1',2)
  },
  ()=>{ // swarm: heads have mouths; larger captain in front
    [[-30,-32],[-28,6],[26,13],[-5,34]].forEach(([x,y],k)=>{fangs(x,y+4,k===3?14:16,7)});
    oval(8,-13,25,25,'#a989ed');path([[-11,-30],[5,-25],[0,-19],[-11,-21]],'#e8dcff',OUT,1.5);
    glare(0,-18,.8);glare(18,-18,.8);fangs(9,-4,26,11);
    for(const [x,y] of [[-42,-45],[31,-41],[44,-8],[-21,44],[35,35]])path([[x-4,y],[x,y-11],[x+5,y+1]],'#e0b4ff')
  },
  ()=>{ // filament: fire crest, segmented ridges and long toothed jaw
    for(let i=0;i<7;i++){const x=-37+i*9,y=-4-i*5;slash(x,y,x+6,y+8,'#ad543d',3)}
    for(let i=0;i<4;i++)path([[11+i*8,-34+(i%2)*4],[17+i*8,-49+(i%2)*5],[20+i*8,-30]],'#ffa957');
    path([[12,0],[41,-5],[36,10],[12,18]],'#cf543e');fangs(24,6,23,9);glare(27,-19,.7,'#ffe6a1');
    for(const [x,y] of [[-53,-1],[-61,-18],[-56,-35]])dot(x,y,4,'#d39d53')
  },
  ()=>{ // mucus: antennae, malicious face, corrosive droplets
    for(const [x,y,dx,dy] of [[-25,-35,-13,-11],[24,-29,13,-11],[-39,5,-15,2],[39,5,14,3]]){line([[x,y],[x+dx,y+dy]],'#c95a9b',4);dot(x+dx,y+dy,5,'#f79ccc')}
    glare(-13,10,1,'#fef6ed');glare(13,10,1,'#fef6ed');fangs(0,19,19,10);
    curve(p=>{p.moveTo(-16,-11);p.bezierCurveTo(-4,-28,9,-33,21,-17)},null,'#ffcae5',3);for(const [x,y] of [[-29,30],[32,33]])dot(x,y,4,'#a5f0eb')
  },
  ()=>{ // toxic bubbling mass, claws in puddle
    for(const [x,y,r] of [[-27,-43,10],[0,-53,8],[25,-42,10]]){oval(x,y,r,r,'#d6b5f1');dot(x-3,y-3,2,'#f1ddfa')}
    glare(-13,-7,1);glare(14,-7,1);fangs(0,12,31,16);
    for(const x of [-35,-4,35])path([[x-4,25],[x-9,46],[x+1,39],[x+5,52],[x+10,26]],'#a977d3');
    for(const [x,y] of [[-50,10],[50,-6],[32,-55]])dot(x,y,3,'#c8ec75')
  },
  ()=>{ // wolf eyes, muzzle, mouth and sharper paws
    path([[-32,-18],[-11,-10],[-18,-1],[-31,-8]],'#324436');path([[-3,-20],[17,-15],[7,-5],[-1,-7]],'#324436');
    glare(-23,-7,.8,'#ffb86d');glare(2,-8,.8,'#ffb86d');
    fangs(24,18,32,12);path([[35,0],[50,-5],[42,4]],'#325b42');
    for(const x of [-42,-32,-20,20,32,45])path([[x,36],[x+3,24],[x+8,36]],'#f5eed7');slash(-10,6,-27,17,'#dd9f7e',2)
  },
  ()=>{ // crowned pandemic shell, broken mask, satellites
    for(const [x,y] of [[-52,-31],[55,-28],[-56,33],[53,41]]){dot(x,y,8,'#f2a463');dot(x,y,3,'#912e47')}
    line([[-38,-14],[-53,-28]],'#eb8761',3);line([[38,-13],[53,-28]],'#eb8761',3);
    path([[-15,-10],[0,-21],[16,-9],[16,12],[0,24],[-16,13]],'#e9deb9');
    glare(-8,-3,.65,'#bb344d');glare(8,-3,.65,'#bb344d');
    line([[0,-20],[-5,-6],[2,3],[-3,15]],'#a33345',3);for(const x of [-10,-4,3,9])line([[x,12],[x,18]],'#672c39',2)
  },
  ()=>{ // drill blades, red sensor, spark burst
    path([[-20,-31],[-42,-17],[-35,-2],[-20,-11]],'#dc7048');path([[20,-30],[43,-12],[34,2],[18,-9]],'#dc7048');
    path([[-14,-47],[-2,-51],[0,-43],[-11,-39]],'#253441');path([[14,-47],[2,-51],[0,-43],[11,-39]],'#253441');
    slash(-12,-43,-3,-42,'#ff7371',3);slash(12,-43,3,-42,'#ff7371',3);
    for(const x of [-25,-8,21]){line([[x,50],[x-4,60]],'#ffd978',2);line([[x,49],[x+7,55]],'#ffd978',2)}
  },
  ()=>{ // rat with swollen plague pustules and muzzle
    for(const [x,y] of [[-24,7],[-13,19],[4,15]]){dot(x,y,6,'#374e50');dot(x-2,y-2,2,'#a9ee72')}
    glare(32,-4,.6,'#f9e099');path([[28,9],[47,5],[39,20],[24,14]],'#4c5d44');fangs(35,11,15,8);
    for(const x of [-31,-7,15])path([[x,28],[x-4,46],[x+2,46],[x+7,31]],'#779f58');
    for(const x of [-47,-40,43])dot(x,-30,4,'#8cd779');curve(p=>{p.moveTo(-43,-25);p.quadraticCurveTo(-50,-42,-41,-48)},null,'#89ca6c',2)
  },
  ()=>{ // armored boar with giant horn, darker cracks and plated back
    path([[-41,-15],[-36,-35],[-17,-40],[2,-37],[20,-29],[30,-17]],'#738460');
    for(const [x,y] of [[-33,-32],[-7,-44],[16,-37]])path([[x-8,y+8],[x,y-17],[x+9,y+9]],'#e5cf82');
    path([[29,15],[50,27],[46,12]],'#f8efcf');glare(26,-4,.7,'#ffe66e');
    for(const [x,y] of [[-20,-19],[0,-24],[10,-5]]){dot(x,y,4,'#304047');dot(x-1,y-1,1.5,'#fff18a')}
    slash(-35,4,-20,12,'#65483e',3);slash(-10,-8,-2,1,'#65483e',3);
    for(const x of [-30,-9,12])path([[x-4,35],[x+1,39],[x+6,35]],'#f7edcf')
  },
  ()=>{ // spectral black face, glowing eyes, long claw arms
    curve(p=>{p.moveTo(-29,-4);p.bezierCurveTo(-33,-33,-10,-48,6,-45);p.bezierCurveTo(27,-38,29,-19,25,7);p.lineTo(9,23);p.lineTo(-19,23);p.closePath()},'#263445');
    path([[-21,-11],[-5,-18],[-9,-4],[-21,0]],'#b5ffff',null);path([[19,-11],[3,-18],[8,-4],[20,0]],'#b5ffff',null);
    path([[-4,8],[0,4],[5,8],[1,16]],'#ecfafa',null);
    path([[-26,12],[-48,30],[-37,34],[-56,50],[-33,39],[-18,32]],'#74c6d7');
    path([[27,10],[47,25],[38,34],[55,50],[31,38],[18,29]],'#74c6d7');
    for(const [x,y] of [[-51,-44],[42,-51],[53,5]])path([[x,y],[x+4,y-10],[x+7,y]],'#b3fcff',null)
  },
  ()=>{ // parasite queen: mask, fang crest, summoning lesser larvae
    for(const [x,y] of [[-53,-25],[52,-30],[-49,29],[52,26]]){oval(x,y,8,5,'#e696a5');dot(x+2,y,2,'#792b46')}
    path([[-25,-27],[-20,-58],[-8,-39],[0,-64],[9,-39],[20,-56],[26,-25]],'#ffc487');
    oval(0,-8,22,17,'#a34463');glare(-10,-10,.65,'#ffe5bf');glare(10,-10,.65,'#ffe5bf');fangs(0,2,19,10);
    for(let i=0;i<4;i++){const x=-29+i*20;line([[x,25],[x+(i%2?12:-12),47],[x+(i%2?-4:5),63]],'#9d3b61',5)}
  }
];


// Mỗi boss một dấu chuyển động gắn với dáng/chiêu; chỉ vẽ path trên Canvas.
function bossMotion(n, t, windup, behind) {
  const s = Math.sin(t * 3), c = Math.cos(t * 2.5);
  if (behind) {
    switch (n) {
      case 0: // Động cơ sau lưng cơ giáp phập phồng.
        for (const x of [-18, 18]) path([[x-3,34],[x+3,34],[x+2+s*2,44+Math.abs(s)*10],[x,41+Math.abs(s)*14]], '#fbab59', null);
        break;
      case 1: // Đốm khuẩn con tách khỏi bầy rồi nhập lại.
        oval(-48+5*s, -18+4*c, 5, 5, '#ba9afa', null);
        oval(48-4*c, 16+4*s, 4, 4, '#d9bdff', null);
        break;
      case 2: // Tro nóng bay khỏi bờm lửa.
        for (let j=0;j<3;j++) dot(-45+j*14+4*s, -35-(j%2)*13-3*c, 2+j%2, '#fdd48b');
        break;
      case 3: // Giọt dịch kéo xuống rồi co lên.
        dot(-30+3*s, 55+6*c, 3, '#a3edf2'); dot(32-3*s, 48-7*c, 4, '#f5abd5');
        break;
      case 4: // Bọt độc nổi khỏi khối nhầy.
        for (let j=0;j<3;j++) dot(-25+j*23+3*s, -54-(j%2)*7-5*c, 2+j%2, '#d9c2fa');
        break;
      case 5: // Vệt vuốt quét quanh hàm sói.
        line([[-48,28+s*4],[-42,22+s*4]], '#b9f475', 2);
        break;
      case 6: // Các lõi virus xoay quanh vương miện.
        for (let j=0;j<3;j++) { const a=t*1.8+j*2.09; dot(Math.cos(a)*58,Math.sin(a)*43,3.5,'#fbc479'); }
        break;
      case 7: // Tia lửa mũi khoan.
        for (let j=0;j<3;j++) line([[-17+j*16+3*s,53],[-22+j*19+4*s,58+4*c]], '#ffe29c', 2);
        break;
      case 8: // Đuôi chuột quẫy ngoài đường viền.
        line([[-46,20],[-54+5*s,32+5*c]], '#9ccd6a', 3);
        break;
      case 9: // Hạt đất văng khi thú giậm chân.
        dot(-47+4*s,36+2*c,2,'#f2cb77'); dot(41+4*c,39+2*s,2,'#e1c16b');
        break;
      case 10: // Mảnh áo choàng/linh khí trôi khỏi thân.
        for (const x of [-48,44]) line([[x+3*s,25],[x+6*s,34+5*c]], '#aaf9ff', 2);
        break;
      case 11: // Xúc tu ngoài quẫy theo nhịp khác nhau.
        line([[-38,24],[-53+6*s,43],[-47+7*c,58]], '#a43d63', 4);
        line([[36,21],[51-7*c,44],[48-6*s,60]], '#a43d63', 4);
        break;
    }
    return;
  }
  switch (n) {
    case 0: // Pháo chớp khi nạp.
      if (windup) for (const x of [-54,54]) dot(x,14,4+Math.abs(s)*2,'#d9fff1');
      break;
    case 1: // Đầu đàn phồng lên.
      oval(43, -28+2*s, 2+Math.abs(s),2+Math.abs(s),'#ecd6ff',null);
      break;
    case 2: // Lửa bật ra từ miệng.
      if (windup) path([[36,7],[53+5*s,2],[44,12]],'#fff1a8',null);
      break;
    case 3: // Hắt hơi bật thành hai đốm cảnh báo.
      if (windup) for (const x of [-19,19]) dot(x,35+4*c,3.5,'#bff9f7');
      break;
    case 4: // Bọt giật theo nhịp nạp độc.
      if (windup) dot(0,-53-5*c,6,'#f2e2ff');
      break;
    case 5: // Mắt sói phát sáng và vuốt co duỗi.
      if (windup) line([[41,27],[51+4*s,18]],'#fff1c2',3);
      break;
    case 6: // Lõi mặt nạ loé sáng.
      if (windup) dot(0,2,2+Math.abs(s)*2,'#ffffff');
      break;
    case 7: // Mũi khoan phát sáng ở đầu.
      if (windup) dot(0,59,3+Math.abs(s)*2,'#ffe7aa');
      break;
    case 8: // Hạch nhấp nháy trước lúc nổ.
      if (windup) for (const x of [-24,4]) dot(x,12,3,'#dcf59a');
      break;
    case 9: // Giáp nứt sáng lúc giậm.
      if (windup) line([[-10,-5],[2,6]],'#ffec9b',3);
      break;
    case 10: // Mắt linh hồn sáng khi nạp.
      if (windup) for (const x of [-14,14]) dot(x,-7,4,'#ffffff');
      break;
    case 11: // Huyết quang ở đầu tua.
      if (windup) for (const x of [-45,0,45]) dot(x,57,3+Math.abs(s)*2,'#ffdcdf');
      break;
  }
}

function drawDistinctBossArt(b, t, blink) {
  const n = b.variant;
  if (!Number.isInteger(n) || n < 0 || n >= draw.length) return;
  g.save();
  // Dáng chính nằm trong hitbox cũ; những gai, tia sáng và xúc tu là trang trí.
  // Cỡ .93 giúp mắt và vũ khí đọc được trên điện thoại mà không đổi va chạm.
  g.scale(.93, .93);
  // Chuyển động thân riêng từng boss, giới hạn góc nhỏ để không gây lệch hitbox.
  const pitch = Math.sin(t * 2.6);
  if (n === 7) g.rotate(pitch * .055);                 // Mũi khoan xoay.
  else if (n === 10) g.rotate(pitch * .04);             // Oán linh lắc áo.
  else if (n === 9) g.rotate((b.windup ? -.08 : 0) + pitch * .018); // Thú lấy đà.
  else if (n === 2) g.rotate(pitch * .035);             // Sợi Ebola trườn.
  bossMotion(n, t, b.windup > 0, true);
  draw[n]();
  enrich[n]();
  bossMotion(n, t, b.windup > 0, false);
  g.restore();
}
window.drawDistinctBossArt = drawDistinctBossArt;
})();
