/**
 * 食物袋 Canvas 場景：紙袋、蔬果、法棍、葉菜與柔光微粒
 * 用於對話框上方顯示（obj_food_bag），可 start/stop 動畫
 */
const FoodBagScene = (function () {
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
    particles = Array.from({ length: 42 }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.62,
        r: Math.random() * 2 + 0.8,
        s: Math.random() * 0.45 + 0.12,
        a: Math.random() * 0.18 + 0.05
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#8c8b90",
        mid: "#d8aa72",
        bottom: "#f2dfc9",
        sun: "#ffd8af",
        glow: "rgba(255,214,178,0.22)",
        bagLight: "#ead6ae",
        bagMid: "#d1b485",
        bagDark: "#ad875d",
        label: "#d56f47",
        string: "#87684a",
        board: "#be855a",
        boardDark: "#8f5a3c"
      };
    }
    return {
      top: "#97b8cb",
      mid: "#efd49e",
      bottom: "#f8edde",
      sun: "#fff7dc",
      glow: "rgba(255,247,218,0.18)",
      bagLight: "#f1e2c0",
      bagMid: "#ddc79b",
      bagDark: "#ba976a",
      label: "#dc7449",
      string: "#8c6d4e",
      board: "#cb9465",
      boardDark: "#9e6944"
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
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,222,182,0.82)" : "rgba(255,248,220,0.72)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(170, W * 0.28), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd8b0" : "#fff8df";
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

  function drawTable() {
    var p = palette();
    var x = W * 0.5;
    var y = H * 0.8;

    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.beginPath();
    ctx.ellipse(x, y + 86 * scale, 290 * scale, 38 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    var g = ctx.createLinearGradient(x - 280 * scale, y - 30 * scale, x + 280 * scale, y + 70 * scale);
    g.addColorStop(0, p.board);
    g.addColorStop(1, p.boardDark);
    ctx.fillStyle = g;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 280 * scale, y - 10 * scale, 560 * scale, 120 * scale, 34 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - 280 * scale, y - 10 * scale, 560 * scale, 120 * scale);
    }

    ctx.strokeStyle = "rgba(110,70,44,0.22)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 5; i++) {
      var yy = y + i * 18 * scale;
      ctx.beginPath();
      ctx.moveTo(x - 250 * scale, yy + Math.sin(i + t) * 2);
      ctx.lineTo(x + 250 * scale, yy + Math.cos(i + t) * 1.5);
      ctx.stroke();
    }
  }

  function drawGlow() {
    var p = palette();
    ctx.fillStyle = p.glow;
    ctx.beginPath();
    ctx.ellipse(W * 0.5, H * 0.48, 230 * scale, 180 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBag() {
    var p = palette();
    var x = W * 0.5;
    var y = H * 0.54;
    var sway = Math.sin(t * 1.3) * 2.5 * scale;

    ctx.save();
    ctx.translate(sway, 0);

    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.beginPath();
    ctx.ellipse(x, y + 210 * scale, 170 * scale, 24 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    var g = ctx.createLinearGradient(x - 130 * scale, y - 140 * scale, x + 140 * scale, y + 180 * scale);
    g.addColorStop(0, p.bagLight);
    g.addColorStop(0.58, p.bagMid);
    g.addColorStop(1, p.bagDark);
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(x - 120 * scale, y - 72 * scale);
    ctx.lineTo(x + 116 * scale, y - 72 * scale);
    ctx.lineTo(x + 138 * scale, y + 164 * scale);
    ctx.lineTo(x - 138 * scale, y + 164 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(x - 120 * scale, y - 72 * scale);
    ctx.lineTo(x + 116 * scale, y - 72 * scale);
    ctx.lineTo(x + 90 * scale, y - 36 * scale);
    ctx.lineTo(x - 98 * scale, y - 36 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = p.label;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 54 * scale, y + 12 * scale, 108 * scale, 88 * scale, 18 * scale);
      ctx.fill();
    } else {
      ctx.fillRect(x - 54 * scale, y + 12 * scale, 108 * scale, 88 * scale);
    }

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(x, y + 56 * scale, 18 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 3 * scale, y + 34 * scale, 6 * scale, 46 * scale);
    ctx.fillRect(x - 20 * scale, y + 53 * scale, 40 * scale, 6 * scale);

    ctx.strokeStyle = p.string;
    ctx.lineWidth = 5 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 72 * scale, y - 60 * scale);
    ctx.quadraticCurveTo(x - 88 * scale, y - 114 * scale, x - 40 * scale, y - 126 * scale);
    ctx.moveTo(x + 72 * scale, y - 60 * scale);
    ctx.quadraticCurveTo(x + 88 * scale, y - 114 * scale, x + 40 * scale, y - 126 * scale);
    ctx.stroke();

    ctx.restore();
  }

  function drawLeafCluster(x, y, scaleLeaf, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scaleLeaf, scaleLeaf);

    var leaves = [
      [-24, 8, -0.6, 38, 18],
      [0, -6, 0, 44, 22],
      [24, 6, 0.6, 38, 18],
      [-10, 26, -0.2, 34, 16],
      [12, 24, 0.25, 34, 16]
    ];

    leaves.forEach(function (arr) {
      var lx = arr[0], ly = arr[1], r = arr[2], rx = arr[3], ry = arr[4];
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(r + Math.sin(t * 1.8 + lx) * 0.03);
      var g = ctx.createLinearGradient(-20, -10, 20, 14);
      g.addColorStop(0, "#88c16c");
      g.addColorStop(1, "#4f8f49");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -ry * 0.7);
      ctx.lineTo(0, ry * 0.7);
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();
  }

  function drawBaguette(x, y, scaleBaguette, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot + Math.sin(t * 1.2) * 0.01);
    ctx.scale(scaleBaguette, scaleBaguette);

    var g = ctx.createLinearGradient(-90, -20, 90, 24);
    g.addColorStop(0, "#e2b06e");
    g.addColorStop(1, "#b9783d");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-84, 0);
    ctx.quadraticCurveTo(-62, -28, 0, -24);
    ctx.quadraticCurveTo(66, -22, 90, 0);
    ctx.quadraticCurveTo(64, 22, 0, 24);
    ctx.quadraticCurveTo(-62, 22, -84, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(140,90,42,0.55)";
    ctx.lineWidth = 4;
    [-46, -16, 16, 48].forEach(function (s) {
      ctx.beginPath();
      ctx.moveTo(s, -14);
      ctx.lineTo(s + 12, 12);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawApple(x, y, scaleApple) {
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 1.8 + x) * 1.5 * scale);
    ctx.scale(scaleApple, scaleApple);

    var g = ctx.createRadialGradient(-8, -10, 4, 0, 0, 36);
    g.addColorStop(0, "#ff8b8b");
    g.addColorStop(1, "#c94444");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#7b5a35";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(2, -30);
    ctx.quadraticCurveTo(8, -46, 0, -56);
    ctx.stroke();

    ctx.fillStyle = "#71a85b";
    ctx.beginPath();
    ctx.ellipse(18, -40, 14, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCarrot(x, y, scaleCarrot, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot + Math.sin(t * 1.4 + x) * 0.02);
    ctx.scale(scaleCarrot, scaleCarrot);

    var g = ctx.createLinearGradient(0, -30, 0, 54);
    g.addColorStop(0, "#f59a45");
    g.addColorStop(1, "#d56d28");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 54);
    ctx.lineTo(-24, -12);
    ctx.quadraticCurveTo(0, -28, 24, -12);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#5f9950";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    [[0, -10, -20, -36], [0, -12, 0, -42], [0, -10, 18, -34]].forEach(function (a) {
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(a[2], a[3]);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawContents() {
    var sway = Math.sin(t * 1.3) * 2.5 * scale;
    drawLeafCluster(W * 0.43 + sway, H * 0.38, 1.1 * scale, -0.1);
    drawLeafCluster(W * 0.57 + sway, H * 0.36, 1.05 * scale, 0.16);
    drawBaguette(W * 0.62 + sway, H * 0.4, 1.02 * scale, 0.4);
    drawApple(W * 0.45 + sway, H * 0.49, 0.86 * scale);
    drawApple(W * 0.57 + sway, H * 0.5, 0.78 * scale);
    drawCarrot(W * 0.39 + sway, H * 0.5, 1.0 * scale, -0.35);
    drawCarrot(W * 0.53 + sway, H * 0.44, 0.84 * scale, 0.18);
  }

  function drawLooseItems() {
    drawApple(W * 0.25, H * 0.77, 0.72 * scale);
    drawCarrot(W * 0.73, H * 0.8, 0.86 * scale, 0.45);
    drawLeafCluster(W * 0.18, H * 0.76, 0.72 * scale, -0.2);
  }

  function drawParticles() {
    particles.forEach(function (pt, i) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,220,165," + (pt.a + 0.03) + ")"
        : "rgba(255,255,238," + pt.a + ")";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();

      pt.y += pt.s * 0.25;
      pt.x += Math.sin(t + i) * 0.14;
      if (pt.y > H * 0.66) {
        pt.y = Math.random() * H * 0.42;
        pt.x = Math.random() * W;
      }
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawTable();
    drawGlow();
    drawContents();
    drawBag();
    drawLooseItems();
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
