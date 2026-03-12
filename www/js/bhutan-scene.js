/**
 * 不丹旅人 Canvas 場景：山谷、森林、寺廟、經幡與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const BhutanScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "morning";
  var clouds = [];
  var prayerFlags = [];
  var birds = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    clouds = Array.from({ length: 8 }, function (_, i) {
      return {
        x: Math.random() * W,
        y: H * (0.08 + Math.random() * 0.18),
        r: 28 + Math.random() * 35,
        s: 0.08 + Math.random() * 0.12,
        a: 0.08 + Math.random() * 0.08
      };
    });
    prayerFlags = Array.from({ length: 28 }, function (_, i) {
      return { p: i / 27, phase: Math.random() * Math.PI * 2 };
    });
    birds = Array.from({ length: 6 }, function () {
      return {
        x: Math.random() * W * 0.6 + W * 0.2,
        y: Math.random() * H * 0.18 + H * 0.12,
        s: 0.3 + Math.random() * 0.3
      };
    });
  }

  function getPalette() {
    if (mode === "sunset") {
      return {
        top: "#425675",
        mid: "#d99b66",
        bottom: "#f3d0a4",
        sun: "#ffd2a0",
        haze: "rgba(255,185,120,0.26)",
        mountainFar: "#756b79",
        mountainNear: "#415247",
        forest: "#2a3d2f",
        path1: "#d9b089",
        path2: "#af835f"
      };
    }
    return {
      top: "#4d6e97",
      mid: "#9bc3df",
      bottom: "#f5d8a9",
      sun: "#fff0c6",
      haze: "rgba(255,245,210,0.18)",
      mountainFar: "#74849a",
      mountainNear: "#4d645c",
      forest: "#34523b",
      path1: "#dfc09d",
      path2: "#b5916d"
    };
  }

  function drawSky() {
    var p = getPalette();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, p.top);
    g.addColorStop(0.5, p.mid);
    g.addColorStop(1, p.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var sx = mode === "sunset" ? W * 0.76 : W * 0.23;
    var sy = mode === "sunset" ? H * 0.18 : H * 0.16;
    var rg = ctx.createRadialGradient(sx, sy, 12, sx, sy, Math.min(120, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,220,175,0.82)" : "rgba(255,245,210,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(120, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd6a8" : "#fff6d6";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(32, W * 0.07), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawClouds() {
    clouds.forEach(function (c) {
      c.x += c.s * (mode === "sunset" ? 1.1 : 0.8);
      if (c.x - c.r * 2 > W + 40) c.x = -120;

      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,230,215," + (c.a + 0.03) + ")"
        : "rgba(255,255,255," + c.a + ")";

      for (var i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(c.x + i * c.r * 0.45, c.y + Math.sin(t * 0.3 + i) * 3, c.r * (0.75 + i * 0.08), 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawBirds() {
    ctx.strokeStyle = "rgba(40,45,55,0.35)";
    ctx.lineWidth = 2;
    birds.forEach(function (b, i) {
      var flap = Math.sin(t * 4 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(b.x - 12 * b.s, b.y);
      ctx.quadraticCurveTo(b.x, b.y - flap * b.s, b.x + 12 * b.s, b.y);
      ctx.stroke();
    });
  }

  function drawMountains() {
    var p = getPalette();
    var scaleX = W / 1400;
    ctx.fillStyle = p.mountainFar;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.56);
    ctx.lineTo(150 * scaleX, H * 0.42);
    ctx.lineTo(300 * scaleX, H * 0.58);
    ctx.lineTo(470 * scaleX, H * 0.38);
    ctx.lineTo(640 * scaleX, H * 0.57);
    ctx.lineTo(820 * scaleX, H * 0.41);
    ctx.lineTo(Math.min(1000 * scaleX, W), H * 0.59);
    ctx.lineTo(W, H * 0.57);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(255,210,175,0.22)" : "rgba(255,250,235,0.18)";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.6);
    ctx.quadraticCurveTo(W * 0.2, H * 0.52, W * 0.42, H * 0.61);
    ctx.quadraticCurveTo(W * 0.64, H * 0.5, W, H * 0.63);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.mountainNear;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.66);
    ctx.quadraticCurveTo(W * 0.18, H * 0.55, W * 0.32, H * 0.67);
    ctx.quadraticCurveTo(W * 0.52, H * 0.54, W * 0.66, H * 0.69);
    ctx.quadraticCurveTo(W * 0.82, H * 0.56, W, H * 0.7);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawForestLayers() {
    var rows = [
      { y: H * 0.68, scale: 0.9, alpha: 0.72 },
      { y: H * 0.74, scale: 1.05, alpha: 0.9 }
    ];

    rows.forEach(function (row, rowIndex) {
      for (var i = 0; i < 19; i++) {
        var x = i * (W / 18) + (rowIndex * 18);
        var h = (28 + (i % 4) * 10) * row.scale;
        var w = (22 + (i % 3) * 6) * row.scale;
        ctx.fillStyle = rowIndex === 0
          ? "rgba(48,76,55," + row.alpha + ")"
          : "rgba(34,58,40," + row.alpha + ")";
        ctx.beginPath();
        ctx.moveTo(x, row.y - h);
        ctx.lineTo(x - w * 0.65, row.y);
        ctx.lineTo(x + w * 0.65, row.y);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(x - 2, row.y, 4, 10);
      }
    });
  }

  function drawValley() {
    var p = getPalette();
    var g = ctx.createLinearGradient(0, H * 0.62, 0, H);
    g.addColorStop(0, p.path1);
    g.addColorStop(0.7, p.path2);
    g.addColorStop(1, "#8b6647");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.quadraticCurveTo(W * 0.16, H * 0.7, W * 0.33, H * 0.8);
    ctx.quadraticCurveTo(W * 0.5, H * 0.89, W * 0.64, H * 0.79);
    ctx.quadraticCurveTo(W * 0.83, H * 0.66, W, H * 0.82);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(130,95,65,0.18)" : "rgba(110,90,70,0.12)";
    for (var i = 0; i < 5; i++) {
      var x = 90 + i * (W / 5) * 0.4;
      var y = H * (0.82 + (i % 2) * 0.02);
      ctx.beginPath();
      ctx.ellipse(x, y, Math.min(100, W * 0.22), 26, -0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPath() {
    var g = ctx.createLinearGradient(W * 0.46, H * 0.62, W * 0.56, H);
    g.addColorStop(0, "rgba(250,234,205,0.56)");
    g.addColorStop(1, "rgba(188,150,111,0.34)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H * 0.66);
    ctx.quadraticCurveTo(W * 0.42, H * 0.78, W * 0.4, H);
    ctx.lineTo(W * 0.6, H);
    ctx.quadraticCurveTo(W * 0.56, H * 0.8, W * 0.53, H * 0.67);
    ctx.closePath();
    ctx.fill();
  }

  function drawTemple(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath();
    ctx.ellipse(0, 98, 94, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d8d0c5";
    ctx.fillRect(-82, 30, 164, 58);

    ctx.fillStyle = "#a34231";
    ctx.fillRect(-74, 10, 148, 26);
    ctx.fillRect(-66, 54, 132, 24);

    ctx.fillStyle = "#f1ebdf";
    for (var i = -54; i <= 42; i += 24) {
      ctx.fillRect(i, 38, 12, 40);
    }

    ctx.fillStyle = "#4f2f24";
    ctx.fillRect(-16, 42, 32, 46);

    ctx.fillStyle = "#d3a656";
    ctx.beginPath();
    ctx.moveTo(-94, 12);
    ctx.lineTo(0, -20);
    ctx.lineTo(94, 12);
    ctx.lineTo(78, 24);
    ctx.lineTo(-78, 24);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#f6efdf";
    ctx.fillRect(-10, -42, 20, 28);
    ctx.fillStyle = "#d3a656";
    ctx.beginPath();
    ctx.arc(0, -48, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawPrayerFlags() {
    var x1 = W * 0.18;
    var y1 = H * 0.34;
    var x2 = W * 0.68;
    var y2 = H * 0.26;

    ctx.strokeStyle = "rgba(90,65,45,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(W * 0.42, H * 0.18, x2, y2);
    ctx.stroke();

    var colors = ["#ffffff", "#4b8bd6", "#d84545", "#e1b547", "#47a86a"];
    prayerFlags.forEach(function (f, i) {
      var x = x1 + (x2 - x1) * f.p;
      var curve = (1 - Math.pow((f.p - 0.5) * 2, 2));
      var y = y1 + (y2 - y1) * f.p - curve * 35;
      var flutter = Math.sin(t * 4 + f.phase + i * 0.35) * 4;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 16, y + 2 + flutter);
      ctx.lineTo(x + 3, y + 12 + flutter * 0.7);
      ctx.closePath();
      ctx.fill();
    });
  }

  function drawTraveler() {
    var x = W * 0.52;
    var y = H * 0.72;
    var s = Math.min(W / 480, (H - y - 10) / 120);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 94 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5d4c3d";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 42 * s, 56 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 42 * s, 56 * s);
    }

    ctx.fillStyle = "#8b3d2d";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 20 * s);
    ctx.lineTo(x + 22 * s, y + 20 * s);
    ctx.lineTo(x + 10 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d7a94f";
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, y + 20 * s);
    ctx.lineTo(x + 18 * s, y + 20 * s);
    ctx.lineTo(x + 8 * s, y + 36 * s);
    ctx.lineTo(x - 18 * s, y + 36 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#3e3027";
    ctx.beginPath();
    ctx.arc(x - 4 * s, y + 4, 22 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f0d2b6";
    ctx.beginPath();
    ctx.arc(x - 4 * s, y + 10 * s, 11 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#22303d";
    ctx.lineWidth = 8 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 18 * s, y + 82 * s); ctx.lineTo(x - 34 * s, y + 118 * s);
    ctx.moveTo(x + 2 * s, y + 82 * s);  ctx.lineTo(x + 18 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#171b21";
    ctx.lineWidth = 9 * s;
    ctx.beginPath();
    ctx.moveTo(x - 37 * s, y + 118 * s); ctx.lineTo(x - 18 * s, y + 118 * s);
    ctx.moveTo(x + 14 * s, y + 118 * s); ctx.lineTo(x + 34 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#22303d";
    ctx.lineWidth = 6 * s;
    ctx.beginPath();
    ctx.moveTo(x + 8 * s, y + 40 * s); ctx.lineTo(x + 42 * s, y + 64 * s);
    ctx.stroke();

    ctx.strokeStyle = "#d8c8aa";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(x + 44 * s, y + 54 * s); ctx.lineTo(x + 58 * s, y + 132 * s);
    ctx.stroke();
  }

  function drawMist() {
    for (var i = 0; i < 5; i++) {
      var y = H * (0.62 + i * 0.045);
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,215,180," + (0.05 + i * 0.012) + ")"
        : "rgba(255,255,255," + (0.04 + i * 0.01) + ")";
      ctx.beginPath();
      ctx.moveTo(-40, y);
      for (var xx = -40; xx <= W + 40; xx += 28) {
        var yy = y + Math.sin(xx * 0.008 + t * 0.7 + i) * 6 + Math.cos(xx * 0.004 + i) * 3;
        ctx.lineTo(xx, yy);
      }
      ctx.lineTo(W + 40, y + 28);
      ctx.lineTo(-40, y + 28);
      ctx.closePath();
      ctx.fill();
    }
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawClouds();
    drawBirds();
    drawMountains();
    drawMist();
    drawForestLayers();
    drawValley();
    drawPath();
    drawTemple(W * 0.78, H * 0.6, 0.6);
    drawTemple(W * 0.22, H * 0.67, 0.36);
    drawPrayerFlags();
    drawTraveler();
    t += 0.016;
    rafId = requestAnimationFrame(render);
  }

  function start(canvas) {
    stop();
    if (!canvas || !canvas.getContext) return;
    canvasEl = canvas;
    ctx = canvas.getContext("2d");
    t = 0;
    mode = "morning";
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
