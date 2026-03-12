/**
 * 巴拉圭旅人 Canvas 場景：紅土道路、亞熱帶林地、河流、鄉村小屋與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const ParaguayScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "day";
  var fireflies = [];
  var birds = [];
  var grasses = [];
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function initArrays() {
    W = canvasEl.width;
    H = canvasEl.height;
    fireflies = Array.from({ length: 22 }, function () {
      return {
        x: Math.random() * W,
        y: H * (0.34 + Math.random() * 0.48),
        r: Math.random() * 1.8 + 1,
        phase: Math.random() * Math.PI * 2
      };
    });
    birds = Array.from({ length: 7 }, function () {
      return {
        x: Math.random() * W * 0.7 + W * 0.1,
        y: Math.random() * H * 0.18 + H * 0.1,
        s: Math.random() * 0.35 + 0.28
      };
    });
    grasses = Array.from({ length: 100 }, function () {
      return {
        x: Math.random() * W,
        h: Math.random() * 22 + 8,
        lean: Math.random() * 8 - 4,
        w: Math.random() * 1.5 + 0.8
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#5f6f8a",
        mid: "#df9c62",
        bottom: "#f1d0a0",
        sun: "#ffd6a8",
        river: "#7aa9b5",
        ground1: "#bf7f4d",
        ground2: "#8e5d38",
        forestFar: "#4f6552",
        forestNear: "#304539",
        cloud: "rgba(255,225,200,0.10)"
      };
    }
    return {
      top: "#5f89b0",
      mid: "#efc57f",
      bottom: "#f7e8c8",
      sun: "#fff3d1",
      river: "#89bfcb",
      ground1: "#ca8d56",
      ground2: "#9c673f",
      forestFar: "#607c61",
      forestNear: "#35513f",
      cloud: "rgba(255,255,245,0.08)"
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

    var sx = mode === "sunset" ? W * 0.77 : W * 0.2;
    var sy = H * 0.18;
    var rg = ctx.createRadialGradient(sx, sy, 10, sx, sy, Math.min(120, W * 0.28));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,220,170,0.8)" : "rgba(255,245,210,0.7)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(120, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd7ab" : "#fff7d9";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(32, W * 0.07), 0, Math.PI * 2);
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
        var y = baseY + Math.sin(x * 0.006 + t * 0.55 + i) * 10 + Math.cos(x * 0.004 + i) * 5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 50, baseY + 32);
      ctx.lineTo(-50, baseY + 32);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawBirds() {
    ctx.strokeStyle = "rgba(45,50,58,0.35)";
    ctx.lineWidth = 2;
    birds.forEach(function (b, i) {
      var flap = Math.sin(t * 4 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(b.x - 13 * b.s, b.y);
      ctx.quadraticCurveTo(b.x, b.y - flap * b.s, b.x + 13 * b.s, b.y);
      ctx.stroke();
    });
  }

  function drawForestBands() {
    var p = palette();
    var scaleX = W / 1400;
    ctx.fillStyle = p.forestFar;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.62);
    ctx.lineTo(120 * scaleX, H * 0.56);
    ctx.lineTo(260 * scaleX, H * 0.61);
    ctx.lineTo(410 * scaleX, H * 0.52);
    ctx.lineTo(590 * scaleX, H * 0.63);
    ctx.lineTo(760 * scaleX, H * 0.55);
    ctx.lineTo(Math.min(930 * scaleX, W), H * 0.64);
    ctx.lineTo(W, H * 0.58);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    for (var row = 0; row < 2; row++) {
      var baseY = H * (0.67 + row * 0.06);
      ctx.fillStyle = row === 0 ? "rgba(67,95,70,0.82)" : p.forestNear;
      for (var i = 0; i < 22; i++) {
        var x = i * (W / 22) + row * 14;
        var h = (24 + (i % 4) * 10 + row * 6);
        var w = (18 + (i % 3) * 6);
        ctx.beginPath();
        ctx.moveTo(x, baseY - h);
        ctx.lineTo(x - w, baseY);
        ctx.lineTo(x + w, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(x - 2, baseY, 4, 10);
      }
    }
  }

  function drawRiver() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.63, 0, H * 0.82);
    g.addColorStop(0, "rgba(255,255,255,0.1)");
    g.addColorStop(0.1, p.river);
    g.addColorStop(1, "rgba(90,140,155,0.95)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.quadraticCurveTo(W * 0.16, H * 0.66, W * 0.32, H * 0.73);
    ctx.quadraticCurveTo(W * 0.5, H * 0.82, W * 0.68, H * 0.74);
    ctx.quadraticCurveTo(W * 0.84, H * 0.68, W, H * 0.77);
    ctx.lineTo(W, H * 0.84);
    ctx.quadraticCurveTo(W * 0.8, H * 0.76, W * 0.63, H * 0.82);
    ctx.quadraticCurveTo(W * 0.42, H * 0.9, W * 0.2, H * 0.8);
    ctx.quadraticCurveTo(W * 0.08, H * 0.75, 0, H * 0.8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 5; i++) {
      var y = H * (0.735 + i * 0.018);
      ctx.beginPath();
      ctx.moveTo(40, y + Math.sin(t + i) * 3);
      ctx.quadraticCurveTo(W * 0.35, y - 6, W * 0.64, y + 2);
      ctx.quadraticCurveTo(W * 0.82, y + 10, W - 50, y - 2);
      ctx.stroke();
    }
  }

  function drawGround() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.68, 0, H);
    g.addColorStop(0, p.ground1);
    g.addColorStop(0.7, p.ground2);
    g.addColorStop(1, "#764a31");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.8);
    ctx.quadraticCurveTo(W * 0.18, H * 0.72, W * 0.34, H * 0.82);
    ctx.quadraticCurveTo(W * 0.54, H * 0.92, W * 0.72, H * 0.82);
    ctx.quadraticCurveTo(W * 0.86, H * 0.75, W, H * 0.84);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawPath() {
    var g = ctx.createLinearGradient(W * 0.44, H * 0.68, W * 0.58, H);
    g.addColorStop(0, "rgba(247,214,169,0.6)");
    g.addColorStop(1, "rgba(180,120,75,0.32)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(W * 0.48, H * 0.73);
    ctx.quadraticCurveTo(W * 0.42, H * 0.83, W * 0.4, H);
    ctx.lineTo(W * 0.61, H);
    ctx.quadraticCurveTo(W * 0.57, H * 0.84, W * 0.53, H * 0.74);
    ctx.closePath();
    ctx.fill();
  }

  function drawHouse(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 62, 70, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#efe5d4";
    ctx.fillRect(-54, 12, 108, 48);

    ctx.fillStyle = "#a6543f";
    ctx.beginPath();
    ctx.moveTo(-66, 14);
    ctx.lineTo(0, -20);
    ctx.lineTo(66, 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#7f4a30";
    ctx.fillRect(-10, 30, 20, 30);

    ctx.fillStyle = "#9bc8d4";
    ctx.fillRect(-38, 28, 18, 14);
    ctx.fillRect(20, 28, 18, 14);

    ctx.strokeStyle = "rgba(90,70,50,0.18)";
    ctx.strokeRect(-54, 12, 108, 48);

    ctx.restore();
  }

  function drawPalm(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.strokeStyle = "#6f5138";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 58);
    ctx.quadraticCurveTo(4, 10, 0, -36);
    ctx.stroke();

    ctx.strokeStyle = "#557255";
    ctx.lineWidth = 8;
    var leaves = [
      [-8, -36, -42, -68], [-2, -40, -18, -82], [0, -40, 18, -82],
      [8, -36, 42, -68], [0, -34, 54, -44], [0, -34, -54, -44]
    ];
    leaves.forEach(function (leaf) {
      ctx.beginPath();
      ctx.moveTo(leaf[0], leaf[1]);
      ctx.lineTo(leaf[2], leaf[3]);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawTraveler() {
    var x = W * 0.52;
    var y = H * 0.73;
    var s = Math.min(W / 480, (H - y - 10) / 120);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 92 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5a4b3e";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 44 * s, 56 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 44 * s, 56 * s);
    }

    ctx.fillStyle = "#3f6b57";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 42 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d68b43";
    ctx.beginPath();
    ctx.moveTo(x - 14 * s, y + 18 * s);
    ctx.lineTo(x + 18 * s, y + 18 * s);
    ctx.lineTo(x + 7 * s, y + 35 * s);
    ctx.lineTo(x - 18 * s, y + 35 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#7a5b45";
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

  function drawGrass() {
    ctx.strokeStyle = mode === "sunset" ? "rgba(98,78,48,0.58)" : "rgba(90,82,48,0.48)";
    grasses.forEach(function (g) {
      var sway = Math.sin(t * 1.6 + g.x * 0.02) * 3.6;
      var baseY = H * 0.84 + Math.sin(g.x * 0.01) * 7;
      ctx.lineWidth = g.w;
      ctx.beginPath();
      ctx.moveTo(g.x, baseY);
      ctx.quadraticCurveTo(g.x + g.lean + sway, baseY - g.h * 0.65, g.x + sway * 0.6, baseY - g.h);
      ctx.stroke();
    });
  }

  function drawFireflies() {
    if (mode !== "sunset") return;
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
    drawCloudBands();
    drawBirds();
    drawForestBands();
    drawRiver();
    drawGround();
    drawPath();
    drawHouse(W * 0.25, H * 0.67, 0.62);
    drawPalm(W * 0.18, H * 0.69, 0.64);
    drawPalm(W * 0.85, H * 0.74, 0.52);
    drawHouse(W * 0.78, H * 0.72, 0.38);
    drawTraveler();
    drawGrass();
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
