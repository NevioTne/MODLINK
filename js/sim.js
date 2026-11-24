// MODLINK device simulator: visual simulation only, no real connection.
(() => {
const $ = q => document.querySelector(q), S = 4, W = 160, H = 128;
const cv = $("#simCanvas"), x = cv.getContext("2d"); cv.width = W * S; cv.height = H * S;
const rgb = v => `rgb(${((v>>11)&31)*255/31|0},${((v>>5)&63)*255/63|0},${(v&31)*255/31|0})`;
const TH = [[0xFFFF,0xDEFB,0xC638,0x0841,0x630C,0xAD55],[0x0841,0x10A2,0x2124,0xFFFF,0x9CF3,0x4208],[0x0008,0x0015,0x08A3,0xFFFF,0x9CF3,0x3186],[0x2124,0x3186,0x4A49,0xFFFF,0x9CF3,0x632C],[0x200B,0x4013,0x601A,0xFFFF,0x9CF3,0x781F]];
const THO = [0,1,3,2,4], THN = [["Hell","Light"],["Dunkel","Dark"],["Graphit","Graphite"],["Mitternacht","Midnight"],["Farbenfroh","Colorful"]];
const ACC = [0x07E0,0x001F,0x07FF,0xF800,0xFD20,0x801F,0xF81F,0xFFFF,0x9CF3];
const ACN = [["Gruen","Green"],["Blau","Blue"],["Cyan","Cyan"],["Rot","Red"],["Orange","Orange"],["Lila","Purple"],["Pink","Pink"],["Weiss","White"],["Neutr.","Neutr."]];
const RAIN = [0xF800,0xFD20,0xFFE0,0x07E0,0x07FF,0x001F,0x801F];
const TO = [60,120,300,600,1200,1800,2700,3600,5400,7200,9000,10800,12600,14400,16200,18000,19800,21600,23400,25200,27000,28800,30600,32400,34200,36000];
const PARENT = {clip:"main",main:"home",storage:"main",diag:"main",task:"main",media:"main",settings:"main",pc:"main",color:"settings",encoder:"settings",theme:"settings",timeout:"settings",lang:"settings",status:"settings",help:"settings"};
const FW = (window.MODLINK_CONFIG && window.MODLINK_CONFIG.version) || "V1.16";
const rnd = (a, b) => a + Math.random() * (b - a), now = () => performance.now();
const s = {page:"boot",t0:now(),theme:1,acc:0,enc:0,en:false,mod:0,pc:true,usb:false,mainSel:0,setSel:0,colSel:0,encSel:0,thSel:1,lgSel:0,toSel:0,toEdit:false,toOn:false,toIdx:0,toAll:true,
  stV:0,stSel:0,stMode:0,stDrive:"",stProg:0,stEta:0,stDup:0,stBig:0,stYes:false,stMsg:"",drives:[],an:{on:false},
  d:{st:"wait",cpu:0,gpu:0,ram:0,dn:0,up:0,h:{cpu:[],gpu:[],ram:[]},last:0,next:0},
  k:{list:[],sel:0,v:0,yes:false,ok:false,msg:"",last:0,next:0},
  m:{got:false,title:"",artist:"",pos:0,dur:0,play:false,vol:50,sel:1,edit:false,ev:50,at:0,last:0}};
Object.assign(s,{sys:false,sysT:0,sysUp:0,sysAt:0,game:false,fps:{on:false,cur:0,avg:0},clip:{list:[],sel:0,conf:false,cs:1}});
const t = (de, en) => s.en ? en : de;
let P;
const pal = () => { const a = TH[s.theme]; P = {BG:a[0],PA:a[1],PL:a[2],WH:a[3],GR:a[4],GD:a[5],AC:ACC[s.acc]}; };
// ---- drawing primitives (logical 160x128 pixels) ----
const R = (a,b,w,h,c) => { x.fillStyle = rgb(c); x.fillRect(a*S,b*S,w*S,h*S); };
const path = (a,b,w,h,r) => { x.beginPath(); x.roundRect ? x.roundRect(a*S,b*S,w*S,h*S,r*S) : x.rect(a*S,b*S,w*S,h*S); };
const RR = (a,b,w,h,r,c) => { x.fillStyle = rgb(c); path(a,b,w,h,r); x.fill(); };
const RO = (a,b,w,h,r,c) => { x.strokeStyle = rgb(c); x.lineWidth = S; path(a+.5,b+.5,w-1,h-1,r); x.stroke(); };
const L = (a,b,c,d,col) => { x.strokeStyle = rgb(col); x.lineWidth = S; x.beginPath(); x.moveTo((a+.5)*S,(b+.5)*S); x.lineTo((c+.5)*S,(d+.5)*S); x.stroke(); };
const CI = (a,b,r,col,f) => { x.beginPath(); x.arc((a+.5)*S,(b+.5)*S,r*S,0,7); if (f) { x.fillStyle = rgb(col); x.fill(); } else { x.strokeStyle = rgb(col); x.lineWidth = S; x.stroke(); } };
const TRI = (a,b,c,d,e,f,col) => { x.fillStyle = rgb(col); x.beginPath(); x.moveTo(a*S,b*S); x.lineTo(c*S,d*S); x.lineTo(e*S,f*S); x.fill(); };
function T(str, a, b, c, z = 1) { x.fillStyle = rgb(c); x.font = `${7.4*S*z}px "Courier New",ui-monospace,monospace`; x.textBaseline = "top"; [...String(str)].forEach((ch, i) => x.fillText(ch, (a + i*6*z)*S, b*S)); }
const TC = (str, b, c, z = 1) => T(str, (W - String(str).length*6*z)/2, b, c, z);
function frame(title, foot = true) {
  R(0,0,W,H,P.BG);
  if (s.theme === 4) RAIN.forEach((c,i) => R(W*i/7|0,0,(W*(i+1)/7|0)-(W*i/7|0),3,c)); else R(0,0,W,3,P.AC);
  T(title,6,8,P.WH); R(6,21,148,1,P.GD);
  if (foot) { R(6,115,148,1,P.GD); T(t("Drehen: Auswahl PUSH: OK K0: Zurueck","Turn: Select PUSH: OK K0: Back"),6,119,P.GR); }
}
function row(y, h, sel, label, val) {
  if (sel) { RR(4,y,152,h,2,P.PL); RO(4,y,152,h,2,P.AC); }
  T(label,8,y+(h-7)/2,sel?P.AC:P.WH); if (val != null) T(val,152-String(val).length*6,y+(h-7)/2,sel?P.AC:P.GR);
}
function icon(i, a, b, c) {
  const rect = (w,h) => RO(a-w/2,b-h/2,w,h,0,c);
  if (i === 13) { RO(a-7,b-8,14,17,0,c); RO(a-3,b-10,6,4,0,c); L(a-3,b-2,a+3,b-2,c); L(a-3,b+2,a+3,b+2,c); L(a-3,b+6,a+1,b+6,c); }
  if (i === 12) { rect(16,12); L(a-4,b-4,a-4,b+4,c); L(a+4,b-4,a+4,b+4,c); L(a-6,b+3,a+6,b+3,c); }
  if (i === 1) { rect(14,12); L(a-5,b+2,a-2,b-2,c); L(a-2,b-2,a+1,b+1,c); L(a+1,b+1,a+5,b-4,c); }
  if (i === 10) { rect(14,14); L(a-4,b-3,a+4,b-3,c); L(a-4,b,a+1,b,c); L(a-4,b+3,a+3,b+3,c); }
  if (i === 11) { CI(a-2,b+5,3,c,1); L(a+1,b+5,a+1,b-7,c); L(a+1,b-7,a+7,b-5,c); L(a+1,b-3,a+7,b-1,c); }
  if (i === 3) { CI(a,b,7,c); CI(a,b,3,c); L(a,b-10,a,b-7,c); L(a,b+7,a,b+10,c); L(a-10,b,a-7,b,c); L(a+7,b,a+10,b,c); }
  if (i === 2) { rect(12,12); [-3,3].forEach(d => { L(a-9,b+d,a-6,b+d,c); L(a+6,b+d,a+9,b+d,c); }); }
}
// ---- screens ----
function boot(n) {
  const e = n - s.t0; R(0,0,W,H,P.BG); R(0,0,W,3,P.AC);
  TC("MODLINK",30,P.AC,3); TC("a Product by Nevio T.",70,P.GR); TC("Nightbyte-Studios",84,P.GD);
  if (e > 1800) TC("SYSTEM READY",104,P.AC);
  if (e > 3000) { s.page = "home"; }
}
const bin = v => v.toString(2).padStart(6, "0");
const two = v => String(v).padStart(2, "0");
function home(n) {
  R(0,0,W,H,P.BG); if (s.theme === 4) RAIN.forEach((c,i) => R(W*i/7|0,0,(W*(i+1)/7|0)-(W*i/7|0),3,c)); else R(0,0,W,3,P.AC);
  if (!s.mod) {
    TC("MODLINK",12,P.WH,2); R(22,39,116,1,P.GD); CI(80,62,12,0xFD20); L(74,56,86,68,0xFD20); L(86,56,74,68,0xFD20);
    TC("NO MODULE CONNECTED",82,0xFD20); TC("SEARCHING"+".".repeat(1+(n/350|0)%3),97,P.GR); R(0,125,W,3,P.AC); return;
  }
  T("MODLINK",7,9,P.WH,2); T(s.en ? "CONNECTED" : "VERBUNDEN",94,15,P.AC);
  const lab = s.en ? "MODULE ID" : "MODUL-ID", id = String(s.mod);
  if (!s.sys) { TC(lab,43,P.GR); T(id,(W-id.length*36)/2,61,P.WH,6); T(bin(s.mod),119,115,P.GD); return; }
  TC(lab,27,P.GR); TC(id,39,P.WH,3); T(bin(s.mod),119,59,P.GD); R(6,67,148,1,P.GD);
  const el = (n - s.sysAt)/1000, ts = Math.floor(s.sysT + el) % 86400, up = Math.floor(s.sysUp + el), d = Math.floor(up/86400);
  TC(s.en ? "PC TIME" : "PC-UHRZEIT",70,P.GR); TC(`${two(ts/3600|0)}:${two(ts/60%60|0)}:${two(ts%60)}`,82,P.WH,2);
  TC(s.en ? "SYSTEM UPTIME" : "SYSTEM-UPTIME",106,P.GR);
  TC((d ? d+"d " : "")+`${two(up/3600%24|0)}:${two(up/60%60|0)}:${two(up%60)}`,117,P.AC);
}
function main() {
  frame("MODLINK "+FW); R(0,112,W,16,P.BG);
  const lb = [t("Medien","Media"),t("Ablage","Clipbd."),"Taskmgr.",t("Diagnose","Diag"),t("Speicher","Storage"),t("Einst.","Settings")], ic = [11,13,10,1,12,3];
  lb.forEach((l,i) => { const a = 5+(i%3)*51, b = 25+(i/3|0)*50, sel = i === s.mainSel, fg = sel ? P.AC : P.WH;
    RR(a,b,48,46,4,sel?P.PL:P.PA); RO(a,b,48,46,4,sel?P.AC:P.GD); icon(ic[i],a+24,b+15,fg); T(l,a+(48-l.length*6)/2,b+34,fg); });
}
function wait(title, l1, l2, sub) { frame(title,false); TC(l1,40,P.WH); TC(l2,52,P.WH); TC(sub,80,P.GR); }
function stor() {
  if (s.stV === 0) {
    frame(t("SPEICHER","STORAGE"),false);
    if (!s.drives.length) T(t("Warte auf PC-Daten...","Waiting for PC data..."),7,48,P.GR);
    s.drives.forEach((d,i) => { const y = 25+i*15, sel = i === s.stSel; if (sel) { RR(4,y,152,14,2,P.PL); RO(4,y,152,14,2,P.AC); }
      T(d.l,8,y+4,sel?P.AC:P.WH); T(`${d.f}/${d.t}GB`,35,y+4,sel?P.WH:P.GR); T(Math.round(d.f*100/d.t)+"%",112,y+4,sel?P.WH:P.GR); });
    const ts = s.stSel === s.drives.length; if (ts) { RR(4,103,152,13,2,P.PL); RO(4,103,152,13,2,P.AC); }
    T(t("Papierkorb leeren","Empty Recycle Bin"),8,106,ts?P.AC:P.WH);
  } else if (s.stV === 1) {
    frame(t("SPEICHERANALYSE","STORAGE ANALYSIS"),false); T(t("Laufwerk: ","Drive: ")+s.stDrive,7,29,P.WH);
    [["Express-Analyse","Express analysis"],["Extreme-Analyse","Extreme analysis"]].forEach((n,i) => { const y = 43+i*26, a = s.stMode === i;
      RR(6,y,148,22,3,a?P.PL:P.BG); RO(6,y,148,22,3,a?P.AC:P.GD); T(t(n[0],n[1]),12,y+5,a?P.AC:P.WH); });
    T(t("PUSH: Start  K0: Zurueck","PUSH: Start  K0: Back"),7,101,P.GR);
  } else if (s.stV === 2) {
    frame(t("ANALYSE LAEUFT","ANALYZING"),false); T(s.stDrive+" "+t("Express","Express").replace("Express",s.stMode?"Extreme":"Express"),7,31,P.WH);
    T(t("Fortschritt:","Progress:"),7,48,P.WH); T(s.stProg+"%",105,48,P.AC); RO(7,61,146,9,0,P.GD); if (s.stProg) R(9,63,Math.round(142*s.stProg/100),5,P.AC);
    T(t("Restzeit: ","Remaining: ")+(s.stEta < 60 ? s.stEta+"s" : Math.ceil(s.stEta/60)+"min"),7,78,P.GR); T(t("Bitte warten...","Please wait..."),7,98,P.GR);
  } else if (s.stV === 4) {
    frame(t("ANALYSEERGEBNIS","ANALYSIS RESULT"),false); T(s.stDrive,7,31,P.WH);
    T(t("Doppelte:","Duplicates:"),7,48,P.WH); T(String(s.stDup),110,48,P.AC); T(t("Grosse Dateien:","Large files:"),7,64,P.WH); T(String(s.stBig),110,64,P.AC);
    T(t("Details am PC oeffnen","Open details on PC"),7,86,P.GR); T(t("PUSH: Oeffnen K0: Zurueck","PUSH: Open  K0: Back"),7,101,P.GR);
  } else if (s.stV === 5) {
    frame(t("PAPIERKORB","RECYCLE BIN"),false); T(t("Papierkorb wirklich","Empty Recycle Bin?"),7,39,P.WH); if (!s.en) T("leeren?",7,52,P.WH);
    [[t("Ja","Yes"),true],[t("Nein","No"),false]].forEach((b,i) => { const a = 18+i*70, sel = s.stYes === b[1]; RR(a,72,52,20,3,sel?P.PL:P.BG); RO(a,72,52,20,3,sel?P.AC:P.GD); T(b[0],a+(52-b[0].length*6)/2,78,sel?P.AC:P.WH); });
    T(t("K0: Abbrechen","K0: Cancel"),7,104,P.GR);
  } else { frame(t("PAPIERKORB","RECYCLE BIN"),false); T(s.stMsg || t("An PC gesendet","Request sent to PC"),7,50,P.WH); T("PUSH / K0: OK",7,105,P.GR); }
}
function bar(a, b, w, v) { RO(a,b,w,6,0,P.GD); const f = Math.round((w-2)*Math.max(0,Math.min(100,v))/100); if (f) R(a+1,b+1,f,4,P.AC); }
function diag() {
  const d = s.d, ttl = t("HARDWARE-DIAGNOSE","HARDWARE DIAG");
  if (d.st === "wait") return wait(ttl,t("WARTE AUF","WAITING FOR"),t("ANTWORT VOM PC","PC RESPONSE"),t("Messwerte laden...","Loading metrics..."));
  if (d.st === "timeout") return wait(ttl,t("PC NICHT","PC NOT"),t("ERREICHBAR","REACHABLE"),t("Warte auf neue Daten...","Waiting for new data..."));
  frame(ttl,false);
  [["CPU","cpu",29],["GPU","gpu",49],["RAM","ram",69]].forEach(([l,k,y]) => { T(l,5,y,P.WH); T(Math.round(d[k])+"%",34,y,P.AC); bar(62,y+1,46,d[k]);
    RO(116,y-3,35,14,0,P.GD); d.h[k].forEach((v,i) => { if (!i) return; const X = q => 118+q*31/11, Y = u => y+8-u*8/100; L(X(i-1),Y(d.h[k][i-1]),X(i),Y(v),P.AC); }); });
  const y0 = s.fps.on ? 86 : 92, y1 = s.fps.on ? 97 : 104;
  T("DOWN:",5,y0,P.WH); T(d.dn.toFixed(1)+" Mb/s",52,y0,P.AC); T("UP:",5,y1,P.WH); T(d.up.toFixed(1)+" Mb/s",52,y1,P.AC);
  if (s.fps.on) { R(5,108,150,1,P.GD); T("FPS:",7,115,P.WH); T(String(Math.round(s.fps.cur)),35,115,P.AC); T("AVG:",83,115,P.WH); T(String(Math.round(s.fps.avg)),111,115,P.AC); }
}
function task() {
  const k = s.k, ttl = t("TASKMANAGER","TASK MANAGER");
  if (k.v === 2) { frame(ttl,false); TC(k.ok ? t("PROZESS BEENDET","PROCESS CLOSED") : t("AKTION FEHLGESCHLAGEN","ACTION FAILED"),44,k.ok?P.AC:0xF800); TC(k.msg,62,P.GR); TC(t("PUSH: ZURUECK","PUSH: BACK"),100,P.WH); return; }
  if (k.v === 1) { frame(t("ANWENDUNG SCHLIESSEN?","CLOSE APPLICATION?"),false); const p = k.list[k.sel]; TC(p ? p.n : "",30,P.AC); TC(t("Moechtest du diese","Do you want to close"),48,P.WH); TC(t("Anwendung schliessen?","this application?"),60,P.WH);
    [[t("Ja","Yes"),true],[t("Nein","No"),false]].forEach((b,i) => { const a = 18+i*70, sel = k.yes === b[1]; RR(a,82,52,20,3,sel?P.PL:P.BG); RO(a,82,52,20,3,sel?P.AC:P.GD); T(b[0],a+(52-b[0].length*6)/2,88,sel?P.AC:P.WH); }); return; }
  if (!k.list.length) return wait(ttl,t("WARTE AUF","WAITING FOR"),t("ANTWORT VOM PC","PC RESPONSE"),t("Prozesse werden geladen...","Loading processes..."));
  frame(ttl,false);
  k.list.forEach((p,i) => { const y = 26+i*16, sel = i === k.sel; if (sel) RR(4,y-1,152,15,2,P.PL); RO(4,y-1,152,15,2,sel?P.AC:P.BG);
    T(p.n.slice(0,17),7,y+2,sel?P.AC:P.WH); T(p.c.toFixed(1)+"%",112,y+2,sel?P.AC:P.GR); });
}
const mm = v => String(v/60|0).padStart(2,"0")+":"+String(v%60|0).padStart(2,"0");
function media() {
  const m = s.m; frame(t("MEDIEN","MEDIA"),false);
  if (!m.got) TC(t("Warte auf PC-Daten...","Waiting for media..."),39,P.GR); else { T(m.title.slice(0,25),6,28,P.WH); T(m.artist.slice(0,25),6,40,P.GR); }
  T(`${mm(m.pos)} / ${mm(m.dur)}`,6,54,P.GR); RO(6,66,148,7,2,P.GD); if (m.dur) R(8,68,Math.round(144*Math.min(1,m.pos/m.dur)),3,P.AC);
  [31,80,129].forEach((cx,i) => { const sel = !m.edit && m.sel === i, c = sel ? P.AC : P.WH; if (sel) RO(cx-13,77,26,21,4,P.AC);
    if (i === 0) { L(cx-7,82,cx-7,94,c); TRI(cx-5,88,cx+5,81,cx+5,95,c); }
    if (i === 1) { if (m.play) { R(cx-5,81,4,14,c); R(cx+2,81,4,14,c); } else TRI(cx-5,80,cx-5,96,cx+7,88,c); }
    if (i === 2) { TRI(cx-4,81,cx-4,95,cx+6,88,c); L(cx+7,82,cx+7,94,c); } });
  const vs = m.sel === 3, c = vs ? P.AC : P.WH, v = m.edit ? m.ev : m.vol; if (vs) RO(3,102,154,20,3,P.AC);
  T(t("LAUT","VOL"),7,108,c); RO(36,108,91,7,2,P.GD); if (v) R(37,109,Math.round(89*v/100),5,P.AC); T(v+"%",132,108,vs?P.AC:P.GR);
}
function clipP() {
  const c = s.clip; frame(t("ZWISCHENABLAGE","CLIPBOARD"));
  if (c.conf) { T(t("Ausgewaehltes einfuegen?","Insert selected item?"),8,42,P.WH);
    [t("Einfuegen","Insert"),t("Abbrechen","Cancel")].forEach((o,i) => { const y = 67+i*22, sel = i === c.cs; RR(15,y-5,130,18,3,sel?P.PL:P.PA); RO(15,y-5,130,18,3,sel?P.AC:P.GD); T(o,26,y+1,sel?P.AC:P.WH); }); return; }
  if (!c.list.length) { T(t("Zwischenablage leer","Clipboard is empty"),12,59,P.GR); return; }
  c.list.forEach((it,i) => { const y = 28+i*14, sel = i === c.sel; R(4,y,152,13,sel?P.PL:P.BG); if (sel) RO(4,y,152,13,2,P.AC); T((it.p || it.l).slice(0,24),8,y+3,sel?P.AC:P.WH); });
}
function sett() {
  frame(t("EINSTELLUNGEN","SETTINGS")); const lb = [["Farbe","Color"],["Encoder","Encoder"],["Modus","Theme"],["Bildschirmtimeout","Screen timeout"],["Sprache","Language"],["Systemstatus","System status"],["Hilfe","Help"]];
  const vals = [ACN[s.acc][+s.en], s.enc ? t("Medien","Media") : t("V+/-","Volume"), THN[s.theme][+s.en], null, s.en ? "English" : "Deutsch", null, null];
  lb.forEach((l,i) => row(25+i*12,12,i === s.setSel,t(...l),vals[i]));
}
function col() { frame(t("AKZENTFARBE","ACCENT COLOR")); ACC.forEach((c,i) => { const a = 8+(i%3)*50, b = 26+(i/3|0)*26; RR(a,b,44,22,3,c); if (i === s.colSel) RO(a-2,b-2,48,26,4,P.WH); }); TC(ACN[s.colSel][+s.en],104,P.AC); }
function encp() { frame(t("ENCODER-FUNKTION","ENCODER")); [t("V+ / V-","Volume"),t("Medien vor/zur.","Media prev/next")].forEach((l,i) => row(30+i*20,16,i === s.encSel,(s.enc === i ? "* " : "  ")+l)); }
function thm() { frame(t("DARSTELLUNG","THEME")); THO.forEach((th,i) => row(26+i*16,15,i === s.thSel,(s.theme === th ? "* " : "  ")+THN[th][+s.en])); }
function lng() { frame(t("SPRACHE","LANGUAGE")); ["Deutsch","English"].forEach((l,i) => row(32+i*20,16,i === s.lgSel,(s.en === !!i ? "* " : "  ")+l)); }
function tmo() {
  frame(t("BILDSCHIRMTIMEOUT","SCREEN TIMEOUT")); const v = TO[s.toIdx], lab = v < 3600 ? v/60+"min" : (v%3600 ? (v/3600).toFixed(1).replace(".",s.en?".":",") : v/3600)+"h";
  const lb = ["Timeout",t("Ausschaltzeit","Time"),t("Gilt","Applies to")];
  row(27,16,s.toSel === 0,lb[0],s.toOn ? t("AN","ON") : t("AUS","OFF")); row(45,16,s.toSel === 1,lb[1],(s.toEdit ? "< " : "")+lab+(s.toEdit ? " >" : ""));
  row(63,16,s.toSel === 2,lb[2],null); T(s.toAll ? t("gilt immer","Applies always") : t("nicht im Menue","not in menus"),24,92,P.GR);
}
function stat() {
  frame(t("SYSTEMSTATUS","SYSTEM STATUS"),false); const ls = ["Firmware: MODLINK "+FW,t("Modul-ID: ","Module ID: ")+s.mod,t("Binaer: ","Binary: ")+bin(s.mod),t("Modul: ","Module: ")+(s.mod ? t("Verbunden","Connected") : t("Nicht verbunden","Not connected")),"Encoder: "+(s.enc ? t("Medien","Media") : t("Lautstaerke","Volume")),t("Darstellung: ","Theme: ")+THN[s.theme][+s.en]];
  ls.forEach((l,i) => T(l,7,28+i*13,i ? P.GR : P.WH));
}
function help() { frame(t("BEDIENUNG","CONTROLS")); [t("DREHEN: Navigation","TURN: Move"),t("PUSH: Oeffnen / OK","PUSH: Open / Select"),t("K0: Zurueck / Schliessen","K0: Back / Close menu"),t("Ausserhalb: Encoder","Outside menu: Encoder"),t("Lautstaerke / Medien","Volume or media")].forEach((l,i) => T(l,7,28+i*14,i < 4 ? P.WH : P.GR)); }
function pcp() { frame("PC",false); T(t("Erstellt von Nevio Tolone","Made by Nevio Tolone"),7,36,P.WH); T(t("PC-Software auf GitHub:","Get PC software on"),7,60,P.GR); T(t("Modlink","GitHub: Modlink"),7,74,P.AC); }
const draw = () => { pal(); ({clip:clipP,boot,home,main,storage:stor,diag,task,media,settings:sett,color:col,encoder:encp,theme:thm,timeout:tmo,lang:lng,status:stat,help,pc:pcp})[s.page](now()); };
// ---- protocol monitor ----
const mon = [], esc = v => String(v).replace(/[&<>]/g,c => ({"&":"&amp;","<":"&lt;",">":"&gt;"})[c]);
const D = (de, en) => document.documentElement.lang === "en" ? en : de;
function say(o) {
  const a = o.action, v = (m, d) => m[a] || d;
  switch (o.type) {
    case "menu": return a === "open" ? D("Menü geöffnet","Menu opened") : D("Menü geschlossen","Menu closed");
    case "encoder": return D("Drehgeber: ","Encoder: ") + v({volume_up:D("Lautstärke +","Volume up"),volume_down:D("Lautstärke −","Volume down"),media_next:D("Nächster Titel","Next track"),media_previous:D("Vorheriger Titel","Previous track")},"");
    case "button": return D("Taster gedrückt","Button pressed");
    case "module_detected": return D("Modul erkannt, ID ","Module detected, ID ") + o.module_id;
    case "diagnostics": return a === "start" ? D("Diagnose starten","Start diagnostics") : D("Diagnose beenden","Stop diagnostics");
    case "diagnostics_update": return `CPU ${o.cpu} % · GPU ${o.gpu} % · RAM ${o.ram} % · ↓ ${o.download_mbps} · ↑ ${o.upload_mbps} Mbit/s` + (o.fps_available ? " · FPS " + o.fps_current : "");
    case "taskmanager": return v({start:D("Task Manager öffnen","Open Task Manager"),stop:D("Task Manager schließen","Close Task Manager"),kill:D("Anwendung beenden anfragen","Request to close application")},"");
    case "taskmanager_update": return D("Prozessliste: ","Process list: ") + o.count + D(" Einträge"," entries");
    case "taskmanager_result": return o.success ? D("Ergebnis: erfolgreich","Result: success") : D("Ergebnis: fehlgeschlagen","Result: failed");
    case "media": return a === "volume_set" ? D("Lautstärke setzen: ","Set volume: ") + o.volume + " %" : v({start:D("Medien öffnen","Open media"),stop:D("Medien schließen","Close media"),previous:D("Vorheriger Titel","Previous track"),play_pause:"Play / Pause",next:D("Nächster Titel","Next track")},"");
    case "media_update": return D("Medieninfo: ","Media info: ") + o.title;
    case "storage": return a === "analyze" ? D("Analyse starten: ","Start analysis: ") + o.drive + " (" + (o.mode === "express" ? "Express" : D("Extrem","Extreme")) + ")" : v({refresh:D("Laufwerke abfragen","Request drives"),cancel_analysis:D("Analyse abbrechen","Cancel analysis"),open_details:D("Details am PC öffnen","Open details on PC"),empty_trash:D("Papierkorb leeren anfragen","Request to empty Recycle Bin")},"");
    case "storage_update": return o.count + D(" Laufwerke"," drives");
    case "storage_analysis": return o.status === "complete" ? D("Analyse fertig: ","Analysis done: ") + o.duplicates + D(" doppelte, "," duplicates, ") + o.large_files + D(" große Dateien"," large files") : D("Analyse: ","Analysis: ") + o.progress + " %";
    case "clipboard": return a === "paste" ? D("Eintrag einfügen: Nr. ","Insert entry no. ") + (o.index+1) : v({start:D("Zwischenablage öffnen","Open clipboard"),stop:D("Zwischenablage schließen","Close clipboard"),refresh:D("Verlauf abfragen","Request history")},"");
    case "clipboard_update": return D("Zwischenablage: ","Clipboard: ") + o.count + D(" Einträge"," entries");
    case "system_info": return a === "request" ? D("Systeminfo anfragen","Request system info") : D("PC-Zeit und Uptime empfangen","PC time and uptime received");
    case "storage_trash_result": return o.message;
  }
  return "";
}
function renderMon() { const L = (window.MODLINK_I18N[document.documentElement.lang] || window.MODLINK_I18N.en);
  $("#mon").innerHTML = mon.map(e => `<li class="${e.d}"><span>${e.d === "up" ? "→ " + L.sim_up : "← " + L.sim_dn}</span><p class="msg">${esc(say(e.o))}</p></li>`).join(""); }
function log(d, o) { mon.unshift({d, o}); mon.length = Math.min(mon.length, 14); renderMon(); }
const send = o => { log("up", o); pcRecv(o); };
const reply = (ms, fn) => setTimeout(() => { if (s.pc) fn(); }, ms);
// ---- simulated PC software ----
const procs = [["render.exe",34.2,4120],["browser.exe",12.8,2216],["game.exe",9.5,7788],["editor.exe",3.1,5032],["chat.exe",1.4,6140],["backup.exe",0.6,9012]].map(p => ({n:p[0],c:p[1],p:p[2]}));
const tracks = [["Demo Track One","Sample Artist",214],["Demo Track Two","Example Band",187],["Demo Track Three","Test Ensemble",242]];
const pcm = {tr:0,pos:0,play:true,vol:50,at:0};
const mediaMsg = () => ({type:"media_update",title:tracks[pcm.tr][0],artist:tracks[pcm.tr][1],position_seconds:Math.floor(pcm.pos),duration_seconds:tracks[pcm.tr][2],playing:pcm.play,volume:pcm.vol});
const drivesNow = () => [{l:"C:",b:"System",f:126,t:256},{l:"D:",b:"Data",f:820,t:1024}].concat(s.usb ? [{l:"E:",b:"Stick",f:12,t:29}] : []);
const storMsg = () => { const d = drivesNow(), o = {type:"storage_update",count:d.length}; d.forEach((v,i) => { o["drive"+i+"_letter"] = v.l; o["drive"+i+"_label"] = v.b; o["drive"+i+"_free_gb"] = v.f; o["drive"+i+"_total_gb"] = v.t; }); return o; };
const diagMsg = () => { const d = s.d, w = (v,a,b) => Math.round(Math.max(a,Math.min(b,v+rnd(-9,9)))); return {type:"diagnostics_update",cpu:w(d.cpu||40,5,95),gpu:w(d.gpu||55,5,95),ram:w(d.ram||62,30,90),download_mbps:+rnd(20,120).toFixed(1),upload_mbps:+rnd(2,25).toFixed(1),...(s.game ? {fps_available:true,fps_current:Math.round(rnd(118,146)),fps_average:131} : {fps_available:false})}; };
const taskMsg = () => { const l = procs.map(p => ({...p,c:Math.max(0.1,p.c+rnd(-1.5,1.5))})).sort((a,b) => b.c-a.c), o = {type:"taskmanager_update",count:l.length}; l.forEach((p,i) => { o["proc"+(i+1)+"_name"] = p.n; o["proc"+(i+1)+"_cpu"] = +p.c.toFixed(1); o["proc"+(i+1)+"_pid"] = p.p; }); return o; };
const kinds = {img:["Bild","Image"],word:["Word-Datei","Word file"],ppt:["PowerPoint-Datei","PowerPoint file"],xls:["Excel-Datei","Excel file"],pdf:["PDF-Datei","PDF file"],zip:["Archiv-Datei","Archive file"],text:["Text","Text"]};
let pcClip = [{k:"text",p:"Meeting notes for Monday"},{k:"img"},{k:"word"},{k:"ppt"},{k:"pdf"},{k:"xls"}], copyN = 0;
const copies = [{k:"text",p:"Invoice 2026-114"},{k:"zip"},{k:"img"},{k:"text",p:"Call back at 4 pm"},{k:"word"},{k:"pdf"}];
const clipMsg = () => { const o = {type:"clipboard_update",count:pcClip.length}; pcClip.forEach((c,i) => { o["item"+i+"_label"] = kinds[c.k][+s.en]; o["item"+i+"_preview"] = c.p || ""; }); return o; };
function pcRecv(o) {
  if (!s.pc) return;
  if (o.type === "system_info") reply(700,() => { const d = new Date(); recv({type:"system_info",hour:d.getHours(),minute:d.getMinutes(),second:d.getSeconds(),uptime_seconds:Math.floor(rnd(20000,300000))}); });
  if (o.type === "clipboard" && (o.action === "refresh" || o.action === "start")) reply(500,() => recv(clipMsg()));
  if (o.type === "diagnostics" && o.action === "start") s.d.next = now()+700;
  if (o.type === "taskmanager" && o.action === "start") s.k.next = now()+700;
  if (o.type === "taskmanager" && o.action === "kill") reply(600,() => { const i = procs.findIndex(p => p.p === o.pid); if (i >= 0) procs.splice(i,1); recv({type:"taskmanager_result",success:i >= 0,message:i >= 0 ? t("Prozess beendet","Process closed") : t("Prozess nicht gefunden","Process not found")}); });
  if (o.type === "media") { if (o.action === "start") { pcm.at = now(); reply(600,() => recv(mediaMsg())); }
    else if (["previous","next","play_pause","volume_set"].includes(o.action)) { if (o.action === "next") { pcm.tr = (pcm.tr+1)%3; pcm.pos = 0; } if (o.action === "previous") { pcm.tr = (pcm.tr+2)%3; pcm.pos = 0; }
      if (o.action === "play_pause") pcm.play = !pcm.play; if (o.action === "volume_set") pcm.vol = o.volume; reply(300,() => recv(mediaMsg())); } }
  if (o.type === "storage") {
    if (o.action === "refresh") reply(600,() => recv(storMsg()));
    if (o.action === "empty_trash") reply(700,() => recv({type:"storage_trash_result",message:t("Papierkorb geleert","Recycle Bin emptied")}));
    if (o.action === "cancel_analysis") s.an.on = false;
    if (o.action === "analyze") s.an = {on:true,t0:now(),dur:o.mode === "express" ? 12000 : 28000,mode:o.mode,next:now()+500};
  }
}
function recv(o) {
  log("dn",o); const n = now();
  if (o.type === "diagnostics_update" && s.page === "diag") { const d = s.d; ["cpu","gpu","ram"].forEach(k => { d[k] = o[k]; d.h[k].push(o[k]); if (d.h[k].length > 12) d.h[k].shift(); }); d.dn = o.download_mbps; d.up = o.upload_mbps; d.last = n; d.st = "live"; }
  if (o.type === "taskmanager_update" && s.page === "task" && s.k.v === 0) { const l = []; for (let i = 1; i <= o.count; i++) l.push({n:o["proc"+i+"_name"],c:o["proc"+i+"_cpu"],p:o["proc"+i+"_pid"]}); s.k.list = l.sort((a,b) => b.c-a.c); s.k.sel = Math.min(s.k.sel,l.length-1); s.k.last = n; }
  if (o.type === "taskmanager_result" && s.page === "task") { s.k.v = 2; s.k.ok = o.success; s.k.msg = o.message; }
  if (o.type === "media_update" && s.page === "media") { const m = s.m; Object.assign(m,{got:true,title:o.title,artist:o.artist,pos:o.position_seconds,dur:o.duration_seconds,play:o.playing,vol:o.volume,at:n,last:n}); }
  if (o.type === "storage_update" && s.page === "storage") { s.drives = []; for (let i = 0; i < o.count; i++) s.drives.push({l:o["drive"+i+"_letter"],f:o["drive"+i+"_free_gb"],t:o["drive"+i+"_total_gb"]}); s.stSel = Math.min(s.stSel,s.drives.length); }
  if (o.type === "storage_analysis" && s.page === "storage" && s.stV === 2) { s.stProg = o.progress; s.stEta = o.eta_seconds; if (o.status === "complete") { s.stDup = o.duplicates; s.stBig = o.large_files; s.stV = 4; } }
  if (o.type === "storage_trash_result" && s.page === "storage" && s.stV === 6) s.stMsg = o.message;
  if (o.type === "diagnostics_update" && s.page === "diag") { s.fps.on = !!o.fps_available; if (s.fps.on) { s.fps.cur = o.fps_current; s.fps.avg = o.fps_average; } }
  if (o.type === "clipboard_update" && s.page === "clip") { const l = []; for (let i = 0; i < o.count; i++) l.push({l:o["item"+i+"_label"],p:o["item"+i+"_preview"]}); s.clip.list = l; s.clip.sel = Math.min(s.clip.sel,Math.max(0,l.length-1)); }
  if (o.type === "system_info") { s.sysT = o.hour*3600+o.minute*60+o.second; s.sysUp = o.uptime_seconds; s.sysAt = n; s.sys = true; }
}
// ---- input handling ----
function open(p) {
  s.page = p; const n = now();
  if (p === "diag") { Object.assign(s.d,{st:"wait",cpu:0,gpu:0,ram:0,last:n,h:{cpu:[],gpu:[],ram:[]}}); send({type:"diagnostics",action:"start"}); }
  if (p === "task") { Object.assign(s.k,{list:[],sel:0,v:0,last:n}); send({type:"taskmanager",action:"start"}); }
  if (p === "media") { Object.assign(s.m,{got:false,sel:1,edit:false,last:n}); send({type:"media",action:"start"}); }
  if (p === "storage") { Object.assign(s,{stV:0,stSel:0,drives:[]}); send({type:"storage",action:"refresh"}); }
  if (p === "clip") { Object.assign(s.clip,{list:[],sel:0,conf:false,cs:1}); send({type:"clipboard",action:"start"}); send({type:"clipboard",action:"refresh"}); }
  if (p === "color") s.colSel = s.acc; if (p === "encoder") s.encSel = s.enc; if (p === "theme") s.thSel = THO.indexOf(s.theme); if (p === "lang") s.lgSel = s.en ? 1 : 0; if (p === "timeout") { s.toSel = 0; s.toEdit = false; }
}
function back() {
  const p = s.page; if (p === "home" || p === "boot") { if (p === "home") send({type:"button",button:"K0",action:"pressed"}); return; }
  if (p === "clip" && s.clip.conf) { s.clip.conf = false; return; }
  if (p === "media" && s.m.edit) { s.m.edit = false; return; }
  if (p === "timeout" && s.toEdit) { s.toEdit = false; return; }
  if (p === "task" && s.k.v === 1) { s.k.v = 0; return; }
  if (p === "task" && s.k.v === 2) { s.k.v = 0; return; }
  if (p === "storage" && s.stV !== 0) { if (s.stV === 2) { send({type:"storage",action:"cancel_analysis"}); s.an.on = false; } s.stV = (s.stV === 1 || s.stV === 5) ? 0 : 0; return; }
  if (p === "clip") send({type:"clipboard",action:"stop"});
  if (p === "diag") send({type:"diagnostics",action:"stop"}); if (p === "task") send({type:"taskmanager",action:"stop"}); if (p === "media") send({type:"media",action:"stop"});
  s.page = PARENT[p]; if (s.page === "home") send({type:"menu",action:"close"});
}
function turn(d) {
  const p = s.page, md = (v,n) => (v+d+n)%n;
  if (p === "home") return send({type:"encoder",action:s.enc ? (d > 0 ? "media_next" : "media_previous") : (d > 0 ? "volume_up" : "volume_down")});
  if (p === "main") s.mainSel = md(s.mainSel,6); if (p === "settings") s.setSel = md(s.setSel,7); if (p === "color") s.colSel = md(s.colSel,9);
  if (p === "encoder") s.encSel = md(s.encSel,2); if (p === "theme") s.thSel = md(s.thSel,5); if (p === "lang") s.lgSel = md(s.lgSel,2);
  if (p === "timeout") { if (s.toEdit) s.toIdx = md(s.toIdx,26); else s.toSel = md(s.toSel,3); }
  if (p === "task") { const k = s.k; if (k.v === 0 && k.list.length) k.sel = md(k.sel,k.list.length); else if (k.v === 1) k.yes = !k.yes; }
  if (p === "media") { const m = s.m; if (m.edit) m.ev = Math.max(0,Math.min(100,m.ev+d*2)); else m.sel = md(m.sel,4); }
  if (p === "clip") { const c = s.clip; if (c.conf) c.cs = 1-c.cs; else if (c.list.length) c.sel = md(c.sel,c.list.length); }
  if (p === "storage") { if (s.stV === 0) s.stSel = md(s.stSel,s.drives.length+1); else if (s.stV === 1) s.stMode = 1-s.stMode; else if (s.stV === 5) s.stYes = !s.stYes; }
}
function push() {
  const p = s.page;
  if (p === "home") { s.page = "main"; send({type:"menu",action:"open"}); }
  else if (p === "main") open(["media","clip","task","diag","storage","settings"][s.mainSel]);
  else if (p === "settings") open(["color","encoder","theme","timeout","lang","status","help"][s.setSel]);
  else if (p === "color") s.acc = s.colSel; else if (p === "encoder") s.enc = s.encSel; else if (p === "theme") s.theme = THO[s.thSel];
  else if (p === "lang") s.en = s.lgSel === 1;
  else if (p === "timeout") { if (s.toSel === 0) s.toOn = !s.toOn; else if (s.toSel === 1) s.toEdit = !s.toEdit; else s.toAll = !s.toAll; }
  else if (p === "clip") { const c = s.clip; if (!c.list.length) return; if (!c.conf) { c.conf = true; c.cs = 1; } else { if (c.cs === 0) send({type:"clipboard",action:"paste",index:c.sel}); c.conf = false; } }
  else if (p === "task") { const k = s.k; if (k.v === 0 && k.list.length) { k.v = 1; k.yes = false; } else if (k.v === 1) { if (k.yes) { send({type:"taskmanager",action:"kill",pid:k.list[k.sel].p}); k.v = 3; } else k.v = 0; } else if (k.v === 2) k.v = 0; }
  else if (p === "media") { const m = s.m; if (m.edit) { send({type:"media",action:"volume_set",volume:m.ev}); m.edit = false; } else if (m.sel === 3) { m.edit = true; m.ev = m.vol; } else send({type:"media",action:["previous","play_pause","next"][m.sel]}); }
  else if (p === "storage") {
    if (s.stV === 0) { if (s.stSel === s.drives.length) { s.stV = 5; s.stYes = false; } else if (s.drives.length) { s.stDrive = s.drives[s.stSel].l; s.stV = 1; s.stMode = 0; } }
    else if (s.stV === 1) { s.stV = 2; s.stProg = 0; s.stEta = 0; send({type:"storage",action:"analyze",drive:s.stDrive,mode:s.stMode ? "extreme" : "express"}); }
    else if (s.stV === 4) send({type:"storage",action:"open_details",drive:s.stDrive});
    else if (s.stV === 5) { if (s.stYes) { s.stV = 6; s.stMsg = ""; send({type:"storage",action:"empty_trash"}); } else s.stV = 0; }
    else if (s.stV === 6) s.stV = 0;
  }
}
// ---- main loop (device timers + PC schedules) ----
function tick() {
  const n = now(), m = s.m;
  if (s.page === "diag") { if (s.pc && n >= s.d.next && s.d.next) { s.d.next = n+5000; recv(diagMsg()); } if (n-s.d.last > 11000) s.d.st = "timeout"; }
  if (s.page === "task" && s.k.v !== 3) { if (s.pc && n >= s.k.next && s.k.next) { s.k.next = n+5000; recv(taskMsg()); } if (n-s.k.last > 11000 && s.k.v === 0) s.k.list = []; }
  if (s.page === "media") {
    if (m.got && m.play) { m.pos = Math.min(m.dur,m.pos+(n-m.at)/1000); } m.at = n;
    if (s.pc && m.got && m.play && m.pos >= m.dur && m.dur) { pcm.tr = (pcm.tr+1)%3; pcm.pos = 0; recv(mediaMsg()); }
    if (n-m.last > 11000 && !s.pc) { m.got = false; }
    if (s.pc && n-m.last > 6000) { m.last = n; }
  }
  if (s.an.on && s.pc && n >= s.an.next) { const e = n-s.an.t0, pr = Math.min(100,Math.floor(e*100/s.an.dur)), eta = Math.max(0,Math.ceil((s.an.dur-e)/1000));
    s.an.next = n+2000; if (pr >= 100) { s.an.on = false; recv({type:"storage_analysis",status:"complete",progress:100,duplicates:s.an.mode === "express" ? 24 : 21,large_files:17,eta_seconds:0}); } else recv({type:"storage_analysis",status:"running",progress:pr,eta_seconds:eta}); }
  draw();
}
// ---- wiring ----
const act = {l:() => turn(-1),r:() => turn(1),p:push,k:back};
$("#bK").addEventListener("click",act.k); $("#bP").addEventListener("click",act.p);
// Rotary encoder: drag in a circle, scroll, or use the arrow keys. One notch = 24 degrees.
const knob = $("#knob"); let ang = 0, last = null, acc = 0;
const spin = d => { ang += d*24; knob.style.transform = `rotate(${ang}deg)`; turn(d); };
const pa = e => { const r = knob.getBoundingClientRect(); return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI; };
knob.addEventListener("pointerdown", e => { last = pa(e); acc = 0; knob.setPointerCapture && knob.setPointerCapture(e.pointerId); e.preventDefault(); });
knob.addEventListener("pointermove", e => { if (last === null) return; const a = pa(e); let d = a-last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a; acc += d; while (acc >= 24) { acc -= 24; spin(1); } while (acc <= -24) { acc += 24; spin(-1); } });
["pointerup","pointercancel"].forEach(ev => knob.addEventListener(ev, () => { last = null; }));
knob.addEventListener("wheel", e => { e.preventDefault(); spin(e.deltaY > 0 ? 1 : -1); }, {passive:false});
knob.addEventListener("keydown", e => { const d = {ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1}[e.key]; if (d) { e.preventDefault(); spin(d); } if (e.key === "Enter" || e.key === " ") { e.preventDefault(); push(); } if (e.key === "Escape") back(); });
$("#simBody").addEventListener("keydown", e => { const k = {ArrowLeft:"l",ArrowRight:"r",ArrowUp:"l",ArrowDown:"r",Enter:"p"," ":"p",Escape:"k",Backspace:"k"}[e.key]; if (k) { e.preventDefault(); act[k](); } });
$("#simBody").addEventListener("wheel", e => { if (document.activeElement === $("#simBody")) { e.preventDefault(); turn(e.deltaY > 0 ? 1 : -1); } }, {passive:false});
$("#simPc").addEventListener("change", e => { s.pc = e.target.checked; if (s.pc && s.mod && !s.sys) send({type:"system_info",action:"request"}); });
$("#simUsb").addEventListener("change", e => { s.usb = e.target.checked; if (s.pc) { log("up",{type:"storage",action:"refresh"}); reply(500,() => recv(storMsg())); } });
let modT; $("#simMod").addEventListener("input", e => { const v = Math.max(0,Math.min(63,parseInt(e.target.value,10) || 0)); clearTimeout(modT); modT = setTimeout(() => { s.mod = v; s.sys = false; if (v) { log("up",{type:"module_detected",module_id:v}); send({type:"system_info",action:"request"}); } }, 50); });
let site = null; document.addEventListener("ml:render", () => { const l = document.documentElement.lang; if (site !== l) { s.en = l === "en"; site = l; } renderMon(); });
$("#simGame").addEventListener("change", e => { s.game = e.target.checked; });
$("#simCopy").addEventListener("click", () => { pcClip.unshift(copies[copyN++ % copies.length]); pcClip = pcClip.slice(0,6); if (s.page === "clip" && s.pc) reply(300,() => recv(clipMsg())); });
window.MODLINK_SIM = {s,turn,push,back,draw,tick};
setInterval(tick,100); tick();
})();
