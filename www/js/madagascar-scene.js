/**
 * 馬達加斯加旅人 Canvas 場景：猴麵包樹、紅土道路、狐猴、岩地與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const MadagascarScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "day";
  var dusts = [];
  var grasses = [];
  var fireflies = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    dusts = Array.from({ length: 50 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.5 + Math.random() * 0.45),
        r: Math.random() * 2 + 0.7,
        s: Math.random() * 0.8 + 0.25,
        dx: Math.random() * 1 + 0.2,
        a: Math.random() * 0.24 + 0.06
      };
    });
    grasses = Array.from({ length: 80 }, function () {
      return {
        x: Math.random() * W,
        h: Math.random() * 20 + 8,
        lean: Math.random() * 8 - 4,
        w: Math.random() * 1.5 + 0.8
      };
    });
    fireflies = Array.from({ length: 20 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.35 + Math.random() * 0.45),
        r: Math.random() * 1.5 + 1,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#5a6280",
        mid: "#df8f51",
        bottom: "#f2c996",
        sun: "#ffd29f",
        haze: "rgba(255,188,120,0.24)",
        ground1: "#c67c4d",
        ground2: "#8f5a38",
        distant: "#7b6b68",
        sea: "#82a7b2"
      };
    }
    return {
      top: "#5a84ab",
      mid: "#f1b36e",
      bottom: "#f7e2bf",
      sun: "#fff0ca",
      haze: "rgba(255,240,200,0.16)",
      ground1: "#d3935b",
      ground2: "#9d6941",
      distant: "#86756f",
      sea: "#7ab2c0"
    };
  }

  function drawSky() {
    var p = palette();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, p.top);
    g.addColorStop(0.52, p.mid);
    g.addColorStop(1, p.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var sx = mode === "sunset" ? W * 0.75 : W * 0.2;
    var sy = H * 0.18;
    var rg = ctx.createRadialGradient(sx, sy, 12, sx, sy, Math.min(120, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,215,165,0.82)" : "rgba(255,245,215,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(120, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd7ab" : "#fff6d8";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(32, W * 0.07), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCloudBands() {
    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,220,195," + (0.07 + i * 0.03) + ")"
        : "rgba(255,255,245," + (0.05 + i * 0.02) + ")";
      var baseY = H * (0.12 + i * 0.08);
      ctx.beginPath();
      ctx.moveTo(-50, baseY);
      for (var x = -50; x <= W + 50; x += 30) {
        var y = baseY + Math.sin(x * 0.006 + t * 0.5 + i) * 10 + Math.cos(x * 0.004 + i) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 50, baseY + 34);
      ctx.lineTo(-50, baseY + 34);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawDistantLand() {
    var p = palette();
    var scaleX = W / 1400;
    ctx.fillStyle = p.distant;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.62);
    ctx.lineTo(130 * scaleX, H * 0.55);
    ctx.lineTo(260 * scaleX, H * 0.6);
    ctx.lineTo(430 * scaleX, H * 0.52);
    ctx.lineTo(610 * scaleX, H * 0.61);
    ctx.lineTo(820 * scaleX, H * 0.54);
    ctx.lineTo(Math.min(1020 * scaleX, W), H * 0.62);
    ctx.lineTo(W, H * 0.62);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.sea;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.63);
    ctx.quadraticCurveTo(W * 0.18, H * 0.6, W * 0.36, H * 0.64);
    ctx.quadraticCurveTo(W * 0.58, H * 0.68, W * 0.77, H * 0.63);
    ctx.quadraticCurveTo(W * 0.9, H * 0.59, W, H * 0.64);
    ctx.lineTo(W, H * 0.7);
    ctx.lineTo(0, H * 0.7);
    ctx.closePath();
    ctx.fill();
  }

  function drawGround() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.62, 0, H);
    g.addColorStop(0, p.ground1);
    g.addColorStop(0.65, p.ground2);
    g.addColorStop(1, "#764a31");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.quadraticCurveTo(W * 0.18, H * 0.64, W * 0.36, H * 0.74);
    ctx.quadraticCurveTo(W * 0.55, H * 0.84, W * 0.73, H * 0.74);
    ctx.quadraticCurveTo(W * 0.88, H * 0.66, W, H * 0.78);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(120,72,48,0.16)" : "rgba(95,66,45,0.1)";
    for (var i = 0; i < 6; i++) {
      var x = 80 + i * (W / 6) * 0.45;
      var y = H * (0.8 + (i % 2) * 0.025);
      ctx.beginPath();
      ctx.ellipse(x, y, Math.min(100, W * 0.22), 26, -0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPath() {
    var g = ctx.createLinearGradient(W * 0.46, H * 0.62, W * 0.58, H);
    g.addColorStop(0, "rgba(252,227,187,0.55)");
    g.addColorStop(1, "rgba(189,134,87,0.32)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(W * 0.48, H * 0.68);
    ctx.quadraticCurveTo(W * 0.42, H * 0.8, W * 0.4, H);
    ctx.lineTo(W * 0.61, H);
    ctx.quadraticCurveTo(W * 0.57, H * 0.82, W * 0.52, H * 0.69);
    ctx.closePath();
    ctx.fill();
  }

  function drawBaobab(x, y, scale, lean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(lean);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 90, 96, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#7a5137";
    ctx.beginPath();
    ctx.moveTo(-38, 84);
    ctx.quadraticCurveTo(-54, 16, -30, -28);
    ctx.quadraticCurveTo(-8, -70, 0, -88);
    ctx.quadraticCurveTo(10, -72, 28, -28);
    ctx.quadraticCurveTo(50, 18, 36, 84);
    ctx.closePath();
    ctx.fill();

    var branches = [
      [-10, -70, -48, -130], [12, -62, 58, -122], [-24, -34, -86, -78],
      [28, -30, 92, -72], [0, -86, 8, -156], [-4, -58, -12, -122], [8, -52, 18, -118]
    ];
    ctx.strokeStyle = "#7a5137";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    branches.forEach(function (b) {
      ctx.beginPath();
      ctx.moveTo(b[0], b[1]);
      ctx.lineTo(b[2], b[3]);
      ctx.stroke();
    });

    ctx.fillStyle = "#5f8b5a";
    [[-50, -134, 20], [60, -126, 18], [10, -164, 22], [-94, -82, 14], [100, -74, 15], [-18, -126, 16], [24, -118, 16]].forEach(function (leaf) {
      ctx.beginPath();
      ctx.arc(leaf[0], leaf[1], leaf[2], 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawRock(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#7a665d";
    ctx.beginPath();
    ctx.moveTo(-30, 8);
    ctx.lineTo(-12, -22);
    ctx.lineTo(24, -10);
    ctx.lineTo(34, 10);
    ctx.lineTo(8, 20);
    ctx.lineTo(-20, 18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawLemur(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 26, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4d5058";
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(18, -14, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f2f2ef";
    ctx.beginPath();
    ctx.ellipse(20, -12, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#40424a";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-10, 12); ctx.lineTo(-12, 30);
    ctx.moveTo(8, 12); ctx.lineTo(10, 30);
    ctx.stroke();

    ctx.strokeStyle = "#f3f3ef";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-18, -10);
    ctx.bezierCurveTo(-46, -36, -28, -82, 4, -72);
    ctx.stroke();
    ctx.strokeStyle = "#4d5058";
    ctx.lineWidth = 5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(-18, -10);
    ctx.bezierCurveTo(-46, -36, -28, -82, 4, -72);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  function drawTraveler() {
    var x = W * 0.51;
    var y = H * 0.72;
    var s = Math.min(W / 480, (H - y - 10) / 120);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 94 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5d4d40";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 44 * s, 56 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 44 * s, 56 * s);
    }

    ctx.fillStyle = "#d16f3d";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#628053";
    ctx.beginPath();
    ctx.moveTo(x - 12 * s, y + 18 * s);
    ctx.lineTo(x + 18 * s, y + 18 * s);
    ctx.lineTo(x + 7 * s, y + 34 * s);
    ctx.lineTo(x - 18 * s, y + 34 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#6d503e";
    ctx.beginPath();
    ctx.arc(x - 4 * s, y + 4, 22 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f0d2b6";
    ctx.beginPath();
    ctx.arc(x - 4 * s, y + 10 * s, 11 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#23303d";
    ctx.lineWidth = 8 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 18 * s, y + 82 * s); ctx.lineTo(x - 34 * s, y + 118 * s);
    ctx.moveTo(x + 2 * s, y + 82 * s);  ctx.lineTo(x + 18 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#1a1e24";
    ctx.lineWidth = 9 * s;
    ctx.beginPath();
    ctx.moveTo(x - 37 * s, y + 118 * s); ctx.lineTo(x - 18 * s, y + 118 * s);
    ctx.moveTo(x + 14 * s, y + 118 * s); ctx.lineTo(x + 34 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#23303d";
    ctx.lineWidth = 6 * s;
    ctx.beginPath();
    ctx.moveTo(x + 9 * s, y + 40 * s); ctx.lineTo(x + 42 * s, y + 64 * s);
    ctx.stroke();

    ctx.strokeStyle = "#d9c7aa";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(x + 44 * s, y + 54 * s); ctx.lineTo(x + 58 * s, y + 132 * s);
    ctx.stroke();
  }

  function drawGrass() {
    ctx.strokeStyle = mode === "sunset" ? "rgba(98,75,44,0.55)" : "rgba(95,82,46,0.48)";
    grasses.forEach(function (g) {
      var sway = Math.sin(t * 1.7 + g.x * 0.018) * 4;
      var baseY = H * 0.84 + Math.sin(g.x * 0.01) * 8;
      ctx.lineWidth = g.w;
      ctx.beginPath();
      ctx.moveTo(g.x, baseY);
      ctx.quadraticCurveTo(g.x + g.lean + sway, baseY - g.h * 0.65, g.x + sway * 0.6, baseY - g.h);
      ctx.stroke();
    });
  }

  function drawDust() {
    dusts.forEach(function (d) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,205,145," + (d.a + 0.03) + ")"
        : "rgba(255,234,196," + d.a + ")";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      d.x += d.dx * (mode === "sunset" ? 1.15 : 0.75);
      d.y += Math.sin(t + d.x * 0.01) * 0.14;
      if (d.x > W + 20) {
        d.x = -20;
        d.y = H * (0.5 + Math.random() * 0.45);
      }
    });
  }

  function drawFireflies() {
    if (mode !== "sunset") return;
    fireflies.forEach(function (f, i) {
      var a = 0.18 + (Math.sin(t * 3 + f.phase + i) + 1) * 0.18;
      ctx.fillStyle = "rgba(255,240,170," + a + ")";
      ctx.beginPath();
      ctx.arc(f.x + Math.sin(t + i) * 4, f.y + Math.cos(t * 0.7 + i) * 3, f.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawCloudBands();
    drawDistantLand();
    drawGround();
    drawPath();
    drawBaobab(W * 0.18, H * 0.64, 0.65, -0.04);
    drawBaobab(W * 0.34, H * 0.59, 0.48, 0.02);
    drawBaobab(W * 0.79, H * 0.61, 0.55, 0.03);
    drawRock(W * 0.66, H * 0.8, 0.9);
    drawRock(W * 0.24, H * 0.84, 0.65);
    drawLemur(W * 0.7, H * 0.72, 0.6);
    drawTraveler();
    drawGrass();
    drawDust();
    drawFireflies();
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
