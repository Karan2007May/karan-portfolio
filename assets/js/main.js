/* ========= Basic helpers ========= */
const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => Array.from(c.querySelectorAll(q));

/* ========= Header: hamburger ========= */
const hamburger = $("#hamburger");
const nav = $("#site-nav");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  // close on nav click (mobile)
  $$("#site-nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
}

/* ========= Footer year ========= */
const y = $("#year");
if (y) y.textContent = new Date().getFullYear();

/* ========= Animated neon blobs background ========= */
(function bg() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height, dpr;

  const blobs = Array.from({ length: 18 }).map((_, i) => ({
    x: Math.random(), y: Math.random(),
    r: 120 + Math.random() * 160,
    vx: (Math.random() - .5) * 0.05,
    vy: (Math.random() - .5) * 0.05,
    hue: Math.random() * 360
  }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener("resize", resize);
  resize();

  function step() {
    ctx.clearRect(0, 0, width, height);
    blobs.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < 0 || b.x > 1) b.vx *= -1;
      if (b.y < 0 || b.y > 1) b.vy *= -1;

      const grad = ctx.createRadialGradient(b.x*width, b.y*height, 0, b.x*width, b.y*height, b.r);
      grad.addColorStop(0, `hsla(${b.hue}, 100%, 60%, .18)`);
      grad.addColorStop(1, `hsla(${(b.hue+180)%360}, 100%, 50%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x*width, b.y*height, b.r, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(step);
  }
  step();
})();

/* ========= Face: draw on me ========= */
(function face() {
  const c = document.getElementById("face-canvas");
  if (!c) return;
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;

  function base() {
    ctx.clearRect(0,0,W,H);
    // head
    ctx.fillStyle = "#0b1224";
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(W/2, H/2, 120, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // eyes
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(W/2-40, H/2-20, 16, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(W/2+40, H/2-20, 16, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#0ff";
    ctx.beginPath(); ctx.arc(W/2-40, H/2-20, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(W/2+40, H/2-20, 6, 0, Math.PI*2); ctx.fill();
    // smile
    ctx.strokeStyle = "#ff4bd8";
    ctx.lineWidth = 5; ctx.lineCap="round";
    ctx.beginPath();
    ctx.arc(W/2, H/2+20, 60, 0.15*Math.PI, 0.85*Math.PI);
    ctx.stroke();
  }
  base();

  let drawing = false, lastX=0, lastY=0;
  function pos(e){
    const rect = c.getBoundingClientRect();
    const x = (e.touches?e.touches[0].clientX:e.clientX) - rect.left;
    const y = (e.touches?e.touches[0].clientY:e.clientY) - rect.top;
    return {x: x * (c.width/rect.width), y: y * (c.height/rect.height)};
  }
  function start(e){ drawing=true; ({x:lastX,y:lastY}=pos(e)); }
  function move(e){
    if(!drawing) return;
    e.preventDefault();
    const {x,y} = pos(e);
    ctx.strokeStyle = "rgba(0,234,255,.9)";
    ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(x,y); ctx.stroke();
    lastX=x; lastY=y;
  }
  function end(){ drawing=false; }
  c.addEventListener("mousedown", start);
  c.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  c.addEventListener("touchstart", start, {passive:false});
  c.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("touchend", end);
  c.addEventListener("dblclick", base);
})();

/* ========= Projects preview loader ========= */
(async function projectsPreview(){
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  let projects = [];
  try {
    const res = await fetch("./assets/data/projects.json", {cache:"no-store"});
    projects = await res.json();
  } catch(e){
    console.warn("projects.json missing; using fallback.", e);
    projects = [];
  }

  const featured = projects.slice(0, 6);
  if (featured.length === 0){
    grid.innerHTML = `<p class="meta">No projects loaded yet. We’ll add them soon.</p>`;
    return;
  }

  grid.innerHTML = featured.map(p => {
    const thumb = p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title} thumbnail">`
      : `<div class="thumb" style="background:linear-gradient(135deg, #0ff33 0%, #7d5aff 100%);"></div>`;
    const tags = (p.tags||[]).slice(0,3).map(t=>`<span class="meta">#${t}</span>`).join(" ");
    return `
      <article class="card">
        <a href="${p.url || ('./projects/' + p.slug + '.html')}">${thumb}</a>
        <h3 class="title"><a href="${p.url || ('./projects/' + p.slug + '.html')}">${p.title}</a></h3>
        <div class="meta">${p.stack || ""}</div>
        <p class="meta">${p.summary || ""}</p>
        <div>${tags}</div>
      </article>
    `;
  }).join("");
})();

/* ========= Quiz ========= */
(function quiz(){
  const form = document.getElementById("quiz");
  if (!form) return;
  const result = document.getElementById("quiz-result");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const a1 = form.q1.value === "line";
    const a2 = form.q2.value === "having";
    const a3 = form.q3.value === "better";
    const score = [a1,a2,a3].filter(Boolean).length;
    const msgs = ["Keep going! 🌱","Nice! 🔥","Pro level! 🚀","Flawless! 🏆"];
    result.textContent = `${score}/3 — ${msgs[score] || msgs[0]}`;
  });
})();
