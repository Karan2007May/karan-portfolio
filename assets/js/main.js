// Util
const $ = (q, s=document) => s.querySelector(q);
const $$ = (q, s=document) => [...s.querySelectorAll(q)];

// Mobile nav
const hamburger = $('#hamburger');
const nav = $('#nav');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
  // Close on link click
  $$('#nav a').forEach(a => a.addEventListener('click', ()=> {
    nav.classList.remove('open'); hamburger.setAttribute('aria-expanded','false');
  }));
}

// Year in footer
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

// Theme toggle (soft – keeps neon)
const themeToggle = $('#themeToggle');
let dark = true;
if (themeToggle){
  themeToggle.addEventListener('click', ()=>{
    dark = !dark;
    document.documentElement.style.setProperty('--bg', dark ? '#0b0e12' : '#f6f8fb');
    document.documentElement.style.setProperty('--text', dark ? '#e9edf3' : '#0b0e12');
    document.documentElement.style.setProperty('--card', dark ? '#121720' : '#ffffff');
  });
}

// Particles background
(function particles(){
  const c = $('#particles');
  if (!c) return;
  const ctx = c.getContext('2d');
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let w, h, dots;

  function reset(){
    w = c.width = innerWidth * DPR;
    h = c.height = innerHeight * DPR;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
    dots = new Array(60).fill(0).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-.5)*.3*DPR,
      vy: (Math.random()-.5)*.3*DPR
    }));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.globalAlpha = .8;
    dots.forEach(d=>{
      d.x+=d.vx; d.y+=d.vy;
      if (d.x<0||d.x>w) d.vx*=-1;
      if (d.y<0||d.y>h) d.vy*=-1;
      ctx.fillStyle = ['#00e5ff33','#57f28733','#ff4dff33'][Math.floor(Math.random()*3)];
      ctx.beginPath(); ctx.arc(d.x,d.y,1.2*DPR,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  reset(); draw();
  addEventListener('resize', reset);
})();

// Wobble rings on mouse
(function wobble(){
  const wrap = document.querySelector('.avatar-wrap');
  if (!wrap) return;
  wrap.addEventListener('mousemove', (e)=>{
    const r = wrap.getBoundingClientRect();
    const dx = ((e.clientX - r.left)/r.width - .5)*8;
    const dy = ((e.clientY - r.top)/r.height - .5)*8;
    wrap.style.transform = `rotateX(${-dy}deg) rotateY(${dx}deg)`;
  });
  wrap.addEventListener('mouseleave', ()=> wrap.style.transform = 'none');
})();

// Doodle-face: playful drawing miniapp
(function doodle(){
  const cvs = $('#doodleCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;

  // base face
  function base(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#0e141c';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#0b0e12';
    ctx.fillRect(8,8,W-16,H-16);
    // face circle
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(W/2, H/2, 70, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur = 0;
    // default eyes
    ctx.fillStyle = '#57f287';
    ctx.beginPath(); ctx.arc(W/2-25, H/2-10, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(W/2+25, H/2-10, 6, 0, Math.PI*2); ctx.fill();
    // neutral mouth
    ctx.strokeStyle = '#ff4dff';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(W/2-25, H/2+20); ctx.lineTo(W/2+25, H/2+20); ctx.stroke();
  }
  base();

  // draw freehand
  let drawing=false, px=0, py=0;
  cvs.addEventListener('pointerdown', e=>{ drawing=true; [px,py]=[e.offsetX,e.offsetY]; });
  cvs.addEventListener('pointermove', e=>{
    if(!drawing) return;
    ctx.strokeStyle = ['#00e5ff','#57f287','#ff4dff'][Math.floor(Math.random()*3)];
    ctx.lineWidth = 2.5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(e.offsetX,e.offsetY); ctx.stroke();
    [px,py]=[e.offsetX,e.offsetY];
  });
  addEventListener('pointerup', ()=> drawing=false);
  $('#clearDoodle')?.addEventListener('click', base);
})();
