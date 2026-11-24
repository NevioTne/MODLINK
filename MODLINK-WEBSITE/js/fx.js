// Motion: reveal, scroll spy, progress, spotlight, tilt, magnetic buttons, particles, cursor glow, counters, live clock.
(() => {
  const $ = q => document.querySelector(q), $$ = q => [...document.querySelectorAll(q)], I = window.MODLINK_I18N;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, touch = matchMedia("(pointer: coarse)").matches;
  document.documentElement.classList.add("js");
  const prog = $("#prog"), top = $(".top");
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.width = (h > 0 ? scrollY/h*100 : 0) + "%"; top.classList.toggle("scrolled", scrollY > 10); };
  addEventListener("scroll", onScroll, {passive: true}); onScroll();
  const links = $$('#nav a[href^="#"]'), spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("act", a.getAttribute("href") === "#" + e.target.id)); }), {rootMargin: "-45% 0px -50% 0px"});
  links.forEach(a => { const s = $(a.getAttribute("href")); if (s) spy.observe(s); });
  const SEL = ["h2","h3.sub","p","h4.sub2"].map(x => ".wrap > " + x).concat([".wrap > .panel",".card",".tile2",".tcard",".stat",".stext",".win",".gh",".scroll",".dir",".node",".doc",".gallery li",".clipx",".two",".devrow"]).map(x => "section:not(.hero) " + x).join(",");
  const io = reduce ? null : new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; io.unobserve(el); el.classList.add("in"); if (el.classList.contains("win")) el.classList.add("live");
    el.addEventListener("animationend", ev => { if (ev.target === el) el.classList.remove("rv","in"); });
  }), {threshold: .08, rootMargin: "0px 0px -6% 0px"});
  function prep() { if (reduce) return;
    $$(SEL).forEach(el => { if (el.dataset.rv) return; el.dataset.rv = 1; el.style.setProperty("--d", Math.min([...el.parentElement.children].indexOf(el), 6)*70 + "ms"); el.classList.add("rv"); io.observe(el); }); }
  // counters
  const sio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; sio.unobserve(e.target); const b = e.target.querySelector("b"), n = +b.dataset.n, t0 = performance.now();
    (function f(t) { const k = Math.min(1, (t-t0)/1300); b.textContent = Math.round(n*(1-Math.pow(1-k,3))); if (k < 1) requestAnimationFrame(f); })(t0); }), {threshold: .6});
  function stats(L) { $("#stats").innerHTML = L.stats.map(s => `<div class="stat"><b data-n="${s[0]}">${reduce ? s[0] : 0}</b><span>${s[1]}</span></div>`).join(""); if (!reduce) $$("#stats .stat").forEach(el => sio.observe(el)); }
  function marquee(L) { const n = [L.f2,L.f1,L.f3,L.f4,L.f9,L.f8,L.f6,L.f5,"MODLINK Studio","Block Studio"], one = n.map(x => `<span>${x}</span>`).join(""); $("#marq").innerHTML = one + one; }
  if (!reduce && !touch) {
    let tiltEl = null, magEl = null;
    document.addEventListener("pointermove", e => {
      const c = e.target.closest && e.target.closest(".card,.tile2,.win"), b = e.target.closest && e.target.closest(".btn,.tbtn");
      if (tiltEl && tiltEl !== c) { tiltEl.style.removeProperty("--rx"); tiltEl.style.removeProperty("--ry"); }
      if (c) { const r = c.getBoundingClientRect(), x = (e.clientX-r.left)/r.width, y = (e.clientY-r.top)/r.height; c.style.setProperty("--rx", ((.5-y)*7).toFixed(2)+"deg"); c.style.setProperty("--ry", ((x-.5)*7).toFixed(2)+"deg"); c.style.setProperty("--mx", x*r.width+"px"); c.style.setProperty("--my", y*r.height+"px"); }
      tiltEl = c;
      if (magEl && magEl !== b) { magEl.style.removeProperty("--bx"); magEl.style.removeProperty("--by"); }
      if (b) { const r = b.getBoundingClientRect(); b.style.setProperty("--bx", ((e.clientX-r.left-r.width/2)*.18).toFixed(1)+"px"); b.style.setProperty("--by", ((e.clientY-r.top-r.height/2)*.28).toFixed(1)+"px"); }
      magEl = b;
    });
    // cursor glow
    const g = $("#glow"); let gx = innerWidth/2, gy = innerHeight/2, tx = gx, ty = gy;
    addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; });
    (function f() { gx += (tx-gx)*.12; gy += (ty-gy)*.12; g.style.transform = `translate(${gx-210}px,${gy-210}px)`; requestAnimationFrame(f); })();
  } else $("#glow").style.display = "none";
  // particle network in the hero
  if (!reduce) {
    const cv = $("#fxc"), ctx = cv.getContext("2d"), hero = $(".hero"); let w = 0, h = 0, P = [], mx = -999, my = -999, run = true, col = "#2de3b5", n = 0;
    const size = () => { w = cv.width = hero.clientWidth; h = cv.height = hero.clientHeight; P = Array.from({length: Math.min(70, Math.floor(w*h/20000))}, () => ({x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4})); };
    size(); new ResizeObserver(size).observe(hero);
    hero.addEventListener("pointermove", e => { const r = hero.getBoundingClientRect(); mx = e.clientX-r.left; my = e.clientY-r.top; }); hero.addEventListener("pointerleave", () => { mx = my = -999; });
    new IntersectionObserver(e => { run = e[0].isIntersecting; }).observe(hero);
    (function frame() {
      if (run) { if (n++ % 90 === 0) col = getComputedStyle(document.documentElement).getPropertyValue("--ac").trim() || col; ctx.clearRect(0,0,w,h);
        P.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; const dx = p.x-mx, dy = p.y-my, d = Math.hypot(dx,dy); if (d < 120 && d > 0) { p.x += dx/d*1.4; p.y += dy/d*1.4; } });
        ctx.strokeStyle = col; ctx.fillStyle = col;
        for (let i = 0; i < P.length; i++) { for (let j = i+1; j < P.length; j++) { const d = Math.hypot(P[i].x-P[j].x, P[i].y-P[j].y); if (d < 130) { ctx.globalAlpha = (1-d/130)*.35; ctx.beginPath(); ctx.moveTo(P[i].x,P[i].y); ctx.lineTo(P[j].x,P[j].y); ctx.stroke(); } }
          ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(P[i].x,P[i].y,1.8,0,7); ctx.fill(); } }
      requestAnimationFrame(frame); })();
  } else $("#fxc").style.display = "none";
  setInterval(() => { const e = $("#vclock"); if (e) { const d = new Date(); e.textContent = [d.getHours(),d.getMinutes(),d.getSeconds()].map(v => String(v).padStart(2,"0")).join(":"); } }, 1000);
  document.addEventListener("ml:render", () => { const L = I[document.documentElement.lang] || I.en; marquee(L); stats(L); setTimeout(prep, 0); });
})();
