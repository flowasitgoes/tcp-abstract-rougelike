/**
 * 納米比亞旅人 Canvas 場景：紅沙丘、鹽沼、枯樹、遠山與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const NamibiaScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "day";
  var dusts = [];
  var heatWaves = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    dusts = Array.from({ length: 80 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.42 + Math.random() * 0.5),
        r: Math.random() * 2.5 + 0.8,
        dx: Math.random() * 1.2 + 0.25,
        a: Math.random() * 0.22 + 0.05
      };
    });
    heatWaves = Array.from({ length: 5 }, function (_, i) {
      return {
        y: H * (0.54 + i * 0.055),
        amp: 3 + i,
        speed: 0.5 + i * 0.08
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#716982",
        mid: "#d98750",
        bottom: "#f1c99a",
        sun: "#ffd0a1",
        cloud: "rgba(255,220,195,0.1)",
        dune1: "#cf7d48",
        dune2: "#a95f37",
        dune3: "#7d4630",
        salt: "#e7d9cc",
        mountain: "#73666a"
      };
    }
    return {
      top: "#678ab0",
      mid: "#f2b36f",
      bottom: "#f8e1bf",
      sun: "#fff2cf",
      cloud: "rgba(255,250,240,0.08)",
      dune1: "#dd9457",
      dune2: "#bb7140",
      dune3: "#915434",
      salt: "#edf0f2",
      mountain: "#8d7b76"
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

    var sx = mode === "sunset" ? W * 0.76 : W * 0.22;
    var sy = H * 0.17;
    var rg = ctx.createRadialGradient(sx, sy, 12, sx, sy, Math.min(180, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,215,165,0.82)" : "rgba(255,246,214,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(180, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd6ab" : "#fff7da";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(50, W * 0.08), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCloudBands() {
    var p = palette();
    for (var i = 0; i < 4; i++) {
      var baseY = H * (0.12 + i * 0.08);
      ctx.fillStyle = p.cloud;
      ctx.beginPath();
      ctx.moveTo(-50, baseY);
      for (var x = -50; x <= W + 50; x += 32) {
        var y = baseY + Math.sin(x * 0.006 + t * 0.45 + i) * 8 + Math.cos(x * 0.004 + i) * 5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 50, baseY + 30);
      ctx.lineTo(-50, baseY + 30);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawMountains() {
    var p = palette();
    var scaleX = W / 1400;
    ctx.fillStyle = p.mountain;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.58);
    ctx.lineTo(150 * scaleX, H * 0.52);
    ctx.lineTo(310 * scaleX, H * 0.57);
    ctx.lineTo(470 * scaleX, H * 0.49);
    ctx.lineTo(680 * scaleX, H * 0.58);
    ctx.lineTo(890 * scaleX, H * 0.5);
    ctx.lineTo(Math.min(1100 * scaleX, W), H * 0.59);
    ctx.lineTo(Math.min(1260 * scaleX, W), H * 0.53);
    ctx.lineTo(W, H * 0.58);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawSaltPan() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.64, 0, H);
    g.addColorStop(0, p.salt);
    g.addColorStop(0.7, mode === "sunset" ? "#d8c6b8" : "#dfe5e8");
    g.addColorStop(1, mode === "sunset" ? "#c9b3a1" : "#c9d1d6");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.quadraticCurveTo(W * 0.18, H * 0.72, W * 0.35, H * 0.8);
    ctx.quadraticCurveTo(W * 0.55, H * 0.88, W * 0.74, H * 0.79);
    ctx.quadraticCurveTo(W * 0.88, H * 0.73, W, H * 0.82);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = mode === "sunset" ? "rgba(140,110,92,0.18)" : "rgba(110,130,145,0.18)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 9; i++) {
      var y = H * (0.79 + i * 0.018);
      ctx.beginPath();
      ctx.moveTo(40, y + Math.sin(t + i) * 2);
      ctx.quadraticCurveTo(W * 0.34, y - 4, W * 0.68, y + 3);
      ctx.quadraticCurveTo(W * 0.84, y + 6, W - 50, y - 1);
      ctx.stroke();
    }
  }

  function drawDunes() {
    var p = palette();

    ctx.fillStyle = p.dune3;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.7);
    ctx.quadraticCurveTo(W * 0.12, H * 0.56, W * 0.25, H * 0.72);
    ctx.quadraticCurveTo(W * 0.42, H * 0.82, W * 0.58, H * 0.68);
    ctx.quadraticCurveTo(W * 0.75, H * 0.56, W, H * 0.72);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.dune2;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.76);
    ctx.quadraticCurveTo(W * 0.1, H * 0.6, W * 0.22, H * 0.78);
    ctx.quadraticCurveTo(W * 0.36, H * 0.88, W * 0.48, H * 0.74);
    ctx.quadraticCurveTo(W * 0.62, H * 0.62, W * 0.8, H * 0.78);
    ctx.quadraticCurveTo(W * 0.9, H * 0.84, W, H * 0.76);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.dune1;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.82);
    ctx.quadraticCurveTo(W * 0.16, H * 0.72, W * 0.32, H * 0.84);
    ctx.quadraticCurveTo(W * 0.5, H * 0.94, W * 0.68, H * 0.83);
    ctx.quadraticCurveTo(W * 0.84, H * 0.74, W, H * 0.86);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(255,206,153,0.16)" : "rgba(255,240,210,0.14)";
    ctx.beginPath();
    ctx.moveTo(W * 0.1, H * 0.77);
    ctx.quadraticCurveTo(W * 0.28, H * 0.65, W * 0.46, H * 0.79);
    ctx.quadraticCurveTo(W * 0.56, H * 0.86, W * 0.7, H * 0.77);
    ctx.quadraticCurveTo(W * 0.82, H * 0.7, W * 0.94, H * 0.8);
    ctx.lineTo(W * 0.94, H);
    ctx.lineTo(W * 0.1, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawHeatShimmer() {
    heatWaves.forEach(function (w, i) {
      ctx.strokeStyle = mode === "sunset"
        ? "rgba(255,220,180," + (0.045 + i * 0.008) + ")"
        : "rgba(255,255,255," + (0.035 + i * 0.008) + ")";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, w.y);
      for (var x = -20; x <= W + 20; x += 22) {
        var y = w.y + Math.sin(x * 0.012 + t * w.speed + i) * w.amp;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  function drawDeadTree(x, y, scale, lean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(lean);

    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 36, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#2a2020";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(0, -78);
    ctx.moveTo(0, -48);
    ctx.lineTo(-28, -70);
    ctx.moveTo(0, -40);
    ctx.lineTo(26, -66);
    ctx.moveTo(0, -22);
    ctx.lineTo(-24, -26);
    ctx.moveTo(0, -12);
    ctx.lineTo(30, -10);
    ctx.moveTo(-18, -64);
    ctx.lineTo(-40, -88);
    ctx.moveTo(18, -60);
    ctx.lineTo(42, -86);
    ctx.stroke();

    ctx.restore();
  }

  function drawRock(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#73625b";
    ctx.beginPath();
    ctx.moveTo(-34, 10);
    ctx.lineTo(-18, -18);
    ctx.lineTo(18, -14);
    ctx.lineTo(34, 8);
    ctx.lineTo(10, 18);
    ctx.lineTo(-24, 18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawTraveler() {
    var x = W * 0.52;
    var y = H * 0.76;
    var s = Math.min(W / 480, (H - y - 10) / 120);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 92 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5b4c40";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 44 * s, 56 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 44 * s, 56 * s);
    }

    ctx.fillStyle = "#4f6f64";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d9924b";
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, y + 18 * s);
    ctx.lineTo(x + 18 * s, y + 18 * s);
    ctx.lineTo(x + 7 * s, y + 35 * s);
    ctx.lineTo(x - 18 * s, y + 35 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#7a614a";
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

  function drawDust() {
    dusts.forEach(function (d) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,205,150," + (d.a + 0.03) + ")"
        : "rgba(255,238,204," + d.a + ")";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      d.x += d.dx * (mode === "sunset" ? 1.2 : 0.8);
      d.y += Math.sin(t + d.x * 0.01) * 0.12;
      if (d.x > W + 20) {
        d.x = -20;
        d.y = H * (0.42 + Math.random() * 0.5);
      }
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawCloudBands();
    drawMountains();
    drawSaltPan();
    drawDunes();
    drawHeatShimmer();
    drawDeadTree(W * 0.22, H * 0.73, 1.3, -0.04);
    drawDeadTree(W * 0.72, H * 0.7, 0.95, 0.03);
    drawDeadTree(W * 0.84, H * 0.76, 0.72, -0.02);
    drawRock(W * 0.38, H * 0.86, 1.4);
    drawRock(W * 0.77, H * 0.88, 1.1);
    drawTraveler();
    drawDust();
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
