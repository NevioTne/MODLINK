(() => {
  const I = window.MODLINK_I18N, C = window.MODLINK_CONFIG, $ = q => document.querySelector(q), T = () => I[document.documentElement.lang] || I.en;
  const spark = (pts, w = 120, h = 34) => `<svg viewBox="0 0 ${w} ${h}" class="spark" aria-hidden="true"><polyline pathLength="1" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" points="${pts.map((v,i) => (i*w/(pts.length-1)).toFixed(1)+","+(h-3-v*(h-6)/100).toFixed(1)).join(" ")}"/></svg>`;
  const bar = v => `<span class="mbar"><i style="width:${v}%"></i></span>`;
  const win = (L, body) => `<div class="win" role="img" aria-label="Mockup"><div class="wbar"><span class="mk">M</span><b>MODLINK <em>STUDIO</em></b><span class="wst"><i></i>${L.stu_conn}</span></div><div class="wbody">${body}</div></div>`;
  const mock = {
    blocks: m => { const N = (c,i,x,y,t1,t2) => `<g class="bn ${c}" style="--i:${i}"><rect class="r" x="${x}" y="${y}" width="${c === "bn1" || c === "bn2" || c === "bn3" ? 118 : 120}" height="40" rx="8"/><text x="${x+10}" y="${y+17}">${t1}</text><text class="s" x="${x+10}" y="${y+30}">${t2}</text></g>`;
      const P = [["M126 125H148",1],["M266 125H288",2],["M406 125C420 125 420 32 432 32",3],["M406 125C420 125 420 88 432 88",3],["M406 125C420 125 420 208 432 208",4]];
      return `<div class="btool"><span>${m.bt_import}</span><span>${m.bt_export}</span><span>${m.bt_check}</span><span>${m.bt_save}</span><span class="on">▶ ${m.bt_run}</span></div><svg class="bsvg" viewBox="0 0 560 240" aria-hidden="true">${P.map(p => `<path class="lk" pathLength="1" style="--i:${p[1]}" d="${p[0]}"/>`).join("")}${P.map((p,i) => `<circle class="flowdot" r="3"><animateMotion dur="2.6s" begin="${1.2+i*.35}s" repeatCount="indefinite" path="${p[0]}"/></circle>`).join("")}${N("bn1",0,8,105,m.bt_trig,m.bt_trig_s)}${N("bn2",1,148,105,m.bt_chk,m.bt_chk_s)}${N("bn3",2,288,105,m.bt_if,m.bt_if_s)}${N("bn4",3,432,12,m.bt_fg,"")}${N("bn5",4,432,68,m.bt_vol,m.bt_vol_s)}${N("bn6",5,432,188,m.bt_start,m.bt_start_s)}<text class="pl" x="410" y="62">${m.bt_true}</text><text class="pl" x="410" y="182">${m.bt_false}</text></svg>`; },
    dash: m => `<div class="g2"><div class="mc"><small>${m.hw}</small><b>${m.mod} 5</b><span class="pill ok">${m.conn}</span></div><div class="mc"><small>${m.audio}</small><b>64 %</b>${bar(64)}</div></div><div class="mc"><small>${m.act}</small><ul class="log"><li><code>07:43</code>${m.a1}</li><li><code>07:45</code>${m.a2}</li><li><code>07:46</code>${m.a3}</li></ul></div>`,
    diag: m => `<div class="g3">${[["CPU",27,[20,24,22,30,28,33,27,25,29,31,26,27]],["GPU",41,[30,35,40,38,45,43,41,44,39,42,40,41]],["RAM",62,[60,61,61,62,63,62,62,64,63,62,62,62]]].map(r => `<div class="mc"><small>${r[0]}</small><b>${r[1]} %</b>${spark(r[2])}</div>`).join("")}</div><div class="g2"><div class="mc"><small>${m.dl}</small><b>85,4 Mbit/s</b></div><div class="mc"><small>${m.ul}</small><b>12,8 Mbit/s</b></div></div>`,
    fps: m => `<div class="mc"><span class="pill ok">${m.game}</span></div><div class="g2"><div class="mc big"><small>${m.cur}</small><b>144</b></div><div class="mc big"><small>${m.avg}</small><b>138</b></div></div><div class="mc">${spark([60,72,68,80,76,84,78,82,86,80,84,88],240,40)}</div>`,
    task: m => `<table class="mt">${[["render.exe",34.2,4120],["browser.exe",12.8,2216],["game.exe",9.5,7788],["editor.exe",3.1,5032],["chat.exe",1.4,6140],["backup.exe",0.6,9012]].map((r,i) => `<tr${i === 2 ? ' class="sel"' : ""}><td>${r[0]}</td><td>${r[1].toFixed(1)} %</td><td><code>${m.pid} ${r[2]}</code></td></tr>`).join("")}</table><div class="dlg"><b>${m.q}</b><span><i class="btn2">${m.yes}</i><i class="btn2 on">${m.no}</i></span></div>`,
    media: m => `<div class="np"><div class="cover">♪</div><div><b>${m.track}</b><small>${m.artist}</small></div></div>${bar(24)}<div class="mtime"><span>0:58</span><span>3:59</span></div><div class="ctrl"><i>⏮</i><i class="on">⏯</i><i>⏭</i></div><div class="mc"><small>${m.audio}</small>${bar(64)}</div>`,
    storage: m => `${[["C:","System",126,256],["D:","Data",820,1024],["E:","Stick",12,29]].map(d => `<div class="drv"><b>${d[0]} ${d[1]}</b>${bar(Math.round(100-d[2]*100/d[3]))}<small>${d[2]} GB ${m.free} ${d[3]} GB</small></div>`).join("")}<div class="g2"><div class="mc"><small>${m.dup}</small><b>24</b></div><div class="mc"><small>${m.big}</small><b>17</b></div></div><div class="mc"><small>${m.grp} 1</small><ul class="log"><li>report_final.docx · 2,4 MB<span class="lnk">${m.open}</span></li><li>report_final (1).docx · 2,4 MB<span class="lnk">${m.open}</span></li></ul></div>`
  };
  const chips = a => a.concat(a).map(x => `<span>${x}</span>`).join("");
  function clipMock(L) {
    const m = L.mk, it = [[m.tt,"Meeting notes for Monday"],["Bild"],["Word-Datei"],["PowerPoint-Datei"],["PDF-Datei"],["Excel-Datei"]], en = document.documentElement.lang === "en", lab = ["Image","Word file","PowerPoint file","PDF file","Excel file"];
    const dev = it.map((r,i) => `<li${i === 1 ? ' class="sel"' : ""}>${r[1] || (en ? lab[i-1] : r[0])}</li>`).join("");
    const st = it.map((r,i) => `<li><b>${i ? (en ? lab[i-1] : r[0]) : m.tt}</b><small>${m.orig2}</small></li>`).join("");
    return win(L, `<div class="g2"><div><small class="cap2">${m.devs}</small><ul class="tiny">${dev}</ul></div><div><small class="cap2">${m.orig}</small><ul class="keep">${st}</ul></div></div>`);
  }
  const VIS = [
    `<div class="v-home"><b>42</b><i>→</i><div><small>12:34:56</small><b>42</b></div></div>`,
    `<div class="v-clock" id="vclock">00:00:00</div>`,
    `<div class="v-tiles">${"<i></i>".repeat(6).replace(/<i>/g,(m,o)=>`<i style="--i:${o/7|0}">`)}</div>`,
    `<div class="v-sw">${["#07e07a","#2f6bff","#16e0e0","#ff3b30","#ff9f1c","#8f3cff","#ff3cc8","#ffffff","#98a0aa"].map((c,i) => `<i style="background:${c};--i:${i}"></i>`).join("")}</div>`,
    `<div class="v-enc"><i></i></div>`,
    `<div class="v-th">${["#f4f6fa","#0b0d10","#252a33","#02062a","#2a1a5c"].map(c => `<i style="background:${c}"></i>`).join("")}</div>`,
    `<div class="v-to"><i></i></div>`,
    `<div class="v-lang"><span>DE</span><span>EN</span></div>`];
  function render() {
    const L = T(), B = L.stu_blocks, st = C.status || {}, keys = ["dash","blocks","diag","fps","task","media","clip","storage"];
    $("#studioBlocks").innerHTML = keys.map((k,i) => { const b = B[k], s = st[k] || "dev", rows = k === "blocks" ? `<div class="chiprow r1"><div>${chips(L.blk_tr)}</div></div><div class="chiprow r2"><div>${chips(L.blk_act)}</div></div>` : "", body = k === "clip" ? clipMock(L) : win(L, mock[k](L.mk) + rows);
      const extra = k === "clip" ? `<div class="clipx"><h4>${L.stu_clip_h}</h4><ol class="flow2">${L.stu_clip_steps.map(x => `<li>${x}</li>`).join("")}</ol><p class="callout">${L.stu_clip_note}</p><p class="muted small">${L.clip_types}</p></div>` : "";
      return `<article class="sblock${i % 2 ? " rev" : ""}${k === "clip" ? " hot" : ""}"><div class="stext"><span class="badge st-${s}">${L.stat[s] || s}</span><h3>${b.n}</h3><p class="tag2">${b.tag}</p><p>${b.d.split(/(?<=[.!?])\s+/)[0]}</p><ul class="pills">${b.b.map(x => `<li>${x}</li>`).join("")}</ul>${k === "storage" ? `<p><a href="#storage">→ ${B.storage.n}</a></p>` : ""}</div><div class="smock">${body}</div>${extra}</article>`; }).join("");
    $("#coopHead").innerHTML = `<tr>${L.stu_cols.map(c => `<th scope="col">${c}</th>`).join("")}</tr>`;
    $("#coopRows").innerHTML = L.stu_rows.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
    $("#smartList").innerHTML = L.stu_smart.map(x => `<li>${x}</li>`).join("");
    $("#devCards").innerHTML = L.dev_cards.map((c,i) => `<li class="card" title="${c.d}"><div class="vis">${VIS[i]}</div>${c.s ? `<span class="badge st-${st[c.s] || "dev"}">${L.stat[st[c.s] || "dev"]}</span>` : ""}<h3>${c.n}</h3><p>${c.d}</p></li>`).join("");
    $("#stuVer").textContent = (C.studioVersion ? L.stu_ver + C.studioVersion + " · " : "") + L.stu_fw + C.version;
  }
  document.addEventListener("ml:render", render);
})();
