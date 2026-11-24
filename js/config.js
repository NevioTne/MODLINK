// Central configuration. Empty string = not set yet (button shows as "not available").
window.MODLINK_CONFIG = {
  projectName: "MODLINK",
  version: "V1.16",                 // firmware version
  copyright: "© 2026 Nevio Tolone",
  studioVersion: "0.8.0",           // MODLINK Studio version shown on the site (empty = hide)
  // Status per function: "available" | "dev" | "planned" | "soon". Update when a new version ships.
  status: { dash:"available", blocks:"dev", diag:"available", fps:"dev", task:"available", media:"available", clip:"dev", storage:"dev", sysinfo:"dev" },
  repoUrl: "",                      // TODO: e.g. https://github.com/<user>/<repo>
  releasesUrl: "",                  // TODO: e.g. https://github.com/<user>/<repo>/releases
  downloadUrl: "",                  // TODO: PC software download (GitHub release asset)
  docsUrl: "",                      // TODO: general documentation URL
  // Per-topic docs: set a URL only when the document really exists.
  docs: { start: "", hardware: "", software: "", firmware: "", connection: "", trouble: "", faq: "" },
  // Gallery images (relative paths, e.g. "assets/images/hardware.jpg"). Empty = placeholder.
  gallery: { hardware: "", menu: "", status: "", diag: "", tasks: "", media: "", settings: "", pc: "" }
};
