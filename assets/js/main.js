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
  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      if (nav.classList.contains("open")) toggle();
    })
  );
}

// -------- Footer Year --------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// -------- Background particles + network lines (site-wide) --------
const canvas = document.getElementById("bgCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height;
  const particles = [];
  const mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.r = Math.random() * 2.5 + 1;
      this.dx = (Math.random() - 0.5) * 0.35;
      this.dy = (Math.random() - 0.5) * 0.35;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
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
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = "#3a86ff66";
      ctx.fill();
    }
  }

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const alpha = 1 - dist / 140;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(120, 140, 160, ${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

// -------- Skills Charts --------
(function skillsInit() {
  if (typeof Chart === "undefined") return;

  const barCtx = document.getElementById("skillsBar");
  if (barCtx) {
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Python", "SQL", "Excel", "Power BI", "Tableau", "Data Storytelling"],
        datasets: [{
          data: [9, 8, 8, 7, 7, 8],
          backgroundColor: ["#3a86ff", "#8338ec", "#06d6a0", "#ff006e", "#ffbe0b", "#118ab2"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  const pieCtx = document.getElementById("skillsPie");
  if (pieCtx) {
    new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: ["Python", "SQL", "Excel", "Power BI", "Tableau", "Data Storytelling"],
        datasets: [{
          data: [30, 20, 15, 15, 10, 10],
          backgroundColor: ["#3a86ff", "#8338ec", "#06d6a0", "#ff006e", "#ffbe0b", "#118ab2"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
    });
  }
})();

const cards = document.querySelectorAll('.proj-card');

cards.forEach(card => {
  let floatingY = 0;
  let direction = 1;

  // Floating animation
  setInterval(() => {
    floatingY += direction * 0.15;
    if (floatingY > 6 || floatingY < -6) direction *= -1;
    if (!card.matches(':hover')) {
      card.style.transform = `translateY(${floatingY}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    }
  }, 20);

  // Mouse tilt & glow
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `translateY(${floatingY}px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    card.style.setProperty('--glow-x', `${percentX}%`);
    card.style.setProperty('--glow-y', `${percentY}%`);
    card.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(58,134,255,0.25), transparent 70%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `translateY(${floatingY}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
    card.style.background = `radial-gradient(circle at 50% 50%, rgba(58, 134, 255, 0.25), transparent 70%)`;
  });
});

// Device orientation tilt for mobile
window.addEventListener('deviceorientation', (event) => {
  const gamma = event.gamma || 0; // left-right tilt [-90,90]
  const beta = event.beta || 0;   // front-back tilt [-180,180]

  cards.forEach(card => {
    const rotateY = gamma * 0.3;
    const rotateX = beta * 0.2;

    const style = window.getComputedStyle(card);
    const matrix = new WebKitCSSMatrix(style.transform);
    const translateY = matrix.m42 || 0;

    card.style.transform = `translateY(${translateY}px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
});

