// -------- Modern Menu Toggle --------
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
if (menuToggle && nav) {
  const toggle = () => {
    const open = nav.classList.toggle("open");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };
  menuToggle.addEventListener("click", toggle);
  // Close menu when a nav link is clicked (mobile)
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    if (nav.classList.contains("open")) toggle();
  }));
}

// -------- Footer Year --------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// -------- Background particles + subtle network lines (interactive) --------
const canvas = document.getElementById("bgCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  const particles = [];
  const mouse = { x: null, y: null };

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Particle {
    constructor(){
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.r = Math.random() * 2.5 + 1;
      this.dx = (Math.random() - 0.5) * 0.35;
      this.dy = (Math.random() - 0.5) * 0.35;
      this.color = ["#3a86ff","#8338ec","#ff006e","#06d6a0"][Math.floor(Math.random()*4)];
    }
    update(){
      this.x += this.dx; this.y += this.dy;
      if (this.x < 0 || this.x > width) this.dx *= -1;
      if (this.y < 0 || this.y > height) this.dy *= -1;

      // gentle mouse repulsion
      if (mouse.x !== null) {
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          this.x -= dx / 28;
          this.y -= dy / 28;
        }
      }
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + "88";
      ctx.fill();
    }
  }

  // initialize particles
  for (let i = 0; i < 110; i++) particles.push(new Particle());

  function connectParticles(){
    for (let i = 0; i < particles.length; i++){
      for (let j = i + 1; j < particles.length; j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120){
          // keep lines subtle (gray, alpha by distance)
          const alpha = 1 - dist / 120;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(140, 150, 160, ${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate(){
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// -------- Interactive SVG shapes hover --------
document.querySelectorAll(".bg-shape").forEach(shape => {
  shape.addEventListener("mousemove", () => {
    shape.style.transform = "scale(1.05) rotate(10deg)";
  });
  shape.addEventListener("mouseleave", () => {
    shape.style.transform = "scale(1) rotate(0)";
  });
});

// -------- Skills Bar (Chart.js) --------
import("https://cdn.jsdelivr.net/npm/chart.js").then(({ Chart }) => {
  const barCtx = document.getElementById("skillsBar");
  if (!barCtx) return;

  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Python","SQL","Excel","Power BI","Tableau","Data Storytelling"],
      datasets: [{
        label: "Skill Level",
        data: [9,8,8,7,7,8],
        backgroundColor: ["#3a86ff","#8338ec","#06d6a0","#ff006e","#ffbe0b","#118ab2"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { intersect: false, mode: "index" }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, max: 10, grid: { color: "#eee" } }
      }
    }
  });

  // Ensure the chart container has height on mobile
  const wrap = barCtx.closest(".chart-wrap");
  if (wrap) wrap.style.minHeight = "260px";
}).catch(() => {/* silently ignore CDN errors */});
