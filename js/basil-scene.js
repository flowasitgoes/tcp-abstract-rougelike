/**
 * 九層塔 Canvas 場景：微風搖曳、陽光、花盆與濕潤土壤感
 * 用於對話框上方顯示（obj_basil），可 start/stop 動畫
 */
const BasilScene = (function () {
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
    particles = Array.from({ length: 40 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.55,
        r: Math.random() * 2.2 + 0.8,
        s: Math.random() * 0.5 + 0.15,
        a: Math.random() * 0.18 + 0.06
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#7d8d6b",
        mid: "#d6a96f",
        bottom: "#f0d8b8",
        sun: "#ffd8ab",
        glow: "rgba(255,210,160,0.22)",
        leaf1: "#3d6b3e",
        leaf2: "#4b7e4d",
        leaf3: "#2b4f2d",
        stem: "#6b7440",
        pot: "#b16a45",
        potDark: "#844b31",
        soil: "#584234"
      };
    }
    return {
      top: "#88ad84",
      mid: "#dcc889",
      bottom: "#f3e7c8",
      sun: "#fff6cf",
      glow: "rgba(255,245,200,0.18)",
      leaf1: "#427f49",
      leaf2: "#519958",
      leaf3: "#315f36",
      stem: "#6f7f45",
      pot: "#bb7248",
      potDark: "#8f5535",
      soil: "#5d4637"
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
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,220,178,0.8)" : "rgba(255,247,214,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(170, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd8ae" : "#fff8dc";
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

  function drawGroundShadow() {
    var scaleX = W / 1400;
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    for (var i = 0; i < 5; i++) {
      var x = (120 + i * 280) * scaleX;
      var y = H * (0.85 + (i % 2) * 0.015);
      ctx.beginPath();
      ctx.ellipse(x, y, 170 * scaleX, 34, -0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPot() {
    var p = palette();
    var x = W * 0.5;
    var y = H * 0.73;

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 120 * scale, 150 * scale, 26 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    var g = ctx.createLinearGradient(x - 120 * scale, y, x + 120 * scale, y + 120 * scale);
    g.addColorStop(0, p.pot);
    g.addColorStop(1, p.potDark);
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(x - 110 * scale, y + 8 * scale);
    ctx.lineTo(x + 110 * scale, y + 8 * scale);
    ctx.lineTo(x + 82 * scale, y + 118 * scale);
    ctx.lineTo(x - 82 * scale, y + 118 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#c37c52";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 126 * scale, y - 14 * scale, 252 * scale, 30 * scale, 16 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - 126 * scale, y - 14 * scale, 252 * scale, 30 * scale);
    }

    ctx.fillStyle = p.soil;
    ctx.beginPath();
    ctx.ellipse(x, y + 4 * scale, 98 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 106 * scale, y + 24 * scale, 24 * scale, 66 * scale, 12 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - 106 * scale, y + 24 * scale, 24 * scale, 66 * scale);
    }
  }

  function drawStem(points, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width * scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      var prev = points[i - 1];
      var cur = points[i];
      var cx = (prev.x + cur.x) / 2;
      var cy = (prev.y + cur.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
    }
    var last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  function drawLeaf(x, y, scaleLeaf, rot, colorA, colorB) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scaleLeaf * scale, scaleLeaf * scale);

    var g = ctx.createLinearGradient(-22, -8, 24, 14);
    g.addColorStop(0, colorA);
    g.addColorStop(1, colorB);
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(20, -18, 42, -8, 48, 0);
    ctx.bezierCurveTo(42, 10, 20, 20, 0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-20, -18, -42, -8, -48, 0);
    ctx.bezierCurveTo(-42, 10, -20, 20, 0, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 18);
    ctx.moveTo(0, -6);
    ctx.lineTo(18, -2);
    ctx.moveTo(0, 2);
    ctx.lineTo(-18, 6);
    ctx.stroke();

    ctx.restore();
  }

  function drawFlowerSpike(x, y, scaleSpike) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleSpike * scale, scaleSpike * scale);
    ctx.strokeStyle = "#846b5c";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(0, -36);
    ctx.stroke();

    for (var i = 0; i < 7; i++) {
      var py = 26 - i * 10;
      ctx.fillStyle = i % 2 === 0 ? "#d7c2c9" : "#c9b0be";
      ctx.beginPath();
      ctx.ellipse(-6, py, 6, 4, -0.4, 0, Math.PI * 2);
      ctx.ellipse(6, py - 2, 6, 4, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBasilPlant() {
    var p = palette();
    var baseX = W * 0.5;
    var baseY = H * 0.735;
    var sway = Math.sin(t * 1.7) * 8 * scale;

    drawStem([
      { x: baseX, y: baseY + 6 * scale },
      { x: baseX - 4 * scale + sway * 0.15, y: baseY - 38 * scale },
      { x: baseX + 6 * scale + sway * 0.3, y: baseY - 96 * scale },
      { x: baseX + sway * 0.45, y: baseY - 186 * scale }
    ], 10, p.stem);

    drawStem([
      { x: baseX - 8 * scale, y: baseY - 24 * scale },
      { x: baseX - 44 * scale + sway * 0.35, y: baseY - 80 * scale },
      { x: baseX - 92 * scale + sway * 0.6, y: baseY - 152 * scale }
    ], 8, p.stem);

    drawStem([
      { x: baseX + 10 * scale, y: baseY - 30 * scale },
      { x: baseX + 62 * scale + sway * 0.35, y: baseY - 92 * scale },
      { x: baseX + 110 * scale + sway * 0.65, y: baseY - 164 * scale }
    ], 8, p.stem);

    drawStem([
      { x: baseX - 6 * scale, y: baseY - 72 * scale },
      { x: baseX - 52 * scale + sway * 0.2, y: baseY - 130 * scale },
      { x: baseX - 78 * scale + sway * 0.35, y: baseY - 206 * scale }
    ], 6, p.stem);

    drawStem([
      { x: baseX + 6 * scale, y: baseY - 80 * scale },
      { x: baseX + 48 * scale + sway * 0.25, y: baseY - 142 * scale },
      { x: baseX + 72 * scale + sway * 0.4, y: baseY - 220 * scale }
    ], 6, p.stem);

    var leaves = [
      [baseX - 18 * scale, baseY - 18 * scale, 1.0, -0.3],
      [baseX + 22 * scale, baseY - 26 * scale, 1.1, 0.32],
      [baseX - 46 * scale, baseY - 64 * scale, 1.18, -0.55],
      [baseX + 54 * scale, baseY - 72 * scale, 1.16, 0.56],
      [baseX - 12 * scale, baseY - 74 * scale, 0.92, -0.1],
      [baseX + 14 * scale, baseY - 98 * scale, 0.96, 0.16],
      [baseX - 82 * scale, baseY - 128 * scale, 1.02, -0.48],
      [baseX - 28 * scale, baseY - 122 * scale, 0.9, -0.2],
      [baseX + 84 * scale, baseY - 136 * scale, 1.05, 0.46],
      [baseX + 24 * scale, baseY - 140 * scale, 0.94, 0.22],
      [baseX - 70 * scale, baseY - 182 * scale, 0.92, -0.4],
      [baseX + 62 * scale, baseY - 192 * scale, 0.88, 0.36],
      [baseX + sway * 0.45, baseY - 170 * scale, 0.86, 0.05]
    ];

    leaves.forEach(function (leaf, i) {
      var lx = leaf[0] + Math.sin(t * 1.6 + i) * 2 * scale;
      var ly = leaf[1];
      var s = leaf[2];
      var r = leaf[3] + Math.sin(t * 2 + i) * 0.06;
      drawLeaf(lx, ly, s, r, p.leaf2, i % 2 === 0 ? p.leaf1 : p.leaf3);
    });

    drawFlowerSpike(baseX + sway * 0.42, baseY - 214 * scale, 0.92);
    drawFlowerSpike(baseX - 76 * scale + sway * 0.35, baseY - 232 * scale, 0.78);
    drawFlowerSpike(baseX + 72 * scale + sway * 0.3, baseY - 246 * scale, 0.82);
  }

  function drawGlow() {
    var p = palette();
    ctx.fillStyle = p.glow;
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.48, 240 * scale, 190 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawParticles() {
    particles.forEach(function (pt, i) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,220,165," + (pt.a + 0.03) + ")"
        : "rgba(255,255,235," + pt.a + ")";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();

      pt.y += pt.s * 0.3;
      pt.x += Math.sin(t + i) * 0.15;
      if (pt.y > H * 0.62) {
        pt.y = Math.random() * H * 0.4;
        pt.x = Math.random() * W;
      }
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawGroundShadow();
    drawGlow();
    drawPot();
    drawBasilPlant();
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
