/**
 * 阿爾巴尼亞旅人 Canvas 場景：山海地景、石頭城、亞得里亞海岸、橄欖樹與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const AlbaniaScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "morning";
  var clouds = [];
  var birds = [];
  var shimmer = [];
  var grasses = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    clouds = Array.from({ length: 8 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.1 + Math.random() * 0.16),
        r: 40 + Math.random() * 54,
        s: 0.07 + Math.random() * 0.1,
        a: 0.05 + Math.random() * 0.07
      };
    });
    birds = Array.from({ length: 7 }, function () {
      return {
        x: Math.random() * W * 0.65 + W * 0.12,
        y: Math.random() * H * 0.18 + H * 0.1,
        s: 0.28 + Math.random() * 0.34
      };
    });
    shimmer = Array.from({ length: 6 }, function (_, i) {
      return {
        y: H * (0.69 + i * 0.02),
        a: 0.12 + i * 0.02
      };
    });
    grasses = Array.from({ length: 120 }, function () {
      return {
        x: Math.random() * W,
        h: Math.random() * 26 + 12,
        lean: Math.random() * 8 - 4,
        w: Math.random() * 1.8 + 0.8
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#6a738d",
        mid: "#d79b66",
        bottom: "#efcfaa",
        sun: "#ffd6ab",
        cloud: "rgba(255,225,205,0.1)",
        mountainFar: "#827886",
        mountainNear: "#56675d",
        sea: "#729ead",
        seaDeep: "#547b8d",
        cliff: "#8a7063",
        mist: "rgba(255,220,190,0.08)"
      };
    }
    return {
      top: "#6a92bb",
      mid: "#afd6ea",
      bottom: "#f5e1bf",
      sun: "#fff4d8",
      cloud: "rgba(255,255,245,0.08)",
      mountainFar: "#8d9aad",
      mountainNear: "#607168",
      sea: "#84b9cb",
      seaDeep: "#6293a7",
      cliff: "#8f786a",
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

    var sx = mode === "sunset" ? W * 0.77 : W * 0.2;
    var sy = H * 0.17;
    var rg = ctx.createRadialGradient(sx, sy, 12, sx, sy, Math.min(180, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,220,175,0.82)" : "rgba(255,247,220,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(180, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd8b1" : "#fff8de";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(48, W * 0.08), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawClouds() {
    var p = palette();
    clouds.forEach(function (c) {
      c.x += c.s * (mode === "sunset" ? 1.05 : 0.75);
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
    ctx.strokeStyle = "rgba(44,50,60,0.35)";
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
    ctx.moveTo(0, H * 0.56);
    ctx.lineTo(120 * scaleX, H * 0.47);
    ctx.lineTo(250 * scaleX, H * 0.58);
    ctx.lineTo(430 * scaleX, H * 0.41);
    ctx.lineTo(620 * scaleX, H * 0.58);
    ctx.lineTo(810 * scaleX, H * 0.45);
    ctx.lineTo(Math.min(1000 * scaleX, W), H * 0.6);
    ctx.lineTo(Math.min(1180 * scaleX, W), H * 0.44);
    ctx.lineTo(W, H * 0.58);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(255,216,190,0.2)" : "rgba(255,252,245,0.18)";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.6);
    ctx.quadraticCurveTo(W * 0.2, H * 0.52, W * 0.4, H * 0.62);
    ctx.quadraticCurveTo(W * 0.6, H * 0.51, W, H * 0.64);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.mountainNear;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.66);
    ctx.quadraticCurveTo(W * 0.18, H * 0.58, W * 0.34, H * 0.68);
    ctx.quadraticCurveTo(W * 0.52, H * 0.55, W * 0.68, H * 0.7);
    ctx.quadraticCurveTo(W * 0.84, H * 0.6, W, H * 0.72);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawSea() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.6, 0, H * 0.88);
    g.addColorStop(0, "rgba(255,255,255,0.12)");
    g.addColorStop(0.1, p.sea);
    g.addColorStop(1, p.seaDeep);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.quadraticCurveTo(W * 0.16, H * 0.66, W * 0.34, H * 0.74);
    ctx.quadraticCurveTo(W * 0.54, H * 0.84, W * 0.72, H * 0.75);
    ctx.quadraticCurveTo(W * 0.86, H * 0.69, W, H * 0.78);
    ctx.lineTo(W, H * 0.9);
    ctx.quadraticCurveTo(W * 0.82, H * 0.83, W * 0.64, H * 0.88);
    ctx.quadraticCurveTo(W * 0.42, H * 0.95, W * 0.2, H * 0.84);
    ctx.quadraticCurveTo(W * 0.08, H * 0.78, 0, H * 0.84);
    ctx.closePath();
    ctx.fill();

    shimmer.forEach(function (s, i) {
      ctx.strokeStyle = mode === "sunset"
        ? "rgba(255,230,190," + s.a + ")"
        : "rgba(255,255,255," + (s.a - 0.02) + ")";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, s.y + Math.sin(t + i) * 2.5);
      ctx.quadraticCurveTo(W * 0.34, s.y - 4, W * 0.64, s.y + 3);
      ctx.quadraticCurveTo(W * 0.82, s.y + 8, W - 44, s.y - 1);
      ctx.stroke();
    });
  }

  function drawCliff() {
    var p = palette();
    var scaleX = W / 1400;
    ctx.fillStyle = p.cliff;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.quadraticCurveTo(W * 0.1, H * 0.7, W * 0.22, H * 0.8);
    ctx.quadraticCurveTo(W * 0.34, H * 0.9, W * 0.48, H * 0.8);
    ctx.quadraticCurveTo(W * 0.58, H * 0.72, W * 0.72, H * 0.83);
    ctx.quadraticCurveTo(W * 0.86, H * 0.93, W, H * 0.84);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(255,214,184,0.1)" : "rgba(255,248,236,0.08)";
    for (var i = 0; i < 5; i++) {
      var x = (90 + i * 260) * scaleX;
      var y = H * (0.84 + (i % 2) * 0.02);
      ctx.beginPath();
      ctx.ellipse(x, y, 150 * scaleX, 34, -0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawHouse(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 56, 56, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d9d0c6";
    ctx.fillRect(-34, 6, 68, 42);
    ctx.fillStyle = "#8e5b48";
    ctx.beginPath();
    ctx.moveTo(-40, 8);
    ctx.lineTo(0, -16);
    ctx.lineTo(40, 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#6c5242";
    ctx.fillRect(-6, 22, 12, 26);
    ctx.fillStyle = "#9fc0d3";
    ctx.fillRect(-24, 22, 10, 10);
    ctx.fillRect(14, 22, 10, 10);

    ctx.restore();
  }

  function drawMinaret(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "#dcd4ca";
    ctx.fillRect(-6, -18, 12, 62);
    ctx.beginPath();
    ctx.moveTo(-10, -18);
    ctx.lineTo(0, -34);
    ctx.lineTo(10, -18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#7d6250";
    ctx.fillRect(-2, 44, 4, 8);

    ctx.restore();
  }

  function drawOliveTree(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.strokeStyle = "#6e5645";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 48);
    ctx.quadraticCurveTo(-4, 6, 0, -28);
    ctx.moveTo(0, -14);
    ctx.lineTo(-18, -40);
    ctx.moveTo(2, -10);
    ctx.lineTo(22, -34);
    ctx.stroke();

    ctx.fillStyle = "#587357";
    [[-24, -44, 18], [-6, -54, 20], [16, -44, 18], [2, -30, 22]].forEach(function (arr) {
      var lx = arr[0], ly = arr[1], r = arr[2];
      ctx.beginPath();
      ctx.arc(lx, ly, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawStoneTown() {
    var baseX = W * 0.72;
    var baseY = H * 0.62;
    var scales = [1.0, 0.85, 0.75, 0.65, 0.55];
    scales.forEach(function (s, i) {
      var x = baseX + i * 44 - (i % 2) * 14;
      var y = baseY + i * 18;
      drawHouse(x, y, s);
    });
    drawMinaret(W * 0.82, H * 0.59, 0.82);
  }

  function drawPath() {
    var g = ctx.createLinearGradient(W * 0.44, H * 0.76, W * 0.58, H);
    g.addColorStop(0, "rgba(247,224,188,0.58)");
    g.addColorStop(1, "rgba(178,132,92,0.34)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H * 0.79);
    ctx.quadraticCurveTo(W * 0.44, H * 0.87, W * 0.41, H);
    ctx.lineTo(W * 0.6, H);
    ctx.quadraticCurveTo(W * 0.57, H * 0.88, W * 0.53, H * 0.8);
    ctx.closePath();
    ctx.fill();
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

    ctx.fillStyle = "#436d68";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d79449";
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, y + 18 * s);
    ctx.lineTo(x + 18 * s, y + 18 * s);
    ctx.lineTo(x + 7 * s, y + 35 * s);
    ctx.lineTo(x - 18 * s, y + 35 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#75614d";
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
    ctx.moveTo(x - 18 * s, y + 82 * s);
    ctx.lineTo(x - 34 * s, y + 118 * s);
    ctx.moveTo(x + 2 * s, y + 82 * s);
    ctx.lineTo(x + 18 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#1a1e24";
    ctx.lineWidth = 9 * s;
    ctx.beginPath();
    ctx.moveTo(x - 37 * s, y + 118 * s);
    ctx.lineTo(x - 18 * s, y + 118 * s);
    ctx.moveTo(x + 14 * s, y + 118 * s);
    ctx.lineTo(x + 34 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#23303d";
    ctx.lineWidth = 6 * s;
    ctx.beginPath();
    ctx.moveTo(x + 9 * s, y + 40 * s);
    ctx.lineTo(x + 42 * s, y + 64 * s);
    ctx.stroke();

    ctx.strokeStyle = "#d8c8aa";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(x + 44 * s, y + 54 * s);
    ctx.lineTo(x + 58 * s, y + 132 * s);
    ctx.stroke();
  }

  function drawGrass() {
    ctx.strokeStyle = mode === "sunset" ? "rgba(96,76,48,0.58)" : "rgba(86,82,52,0.46)";
    grasses.forEach(function (g) {
      var sway = Math.sin(t * 1.6 + g.x * 0.02) * 3.4;
      var baseY = H * 0.87 + Math.sin(g.x * 0.011) * 5;
      ctx.lineWidth = g.w;
      ctx.beginPath();
      ctx.moveTo(g.x, baseY);
      ctx.quadraticCurveTo(g.x + g.lean + sway, baseY - g.h * 0.65, g.x + sway * 0.6, baseY - g.h);
      ctx.stroke();
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawClouds();
    drawBirds();
    drawMountains();
    drawSea();
    drawCliff();
    drawStoneTown();
    drawOliveTree(W * 0.2, H * 0.8, 1.05);
    drawOliveTree(W * 0.82, H * 0.84, 0.85);
    drawPath();
    drawTraveler();
    drawGrass();
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
