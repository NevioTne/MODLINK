(() => {
  const I = window.MODLINK_I18N, $ = s => document.querySelector(s), T = () => I[document.documentElement.lang] || I.en;
  const ul = a => a.map(x => `<li>${x}</li>`).join("");
  document.addEventListener("ml:render", () => {
    const L = T();
    $("#drives").innerHTML = L.drives.map(d => `<li class="drive"><b>${d.l} ${d.n}</b><span class="bar"><i style="width:${d.p}%"></i></span><small>${d.t}</small></li>`).join("");
    $("#stDev").innerHTML = ul(L.st_dev);
    $("#modes").innerHTML = L.modes.map(m => `<li class="card"><h4>${m.n}</h4><p>${m.d}</p><p class="mini">${L.st_pros}</p><ul class="tick">${ul(m.pros)}</ul><p class="note"><b>${L.st_caveat}:</b> ${m.c}</p></li>`).join("");
    $("#progMock").innerHTML = `<b>D: Daten</b><span>${L.st_mock_mode}: ${L.modes[0].n}</span><span class="bar"><i style="width:62%"></i></span><small>62 % · ${L.st_mock_rem}: ≈ 4 min</small>`;
    $("#stRes").innerHTML = L.st_res.map(x => `<li class="card tile"><span class="big">—</span><p>${x}</p></li>`).join("");
    $("#pcDup").innerHTML = ul(L.st_pc_dup); $("#pcBig").innerHTML = ul(L.st_pc_big); $("#stTeam").innerHTML = ul(L.st_team);
  });
})();
