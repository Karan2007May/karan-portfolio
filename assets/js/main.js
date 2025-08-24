// Mobile nav toggle
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Year in footer
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Radar chart using Chart.js
import("https://cdn.jsdelivr.net/npm/chart.js").then(({ Chart }) => {
  const ctx = document.getElementById("skillsRadar");
  if (!ctx) return;

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Python", "SQL", "Excel", "Power BI", "Tableau", "Data Storytelling"],
      datasets: [{
        label: "Skill Level",
        data: [9, 8, 8, 7, 7, 8],
        backgroundColor: "rgba(58,134,255,0.2)",
        borderColor: "#3a86ff",
        pointBackgroundColor: "#ff006e",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { color: "#ddd" },
          grid: { color: "#eee" },
          suggestedMin: 0,
          suggestedMax: 10
        }
      }
    }
  });
});
// Modern menu toggle
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    nav.classList.toggle("open");
  });
}
