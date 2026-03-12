/**
 * 冰島旅人 Canvas 場景：極光、雪山、冰原、旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const IcelandScene = (function () {
  let rafId = null;
  let t = 0;
  let auroraBoost = 1;
  let stars = [];
  let snowflakes = [];
  let canvasEl = null;
  let ctx = null;
  let W = 0;
  let H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    stars = Array.from({ length: 80 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.45,
        r: Math.random() * 1.2 + 0.25,
        a: Math.random() * 0.8 + 0.2,
        tw: Math.random() * 0.03 + 0.01
      };
    });
    snowflakes = Array.from({ length: 40 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.5,
        s: Math.random() * 0.6 + 0.3,
        dx: Math.random() * 0.4 - 0.2
      };
    });
  }

  function gradientSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#09111c");
    g.addColorStop(0.45, "#13233b");
    g.addColorStop(0.7, "#27486f");
    g.addColorStop(1, "#edf8ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawMoon() {
    var x = W * 0.82;
    var y = H * 0.14;
    var r = Math.min(36, W * 0.06);
    var rg = ctx.createRadialGradient(x, y, 4, x, y, 80);
    rg.addColorStop(0, "rgba(255,255,230,0.95)");
    rg.addColorStop(0.3, "rgba(255,255,235,0.65)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(x, y, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffbe8";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStars() {
    stars.forEach(function (s) {
      var alpha = s.a + Math.sin(t * s.tw * 60 + s.x) * 0.15;
      ctx.fillStyle = "rgba(255,255,255," + Math.max(0.1, alpha) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawAurora() {
    var band;
    for (band = 0; band < 4; band++) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.moveTo(0, H * 0.16 + band * 18);

      for (var x = 0; x <= W; x += 14) {
        var wave = Math.sin(x * 0.012 + t * 1.3 + band) * 28;
        var wave2 = Math.cos(x * 0.006 + t * 0.8 + band * 2) * 14;
        var y = H * (0.16 + band * 0.05) + wave + wave2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();

      var g = ctx.createLinearGradient(0, 0, 0, H * 0.45);
      var a = 0.14 * auroraBoost;
      if (band % 2 === 0) {
        g.addColorStop(0, "rgba(126,247,200," + a + ")");
        g.addColorStop(0.45, "rgba(139,233,253," + a * 0.9 + ")");
        g.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        g.addColorStop(0, "rgba(169,140,255," + a + ")");
        g.addColorStop(0.45, "rgba(255,145,193," + a * 0.8 + ")");
        g.addColorStop(1, "rgba(255,255,255,0)");
      }
      ctx.fillStyle = g;
      ctx.filter = "blur(" + (12 + band * 3) + "px)";
      ctx.fill();
      ctx.restore();
    }
    ctx.filter = "none";
  }

  function drawMountains() {
    var scale = W / 1400;
    ctx.fillStyle = "#405977";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.58);
    ctx.lineTo(140 * scale, H * 0.44);
    ctx.lineTo(280 * scale, H * 0.58);
    ctx.lineTo(420 * scale, H * 0.40);
    ctx.lineTo(610 * scale, H * 0.58);
    ctx.lineTo(760 * scale, H * 0.43);
    ctx.lineTo(930 * scale, H * 0.58);
    ctx.lineTo(Math.min(1090 * scale, W), H * 0.38);
    ctx.lineTo(W, H * 0.58);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.moveTo(350 * scale, H * 0.48);
    ctx.lineTo(420 * scale, H * 0.40);
    ctx.lineTo(500 * scale, H * 0.50);
    ctx.lineTo(455 * scale, H * 0.48);
    ctx.lineTo(430 * scale, H * 0.44);
    ctx.closePath();
    ctx.fill();

    if (W > 800) {
      ctx.beginPath();
      ctx.moveTo(1030 * scale, H * 0.47);
      ctx.lineTo(1090 * scale, H * 0.38);
      ctx.lineTo(1170 * scale, H * 0.49);
      ctx.lineTo(1125 * scale, H * 0.47);
      ctx.lineTo(1095 * scale, H * 0.43);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = "#2a2f3f";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.7);
    ctx.quadraticCurveTo(W * 0.18, H * 0.6, W * 0.32, H * 0.71);
    ctx.quadraticCurveTo(W * 0.43, H * 0.62, W * 0.58, H * 0.72);
    ctx.quadraticCurveTo(W * 0.74, H * 0.60, W, H * 0.72);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawIceField() {
    var g = ctx.createLinearGradient(0, H * 0.62, 0, H);
    g.addColorStop(0, "rgba(235,246,255,0.35)");
    g.addColorStop(0.35, "rgba(227,243,255,0.85)");
    g.addColorStop(1, "rgba(250,253,255,1)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.73);
    ctx.quadraticCurveTo(W * 0.2, H * 0.68, W * 0.34, H * 0.74);
    ctx.quadraticCurveTo(W * 0.46, H * 0.79, W * 0.58, H * 0.73);
    ctx.quadraticCurveTo(W * 0.76, H * 0.66, W, H * 0.77);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(120,180,215,0.35)";
    ctx.lineWidth = 1.5;
    for (var i = 0; i < 6; i++) {
      var y = H * 0.76 + i * 14;
      ctx.beginPath();
      ctx.moveTo(40, y + Math.sin(i + t) * 4);
      ctx.quadraticCurveTo(W * 0.35, y - 8, W * 0.58, y + 3);
      ctx.quadraticCurveTo(W * 0.78, y + 8, W - 50, y - 2);
      ctx.stroke();
    }
  }

  function drawTraveler() {
    var x = W * 0.5;
    var y = H * 0.68;
    var s = Math.min(W / 480, H / 270, (H - y - 10) / 90);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 62 * s, 38 * s, 10 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4d5f73";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 24 * s, y + 2, 28 * s, 38 * s, 8);
      ctx.fill();
    } else {
      ctx.fillRect(x - 24 * s, y + 2, 28 * s, 38 * s);
    }

    ctx.fillStyle = "#f3b36a";
    ctx.beginPath();
    ctx.moveTo(x - 18 * s, y + 14 * s);
    ctx.lineTo(x + 16 * s, y + 14 * s);
    ctx.lineTo(x + 7 * s, y + 54 * s);
    ctx.lineTo(x - 30 * s, y + 54 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#e99549";
    ctx.beginPath();
    ctx.arc(x - 3 * s, y + 2, 16 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f5d4ba";
    ctx.beginPath();
    ctx.arc(x - 2 * s, y + 5 * s, 8 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#213040";
    ctx.lineWidth = 5 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 12 * s, y + 53 * s);
    ctx.lineTo(x - 24 * s, y + 78 * s);
    ctx.moveTo(x + 2 * s, y + 53 * s);
    ctx.lineTo(x + 12 * s, y + 78 * s);
    ctx.stroke();

    ctx.strokeStyle = "#1a1f28";
    ctx.lineWidth = 6 * s;
    ctx.beginPath();
    ctx.moveTo(x - 26 * s, y + 78 * s);
    ctx.lineTo(x - 14 * s, y + 78 * s);
    ctx.moveTo(x + 10 * s, y + 78 * s);
    ctx.lineTo(x + 22 * s, y + 78 * s);
    ctx.stroke();

    ctx.strokeStyle = "#213040";
    ctx.lineWidth = 4 * s;
    ctx.beginPath();
    ctx.moveTo(x + 7 * s, y + 24 * s);
    ctx.lineTo(x + 28 * s, y + 44 * s);
    ctx.stroke();

    ctx.strokeStyle = "#c8d2da";
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.moveTo(x + 30 * s, y + 38 * s);
    ctx.lineTo(x + 40 * s, y + 88 * s);
    ctx.stroke();

    ctx.fillStyle = "#9dc7ff";
    ctx.beginPath();
    ctx.moveTo(x - 12 * s, y + 12 * s);
    ctx.quadraticCurveTo(x - 3 * s, y + 9 * s, x + 8 * s, y + 14 * s);
    ctx.lineTo(x + 5 * s, y + 20 * s);
    ctx.quadraticCurveTo(x - 4 * s, y + 16 * s, x - 12 * s, y + 19 * s);
    ctx.closePath();
    ctx.fill();
  }

  function drawSnow() {
    snowflakes.forEach(function (f) {
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.s;
      f.x += f.dx + Math.sin((t + f.y) * 0.02) * 0.2;
      if (f.y > H + 5) {
        f.y = -10;
        f.x = Math.random() * W;
      }
      if (f.x > W + 5) f.x = -5;
      if (f.x < -5) f.x = W + 5;
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    gradientSky();
    drawMoon();
    drawStars();
    drawAurora();
    drawMountains();
    drawIceField();
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
    auroraBoost = 1;
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
