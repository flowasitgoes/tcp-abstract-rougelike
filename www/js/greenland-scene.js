/**
 * 格陵蘭旅人 Canvas 場景：冰山、峽灣、雪原、冷霧與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const GreenlandScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "day";
  var snowflakes = [];
  var stars = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;
  var scale = 1;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    scale = Math.min(W / 1400, H / 900);
    snowflakes = Array.from({ length: 85 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.4 + 0.6,
        s: Math.random() * 0.7 + 0.2,
        dx: Math.random() * 0.5 - 0.25,
        a: Math.random() * 0.45 + 0.2
      };
    });
    stars = Array.from({ length: 90 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.42,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * 0.5 + 0.2,
        tw: Math.random() * 0.03 + 0.01
      };
    });
  }

  function palette() {
    if (mode === "twilight") {
      return {
        top: "#263b5f",
        mid: "#567da7",
        bottom: "#c8e0f2",
        sun: "#dff3ff",
        cloud: "rgba(220,240,255,0.10)",
        ice1: "#d9effa",
        ice2: "#a9cadf",
        ice3: "#7da3be",
        water: "#527895",
        rock: "#465366",
        mist: "rgba(220,240,255,0.12)"
      };
    }
    return {
      top: "#4d6f99",
      mid: "#8ab3d3",
      bottom: "#edf8ff",
      sun: "#fffef2",
      cloud: "rgba(255,255,255,0.08)",
      ice1: "#e6f7ff",
      ice2: "#bedced",
      ice3: "#95bbd4",
      water: "#709db7",
      rock: "#546173",
      mist: "rgba(255,255,255,0.08)"
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

    var sx = mode === "twilight" ? W * 0.72 : W * 0.23;
    var sy = H * 0.16;
    var rg = ctx.createRadialGradient(sx, sy, 10, sx, sy, Math.min(170, W * 0.28));
    rg.addColorStop(0, mode === "twilight" ? "rgba(230,246,255,0.95)" : "rgba(255,251,230,0.96)");
    rg.addColorStop(0.45, mode === "twilight" ? "rgba(220,240,255,0.68)" : "rgba(255,248,220,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(170, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.sun;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(44, W * 0.08), 0, Math.PI * 2);
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
      var baseY = H * (0.13 + i * 0.08);
      ctx.fillStyle = p.cloud;
      ctx.beginPath();
      ctx.moveTo(-40, baseY);
      for (var x = -40; x <= W + 40; x += 28) {
        var y = baseY + Math.sin(x * 0.006 + t * 0.45 + i) * 8 + Math.cos(x * 0.004 + i) * 6;
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
    ctx.fillStyle = p.rock;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.58);
    ctx.lineTo(140 * scaleX, H * 0.49);
    ctx.lineTo(280 * scaleX, H * 0.58);
    ctx.lineTo(440 * scaleX, H * 0.41);
    ctx.lineTo(610 * scaleX, H * 0.59);
    ctx.lineTo(790 * scaleX, H * 0.46);
    ctx.lineTo(Math.min(980 * scaleX, W), H * 0.61);
    ctx.lineTo(Math.min(1170 * scaleX, W), H * 0.43);
    ctx.lineTo(W, H * 0.59);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "twilight" ? "rgba(220,240,255,0.12)" : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.6);
    ctx.quadraticCurveTo(W * 0.2, H * 0.52, W * 0.42, H * 0.61);
    ctx.quadraticCurveTo(W * 0.62, H * 0.5, W, H * 0.63);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawFjord() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.6, 0, H * 0.92);
    g.addColorStop(0, "rgba(255,255,255,0.10)");
    g.addColorStop(0.1, p.water);
    g.addColorStop(1, mode === "twilight" ? "#40637d" : "#5f8ca8");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.quadraticCurveTo(W * 0.18, H * 0.66, W * 0.36, H * 0.74);
    ctx.quadraticCurveTo(W * 0.54, H * 0.83, W * 0.72, H * 0.75);
    ctx.quadraticCurveTo(W * 0.86, H * 0.69, W, H * 0.79);
    ctx.lineTo(W, H * 0.92);
    ctx.quadraticCurveTo(W * 0.82, H * 0.84, W * 0.62, H * 0.9);
    ctx.quadraticCurveTo(W * 0.4, H * 0.96, W * 0.18, H * 0.86);
    ctx.quadraticCurveTo(W * 0.07, H * 0.8, 0, H * 0.86);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = mode === "twilight" ? "rgba(220,240,255,0.18)" : "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 6; i++) {
      var y = H * (0.735 + i * 0.02);
      ctx.beginPath();
      ctx.moveTo(40, y + Math.sin(t + i) * 2);
      ctx.quadraticCurveTo(W * 0.34, y - 5, W * 0.64, y + 3);
      ctx.quadraticCurveTo(W * 0.82, y + 8, W - 48, y - 2);
      ctx.stroke();
    }
  }

  function drawIcebergs() {
    var p = palette();
    var bergs = [
      { x: W * 0.22, y: H * 0.67, s: 1.2 },
      { x: W * 0.58, y: H * 0.64, s: 1.0 },
      { x: W * 0.79, y: H * 0.69, s: 0.76 }
    ];

    bergs.forEach(function (b) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.s * scale, b.s * scale);

      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.beginPath();
      ctx.ellipse(0, 58, 76, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      var g = ctx.createLinearGradient(-70, -70, 80, 70);
      g.addColorStop(0, p.ice1);
      g.addColorStop(0.55, p.ice2);
      g.addColorStop(1, p.ice3);
      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(-72, 34);
      ctx.lineTo(-42, -22);
      ctx.lineTo(-8, 6);
      ctx.lineTo(16, -48);
      ctx.lineTo(54, -18);
      ctx.lineTo(74, 28);
      ctx.lineTo(44, 40);
      ctx.lineTo(-22, 44);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.26)";
      ctx.beginPath();
      ctx.moveTo(-38, -18);
      ctx.lineTo(-8, 4);
      ctx.lineTo(14, -38);
      ctx.lineTo(34, -16);
      ctx.lineTo(6, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  }

  function drawSnowField() {
    ctx.fillStyle = mode === "twilight" ? "#d9edf8" : "#eef9ff";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.84);
    ctx.quadraticCurveTo(W * 0.18, H * 0.76, W * 0.36, H * 0.85);
    ctx.quadraticCurveTo(W * 0.55, H * 0.95, W * 0.73, H * 0.84);
    ctx.quadraticCurveTo(W * 0.88, H * 0.78, W, H * 0.87);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = mode === "twilight" ? "rgba(120,170,200,0.18)" : "rgba(120,180,215,0.2)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 7; i++) {
      var y = H * (0.84 + i * 0.02);
      ctx.beginPath();
      ctx.moveTo(44, y + Math.sin(i + t) * 2);
      ctx.quadraticCurveTo(W * 0.36, y - 4, W * 0.66, y + 2);
      ctx.quadraticCurveTo(W * 0.84, y + 7, W - 44, y - 1);
      ctx.stroke();
    }
  }

  function drawTraveler() {
    var x = W * 0.5;
    var y = H * 0.77;
    var s = Math.min(W / 480, (H - y - 10) / 120);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 92 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#596273";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 44 * s, 56 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 44 * s, 56 * s);
    }

    ctx.fillStyle = "#d97843";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#7fb8ff";
    ctx.beginPath();
    ctx.moveTo(x - 16 * s, y + 18 * s);
    ctx.lineTo(x + 18 * s, y + 18 * s);
    ctx.lineTo(x + 8 * s, y + 36 * s);
    ctx.lineTo(x - 20 * s, y + 36 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#556170";
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

    ctx.strokeStyle = "#22303d";
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
    for (var i = 0; i < 5; i++) {
      var y = H * (0.63 + i * 0.04);
      ctx.fillStyle = p.mist;
      ctx.beginPath();
      ctx.moveTo(-40, y);
      for (var x = -40; x <= W + 40; x += 26) {
        var yy = y + Math.sin(x * 0.008 + t * 0.6 + i) * 5 + Math.cos(x * 0.004 + i) * 3;
        ctx.lineTo(x, yy);
      }
      ctx.lineTo(W + 40, y + 24);
      ctx.lineTo(-40, y + 24);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawSnow() {
    snowflakes.forEach(function (f, i) {
      ctx.fillStyle = "rgba(255,255,255," + f.a + ")";
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.s;
      f.x += f.dx + Math.sin((t + i) * 0.7) * 0.08;
      if (f.y > H + 5) {
        f.y = -8;
        f.x = Math.random() * W;
      }
      if (f.x < -6) f.x = W + 6;
      if (f.x > W + 6) f.x = -6;
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawStars();
    drawCloudBands();
    drawMountains();
    drawFjord();
    drawIcebergs();
    drawMist();
    drawSnowField();
    drawTraveler();
    drawSnow();
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
