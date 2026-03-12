/**
 * 玩家：位置、移動、繪製
 */
const Player = (function () {
  let x = CONST.PLAYER_START_X;
  let vx = 0;
  let frameIndex = 0;
  let lastTime = 0;

  function update(dt) {
    x += vx * dt;
    const minX = CONST.PLAYER_WIDTH / 2;
    const maxX = CONST.WORLD_WIDTH - CONST.PLAYER_WIDTH / 2;
    x = Math.max(minX, Math.min(maxX, x));

    if (Math.abs(vx) > 1) {
      frameIndex = (frameIndex + dt * 8) % 4;
    } else {
      frameIndex = 0;
    }
  }

  function draw(ctx, cameraX) {
    const sx = x - cameraX - CONST.PLAYER_WIDTH / 2;
    const sy = CONST.CANVAS_HEIGHT - 120 - CONST.PLAYER_HEIGHT;

    ctx.save();
    // 身體（簡易人形）
    ctx.fillStyle = "#4a7c59";
    ctx.fillRect(sx + 12, sy + 20, 24, 50);
    // 頭
    ctx.fillStyle = "#e8c9a0";
    ctx.beginPath();
    ctx.arc(sx + CONST.PLAYER_WIDTH / 2, sy + 14, 14, 0, Math.PI * 2);
    ctx.fill();
    // 腳（走路時輕微擺動）
    const legOffset = Math.sin(frameIndex * Math.PI * 0.5) * 6;
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(sx + 14 + legOffset, sy + 68, 10, 14);
    ctx.fillRect(sx + 24 - legOffset, sy + 68, 10, 14);
    ctx.restore();
  }

  function setVelocity(vel) {
    vx = vel;
  }

  function getX() {
    return x;
  }

  function reset() {
    x = CONST.PLAYER_START_X;
    vx = 0;
    frameIndex = 0;
  }

  return {
    update,
    draw,
    setVelocity,
    getX,
    reset
  };
})();
