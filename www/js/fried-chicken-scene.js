/**
 * 鹹酥雞 Canvas 場景：炸雞塊、九層塔、胡椒粒與熱氣微粒
 * 用於對話框上方顯示（stall_buy 購買後），可 start/stop 動畫
 */
const FriedChickenScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "warm";
  var crumbs = [];
  var steam = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;
  var scale = 1;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    scale = Math.min(W / 1400, H / 900);
    crumbs = Array.from({ length: 70 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.42 + Math.random() * 0.5),
        r: Math.random() * 2.3 + 0.7,
        a: Math.random() * 0.2 + 0.05,
        drift: Math.random() * 0.4 + 0.1
      };
    });
    steam = Array.from({ length: 12 }, function (_, i) {
      return {
        x: W * 0.42 + i * 28 * scale + Math.random() * 16 * scale,
        y: H * 0.46 + Math.random() * 30 * scale,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.5
      };
    });
  }

  function palette() {
    if (mode === "night") {
      return {
        top: "#4a3454",
        mid: "#a65b6e",
        bottom: "#f0c38f",
        sun: "#ffd8af",
        glow: "rgba(255,120,170,0.18)",
        paper: "#ead7aa",
        paperShadow: "#ccb17b",
        board: "#b77749",
        boardDark: "#834d31",
        pepper: "#241a16"
      };
    }
    return {
      top: "#955f43",
      mid: "#d99b61",
      bottom: "#f7e1c0",
      sun: "#ffe4bb",
      glow: "rgba(255,220,170,0.18)",
      paper: "#f2e2bb",
      paperShadow: "#d9c18f",
      board: "#ca8d58",
      boardDark: "#995f3d",
      pepper: "#382822"
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

    var sx = mode === "night" ? W * 0.76 : W * 0.24;
    var sy = H * 0.18;
    var rg = ctx.createRadialGradient(sx, sy, 8, sx, sy, Math.min(170, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "night" ? "rgba(255,190,210,0.6)" : "rgba(255,236,198,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(170, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "night" ? "rgba(255,150,210,0.12)" : "rgba(255,255,245,0.06)";
    for (var i = 0; i < 4; i++) {
      var baseY = H * (0.12 + i * 0.08);
      ctx.beginPath();
      ctx.moveTo(-40, baseY);
      for (var x = -40; x <= W + 40; x += 28) {
        var y = baseY + Math.sin(x * 0.006 + t * 0.45 + i) * 8 + Math.cos(x * 0.004 + i) * 5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 40, baseY + 28);
      ctx.lineTo(-40, baseY + 28);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawTray() {
    var p = palette();
    var x = W * 0.5;
    var y = H * 0.8;

    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath();
    ctx.ellipse(x, y + 92 * scale, 300 * scale, 40 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    var g = ctx.createLinearGradient(x - 280 * scale, y - 20 * scale, x + 280 * scale, y + 80 * scale);
    g.addColorStop(0, p.board);
    g.addColorStop(1, p.boardDark);
    ctx.fillStyle = g;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 280 * scale, y - 6 * scale, 560 * scale, 122 * scale, 36 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - 280 * scale, y - 6 * scale, 560 * scale, 122 * scale);
    }

    ctx.strokeStyle = "rgba(95,60,38,0.2)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 5; i++) {
      var yy = y + i * 18 * scale;
      ctx.beginPath();
      ctx.moveTo(x - 248 * scale, yy + Math.sin(i + t) * 2);
      ctx.lineTo(x + 248 * scale, yy + Math.cos(i + t) * 1.3);
      ctx.stroke();
    }
  }

  function drawGlow() {
    var p = palette();
    ctx.fillStyle = p.glow;
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.48, 235 * scale, 180 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPaperBag() {
    var p = palette();
    var x = W * 0.5;
    var y = H * 0.55;
    var sway = Math.sin(t * 1.2) * 2 * scale;

    ctx.save();
    ctx.translate(sway, 0);

    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.beginPath();
    ctx.ellipse(x, y + 198 * scale, 178 * scale, 24 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    var g = ctx.createLinearGradient(x - 140 * scale, y - 110 * scale, x + 140 * scale, y + 180 * scale);
    g.addColorStop(0, p.paper);
    g.addColorStop(0.6, p.paperShadow);
    g.addColorStop(1, "#b39162");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - 130 * scale, y - 42 * scale);
    ctx.lineTo(x + 126 * scale, y - 42 * scale);
    ctx.lineTo(x + 152 * scale, y + 166 * scale);
    ctx.lineTo(x - 152 * scale, y + 166 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.moveTo(x - 130 * scale, y - 42 * scale);
    ctx.lineTo(x + 126 * scale, y - 42 * scale);
    ctx.lineTo(x + 102 * scale, y - 8 * scale);
    ctx.lineTo(x - 102 * scale, y - 8 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(130,100,68,0.4)";
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(x, y - 40 * scale);
    ctx.lineTo(x + 8 * scale, y + 160 * scale);
    ctx.stroke();

    ctx.restore();
  }

  function drawFriedPiece(x, y, scalePiece, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot + Math.sin(t * 1.4 + x * 0.01) * 0.01);
    ctx.scale(scalePiece, scalePiece);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 34, 42, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    var g = ctx.createLinearGradient(-40, -30, 40, 44);
    g.addColorStop(0, "#e0a458");
    g.addColorStop(0.5, "#c67834");
    g.addColorStop(1, "#8a4d22");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-36, -6);
    ctx.lineTo(-22, -28);
    ctx.lineTo(10, -30);
    ctx.lineTo(32, -14);
    ctx.lineTo(38, 8);
    ctx.lineTo(24, 28);
    ctx.lineTo(-6, 34);
    ctx.lineTo(-30, 18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,210,130,0.18)";
    [[-12, -10, 8], [6, -12, 7], [20, 4, 6], [-18, 8, 5]].forEach(function (arr) {
      var px = arr[0], py = arr[1], r = arr[2];
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawBasilLeaf(x, y, scaleLeaf, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot + Math.sin(t * 1.7 + x) * 0.04);
    ctx.scale(scaleLeaf, scaleLeaf);
    var g = ctx.createLinearGradient(-16, -10, 16, 14);
    g.addColorStop(0, "#5b9945");
    g.addColorStop(1, "#2f5f2e");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.bezierCurveTo(18, -18, 22, 10, 0, 28);
    ctx.bezierCurveTo(-22, 10, -18, -18, 0, -26);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.stroke();
    ctx.restore();
  }

  function drawPepper(px, py, r) {
    ctx.fillStyle = mode === "night" ? "#241a16" : "#342520";
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawContents() {
    var sway = Math.sin(t * 1.2) * 2 * scale;
    var pieces = [
      [W * 0.41 + sway, H * 0.49, 1.1 * scale, -0.24],
      [W * 0.49 + sway, H * 0.46, 1.25 * scale, 0.18],
      [W * 0.58 + sway, H * 0.48, 1.18 * scale, -0.12],
      [W * 0.45 + sway, H * 0.56, 1.06 * scale, 0.28],
      [W * 0.54 + sway, H * 0.56, 1.1 * scale, -0.2],
      [W * 0.36 + sway, H * 0.56, 0.96 * scale, 0.14],
      [W * 0.63 + sway, H * 0.55, 0.94 * scale, 0.3]
    ];
    pieces.forEach(function (p) {
      drawFriedPiece(p[0], p[1], p[2], p[3]);
    });

    var basil = [
      [W * 0.39 + sway, H * 0.43, 0.9 * scale, -0.3],
      [W * 0.56 + sway, H * 0.42, 1.0 * scale, 0.24],
      [W * 0.61 + sway, H * 0.5, 0.88 * scale, -0.5],
      [W * 0.44 + sway, H * 0.61, 0.78 * scale, 0.35],
      [W * 0.52 + sway, H * 0.62, 0.82 * scale, -0.2]
    ];
    basil.forEach(function (b) {
      drawBasilLeaf(b[0], b[1], b[2], b[3]);
    });

    for (var i = 0; i < 36; i++) {
      var px = W * 0.36 + ((i * 23) % 260) * scale + sway;
      var py = H * 0.44 + ((i * 17) % 150) * scale;
      drawPepper(px + Math.sin(i) * 4 * scale, py + Math.cos(i * 1.3) * 3 * scale, (2 + (i % 3) * 0.7) * scale);
    }
  }

  function drawLoosePieces() {
    drawFriedPiece(W * 0.24, H * 0.78, 0.88 * scale, -0.35);
    drawFriedPiece(W * 0.74, H * 0.81, 0.82 * scale, 0.28);
    drawBasilLeaf(W * 0.18, H * 0.79, 0.7 * scale, -0.15);
    drawBasilLeaf(W * 0.8, H * 0.78, 0.74 * scale, 0.22);
    for (var i = 0; i < 10; i++) {
      drawPepper(W * 0.23 + i * 12 * scale, H * 0.84 + (i % 2) * 4 * scale, 2.1 * scale);
    }
  }

  function drawSteam() {
    steam.forEach(function (s, i) {
      var x = s.x + Math.sin(t * s.speed + s.phase) * 8 * scale;
      var y = s.y - (Math.sin(t * 1.2 + i) + 1) * 14 * scale;
      ctx.strokeStyle = mode === "night"
        ? "rgba(255,210,230," + (0.08 + i * 0.003) + ")"
        : "rgba(255,255,255," + (0.07 + i * 0.003) + ")";
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(x, y + 80 * scale);
      ctx.bezierCurveTo(x - 14 * scale, y + 48 * scale, x + 16 * scale, y + 30 * scale, x + 4 * scale, y);
      ctx.stroke();
    });
  }

  function drawCrumbs() {
    crumbs.forEach(function (c, i) {
      ctx.fillStyle = mode === "night"
        ? "rgba(255,210,155," + c.a + ")"
        : "rgba(255,235,190," + c.a + ")";
      ctx.beginPath();
      ctx.arc(c.x + Math.sin(t + i) * c.drift, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawTray();
    drawGlow();
    drawContents();
    drawPaperBag();
    drawLoosePieces();
    drawSteam();
    drawCrumbs();
    t += 0.016;
    rafId = requestAnimationFrame(render);
  }

  function start(canvas) {
    stop();
    if (!canvas || !canvas.getContext) return;
    canvasEl = canvas;
    ctx = canvas.getContext("2d");
    t = 0;
    mode = "warm";
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
