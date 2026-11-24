(() => {
  const I = window.MODLINK_I18N, $ = (s) => document.querySelector(s), T = () => I[document.documentElement.lang] || I.en;
  let tab = 0, timers = [], modI = null, mod = 1, dg = 2;
  const bits = "101010";
  function build() {
    const L = T();
    $("#devTasks").innerHTML = L.cm_dev_tasks.map(x => `<li>${x}</li>`).join("");
    $("#pcTasks").innerHTML = L.cm_pc_tasks.map(x => `<li>${x}</li>`).join("");
    $("#upList").innerHTML = L.cm_up.map(x => `<li>${x}</li>`).join("");
    $("#downList").innerHTML = L.cm_down.map(x => `<li>${x}</li>`).join("");
    $("#tabs").innerHTML = L.topics.map((p, i) => `<button role="tab" id="tab${i}" class="chip" aria-selected="${i === tab}" aria-controls="tabPanel" tabindex="${i === tab ? 0 : -1}" data-i="${i}">${p.name}</button>`).join("");
    const p = L.topics[tab], k = ["trig", "from", "to", "info", "next", "see"];
    $("#tabPanel").setAttribute("aria-labelledby", "tab" + tab);
    $("#tabPanel").innerHTML = `<p class="badge ${p.dev ? "dev" : ""}">${p.st}</p><dl>${k.map((x, j) => `<div><dt>${L.cm_q[j]}</dt><dd>${p[x]}</dd></div>`).join("")}</dl>`;
    $("#modBtns").innerHTML = L.mod.map((m, i) => `<button class="chip" aria-pressed="${i === mod}" data-m="${i}">${m[0]}</button>`).join("");
    $("#modDesc").textContent = L.mod[mod][1];
    $("#bits").className = "bits s" + mod;
    $("#bits").innerHTML = [...bits].map(b => `<span class="${mod === 1 && b === "1" ? "on" : ""}">${mod === 1 ? b : ""}</span>`).join("");
    $("#modId").textContent = mod === 1 ? "ID 42" : "ID –";
    $("#diagBtns").innerHTML = L.diag.map((m, i) => `<button class="chip" aria-pressed="${i === dg}" data-d="${i}">${m[0]}</button>`).join("");
    $("#diagDesc").textContent = L.diag[dg][1];
    $("#specs").innerHTML = L.specs.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>`).join("");
    $("#relList").innerHTML = L.rel.map(r => `<li class="card"><h3>${r[0]}</h3><p>${r[1]}</p></li>`).join("");
  }
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-i],[data-m],[data-d]"); if (!t) return;
    if (t.dataset.i) tab = +t.dataset.i; if (t.dataset.m) { mod = +t.dataset.m; clearInterval(modI); } if (t.dataset.d) dg = +t.dataset.d;
    build(); const f = document.querySelector(t.dataset.i ? "#tab" + tab : t.dataset.m ? `[data-m="${mod}"]` : `[data-d="${dg}"]`); if (f) f.focus();
  });
  document.addEventListener("keydown", e => {
    if (!e.target.matches('[role="tab"]') || !/Arrow(Left|Right)/.test(e.key)) return;
    const n = T().topics.length; tab = (tab + (e.key === "ArrowRight" ? 1 : n - 1)) % n; build(); $("#tab" + tab).focus();
  });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) modI = setInterval(() => { mod = (mod + 1) % 3; build(); }, 3500);
  document.addEventListener("ml:render", build);
})();
