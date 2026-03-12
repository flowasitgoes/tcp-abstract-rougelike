/**
 * 玻利維亞旅人 Canvas 場景：天空之鏡、淺水反射、遠山、高原石地與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const BoliviaScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "day";
  var stars = [];
  var sparkles = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    stars = Array.from({ length: 90 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.42,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * 0.5 + 0.18,
        tw: Math.random() * 0.03 + 0.01
      };
    });
    sparkles = Array.from({ length: 44 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.55 + Math.random() * 0.35),
        r: Math.random() * 2 + 0.8,
        a: Math.random() * 0.18 + 0.04,
        drift: Math.random() * 0.4 + 0.1
      };
    });
  }

  function palette() {
    if (mode === "twilight") {
      return {
        top: "#5b5878",
        mid: "#c38eb0",
        bottom: "#eed6bc",
        sun: "#ffd9bc",
        cloud: "rgba(255,228,220,0.10)",
        salt: "#f1f6fb",
        saltShadow: "#d4dce8",
        water: "#9e9fd1",
        mountainFar: "#8f788c",
        mountainNear: "#70616f",
        mist: "rgba(255,235,235,0.08)"
      };
    }
    return {
      top: "#5f80ab",
      mid: "#abd1e6",
      bottom: "#f5e1bd",
      sun: "#fff6db",
      cloud: "rgba(255,255,245,0.08)",
      salt: "#f6fbff",
      saltShadow: "#dce7ef",
      water: "#8dbcd5",
      mountainFar: "#9896aa",
      mountainNear: "#73727c",
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

    var sx = mode === "twilight" ? W * 0.74 : W * 0.23;
    var sy = H * 0.17;
    var rg = ctx.createRadialGradient(sx, sy, 12, sx, sy, Math.min(175, W * 0.28));
    rg.addColorStop(0, mode === "twilight" ? "rgba(255,225,210,0.92)" : "rgba(255,252,232,0.96)");
    rg.addColorStop(0.45, mode === "twilight" ? "rgba(255,216,194,0.7)" : "rgba(255,248,220,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(175, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.sun;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(46, W * 0.08), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStars() {
    if (mode !== "twilight") return;
    stars.forEach(function (s) {
      var alpha = s.a + Math.sin(t * s.tw * 60 + s.x) * 0.12;
      ctx.fillStyle = "rgba(255,255,255," + Math.max(0.08, alpha) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawCloudBands() {
    var p = palette();
    for (var i = 0; i < 4; i++) {
      var baseY = H * (0.12 + i * 0.08);
      ctx.fillStyle = p.cloud;
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

  function drawMountains() {
    var p = palette();
    var scaleX = W / 1400;
    ctx.fillStyle = p.mountainFar;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.58);
    ctx.lineTo(130 * scaleX, H * 0.52);
    ctx.lineTo(280 * scaleX, H * 0.59);
    ctx.lineTo(460 * scaleX, H * 0.47);
    ctx.lineTo(650 * scaleX, H * 0.6);
    ctx.lineTo(830 * scaleX, H * 0.5);
    ctx.lineTo(Math.min(1030 * scaleX, W), H * 0.62);
    ctx.lineTo(Math.min(1200 * scaleX, W), H * 0.52);
    ctx.lineTo(W, H * 0.6);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.mountainNear;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.66);
    ctx.quadraticCurveTo(W * 0.18, H * 0.58, W * 0.34, H * 0.68);
    ctx.quadraticCurveTo(W * 0.54, H * 0.56, W * 0.72, H * 0.7);
    ctx.quadraticCurveTo(W * 0.86, H * 0.62, W, H * 0.72);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawMirrorWater() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.56, 0, H * 0.92);
    g.addColorStop(0, "rgba(255,255,255,0.08)");
    g.addColorStop(0.08, p.water);
    g.addColorStop(1, mode === "twilight" ? "#8d90bf" : "#7aaecb");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.quadraticCurveTo(W * 0.16, H * 0.66, W * 0.34, H * 0.74);
    ctx.quadraticCurveTo(W * 0.54, H * 0.84, W * 0.72, H * 0.75);
    ctx.quadraticCurveTo(W * 0.86, H * 0.69, W, H * 0.79);
    ctx.lineTo(W, H * 0.93);
    ctx.quadraticCurveTo(W * 0.82, H * 0.86, W * 0.64, H * 0.91);
    ctx.quadraticCurveTo(W * 0.4, H * 0.97, W * 0.18, H * 0.86);
    ctx.quadraticCurveTo(W * 0.08, H * 0.8, 0, H * 0.86);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = mode === "twilight" ? "rgba(255,235,240,0.16)" : "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 6; i++) {
      var y = H * (0.735 + i * 0.022);
      ctx.beginPath();
      ctx.moveTo(40, y + Math.sin(t + i) * 1.8);
      ctx.quadraticCurveTo(W * 0.35, y - 4, W * 0.66, y + 2);
      ctx.quadraticCurveTo(W * 0.84, y + 6, W - 46, y - 1);
      ctx.stroke();
    }
  }

  function drawSaltFlat() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.78, 0, H);
    g.addColorStop(0, p.salt);
    g.addColorStop(0.65, p.saltShadow);
    g.addColorStop(1, mode === "twilight" ? "#cfcfda" : "#dbe7ef");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.84);
    ctx.quadraticCurveTo(W * 0.18, H * 0.77, W * 0.35, H * 0.85);
    ctx.quadraticCurveTo(W * 0.55, H * 0.95, W * 0.74, H * 0.85);
    ctx.quadraticCurveTo(W * 0.88, H * 0.79, W, H * 0.88);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = mode === "twilight" ? "rgba(150,140,165,0.16)" : "rgba(145,170,190,0.15)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 8; i++) {
      var y = H * (0.84 + i * 0.018);
      ctx.beginPath();
      ctx.moveTo(48, y + Math.sin(i + t) * 1.6);
      ctx.quadraticCurveTo(W * 0.36, y - 4, W * 0.66, y + 2);
      ctx.quadraticCurveTo(W * 0.84, y + 6, W - 48, y - 1);
      ctx.stroke();
    }
  }

  function drawRock(x, y, scaleRock) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleRock, scaleRock);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 24, 38, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7d6f68";
    ctx.beginPath();
    ctx.moveTo(-34, 10);
    ctx.lineTo(-16, -16);
    ctx.lineTo(16, -12);
    ctx.lineTo(34, 8);
    ctx.lineTo(8, 18);
    ctx.lineTo(-22, 18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawFlag(x, y, scaleFlag) {
    var flutter = Math.sin(t * 2.2 + x * 0.01) * 4;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleFlag, scaleFlag);
    ctx.strokeStyle = "#7a6b5b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -92);
    ctx.stroke();

    var flagX = 2;
    var flagY = -90;
    var width = 64;
    var height = 36;
    ["#d54f4f", "#e3bb44", "#4fa165"].forEach(function (color, i) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(flagX, flagY + i * 12);
      ctx.quadraticCurveTo(flagX + 20, flagY + i * 12 + flutter * 0.4, flagX + width, flagY + i * 12 + 3 + flutter);
      ctx.lineTo(flagX + width, flagY + i * 12 + 12 + flutter);
      ctx.quadraticCurveTo(flagX + 18, flagY + i * 12 + 12 + flutter * 0.4, flagX, flagY + i * 12 + 12);
      ctx.closePath();
      ctx.fill();
    });
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

    ctx.fillStyle = "#5a4c40";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 44 * s, 56 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 44 * s, 56 * s);
    }

    ctx.fillStyle = "#d66f42";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#5aa2d6";
    ctx.beginPath();
    ctx.moveTo(x - 16 * s, y + 18 * s);
    ctx.lineTo(x + 18 * s, y + 18 * s);
    ctx.lineTo(x + 8 * s, y + 36 * s);
    ctx.lineTo(x - 20 * s, y + 36 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#765f4a";
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

    ctx.strokeStyle = "#171c22";
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
    ctx.moveTo(x + 8 * s, y + 40 * s);
    ctx.lineTo(x + 42 * s, y + 64 * s);
    ctx.stroke();

    ctx.strokeStyle = "#d8c8aa";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(x + 44 * s, y + 54 * s);
    ctx.lineTo(x + 58 * s, y + 132 * s);
    ctx.stroke();
  }

  function drawMist() {
    var p = palette();
    for (var i = 0; i < 4; i++) {
      var y = H * (0.64 + i * 0.04);
      ctx.fillStyle = p.mist;
      ctx.beginPath();
      ctx.moveTo(-40, y);
      for (var x = -40; x <= W + 40; x += 26) {
        var yy = y + Math.sin(x * 0.008 + t * 0.6 + i) * 4 + Math.cos(x * 0.004 + i) * 2.5;
        ctx.lineTo(x, yy);
      }
      ctx.lineTo(W + 40, y + 22);
      ctx.lineTo(-40, y + 22);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawSparkles() {
    sparkles.forEach(function (s, i) {
      ctx.fillStyle = mode === "twilight"
        ? "rgba(255,240,245," + (s.a + 0.02) + ")"
        : "rgba(255,255,255," + s.a + ")";
      ctx.beginPath();
      ctx.arc(s.x + Math.sin(t + i) * s.drift, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawStars();
    drawCloudBands();
    drawMountains();
    drawMirrorWater();
    drawMist();
    drawSaltFlat();
    drawRock(W * 0.23, H * 0.85, 1.15);
    drawRock(W * 0.76, H * 0.88, 0.95);
    drawFlag(W * 0.28, H * 0.82, 1.05);
    drawTraveler();
    drawSparkles();
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
