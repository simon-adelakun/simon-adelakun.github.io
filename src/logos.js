// Logos des technologies dessinés en vectoriel (canvas 2D), centrés sur (0,0), dans une zone d'environ ±100.
// fg = couleur du tracé, bg = couleur du fond (pour les découpes). Aucun fichier image n'est nécessaire.
const T = (c, s, x, y, sz, col) => { c.fillStyle = col; c.font = `800 ${sz}px Syne, Arial, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y) }
const poly = (c, pts, fill) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); fill ? c.fill() : c.stroke() }
const line = (c, x1, y1, x2, y2) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke() }
const arrow = (c, x1, y1, x2, y2) => {
  line(c, x1, y1, x2, y2)
  const a = Math.atan2(y2 - y1, x2 - x1)
  line(c, x2, y2, x2 - 26 * Math.cos(a - 0.5), y2 - 26 * Math.sin(a - 0.5))
  line(c, x2, y2, x2 - 26 * Math.cos(a + 0.5), y2 - 26 * Math.sin(a + 0.5))
}
const shield = (c, fg, bg, n) => { c.fillStyle = fg; poly(c, [[-78, -92], [78, -92], [66, 66], [0, 98], [-66, 66]], true); T(c, n, 0, -8, 120, bg) }
const db = (c, fg) => {
  c.strokeStyle = fg; c.lineWidth = 11
  line(c, -66, -52, -66, 52); line(c, 66, -52, 66, 52)
  ;[-52, 0, 52].forEach((y) => { c.beginPath(); c.ellipse(0, y, 66, 22, 0, y === -52 ? 0 : 0, y === -52 ? 7 : Math.PI); c.stroke() })
}
const atom = (c, fg, rx = 92, ry = 36) => {
  c.strokeStyle = fg; c.lineWidth = 9
  ;[0, Math.PI / 3, (2 * Math.PI) / 3].forEach((a) => { c.beginPath(); c.ellipse(0, 0, rx, ry, a, 0, 7); c.stroke() })
}

const LOGOS = {
  React: (c, f) => { atom(c, f); c.fillStyle = f; c.beginPath(); c.arc(0, 0, 14, 0, 7); c.fill() },
  RN: (c, f, b) => { atom(c, f, 90, 34); c.fillStyle = f; c.beginPath(); c.roundRect(-20, -34, 40, 68, 8); c.fill(); c.fillStyle = b; c.beginPath(); c.roundRect(-13, -24, 26, 44, 4); c.fill() },
  JS: (c, f, b) => { c.fillStyle = f; c.beginPath(); c.roundRect(-86, -86, 172, 172, 18); c.fill(); T(c, 'JS', 30, 38, 96, b) },
  HTML: (c, f, b) => shield(c, f, b, '5'),
  CSS: (c, f, b) => shield(c, f, b, '3'),
  PHP: (c, f) => { c.strokeStyle = f; c.lineWidth = 11; c.beginPath(); c.ellipse(0, 0, 98, 58, 0, 0, 7); c.stroke(); T(c, 'php', 0, 2, 82, f) },
  Laravel: (c, f) => { c.strokeStyle = f; c.lineWidth = 12; const h = (r) => Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3 - Math.PI / 6) * r, Math.sin((i * Math.PI) / 3 - Math.PI / 6) * r]); poly(c, h(92), false); T(c, 'L', 0, 4, 100, f) },
  Python: (c, f) => { T(c, 'Py', 0, 4, 120, f) },
  Django: (c, f) => { T(c, 'dj', 0, 4, 130, f) },
  PostgreSQL: (c, f) => db(c, f),
  JWT: (c, f) => { T(c, 'JWT', 0, 4, 84, f) },
  Celery: (c, f) => { T(c, 'Ce', 0, 4, 120, f) },
  Redis: (c, f) => { T(c, 'Rd', 0, 4, 120, f) },
  MySQL: (c, f) => { T(c, 'My', -2, -30, 84, f); T(c, 'SQL', 0, 42, 84, f) },
  SQL: (c, f) => db(c, f),
  Git: (c, f, b) => {
    c.save(); c.rotate(Math.PI / 4); c.fillStyle = f; c.beginPath(); c.roundRect(-66, -66, 132, 132, 14); c.fill(); c.restore()
    c.strokeStyle = b; c.lineWidth = 13; line(c, -6, -42, -6, 38); line(c, -6, -8, 32, -26)
    c.fillStyle = b; ;[[-6, -42], [-6, 38], [34, -26]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 16, 0, 7); c.fill() })
  },
  GitHub: (c, f, b) => {
    c.fillStyle = f; c.beginPath(); c.arc(0, 0, 94, 0, 7); c.fill()
    c.fillStyle = b; c.beginPath(); c.arc(0, 8, 54, 0, 7); c.fill(); poly(c, [[-52, -26], [-24, -62], [-14, -24]], true); poly(c, [[52, -26], [24, -62], [14, -24]], true)
    c.fillStyle = f; c.beginPath(); c.arc(-20, 2, 9, 0, 7); c.arc(20, 2, 9, 0, 7); c.fill()
  },
  Vite: (c, f) => { c.fillStyle = f; poly(c, [[-62, -92], [80, -92], [18, -14], [72, -14], [-38, 98], [-8, 8], [-64, 8]], true) },
  Vercel: (c, f) => { c.fillStyle = f; poly(c, [[0, -84], [96, 74], [-96, 74]], true) },
  Render: (c, f) => { c.strokeStyle = f; c.lineWidth = 16; c.beginPath(); c.arc(0, 0, 84, 0.35, Math.PI * 2 - 0.35); c.stroke(); T(c, 'R', 0, 4, 100, f) },
  Aiven: (c, f) => T(c, 'Ai', 0, 4, 120, f),
  Sanctum: (c, f, b) => { shield(c, f, b, ''); c.fillStyle = b; c.beginPath(); c.arc(0, -18, 22, 0, 7); c.fill(); c.fillRect(-9, -8, 18, 48) },
  REST: (c, f) => { c.strokeStyle = f; c.lineWidth = 14; arrow(c, -84, -32, 76, -32); arrow(c, 84, 36, -76, 36) },
  MERISE: (c, f) => { c.strokeStyle = f; c.lineWidth = 11; c.strokeRect(-98, -34, 58, 68); c.strokeRect(40, -34, 58, 68); poly(c, [[0, -34], [28, 0], [0, 34], [-28, 0]], false); line(c, -40, 0, -28, 0); line(c, 28, 0, 40, 0) },
  JSON: (c, f) => T(c, '{ }', 0, 0, 120, f),
  Fetch: (c, f) => { c.strokeStyle = f; c.lineWidth = 14; arrow(c, -34, 82, -34, -76); arrow(c, 34, -82, 34, 76) },
}

export function drawLogo(name, c, fg, bg) {
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'
  ;(LOGOS[name] || ((cc, f) => T(cc, name, 0, 0, 70, f)))(c, fg, bg)
  c.restore()
}
