// Block Studio, counters and short bullets (same central translation object).
(() => { const I = window.MODLINK_I18N;
Object.assign(I.en.mk, {bt_trig:"MODLINK button",bt_trig_s:"K0 pressed",bt_chk:"Check process",bt_chk_s:"app.exe",bt_if:"If / Else",bt_if_s:"running?",bt_fg:"Bring to foreground",bt_vol:"Set volume",bt_vol_s:"65 %",bt_start:"Start application",bt_start_s:"app.exe",bt_true:"true",bt_false:"false",bt_import:"Import",bt_export:"Export",bt_check:"Check",bt_save:"Save",bt_run:"Run"});
Object.assign(I.de.mk, {bt_trig:"MODLINK-Taste",bt_trig_s:"K0 gedrückt",bt_chk:"Prozess prüfen",bt_chk_s:"app.exe",bt_if:"Wenn / Sonst",bt_if_s:"läuft?",bt_fg:"In den Vordergrund",bt_vol:"Lautstärke setzen",bt_vol_s:"65 %",bt_start:"Anwendung starten",bt_start_s:"app.exe",bt_true:"wahr",bt_false:"falsch",bt_import:"Import",bt_export:"Export",bt_check:"Prüfen",bt_save:"Speichern",bt_run:"Ausführen"});
I.en.blk_tr = ["Application started","Application closed","Key combination","Timed","System event","Start manually","Controller connected"];
I.de.blk_tr = ["Anwendung gestartet","Anwendung geschlossen","Tastenkombination","Zeitgesteuert","Systemereignis","Manuell starten","Controller verbunden"];
I.en.blk_act = ["Check process","If / Else","Bring to foreground","Set volume","Show overlay","Send display content","Change accent color","Update display"];
I.de.blk_act = ["Prozess prüfen","Wenn / Sonst","In den Vordergrund holen","Lautstärke setzen","Overlay anzeigen","Displayinhalt senden","Akzentfarbe ändern","Display aktualisieren"];
I.en.stu_blocks.blocks = {n:"Block Studio",tag:"Build your own flows with connected blocks",d:"Drag blocks onto the canvas and connect them. A trigger such as a MODLINK button press starts the flow.",b:["Triggers: buttons, apps, key combos, time","Actions on your PC and the device display","Conditions with If / Else","Import, export, check and run"]};
I.de.stu_blocks.blocks = {n:"Block Studio",tag:"Baue eigene Abläufe aus verbundenen Blöcken",d:"Ziehe Blöcke auf die Fläche und verbinde sie. Ein Auslöser wie ein Druck auf die MODLINK-Taste startet den Ablauf.",b:["Auslöser: Tasten, Apps, Tastenkombis, Zeit","Aktionen am PC und auf dem Geräte-Display","Bedingungen mit Wenn / Sonst","Import, Export, Prüfen und Ausführen"]};
I.en.stu_blocks.media.b[3] = "Compatibility depends on the media app"; I.de.stu_blocks.media.b[3] = "Die Kompatibilität hängt von der Medienanwendung ab";
I.en.stu_blocks.storage.b[2] = "Never deletes automatically"; I.de.stu_blocks.storage.b[2] = "Löscht nie automatisch";
I.en.stats = [[6,"Main areas"],[9,"Accent colors"],[5,"Themes"],[6,"Clipboard entries"],[12,"History points"],[2,"Languages"]];
I.de.stats = [[6,"Hauptbereiche"],[9,"Akzentfarben"],[5,"Darstellungsmodi"],[6,"Ablage-Einträge"],[12,"Verlaufspunkte"],[2,"Sprachen"]];
})();
