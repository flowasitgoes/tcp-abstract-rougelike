/**
 * 夜市鹹酥雞小遊戲 - 主程式
 */
(function () {
  let canvas, ctx;
  let cameraX = 0;
  let lastTime = 0;
  let talkedIds = new Set();
  let hasBought = false;
  let lastOverlappingNpcs = new Set();
  let scale = 1;
  let canvasDisplayWidth, canvasDisplayHeight;

  function resize() {
    canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const w = CONST.CANVAS_WIDTH;
    const h = CONST.CANVAS_HEIGHT;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    scale = Math.min(winW / w, winH / h, 2);
    canvasDisplayWidth = w * scale;
    canvasDisplayHeight = h * scale;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = canvasDisplayWidth + "px";
    canvas.style.height = canvasDisplayHeight + "px";
  }

  function getWorldCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const sx = (clientX - rect.left) / rect.width;
    const sy = (clientY - rect.top) / rect.height;
    const worldX = cameraX + sx * CONST.CANVAS_WIDTH;
    const worldY = sy * CONST.CANVAS_HEIGHT;
    return { worldX, worldY };
  }

  function updateCamera() {
    const px = Player.getX();
    const halfW = CONST.CANVAS_WIDTH / 2;
    const dead = CONST.CAMERA_DEAD_ZONE;
    if (px < halfW - dead) {
      cameraX = Math.max(0, px - halfW + dead);
    } else if (px > halfW + dead) {
      cameraX = Math.min(CONST.WORLD_WIDTH - CONST.CANVAS_WIDTH, px - halfW - dead);
    }
    cameraX = Math.max(0, Math.min(CONST.WORLD_WIDTH - CONST.CANVAS_WIDTH, cameraX));
  }

  function handleClick(clientX, clientY) {
    if (Dialogues.isOpen()) return;
    const { worldX, worldY } = getWorldCoords(clientX, clientY);
    const id = Scene.getClickedId(worldX, worldY);
    if (!id) return;

    if (id === "stall") {
      if (hasBought) return;
      const canBuy = talkedIds.size >= CONST.MIN_TALKS_TO_BUY;
      if (canBuy) {
        if (typeof AudioManager !== "undefined") {
          try { AudioManager.play("stall_cheer"); } catch (err) {}
        }
        Dialogues.show("stall_buy", {
          onClose: function () {
            hasBought = true;
            document.getElementById("ending-overlay").classList.remove("hidden");
            if (typeof AudioManager !== "undefined") {
              try { AudioManager.play("stall_firework"); } catch (err) {}
            }
          }
        });
      } else {
        Dialogues.show("stall");
      }
      return;
    }

    talkedIds.add(id);
    Dialogues.show(id);
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    if (!Dialogues.isOpen() && !hasBought) {
      Player.update(dt);
      updateCamera();

      var currentNpcs = Scene.getNpcsAtPlayer(Player.getX());
      if (Scene.isPlayerAtStall(Player.getX())) {
        currentNpcs.push("stall");
      }
      for (var i = 0; i < currentNpcs.length; i++) {
        var id = currentNpcs[i];
        if (!lastOverlappingNpcs.has(id)) {
          if (id === "stall") {
            var canBuy = talkedIds.size >= CONST.MIN_TALKS_TO_BUY;
            if (canBuy) {
              if (typeof AudioManager !== "undefined") {
                try { AudioManager.play("stall_cheer"); } catch (err) {}
              }
              Dialogues.show("stall_buy", {
                onClose: function () {
                  hasBought = true;
                  document.getElementById("ending-overlay").classList.remove("hidden");
                  if (typeof AudioManager !== "undefined") {
                    try { AudioManager.play("stall_firework"); } catch (err) {}
                  }
                }
              });
            } else {
              Dialogues.show("stall");
            }
          } else {
            talkedIds.add(id);
            if (typeof AudioManager !== "undefined") {
              try {
                AudioManager.play("npc_meet");
              } catch (err) {}
            }
            Dialogues.show(id);
          }
          break;
        }
      }
      lastOverlappingNpcs = new Set(currentNpcs);
    }

    ctx.clearRect(0, 0, CONST.CANVAS_WIDTH, CONST.CANVAS_HEIGHT);
    Scene.draw(ctx, cameraX);
    Player.draw(ctx, cameraX);

    requestAnimationFrame(loop);
  }

  function setupInput() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        Player.setVelocity(-CONST.PLAYER_SPEED);
        if (!e.repeat && typeof AudioManager !== "undefined") AudioManager.play("walk_left");
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        Player.setVelocity(CONST.PLAYER_SPEED);
        if (!e.repeat && typeof AudioManager !== "undefined") AudioManager.play("walk_right");
      }
      if (Dialogues.isOpen() && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        try {
          const closeBtn = document.getElementById("dialog-close");
          const willClose = closeBtn && !closeBtn.classList.contains("hidden");
          if (typeof AudioManager !== "undefined") {
            AudioManager.play(willClose ? "dialog_close" : "dialog_next");
          }
        } catch (err) {}
        Dialogues.advance();
      }
    });
    document.addEventListener("keyup", function (e) {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") Player.setVelocity(0);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") Player.setVelocity(0);
    });

    canvas.addEventListener("click", function (e) {
      handleClick(e.clientX, e.clientY);
    });

    const btnLeft = document.getElementById("btn-left");
    const btnRight = document.getElementById("btn-right");
    if (btnLeft) {
      btnLeft.addEventListener("mousedown", function () {
        Player.setVelocity(-CONST.PLAYER_SPEED);
        if (typeof AudioManager !== "undefined") AudioManager.play("walk_left");
      });
      btnLeft.addEventListener("mouseup", function () { Player.setVelocity(0); });
      btnLeft.addEventListener("mouseleave", function () { Player.setVelocity(0); });
      btnLeft.addEventListener("touchstart", function (e) {
        e.preventDefault();
        Player.setVelocity(-CONST.PLAYER_SPEED);
        if (typeof AudioManager !== "undefined") AudioManager.play("walk_left");
      });
      btnLeft.addEventListener("touchend", function (e) { e.preventDefault(); Player.setVelocity(0); });
    }
    if (btnRight) {
      btnRight.addEventListener("mousedown", function () {
        Player.setVelocity(CONST.PLAYER_SPEED);
        if (typeof AudioManager !== "undefined") AudioManager.play("walk_right");
      });
      btnRight.addEventListener("mouseup", function () { Player.setVelocity(0); });
      btnRight.addEventListener("mouseleave", function () { Player.setVelocity(0); });
      btnRight.addEventListener("touchstart", function (e) {
        e.preventDefault();
        Player.setVelocity(CONST.PLAYER_SPEED);
        if (typeof AudioManager !== "undefined") AudioManager.play("walk_right");
      });
      btnRight.addEventListener("touchend", function (e) { e.preventDefault(); Player.setVelocity(0); });
    }
  }

  function init() {
    resize();
    window.addEventListener("resize", resize);
    ctx = canvas.getContext("2d");
    Dialogues.init();
    document.getElementById("ending-replay").addEventListener("click", function () {
      document.getElementById("ending-overlay").classList.add("hidden");
      hasBought = false;
      talkedIds.clear();
      Player.reset();
      cameraX = 0;
    });
    setupInput();
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
