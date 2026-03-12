/**
 * 斯洛維尼亞旅人 Canvas 場景：湖泊、湖心小島教堂、阿爾卑斯山景、森林與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const SloveniaScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "morning";
  var clouds = [];
  var fireflies = [];
  var birds = [];
  var reeds = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    clouds = Array.from({ length: 7 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.1 + Math.random() * 0.18),
        r: 28 + Math.random() * 38,
        s: 0.08 + Math.random() * 0.1,
        a: 0.06 + Math.random() * 0.08
      };
    });
    fireflies = Array.from({ length: 20 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.35 + Math.random() * 0.4),
        r: Math.random() * 1.8 + 1,
        phase: Math.random() * Math.PI * 2
      };
    });
    birds = Array.from({ length: 6 }, function () {
      return {
        x: Math.random() * W * 0.65 + W * 0.15,
        y: Math.random() * H * 0.18 + H * 0.1,
        s: 0.28 + Math.random() * 0.35
      };
    });
    reeds = Array.from({ length: 70 }, function () {
      return {
        x: Math.random() * W,
        h: Math.random() * 22 + 10,
        lean: Math.random() * 8 - 4,
        w: Math.random() * 1.5 + 0.8
      };
    });
  }

  function palette() {
    if (mode === "evening") {
      return {
        top: "#61708c",
        mid: "#d59a67",
        bottom: "#efd1a9",
        sun: "#ffd6aa",
        cloud: "rgba(255,226,208,0.1)",
        mountainFar: "#807486",
        mountainNear: "#4f6458",
        lake: "#6f99a8",
        island: "#62785a",
        mist: "rgba(255,220,190,0.08)"
      };
    }
    return {
      top: "#658cb5",
      mid: "#afd6ea",
      bottom: "#f6e2bf",
      sun: "#fff3d5",
      cloud: "rgba(255,255,245,0.08)",
      mountainFar: "#8b9eb4",
      mountainNear: "#5c7361",
      lake: "#88becd",
      island: "#718b66",
      mist: "rgba(255,255,255,0.08)"
    };
  }

  function drawSky() {
    var p = palette();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, p.top);
    g.addColorStop(0.5, p.mid);
    g.addColorStop(1, p.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var sx = mode === "evening" ? W * 0.77 : W * 0.22;
    var sy = H * 0.17;
    var rg = ctx.createRadialGradient(sx, sy, 12, sx, sy, Math.min(120, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "evening" ? "rgba(255,220,170,0.8)" : "rgba(255,246,216,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(120, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "evening" ? "#ffd8b0" : "#fff7dc";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(32, W * 0.07), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawClouds() {
    var p = palette();
    clouds.forEach(function (c) {
      c.x += c.s * (mode === "evening" ? 1.05 : 0.75);
      if (c.x - c.r * 2 > W + 60) c.x = -140;
      ctx.fillStyle = p.cloud;
      for (var i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(c.x + i * c.r * 0.45, c.y + Math.sin(t * 0.3 + i) * 2.5, c.r * (0.74 + i * 0.08), 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawBirds() {
    ctx.strokeStyle = "rgba(42,48,58,0.35)";
    ctx.lineWidth = 2;
    birds.forEach(function (b, i) {
      var flap = Math.sin(t * 4 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(b.x - 13 * b.s, b.y);
      ctx.quadraticCurveTo(b.x, b.y - flap * b.s, b.x + 13 * b.s, b.y);
      ctx.stroke();
    });
  }

  function drawMountains() {
    var p = palette();
    var scaleX = W / 1400;
    ctx.fillStyle = p.mountainFar;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.58);
    ctx.lineTo(130 * scaleX, H * 0.46);
    ctx.lineTo(260 * scaleX, H * 0.58);
    ctx.lineTo(430 * scaleX, H * 0.39);
    ctx.lineTo(620 * scaleX, H * 0.59);
    ctx.lineTo(810 * scaleX, H * 0.43);
    ctx.lineTo(Math.min(980 * scaleX, W), H * 0.6);
    ctx.lineTo(W, H * 0.58);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "evening" ? "rgba(255,218,188,0.2)" : "rgba(255,252,245,0.18)";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.61);
    ctx.quadraticCurveTo(W * 0.2, H * 0.53, W * 0.38, H * 0.62);
    ctx.quadraticCurveTo(W * 0.6, H * 0.51, W, H * 0.64);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.mountainNear;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.68);
    ctx.quadraticCurveTo(W * 0.16, H * 0.58, W * 0.34, H * 0.69);
    ctx.quadraticCurveTo(W * 0.55, H * 0.56, W * 0.7, H * 0.71);
    ctx.quadraticCurveTo(W * 0.84, H * 0.61, W, H * 0.72);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawMist() {
    var p = palette();
    for (var i = 0; i < 4; i++) {
      var y = H * (0.62 + i * 0.04);
      ctx.fillStyle = p.mist;
      ctx.beginPath();
      ctx.moveTo(-40, y);
      for (var x = -40; x <= W + 40; x += 28) {
        var yy = y + Math.sin(x * 0.008 + t * 0.65 + i) * 5 + Math.cos(x * 0.004 + i) * 3;
        ctx.lineTo(x, yy);
      }
      ctx.lineTo(W + 40, y + 26);
      ctx.lineTo(-40, y + 26);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawLake() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.62, 0, H * 0.88);
    g.addColorStop(0, "rgba(255,255,255,0.12)");
    g.addColorStop(0.1, p.lake);
    g.addColorStop(1, "rgba(82,132,148,0.96)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.quadraticCurveTo(W * 0.18, H * 0.65, W * 0.35, H * 0.74);
    ctx.quadraticCurveTo(W * 0.55, H * 0.84, W * 0.72, H * 0.74);
    ctx.quadraticCurveTo(W * 0.86, H * 0.67, W, H * 0.77);
    ctx.lineTo(W, H * 0.88);
    ctx.quadraticCurveTo(W * 0.84, H * 0.8, W * 0.66, H * 0.86);
    ctx.quadraticCurveTo(W * 0.43, H * 0.94, W * 0.2, H * 0.82);
    ctx.quadraticCurveTo(W * 0.08, H * 0.76, 0, H * 0.83);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.24)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 6; i++) {
      var y = H * (0.735 + i * 0.018);
      ctx.beginPath();
      ctx.moveTo(44, y + Math.sin(t + i) * 3);
      ctx.quadraticCurveTo(W * 0.34, y - 5, W * 0.64, y + 2);
      ctx.quadraticCurveTo(W * 0.82, y + 10, W - 44, y - 2);
      ctx.stroke();
    }
  }

  function drawIsland() {
    var p = palette();
    ctx.fillStyle = p.island;
    ctx.beginPath();
    ctx.moveTo(W * 0.56, H * 0.66);
    ctx.quadraticCurveTo(W * 0.61, H * 0.61, W * 0.67, H * 0.67);
    ctx.quadraticCurveTo(W * 0.64, H * 0.71, W * 0.58, H * 0.7);
    ctx.quadraticCurveTo(W * 0.54, H * 0.69, W * 0.56, H * 0.66);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(46,73,53,0.9)";
    for (var i = 0; i < 8; i++) {
      var x = W * 0.575 + i * 14;
      var y = H * 0.655 + (i % 2) * 5;
      var h = 20 + (i % 3) * 8;
      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.lineTo(x - 10, y);
      ctx.lineTo(x + 10, y);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawChurch() {
    var x = W * 0.62;
    var y = H * 0.63;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.58, 0.58);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 54, 54, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f2ebe0";
    ctx.fillRect(-30, 4, 60, 34);
    ctx.fillRect(18, -20, 18, 42);

    ctx.fillStyle = "#b15a43";
    ctx.beginPath();
    ctx.moveTo(-36, 6);
    ctx.lineTo(0, -14);
    ctx.lineTo(36, 6);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(12, -18);
    ctx.lineTo(27, -34);
    ctx.lineTo(42, -18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#826e5a";
    ctx.fillRect(-6, 16, 12, 22);
    ctx.fillStyle = "#d5cabd";
    ctx.fillRect(23, -12, 8, 10);
    ctx.fillStyle = "#f3ead8";
    ctx.fillRect(26, -42, 2, 10);
    ctx.fillRect(22, -38, 10, 2);

    ctx.restore();
  }

  function drawShore() {
    var g = ctx.createLinearGradient(0, H * 0.76, 0, H);
    g.addColorStop(0, "rgba(214,182,140,0.95)");
    g.addColorStop(1, "rgba(140,110,78,0.96)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.84);
    ctx.quadraticCurveTo(W * 0.18, H * 0.76, W * 0.34, H * 0.86);
    ctx.quadraticCurveTo(W * 0.54, H * 0.95, W * 0.72, H * 0.86);
    ctx.quadraticCurveTo(W * 0.86, H * 0.8, W, H * 0.88);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawPath() {
    var g = ctx.createLinearGradient(W * 0.44, H * 0.76, W * 0.58, H);
    g.addColorStop(0, "rgba(247,223,185,0.58)");
    g.addColorStop(1, "rgba(178,132,92,0.34)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H * 0.8);
    ctx.quadraticCurveTo(W * 0.44, H * 0.87, W * 0.41, H);
    ctx.lineTo(W * 0.6, H);
    ctx.quadraticCurveTo(W * 0.57, H * 0.88, W * 0.53, H * 0.81);
    ctx.closePath();
    ctx.fill();
  }

  function drawCastle(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(0, 50, 44, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d7cec2";
    ctx.fillRect(-30, 0, 60, 28);
    ctx.fillRect(12, -14, 16, 24);
    ctx.fillRect(-20, -10, 12, 18);
    ctx.fillRect(-2, -16, 10, 14);

    ctx.fillStyle = "#8f6d58";
    ctx.fillRect(-4, 10, 8, 18);
    ctx.fillRect(-18, 8, 4, 8);
    ctx.fillRect(18, -6, 4, 8);

    ctx.restore();
  }

  function drawTraveler() {
    var x = W * 0.5;
    var y = H * 0.77;
    var s = Math.min(W / 480, (H - y - 10) / 120);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 92 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5a4d42";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 44 * s, 56 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 44 * s, 56 * s);
    }

    ctx.fillStyle = "#466e67";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d79a48";
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, y + 18 * s);
    ctx.lineTo(x + 18 * s, y + 18 * s);
    ctx.lineTo(x + 7 * s, y + 35 * s);
    ctx.lineTo(x - 18 * s, y + 35 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#73604b";
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

    ctx.strokeStyle = "#d8c8aa";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(x + 44 * s, y + 54 * s); ctx.lineTo(x + 58 * s, y + 132 * s);
    ctx.stroke();
  }

  function drawReeds() {
    ctx.strokeStyle = mode === "evening" ? "rgba(96,76,48,0.58)" : "rgba(86,82,52,0.46)";
    reeds.forEach(function (r) {
      var sway = Math.sin(t * 1.6 + r.x * 0.02) * 3.4;
      var baseY = H * 0.86 + Math.sin(r.x * 0.011) * 5;
      ctx.lineWidth = r.w;
      ctx.beginPath();
      ctx.moveTo(r.x, baseY);
      ctx.quadraticCurveTo(r.x + r.lean + sway, baseY - r.h * 0.65, r.x + sway * 0.6, baseY - r.h);
      ctx.stroke();
    });
  }

  function drawFireflies() {
    if (mode !== "evening") return;
    fireflies.forEach(function (f, i) {
      var a = 0.16 + (Math.sin(t * 3 + f.phase + i) + 1) * 0.16;
      ctx.fillStyle = "rgba(255,238,165," + a + ")";
      ctx.beginPath();
      ctx.arc(f.x + Math.sin(t + i) * 4, f.y + Math.cos(t * 0.7 + i) * 3, f.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawClouds();
    drawBirds();
    drawMountains();
    drawMist();
    drawLake();
    drawIsland();
    drawChurch();
    drawCastle(W * 0.17, H * 0.58, 0.64);
    drawShore();
    drawPath();
    drawTraveler();
    drawReeds();
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
