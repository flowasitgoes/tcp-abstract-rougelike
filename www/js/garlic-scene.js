/**
 * 蒜頭 Canvas 場景：蒜瓣、外皮、根鬚、木砧板與柔光氣氛
 * 用於對話框上方顯示（obj_garlic），可 start/stop 動畫
 */
const GarlicScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "day";
  var particles = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;
  var scale = 1;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    scale = Math.min(W / 1400, H / 900);
    particles = Array.from({ length: 36 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.58,
        r: Math.random() * 2 + 0.8,
        s: Math.random() * 0.4 + 0.12,
        a: Math.random() * 0.18 + 0.05
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#8f8a8d",
        mid: "#d7a871",
        bottom: "#f1dcc5",
        sun: "#ffd8ae",
        glow: "rgba(255,214,178,0.22)",
        bulbLight: "#f1e8de",
        bulbMid: "#ddd0c1",
        bulbShadow: "#c7b7a5",
        skin: "#cfa37d",
        stem: "#8a9464",
        root: "#a37955",
        soil: "#64493a",
        board: "#bf8659",
        boardDark: "#925c3c"
      };
    }
    return {
      top: "#98b0bb",
      mid: "#dfcb9d",
      bottom: "#f5ecda",
      sun: "#fff7dc",
      glow: "rgba(255,248,218,0.18)",
      bulbLight: "#f4efe8",
      bulbMid: "#e6ddd2",
      bulbShadow: "#d0c4b2",
      skin: "#d8b08a",
      stem: "#909b69",
      root: "#aa815a",
      soil: "#6a4e3e",
      board: "#cb9363",
      boardDark: "#9f6b45"
    };
  }

  function drawBackground() {
    var p = palette();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, p.top);
    g.addColorStop(0.55, p.mid);
    g.addColorStop(1, p.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var sx = mode === "sunset" ? W * 0.76 : W * 0.23;
    var sy = H * 0.18;
    var rg = ctx.createRadialGradient(sx, sy, 8, sx, sy, Math.min(170, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,222,182,0.82)" : "rgba(255,248,220,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(170, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd8b0" : "#fff8df";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(46, W * 0.08), 0, Math.PI * 2);
    ctx.fill();

    for (var i = 0; i < 4; i++) {
      var baseY = H * (0.12 + i * 0.08);
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,226,205," + (0.07 + i * 0.02) + ")"
        : "rgba(255,255,245," + (0.05 + i * 0.02) + ")";
      ctx.beginPath();
      ctx.moveTo(-40, baseY);
      for (var x = -40; x <= W + 40; x += 30) {
        var y = baseY + Math.sin(x * 0.006 + t * 0.45 + i) * 8 + Math.cos(x * 0.004 + i) * 5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 40, baseY + 28);
      ctx.lineTo(-40, baseY + 28);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawBoard() {
    var p = palette();
    var x = W * 0.5;
    var y = H * 0.78;

    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.beginPath();
    ctx.ellipse(x, y + 90 * scale, 270 * scale, 36 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    var g = ctx.createLinearGradient(x - 250 * scale, y - 40 * scale, x + 250 * scale, y + 70 * scale);
    g.addColorStop(0, p.board);
    g.addColorStop(1, p.boardDark);
    ctx.fillStyle = g;

    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 250 * scale, y - 22 * scale, 500 * scale, 120 * scale, 34 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - 250 * scale, y - 22 * scale, 500 * scale, 120 * scale);
    }

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 214 * scale, y - 6 * scale, 26 * scale, 84 * scale, 14 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - 214 * scale, y - 6 * scale, 26 * scale, 84 * scale);
    }

    ctx.strokeStyle = "rgba(110,70,44,0.24)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 5; i++) {
      var yy = y + i * 18 * scale;
      ctx.beginPath();
      ctx.moveTo(x - 220 * scale, yy + Math.sin(i + t) * 2);
      ctx.lineTo(x + 220 * scale, yy + Math.cos(i + t) * 1.4);
      ctx.stroke();
    }
  }

  function drawGlow() {
    var p = palette();
    ctx.fillStyle = p.glow;
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.48, 220 * scale, 170 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBulbBody() {
    var p = palette();
    var cx = W * 0.5;
    var cy = H * 0.58;

    var g = ctx.createLinearGradient(cx - 120 * scale, cy - 120 * scale, cx + 120 * scale, cy + 120 * scale);
    g.addColorStop(0, p.bulbLight);
    g.addColorStop(0.55, p.bulbMid);
    g.addColorStop(1, p.bulbShadow);
    ctx.fillStyle = g;

    var cloves = [
      { x: -86, y: 10, rx: 72, ry: 104, rot: -0.32 },
      { x: -38, y: -28, rx: 74, ry: 116, rot: -0.12 },
      { x: 18, y: -36, rx: 78, ry: 122, rot: 0.08 },
      { x: 74, y: 4, rx: 76, ry: 108, rot: 0.28 },
      { x: -10, y: 34, rx: 88, ry: 110, rot: 0.02 }
    ];

    cloves.forEach(function (c, i) {
      ctx.save();
      ctx.translate(cx + c.x * scale, cy + c.y * scale);
      ctx.rotate(c.rot + Math.sin(t * 1.1 + i) * 0.006);
      ctx.beginPath();
      ctx.ellipse(0, 0, c.rx * scale, c.ry * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(160,145,128,0.18)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -c.ry * scale * 0.85);
      ctx.quadraticCurveTo(10 * scale, 0, 0, c.ry * scale * 0.85);
      ctx.stroke();
      ctx.restore();
    });

    ctx.fillStyle = p.skin;
    ctx.globalAlpha = 0.24;
    ctx.beginPath();
    ctx.moveTo(cx - 124 * scale, cy + 42 * scale);
    ctx.quadraticCurveTo(cx - 160 * scale, cy - 16 * scale, cx - 110 * scale, cy - 86 * scale);
    ctx.quadraticCurveTo(cx - 26 * scale, cy - 150 * scale, cx + 62 * scale, cy - 108 * scale);
    ctx.quadraticCurveTo(cx + 146 * scale, cy - 56 * scale, cx + 126 * scale, cy + 28 * scale);
    ctx.quadraticCurveTo(cx + 88 * scale, cy + 124 * scale, cx - 14 * scale, cy + 132 * scale);
    ctx.quadraticCurveTo(cx - 92 * scale, cy + 122 * scale, cx - 124 * scale, cy + 42 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawStemAndRoots() {
    var p = palette();
    var cx = W * 0.5;
    var cy = H * 0.58;

    ctx.strokeStyle = p.stem;
    ctx.lineWidth = 10 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + 4 * scale, cy - 120 * scale);
    ctx.quadraticCurveTo(cx + (18 + Math.sin(t) * 4) * scale, cy - 188 * scale, cx - 6 * scale, cy - 246 * scale);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(cx + 4 * scale, cy - 122 * scale);
    ctx.quadraticCurveTo(cx + 14 * scale, cy - 178 * scale, cx - 4 * scale, cy - 236 * scale);
    ctx.stroke();

    ctx.strokeStyle = p.root;
    ctx.lineWidth = 3 * scale;
    var rootBaseX = cx - 2 * scale;
    var rootBaseY = cy + 118 * scale;
    var roots = [
      [-8, 26, -28, 56],
      [2, 28, 8, 62],
      [10, 22, 32, 52],
      [-18, 18, -40, 42],
      [16, 18, 42, 38],
      [-2, 30, -6, 68]
    ];
    roots.forEach(function (r, i) {
      var dx1 = r[0], dy1 = r[1], dx2 = r[2], dy2 = r[3];
      ctx.beginPath();
      ctx.moveTo(rootBaseX, rootBaseY);
      ctx.quadraticCurveTo(
        rootBaseX + (dx1 + Math.sin(t + i) * 1.2) * scale,
        rootBaseY + dy1 * scale,
        rootBaseX + dx2 * scale,
        rootBaseY + dy2 * scale
      );
      ctx.stroke();
    });
  }

  function drawLooseCloves() {
    var p = palette();
    var cloves = [
      { x: W * 0.28, y: H * 0.73, scaleClove: 0.72, rot: -0.4 },
      { x: W * 0.72, y: H * 0.75, scaleClove: 0.82, rot: 0.46 }
    ];

    cloves.forEach(function (c, i) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot + Math.sin(t * 1.1 + i) * 0.01);
      ctx.scale(c.scaleClove * scale, c.scaleClove * scale);

      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.beginPath();
      ctx.ellipse(0, 74, 60, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      var g = ctx.createLinearGradient(-60, -70, 70, 80);
      g.addColorStop(0, p.bulbLight);
      g.addColorStop(0.6, p.bulbMid);
      g.addColorStop(1, p.bulbShadow);
      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(0, -72);
      ctx.bezierCurveTo(46, -54, 64, 12, 32, 66);
      ctx.bezierCurveTo(16, 90, -10, 92, -28, 70);
      ctx.bezierCurveTo(-60, 28, -48, -38, 0, -72);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = p.skin;
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.moveTo(-8, -58);
      ctx.quadraticCurveTo(30, -30, 30, 44);
      ctx.quadraticCurveTo(8, 82, -18, 58);
      ctx.quadraticCurveTo(-32, 22, -20, -30);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    });
  }

  function drawParticles() {
    particles.forEach(function (pt, i) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,220,165," + (pt.a + 0.03) + ")"
        : "rgba(255,255,238," + pt.a + ")";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();

      pt.y += pt.s * 0.25;
      pt.x += Math.sin(t + i) * 0.14;
      if (pt.y > H * 0.62) {
        pt.y = Math.random() * H * 0.42;
        pt.x = Math.random() * W;
      }
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawGlow();
    drawBoard();
    drawLooseCloves();
    drawBulbBody();
    drawStemAndRoots();
    drawParticles();
    t += 0.016;
    rafId = requestAnimationFrame(render);
  }

  function start(canvas) {
    stop();
    if (!canvas || !canvas.getContext) return;
    canvasEl = canvas;
    ctx = canvas.getContext("2d");
    t = 0;
    mode = "day";
    initArrays();
    rafId = requestAnimationFrame(render);
  }

  function stop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    canvasEl = null;
    ctx = null;
  }

  return { start: start, stop: stop };
})();
