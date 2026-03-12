/**
 * 蒙古旅人 Canvas 場景：草原、沙塵、遠山、蒙古包、駱駝與旅人剪影
 * 用於對話框上方顯示，可 start/stop 動畫
 */
const MongoliaScene = (function () {
  var rafId = null;
  var t = 0;
  var mode = "day";
  var dusts = [];
  var grasses = [];
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
        y: H * (0.52 + Math.random() * 0.4),
        r: Math.random() * 2 + 0.8,
        s: Math.random() * 0.9 + 0.2,
        dx: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.3 + 0.08
      };
    });
    grasses = Array.from({ length: 80 }, function () {
      return {
        x: Math.random() * W,
        h: Math.random() * 18 + 8,
        lean: Math.random() * 10 - 5,
        w: Math.random() * 1.5 + 0.6
      };
    });
  }

  function palette() {
    if (mode === "sunset") {
      return {
        top: "#4a5f84",
        mid: "#de9355",
        bottom: "#f7d4a3",
        sun: "#ffd499",
        haze: "rgba(255,190,120,0.28)",
        ground1: "#c89a61",
        ground2: "#a87845",
        mountain: "#6e6170"
      };
    }
    return {
      top: "#5578a5",
      mid: "#e3b780",
      bottom: "#f8e8c9",
      sun: "#fff0c2",
      haze: "rgba(255,230,180,0.18)",
      ground1: "#d4ae75",
      ground2: "#bb8f58",
      mountain: "#73809a"
    };
  }

  function drawSky() {
    var p = palette();
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, p.top);
    g.addColorStop(0.48, p.mid);
    g.addColorStop(1, p.bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var rg = ctx.createRadialGradient(W * 0.72, H * 0.2, 10, W * 0.72, H * 0.2, Math.min(120, W * 0.25));
    rg.addColorStop(0, p.sun);
    rg.addColorStop(0.45, mode === "sunset" ? "rgba(255,220,170,0.85)" : "rgba(255,245,210,0.75)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(W * 0.72, H * 0.2, Math.min(120, W * 0.25), 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "#ffd39e" : "#fff5d2";
    ctx.beginPath();
    ctx.arc(W * 0.72, H * 0.2, Math.min(32, W * 0.07), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCloudBands() {
    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,230,210," + (0.08 + i * 0.04) + ")"
        : "rgba(255,250,240," + (0.06 + i * 0.03) + ")";
      ctx.beginPath();
      var baseY = H * (0.14 + i * 0.08);
      ctx.moveTo(-40, baseY);
      for (var x = -40; x <= W + 40; x += 40) {
        var y = baseY + Math.sin(x * 0.005 + t * 0.5 + i * 2) * 12 + Math.cos(x * 0.009 + i) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W + 40, baseY + 40);
      ctx.lineTo(-40, baseY + 40);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawMountains() {
    var p = palette();
    var sx = W / 1400;
    ctx.fillStyle = p.mountain;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.58);
    ctx.lineTo(180 * sx, H * 0.45);
    ctx.lineTo(320 * sx, H * 0.56);
    ctx.lineTo(510 * sx, H * 0.4);
    ctx.lineTo(690 * sx, H * 0.57);
    ctx.lineTo(860 * sx, H * 0.43);
    ctx.lineTo(Math.min(1030 * sx, W), H * 0.59);
    ctx.lineTo(W, H * 0.57);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(255,210,170,0.28)" : "rgba(255,245,220,0.22)";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.61);
    ctx.quadraticCurveTo(W * 0.2, H * 0.54, W * 0.38, H * 0.62);
    ctx.quadraticCurveTo(W * 0.6, H * 0.52, W, H * 0.64);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawSteppe() {
    var p = palette();
    var g = ctx.createLinearGradient(0, H * 0.56, 0, H);
    g.addColorStop(0, p.ground1);
    g.addColorStop(0.65, p.ground2);
    g.addColorStop(1, "#8e673d");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.64);
    ctx.quadraticCurveTo(W * 0.16, H * 0.58, W * 0.35, H * 0.66);
    ctx.quadraticCurveTo(W * 0.52, H * 0.72, W * 0.72, H * 0.65);
    ctx.quadraticCurveTo(W * 0.88, H * 0.61, W, H * 0.69);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = mode === "sunset" ? "rgba(120,80,48,0.18)" : "rgba(90,70,40,0.12)";
    for (var i = 0; i < 6; i++) {
      var x = 60 + i * (W / 6) * 0.35 + Math.sin(t + i) * 8;
      var y = H * (0.72 + (i % 2) * 0.03);
      ctx.beginPath();
      ctx.ellipse(x, y, Math.min(100, W * 0.22), 24, -0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPath() {
    var g = ctx.createLinearGradient(W * 0.4, H * 0.64, W * 0.58, H);
    g.addColorStop(0, "rgba(245,225,180,0.55)");
    g.addColorStop(1, "rgba(180,130,80,0.25)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(W * 0.46, H * 0.66);
    ctx.quadraticCurveTo(W * 0.42, H * 0.76, W * 0.39, H);
    ctx.lineTo(W * 0.58, H);
    ctx.quadraticCurveTo(W * 0.56, H * 0.78, W * 0.52, H * 0.67);
    ctx.closePath();
    ctx.fill();
  }

  function drawGer(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 72, 84, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f2ecde";
    ctx.beginPath();
    ctx.moveTo(-74, 26);
    ctx.quadraticCurveTo(0, -28, 74, 26);
    ctx.lineTo(74, 52);
    ctx.lineTo(-74, 52);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#e7dfcf";
    ctx.fillRect(-82, 42, 164, 32);

    ctx.strokeStyle = "#b68955";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-74, 26);
    ctx.quadraticCurveTo(0, -28, 74, 26);
    ctx.stroke();

    for (var i = -56; i <= 56; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 44);
      ctx.lineTo(i, 72);
      ctx.stroke();
    }

    ctx.fillStyle = "#b56d3b";
    ctx.fillRect(-16, 40, 32, 34);
    ctx.fillStyle = "#855331";
    ctx.fillRect(-4, -6, 8, 18);

    ctx.restore();
  }

  function drawCamel(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 48, 56, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8d5a35";
    ctx.beginPath();
    ctx.moveTo(-48, 12);
    ctx.quadraticCurveTo(-24, -28, 0, 0);
    ctx.quadraticCurveTo(18, -36, 36, 6);
    ctx.lineTo(48, 16);
    ctx.lineTo(36, 30);
    ctx.lineTo(-40, 30);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(26, -6, 12, 28);
    ctx.beginPath();
    ctx.arc(42, -6, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#7a4d2d";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-26, 28); ctx.lineTo(-30, 64);
    ctx.moveTo(-4, 28);  ctx.lineTo(-8, 64);
    ctx.moveTo(18, 28);  ctx.lineTo(14, 64);
    ctx.moveTo(38, 28);  ctx.lineTo(34, 64);
    ctx.stroke();

    ctx.restore();
  }

  function drawTraveler() {
    var x = W * 0.5;
    var y = H * 0.72;
    var s = Math.min(W / 480, (H - y - 10) / 120);

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x, y + 94 * s, 58 * s, 14 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5a4032";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x - 36 * s, y + 4, 44 * s, 58 * s, 12);
      ctx.fill();
    } else {
      ctx.fillRect(x - 36 * s, y + 4, 44 * s, 58 * s);
    }

    ctx.fillStyle = "#304a6f";
    ctx.beginPath();
    ctx.moveTo(x - 26 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 12 * s, y + 82 * s);
    ctx.lineTo(x - 40 * s, y + 82 * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#d58f45";
    ctx.beginPath();
    ctx.arc(x - 4 * s, y + 4, 23 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f0d2b4";
    ctx.beginPath();
    ctx.arc(x - 4 * s, y + 9 * s, 11 * s, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#233242";
    ctx.lineWidth = 8 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 18 * s, y + 82 * s); ctx.lineTo(x - 32 * s, y + 118 * s);
    ctx.moveTo(x + 2 * s, y + 82 * s);  ctx.lineTo(x + 18 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#1b2028";
    ctx.lineWidth = 9 * s;
    ctx.beginPath();
    ctx.moveTo(x - 35 * s, y + 118 * s); ctx.lineTo(x - 16 * s, y + 118 * s);
    ctx.moveTo(x + 14 * s, y + 118 * s); ctx.lineTo(x + 34 * s, y + 118 * s);
    ctx.stroke();

    ctx.strokeStyle = "#233242";
    ctx.lineWidth = 6 * s;
    ctx.beginPath();
    ctx.moveTo(x + 10 * s, y + 38 * s); ctx.lineTo(x + 42 * s, y + 64 * s);
    ctx.stroke();

    ctx.strokeStyle = "#d8c7a8";
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(x + 44 * s, y + 55 * s); ctx.lineTo(x + 58 * s, y + 132 * s);
    ctx.stroke();

    ctx.fillStyle = "#bb6a39";
    ctx.beginPath();
    ctx.moveTo(x - 18 * s, y + 18 * s);
    ctx.quadraticCurveTo(x - 6 * s, y + 12 * s, x + 13 * s, y + 22 * s);
    ctx.lineTo(x + 8 * s, y + 31 * s);
    ctx.quadraticCurveTo(x - 6 * s, y + 23 * s, x - 18 * s, y + 29 * s);
    ctx.closePath();
    ctx.fill();
  }

  function drawGrass() {
    ctx.strokeStyle = mode === "sunset" ? "rgba(92,64,36,0.65)" : "rgba(88,78,45,0.58)";
    grasses.forEach(function (g) {
      var sway = Math.sin(t * 1.8 + g.x * 0.02) * 4;
      var baseY = H * 0.82 + Math.sin(g.x * 0.01) * 10;
      ctx.lineWidth = g.w;
      ctx.beginPath();
      ctx.moveTo(g.x, baseY);
      ctx.quadraticCurveTo(g.x + g.lean + sway, baseY - g.h * 0.65, g.x + sway * 0.7, baseY - g.h);
      ctx.stroke();
    });
  }

  function drawDust() {
    dusts.forEach(function (d) {
      ctx.fillStyle = mode === "sunset"
        ? "rgba(255,205,150," + (d.a + 0.03) + ")"
        : "rgba(255,235,200," + d.a + ")";
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      d.x += d.dx * (mode === "sunset" ? 1.2 : 0.8);
      d.y += Math.sin(t + d.x * 0.01) * 0.15;
      if (d.x > W + 20) {
        d.x = -20;
        d.y = H * (0.52 + Math.random() * 0.4);
      }
    });
  }

  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawCloudBands();
    drawMountains();
    drawSteppe();
    drawPath();
    drawGer(W * 0.22, H * 0.63, 0.5);
    drawGer(W * 0.82, H * 0.66, 0.38);
    drawCamel(W * 0.67, H * 0.72, 0.58);
    drawTraveler();
    drawGrass();
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
