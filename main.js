/* =====================================================================
   MAIN.JS — edit the three config blocks. Everything below them is plumbing.
   ===================================================================== */

/* 1) SITE SETTINGS: name, email, nav, social links, logo (images/logo.png) */
const SITE = {
  name: "Davis Kwame Baako", email: "hello@yourdomain.com",
  nav: [["Portfolio","index.html#portfolio"],["Results","index.html#results"],["Services","index.html#services"],
        ["About","index.html#about"],["Resume","resume.html"],["Contact","index.html#contact"]],
  social: { linkedin:"https://linkedin.com/in/yourname", instagram:"https://instagram.com/you", x:"https://x.com/you",
            tiktok:"https://tiktok.com/@you", youtube:"https://youtube.com/@you" }
};

/* 2) FEATURED PROJECTS: paste a YouTube / Vimeo / TikTok / Instagram link; the video plays on the page.
      cat = filter button name. metrics = tags under the video. */
const PROJECTS = [
  { cat:"Social", title:"Product launch Reel", link:"https://www.youtube.com/watch?v=dQw4w9WgXcQ", metrics:["1.2M views","8.4% engagement"] },
  { cat:"Social", title:"TikTok brand challenge", link:"https://www.tiktok.com/@scout2015/video/6718335390845095173", metrics:["600K views","12K shares"] },
  { cat:"Paid", title:"Instagram carousel ad", link:"https://www.instagram.com/p/CxxxxxxXXXX/", metrics:["90K reach","4.1% CTR"] }
];

/* 3) RESULTS for websites you built. series = monthly organic visits, oldest → newest */
const SITES = [
  { name:"Example Bakery", url:"https://example.com", img:"images/sites/site1.jpg", desc:"Local SEO rebuild and GA4 tracking.",
    kpis:[["+212%","Organic traffic"],["#1","Top keyword"],["3.4x","Leads"]], series:[300,320,410,520,640,780,950] },
  { name:"Example Studio", url:"https://example.org", img:"images/sites/site2.jpg", desc:"Content SEO and conversion tracking.",
    kpis:[["+140%","Organic traffic"],["-35%","Bounce rate"],["2.1x","Signups"]], series:[800,850,900,1100,1350,1600,1900] }
];

/* ====================== plumbing: edit only if you know JS ====================== */
const $ = (s, el=document) => el.querySelector(s);
const ic = {linkedin:"linkedin-in",instagram:"instagram",x:"x-twitter",tiktok:"tiktok",youtube:"youtube"};

/* Header (clickable logo + mobile menu) and silhouette footer, shared by every page */
$("#site-header").innerHTML = `<header class="site"><div class="wrap">
 <a class="brand" href="index.html" aria-label="${SITE.name} home"><img src="images/logo.png" alt="" onerror="this.remove()">${SITE.name}</a>
 <button id="burger" aria-label="Menu" aria-expanded="false">☰</button>
 <nav id="nav" aria-label="Main"><ul>${SITE.nav.map(n=>`<li><a href="${n[1]}">${n[0]}</a></li>`).join("")}</ul></nav></div></header>`;
$("#burger").onclick = e => e.currentTarget.setAttribute("aria-expanded", $("#nav").classList.toggle("open"));
$("#nav").onclick = e => e.target.tagName==="A" && $("#nav").classList.remove("open");
$("#site-footer").innerHTML = `<footer class="sil"><svg viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80V50h60V30h40v20h50V10h50v40h60V25h40v25h70V5h60v45h50V28h60v22h70V15h50v35h60V32h50v18h70V8h60v42h60V30h50v20h60V18h40v32h80v30z"/></svg>
 <div class="wrap"><div class="social">${Object.entries(SITE.social).map(([k,v])=>`<a href="${v}" target="_blank" rel="noopener" aria-label="${k}"><i class="fa-brands fa-${ic[k]}"></i></a>`).join("")}</div>
 <span>&copy; ${new Date().getFullYear()} ${SITE.name} · <a href="mailto:${SITE.email}">${SITE.email}</a></span></div></footer>`;

/* Link → embeddable player */
function embed(u){ let m;
  if(m=u.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/)) return {src:`https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1`,thumb:`https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`};
  if(m=u.match(/vimeo\.com\/(\d+)/)) return {src:`https://player.vimeo.com/video/${m[1]}?autoplay=1`};
  if(m=u.match(/tiktok\.com\/.*video\/(\d+)/)) return {src:`https://www.tiktok.com/embed/v2/${m[1]}`};
  if(m=u.match(/instagram\.com\/(p|reel)\/([\w-]+)/)) return {src:`https://www.instagram.com/${m[1]}/${m[2]}/embed`};
  return {src:u};
}
/* Featured projects with filters; each video loads only when played (fast page) */
const pg = $("#projects");
if (pg) {
  PROJECTS.forEach(p => { const e = embed(p.link), c = document.createElement("article");
    c.className="card static"; c.dataset.cat=p.cat;
    c.innerHTML = `<div class="vid" ${e.thumb?`style="background-image:url(${e.thumb})"`:""}><button aria-label="Play ${p.title}">▶</button></div>
     <div class="body"><span class="tag">${p.cat}</span> ${p.metrics.map(m=>`<span class="tag">${m}</span>`).join(" ")}<h3>${p.title}</h3><a class="link" href="${p.link}" target="_blank" rel="noopener">View original post</a></div>`;
    $("button",c).onclick = () => $(".vid",c).innerHTML = `<iframe src="${e.src}" allow="autoplay;encrypted-media;fullscreen" allowfullscreen loading="lazy" title="${p.title}"></iframe>`;
    pg.append(c); });
  const f = $("#filters"), cats = ["All",...new Set(PROJECTS.map(p=>p.cat))];
  f.innerHTML = cats.map((c,i)=>`<button aria-pressed="${!i}" data-f="${c}">${c}</button>`).join("");
  f.onclick = e => { const b = e.target.closest("button"); if(!b) return;
    f.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed", x===b));
    pg.querySelectorAll(".card").forEach(c => c.hidden = b.dataset.f!=="All" && c.dataset.cat!==b.dataset.f); };
}
/* Results cards with auto-drawn growth chart */
function spark(d){ const mx=Math.max(...d), w=300, h=60, p=d.map((v,i)=>`${i*w/(d.length-1)},${h-v/mx*(h-6)}`).join(" ");
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Traffic growth"><polygon points="0,${h} ${p} ${w},${h}" fill="var(--accent-soft)"/><polyline points="${p}" fill="none" stroke="var(--accent)" stroke-width="3"/></svg>`; }
const sg = $("#sites");
if (sg) SITES.forEach(s => sg.insertAdjacentHTML("beforeend", `<article class="card static"><div class="shot" style="background-image:url(${s.img})" role="img" aria-label="${s.name} screenshot"></div>
  <div class="body"><h3>${s.name}</h3><p class="muted">${s.desc}</p><div class="kpis">${s.kpis.map(k=>`<div><strong>${k[0]}</strong><span>${k[1]}</span></div>`).join("")}</div>
  ${spark(s.series)}<span class="muted" style="font-size:.8rem">Monthly organic visits</span><br><a class="link" href="${s.url}" target="_blank" rel="noopener">Visit site</a></div></article>`));

/* Broken images: brand logos fall back to the brand name, other images just hide */
document.addEventListener("error", e => { const i = e.target; if (i.tagName!=="IMG") return;
  if (i.closest(".logos")) i.replaceWith(Object.assign(document.createElement("span"),{textContent:i.alt})); else i.style.visibility="hidden"; }, true);