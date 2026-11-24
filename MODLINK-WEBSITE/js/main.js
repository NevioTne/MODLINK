(() => {
  const C = window.MODLINK_CONFIG, I = window.MODLINK_I18N;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
  let lang = store.get("ml-lang") || ((navigator.language || "en").toLowerCase().startsWith("de") ? "de" : "en");
  if (!I[lang]) lang = "en";
  const t = k => I[lang][k] ?? I.en[k] ?? k;
  const IC = {
    f1:"M4 19V5m0 14h16M8 15l3-4 3 2 4-6", f2:"M12 3v4m0 10v4M3 12h4m10 0h4M7 7l10 10", f3:"M4 6h16M4 12h16M4 18h10",
    f4:"M8 5v14l11-7z", f5:"M5 8h14M5 16h14M9 6v4M15 14v4", f6:"M8 12h8M6 8a4 4 0 000 8M18 8a4 4 0 010 8", f9:"M8 4h8v3H8zM6 6h12v14H6zM9 12h6M9 16h4", f8:"M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 7v5c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 12v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5", f7:"M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"};
  const svg = p => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`;
  const SV = {
    h1:'<svg viewBox="0 0 64 64"><rect class="st" x="12" y="5" width="40" height="54" rx="8"/><rect class="fl blink" x="18" y="11" width="28" height="18" rx="3"/><g class="rot"><circle class="st" cx="32" cy="43" r="8"/><path class="st" d="M32 36v4"/></g></svg>',
    h2:'<svg viewBox="0 0 64 64"><rect class="st" x="6" y="10" width="52" height="44" rx="6"/>' + [0,1,2,3,4,5].map(i => `<rect class="fl tl" style="--i:${i}" x="${12+(i%3)*15}" y="${17+(i/3|0)*16}" width="12" height="11" rx="2"/>`).join("") + '</svg>',
    h3:'<svg viewBox="0 0 64 64"><circle class="st" cx="32" cy="32" r="22"/><g class="rot"><circle class="st" cx="32" cy="32" r="13"/><path class="st" d="M32 12v10"/></g></svg>',
    h4:'<svg viewBox="0 0 64 64"><circle class="st press" cx="20" cy="32" r="11"/><circle class="st press b" cx="44" cy="32" r="11"/></svg>',
    h5:'<svg viewBox="0 0 64 64"><rect class="st" x="3" y="22" width="14" height="20" rx="3"/><rect class="st" x="47" y="22" width="14" height="20" rx="3"/><path class="st" d="M17 32h30"/><circle class="fl dotm" cx="20" cy="32" r="3" opacity=".9"/></svg>',
    s1:'<svg viewBox="0 0 64 64"><rect class="st" x="3" y="22" width="14" height="20" rx="3"/><rect class="st" x="47" y="22" width="14" height="20" rx="3"/><path class="st" d="M17 32h30"/><circle class="fl dotm" cx="20" cy="32" r="3" opacity=".9"/></svg>',
    s2:'<svg viewBox="0 0 64 64"><text class="pulse" x="32" y="43" text-anchor="middle" font-size="32" font-weight="700" fill="currentColor">{ }</text></svg>',
    s3:'<svg viewBox="0 0 64 64"><rect class="st" x="6" y="10" width="52" height="36" rx="4"/><path class="st" d="M24 56h16M32 46v10"/><rect class="fl sb" style="--i:0" x="12" y="18" width="30" height="5" rx="2.5"/><rect class="fl sb" style="--i:1" x="12" y="28" width="20" height="5" rx="2.5"/></svg>'};
  const tile = k => `<li class="tile2"><div class="tico">${SV[k]}</div><h3>${t(k)}</h3></li>`;
  const li = (k, d) => `<li><h3>${t(k)}</h3><p>${t(d)}</p></li>`;
  const GAL = ["hardware","menu","status","diag","tasks","media","settings","pc"];
  const DOCS = ["start","hardware","software","firmware","connection","trouble","faq"];

  function setLink(el, url) {
    if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener noreferrer"; el.classList.remove("off"); el.removeAttribute("aria-disabled"); el.removeAttribute("title"); }
    else { el.removeAttribute("href"); el.classList.add("off"); el.setAttribute("aria-disabled", "true"); el.title = t("unset"); }
  }
  function render() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(e => e.textContent = t(e.dataset.i18n));
    $$("[data-aria]").forEach(e => e.setAttribute("aria-label", t(e.dataset.aria)));
    $("#ov4").textContent = t("ov_4") + C.version;
    $("#langBtn").textContent = lang === "de" ? "EN" : "DE";
    $("#featureList").innerHTML = [1,2,3,4,5,6,7,8,9].map(n => `<li class="card"><span class="ico">${svg(IC["f"+n])}</span><h3>${t("f"+n)}</h3><p>${t("f"+n+"d")}</p></li>`).join("");
    $("#hwList").innerHTML = [1,2,3,4,5].map(n => tile("h"+n)).join("");
    $("#swList").innerHTML = [1,2,3].map(n => tile("s"+n)).join("");
    $("#galGrid").innerHTML = GAL.map(k => { const src = C.gallery[k];
      return `<li><button class="shot" data-k="${k}" aria-label="${t("g_"+k)}">${src ? `<img src="${src}" alt="${t("g_"+k)}" loading="lazy">` : `<span class="ph">${t("ph")}</span>`}<span class="cap">${t("g_"+k)}</span></button></li>`; }).join("");
    $("#docList").innerHTML = DOCS.map(k => { const u = C.docs[k];
      return `<li class="doc">${u ? `<a href="${u}" target="_blank" rel="noopener noreferrer">${t("d_"+k)}<span>${t("open")}</span></a>` : `<div class="off-doc">${t("d_"+k)}<span>${t("soon")}</span></div>`}</li>`; }).join("");
    $$("[data-link]").forEach(a => setLink(a, C[a.dataset.link]));
    $$(".name").forEach(e => e.textContent = C.projectName);
    $$(".fwv").forEach(e => e.textContent = C.version);
    $("#copy").textContent = C.copyright;
    document.title = `${C.projectName} – ${t("hero_title")}`;
    $('meta[name="description"]').content = t("hero_text");
    document.dispatchEvent(new Event("ml:render"));
  }
  $("#langBtn").onclick = () => { lang = lang === "de" ? "en" : "de"; store.set("ml-lang", lang); render(); };
  const th = store.get("ml-theme"); if (th) document.documentElement.dataset.theme = th;
  $("#themeBtn").onclick = () => { const n = document.documentElement.dataset.theme === "light" ? "dark" : "light"; document.documentElement.dataset.theme = n; store.set("ml-theme", n); };
  const nav = $("#nav"), mb = $("#menuBtn");
  mb.onclick = () => { const o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); };
  $$("#nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); }));
  const dlg = $("#lightbox");
  document.addEventListener("click", e => {
    const b = e.target.closest(".shot"); if (b) { const k = b.dataset.k, src = C.gallery[k];
      $("#lbBody").innerHTML = src ? `<img src="${src}" alt="${t("g_"+k)}">` : `<div class="ph big">${t("ph")}</div>`; $("#lbCap").textContent = t("g_"+k); dlg.showModal(); }
    if (e.target === dlg) dlg.close();
    const off = e.target.closest("a.off"); if (off) e.preventDefault();
  });
  $("#lbClose").onclick = () => dlg.close();
  render();
})();
