/* Throwaway: static waveform renderer. Fills any [data-wave="w1|w2|w3"] element with an SVG
   sized to its own pixel box. Deterministic (seeded); rebuilt only when the box width changes. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  // seeded PRNG (mulberry32)
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // 1-D value noise on a seeded lattice, so the shape is the same at every width
  function lattice(seed, n) { var r = rng(seed), a = []; for (var i = 0; i <= n; i++) a.push(r()); return a; }
  var FINE = lattice(11, 1200), MID = lattice(23, 60);
  function noise(tab, x) {
    var i = Math.floor(x), f = x - i, a = tab[i % tab.length], b = tab[(i + 1) % tab.length];
    f = f * f * (3 - 2 * f); return a + (b - a) * f;
  }
  function smooth(e0, e1, x) { var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }

  // song-shaped loudness: quiet intro, build, verse/chorus dynamics, short break, last chorus, tail
  var KEYS = [[0, .02], [.03, .14], [.10, .18], [.13, .30], [.22, .62], [.30, .58], [.40, .66],
              [.44, .92], [.56, .96], [.60, .40], [.65, .44], [.69, .98], [.84, 1], [.89, .55], [.95, .16], [1, .02]];
  function envelope(t) {
    for (var i = 1; i < KEYS.length; i++) if (t <= KEYS[i][0]) {
      var a = KEYS[i - 1], b = KEYS[i]; return a[1] + (b[1] - a[1]) * smooth(a[0], b[0], t);
    }
    return 0;
  }
  function loud(t) {          // W1: envelope x beat pulses x fine detail
    var beat = .8 + .2 * Math.pow(Math.abs(Math.cos(t * Math.PI * 64)), 4);
    return Math.min(1, envelope(t) * beat * (.62 + .38 * noise(FINE, t * 1100)) * (.9 + .1 * noise(MID, t * 50)) * 1.08);
  }
  function overview(t) {      // W2: smoothed loudness
    return envelope(t) * (.9 + .1 * noise(MID, t * 36));
  }

  function el(name, attrs) { var e = document.createElementNS(NS, name); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  // Catmull-Rom through points -> cubic Bezier path
  function curve(p) {
    var d = 'M' + p[0][0].toFixed(2) + ',' + p[0][1].toFixed(2);
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) + ' ' +
           (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) + ' ' +
           p2[0].toFixed(2) + ',' + p2[1].toFixed(2);
    }
    return d;
  }

  var uid = 0;
  var draw = {
    w1: function (svg, W, H, host) {          // DAW clip: 2px mirrored bars, played part in accent
      var split = parseFloat(host.dataset.split || '.35'), pitch = 4, bw = 2, mid = H / 2;
      var n = Math.floor((W + (pitch - bw)) / pitch), x0 = Math.floor((W - (n * pitch - (pitch - bw))) / 2);
      var k = Math.round(n * split), played = el('g', { 'class': 'played' }), rest = el('g', { 'class': 'rest' });
      for (var i = 0; i < n; i++) {
        var h = Math.max(1, Math.round(loud((i + .5) / n) * (mid - 3)));
        (i < k ? played : rest).appendChild(el('rect', { x: x0 + i * pitch, y: mid - h, width: bw, height: 2 * h }));
      }
      svg.appendChild(played); svg.appendChild(rest);
      svg.appendChild(el('rect', { 'class': 'playhead', x: x0 + k * pitch - 1, y: 0, width: 1, height: H }));
    },
    w2: function (svg, W, H) {                // Envelope overview: smooth filled mirrored shape
      var n = 180, mid = H / 2, top = [], bot = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n, a = overview(t) * (mid - 2);
        top.push([t * W, mid - a]); bot.push([t * W, mid + a]);
      }
      var d = curve(top) + 'L' + curve(bot.reverse()).slice(1) + 'Z';
      svg.appendChild(el('path', { 'class': 'env', d: d }));
      svg.appendChild(el('rect', { 'class': 'axis', x: 0, y: mid - .5, width: W, height: 1 }));
    },
    w3: function (svg, W, H) {                // Oscilloscope: one smooth AM hairline, fading at both ends
      var id = 'osc' + (++uid), n = Math.max(480, Math.round(W)), mid = H / 2, p = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n, win = Math.pow(Math.sin(Math.PI * t), 1.2);
        var am = .35 + .65 * Math.pow(Math.sin(t * Math.PI * 2.5 + .3), 2);
        var s = .86 * Math.sin(t * Math.PI * 2 * 26) + .14 * Math.sin(t * Math.PI * 2 * 52 + .8);
        p.push([t * W, mid - s * am * win * (mid - 3)]);
      }
      var g = el('linearGradient', { id: id, x1: 0, x2: 1, y1: 0, y2: 0 });
      [[0, 0], [.18, 1], [.82, 1], [1, 0]].forEach(function (s) {
        g.appendChild(el('stop', { offset: s[0], 'stop-color': 'currentColor', 'stop-opacity': s[1] }));
      });
      var defs = el('defs', {}); defs.appendChild(g); svg.appendChild(defs);
      svg.appendChild(el('path', { 'class': 'osc', d: curve(p), fill: 'none', stroke: 'url(#' + id + ')', 'stroke-width': 1.25 }));
    }
  };

  function render(host) {
    var W = Math.round(host.clientWidth), H = Math.round(host.clientHeight);
    if (!W || !H || host._w === W) return;
    host._w = W;
    var svg = el('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true', focusable: 'false' });
    if (host.dataset.wave === 'w1') svg.setAttribute('shape-rendering', 'crispEdges');
    draw[host.dataset.wave](svg, W, H, host);
    host.replaceChildren(svg);
  }
  function init() {
    var hosts = document.querySelectorAll('[data-wave]');
    hosts.forEach(render);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function (es) { es.forEach(function (e) { render(e.target); }); });
      hosts.forEach(function (h) { ro.observe(h); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
