/**
 * 玻利維亞旅人 Canvas 場景（批次產生，具文化元素）
 * llama
 */
const BoliviaScene = (function () {
  var rafId = null;
  var t = 0;
  var canvasEl = null;
  var ctx = null;
  var W = 0;
  var H = 0;

  function drawSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#5a7aa0");
    g.addColorStop(0.5, "#a8d0e8");
    g.addColorStop(1, "#e8e8dc");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    var sx = W * 0.74;
    var sy = H * 0.2;
    var rg = ctx.createRadialGradient(sx, sy, 8, sx, sy, Math.min(100, W * 0.22));
    rg.addColorStop(0, "#fff0c8");
    rg.addColorStop(0.5, "rgba(255,250,230,0.6)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(100, W * 0.22), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff8e0";
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(24, W * 0.05), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMountains() {
    var sx = W / 1400;
    ctx.fillStyle = "#7a8a98";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.58);
    ctx.lineTo(200 * sx, H * 0.42);
    ctx.lineTo(400 * sx, H * 0.58);
    ctx.lineTo(600 * sx, H * 0.38);
    ctx.lineTo(800 * sx, H * 0.56);
    ctx.lineTo(Math.min(1000 * sx, W), H * 0.4);
    ctx.lineTo(W, H * 0.58);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#5a6860";
    ctx.beginPath();
    ctx.moveTo(0, H * 0.68);
    ctx.quadraticCurveTo(W * 0.2, H * 0.55, W * 0.4, H * 0.7);
    ctx.quadraticCurveTo(W * 0.6, H * 0.52, W * 0.85, H * 0.72);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawGround() {
    var g = ctx.createLinearGradient(0, H * 0.62, 0, H);
    g.addColorStop(0, "#e0d8c8");
    g.addColorStop(0.7, "#c8c0b0");
    g.addColorStop(1, "#6a4a28");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.72);
    ctx.quadraticCurveTo(W * 0.2, H * 0.66, W * 0.5, H * 0.74);
    ctx.quadraticCurveTo(W * 0.8, H * 0.68, W, H * 0.76);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawTraveler() {
    var x = W * 0.5;
    var y = H * 0.72;
    var s = Math.min(W / 480, (H - y - 10) / 100);
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath();
    ctx.ellipse(x, y + 70 * s, 50 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5a3020";
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y + 18 * s);
    ctx.lineTo(x + 24 * s, y + 18 * s);
    ctx.lineTo(x + 10 * s, y + 78 * s);
    ctx.lineTo(x - 38 * s, y + 78 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#c87838";
    ctx.fillRect(x - 20 * s, y + 18 * s, 38 * s, 12 * s);
    if ("cap" === "round") {
      ctx.fillStyle = "#5a3020";
      ctx.beginPath();
      ctx.arc(x - 2 * s, y - 4 * s, 18 * s, 0, Math.PI * 2);
      ctx.fill();
    } else if ("cap" === "cap") {
      ctx.fillStyle = "#c87838";
      ctx.beginPath();
      ctx.moveTo(x - 22 * s, y + 4 * s);
      ctx.lineTo(x + 18 * s, y + 4 * s);
      ctx.lineTo(x + 8 * s, y + 20 * s);
      ctx.lineTo(x - 28 * s, y + 20 * s);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "#e0c8a8";
    ctx.beginPath();
    ctx.arc(x - 2 * s, y + 8 * s, 12 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2a2830";
    ctx.lineWidth = 6 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 16 * s, y + 76 * s);
    ctx.lineTo(x - 28 * s, y + 108 * s);
    ctx.moveTo(x + 4 * s, y + 76 * s);
    ctx.lineTo(x + 16 * s, y + 108 * s);
    ctx.stroke();
    ctx.strokeStyle = "#1a1818";
    ctx.lineWidth = 7 * s;
    ctx.beginPath();
    ctx.moveTo(x - 30 * s, y + 108 * s);
    ctx.lineTo(x - 14 * s, y + 108 * s);
    ctx.moveTo(x + 12 * s, y + 108 * s);
    ctx.lineTo(x + 28 * s, y + 108 * s);
    ctx.stroke();
  }

  function drawLlama(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.beginPath();
    ctx.ellipse(0, 24, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8d8c8";
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(18, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4a4038";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-12, 12);
    ctx.lineTo(-14, 32);
    ctx.moveTo(2, 12);
    ctx.lineTo(4, 32);
    ctx.moveTo(14, 12);
    ctx.lineTo(12, 32);
    ctx.stroke();
    ctx.restore();
  }


  function render() {
    if (!ctx || !canvasEl) return;
    ctx.clearRect(0, 0, W, H);
    drawSky();
    drawMountains();
    
    
    drawGround();
    drawLlama(W * 0.7, H * 0.74, 0.5);
    drawTraveler();
    t += 0.016;
    rafId = requestAnimationFrame(render);
  }

  function start(canvas) {
    stop();
    if (!canvas || !canvas.getContext) return;
    canvasEl = canvas;
    ctx = canvas.getContext("2d");
    W = canvasEl.width;
    H = canvasEl.height;
    t = 0;
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
if (typeof window !== "undefined") window.BoliviaScene = BoliviaScene;
