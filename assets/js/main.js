// Modern menu toggle
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    nav.classList.toggle("open");
  });
}

// Year in footer
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Charts with Chart.js
import("https://cdn.jsdelivr.net/npm/chart.js").then(({ Chart }) => {
  // Skills Bar
  const barCtx = document.getElementById("skillsBar");
  if (barCtx) {
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
        scales: { y: { beginAtZero: true, max: 10 } }
      }
    });
  }
});
