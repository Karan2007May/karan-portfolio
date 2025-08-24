(async function(){
  // Background reuse (simple, lightweight color wash)
  const bg = document.getElementById("bg-canvas");
  if (bg) {
    const ctx = bg.getContext("2d");
    let W, H, dpr= Math.min(devicePixelRatio||1,2);
    function size(){ bg.width=(W=innerWidth)*dpr; bg.height=(H=innerHeight)*dpr; bg.style.width=W+"px"; bg.style.height=H+"px"; ctx.setTransform(dpr,0,0,dpr,0,0); }
    size(); addEventListener("resize", size);
    let t=0; (function loop(){
      t+=0.005; const g=ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,`hsla(${(t*200)%360},100%,60%,.10)`); g.addColorStop(1,`hsla(${(t*200+180)%360},100%,50%,.10)`);
      ctx.fillStyle="#080b14"; ctx.fillRect(0,0,W,H); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); requestAnimationFrame(loop);
    })();
  }

  const grid = document.getElementById("projects-grid");
  const search = document.getElementById("search");
  const sort = document.getElementById("sort");
  const tagRow = document.getElementById("tag-row");

  let projects = [];
  try{
    const r = await fetch("./assets/data/projects.json", {cache:"no-store"});
    projects = await r.json();
  }catch(e){ console.error("Failed to load projects.json", e); }

  // collect tags
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || []))).sort();
  tagRow.innerHTML = allTags.map(t => `<button class="chip" data-tag="${t}">#${t}</button>`).join("");

  let activeTag = null;

  function render(list){
    if (list.length === 0){
      grid.innerHTML = `<p class="meta">No projects match your filters.</p>`;
      return;
    }
    grid.innerHTML = list.map(p=>{
      const url = p.url || (`./projects/${p.slug}.html`);
      const thumb = p.thumbnail ? `<img src="${p.thumbnail}" alt="${p.title} thumbnail" loading="lazy">`
        : `<div class="thumb"></div>`;
      const tags = (p.tags||[]).slice(0,4).map(t=>`<span class="meta">#${t}</span>`).join(" ");
      return `
        <article class="card">
          <a href="${url}">${thumb}</a>
          <h3 class="title"><a href="${url}">${p.title}</a></h3>
          <div class="meta">${p.stack||""}</div>
          <p class="meta">${p.summary||""}</p>
          <div>${tags}</div>
        </article>
      `;
    }).join("");
  }

  function apply(){
    const q = (search.value||"").trim().toLowerCase();
    let list = projects.filter(p=>{
      const hay = (p.title+" "+(p.stack||"")+" "+(p.summary||"")+" "+(p.tags||[]).join(" ")).toLowerCase();
      const tagOK = !activeTag || (p.tags||[]).includes(activeTag);
      return hay.includes(q) && tagOK;
    });
    if (sort.value === "az") list.sort((a,b)=>a.title.localeCompare(b.title));
    if (sort.value === "za") list.sort((a,b)=>b.title.localeCompare(a.title));
    render(list);
  }

  tagRow.addEventListener("click", (e)=>{
    const b = e.target.closest("button[data-tag]");
    if (!b) return;
    const t = b.getAttribute("data-tag");
    activeTag = (activeTag === t) ? null : t;
    // toggle UI
    tagRow.querySelectorAll("button").forEach(x=>x.classList.remove("active"));
    if (activeTag) b.classList.add("active");
    apply();
  });
  search.addEventListener("input", apply);
  sort.addEventListener("change", apply);

  render(projects);
})();
