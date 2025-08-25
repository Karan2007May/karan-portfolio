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
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    if (nav.classList.contains("open")) toggle();
  }));
}

// -------- Footer Year --------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// -------- Background particles (site-wide) --------
const bgCanvas = document.getElementById("bgCanvas");
if (bgCanvas) {
  const ctx = bgCanvas.getContext("2d");
  let width, height;
  const particles = [];
  function resize(){
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();
  class Particle {
    constructor(){
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.r = Math.random() * 2 + 1;
      this.dx = (Math.random()-0.5)*0.3;
      this.dy = (Math.random()-0.5)*0.3;
    }
    move(){
      this.x+=this.dx; this.y+=this.dy;
      if(this.x<0||this.x>width) this.dx*=-1;
      if(this.y<0||this.y>height) this.dy*=-1;
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle="#9993";
      ctx.fill();
    }
  }
  for(let i=0;i<80;i++) particles.push(new Particle());
  function animate(){
    ctx.clearRect(0,0,width,height);
    particles.forEach(p=>{p.move();p.draw()});
    requestAnimationFrame(animate);
  }
  animate();
}

// -------- Hero network graph only --------
const hero = document.querySelector(".hero");
const netCanvas = document.getElementById("networkCanvas");
if (hero && netCanvas) {
  const ctx = netCanvas.getContext("2d");
  function resize(){
    netCanvas.width = hero.clientWidth;
    netCanvas.height = hero.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  let width = netCanvas.width, height = netCanvas.height;
  const nodes = Array.from({length:40},()=>({
    x:Math.random()*width,
    y:Math.random()*height,
    dx:(Math.random()-0.5)*0.6,
    dy:(Math.random()-0.5)*0.6,
    r:Math.random()*2+1.5
  }));
  const mouse={x:null,y:null};
  hero.addEventListener("mousemove",e=>{
    const rect=hero.getBoundingClientRect();
    mouse.x=e.clientX-rect.left;
    mouse.y=e.clientY-rect.top;
  });
  function animate(){
    ctx.clearRect(0,0,width,height);
    nodes.forEach(n=>{
      n.x+=n.dx; n.y+=n.dy;
      if(n.x<0||n.x>width) n.dx*=-1;
      if(n.y<0||n.y>height) n.dy*=-1;
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle="#3a86ffbb";
      ctx.fill();
    });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x;
        const dy=nodes[i].y-nodes[j].y;
        const dist=Math.hypot(dx,dy);
        if(dist<120){
          ctx.beginPath();
          ctx.strokeStyle=`rgba(100,120,160,${1-dist/120})`;
          ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.stroke();
        }
      }
    }
    if(mouse.x!==null){
      nodes.forEach(n=>{
        const dx=n.x-mouse.x, dy=n.y-mouse.y;
        const dist=Math.hypot(dx,dy);
        if(dist<150){
          ctx.beginPath();
          ctx.strokeStyle=`rgba(58,134,255,${1-dist/150})`;
          ctx.moveTo(n.x,n.y);
          ctx.lineTo(mouse.x,mouse.y);
          ctx.stroke();
        }
      });
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// -------- Skills Charts --------
(function skillsInit(){
  if (typeof Chart==="undefined") return;
  const barCtx=document.getElementById("skillsBar");
  if(barCtx){
    new Chart(barCtx,{type:"bar",data:{
      labels:["Python","SQL","Excel","Power BI","Tableau","Data Storytelling"],
      datasets:[{data:[9,8,8,7,7,8],backgroundColor:["#3a86ff","#8338ec","#06d6a0","#ff006e","#ffbe0b","#118ab2"]}]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});
  }
  const pieCtx=document.getElementById("skillsPie");
  if(pieCtx){
    new Chart(pieCtx,{type:"pie",data:{
      labels:["Python","SQL","Excel","Power BI","Tableau","Data Storytelling"],
      datasets:[{data:[30,20,15,15,10,10],backgroundColor:["#3a86ff","#8338ec","#06d6a0","#ff006e","#ffbe0b","#118ab2"]}]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom"}}}});
  }
})();
