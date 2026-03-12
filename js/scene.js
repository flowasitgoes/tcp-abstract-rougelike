/**
 * 場景：世界寬度、可點擊區、繪製
 */
const Scene = (function () {
  const WORLD_WIDTH = CONST.WORLD_WIDTH;
  const W = CONST.CANVAS_WIDTH;
  const H = CONST.CANVAS_HEIGHT;
  const GROUND_Y = H - 100;

  // 可點擊矩形 { x, y, w, h, id }
  const NPCS = [
    { x: 320, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_iceland" },
    { x: 520, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_mongolia" },
    { x: 720, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_bhutan" },
    { x: 920, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_madagascar" },
    { x: 1120, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_paraguay" },
    { x: 1320, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_slovenia" },
    { x: 1520, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_namibia" },
    { x: 1720, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_albania" },
    { x: 1920, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_greenland" },
    { x: 2120, y: GROUND_Y - 90, w: 50, h: 90, id: "npc_bolivia" }
  ];

  const OBJECTS = [
    { x: 800, y: GROUND_Y - 50, w: 60, h: 50, id: "obj_basil" },
    { x: 1200, y: GROUND_Y - 45, w: 40, h: 45, id: "obj_garlic" },
    { x: 1840, y: GROUND_Y - 55, w: 55, h: 55, id: "obj_food_bag" }
  ];

  const STALL_BOUNDS = { x: 2240, y: GROUND_Y - 140, w: 220, h: 140, id: "stall" };

  const allClickables = [...NPCS, ...OBJECTS, STALL_BOUNDS];

  const PLAYER_TOP = CONST.CANVAS_HEIGHT - 120 - CONST.PLAYER_HEIGHT;
  const PLAYER_BOTTOM = CONST.CANVAS_HEIGHT - 120;

  function getNpcsAtPlayer(playerX) {
    const pl = playerX - CONST.PLAYER_WIDTH / 2;
    const pr = playerX + CONST.PLAYER_WIDTH / 2;
    const ids = [];

    // 路人
    NPCS.forEach(function (npc) {
      if (pr > npc.x && pl < npc.x + npc.w && PLAYER_BOTTOM > npc.y && PLAYER_TOP < npc.y + npc.h) {
        ids.push(npc.id);
      }
    });

    // 前景物件：九層塔、蒜頭、食物袋
    OBJECTS.forEach(function (obj) {
      if (pr > obj.x && pl < obj.x + obj.w && PLAYER_BOTTOM > obj.y && PLAYER_TOP < obj.y + obj.h) {
        ids.push(obj.id);
      }
    });

    return ids;
  }

  /** 玩家是否與攤位重疊（走到攤位範圍內） */
  function isPlayerAtStall(playerX) {
    const pl = playerX - CONST.PLAYER_WIDTH / 2;
    const pr = playerX + CONST.PLAYER_WIDTH / 2;
    const s = STALL_BOUNDS;
    return pr > s.x && pl < s.x + s.w && PLAYER_BOTTOM > s.y && PLAYER_TOP < s.y + s.h;
  }

  function getClickedId(worldX, worldY) {
    for (let i = allClickables.length - 1; i >= 0; i--) {
      const r = allClickables[i];
      if (worldX >= r.x && worldX <= r.x + r.w && worldY >= r.y && worldY <= r.y + r.h) {
        return r.id;
      }
    }
    return null;
  }

  function draw(ctx, cameraX) {
    const left = cameraX;
    const right = cameraX + W + 100;

    // 夜空
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#0a0a14");
    bgGrad.addColorStop(0.7, "#12121a");
    bgGrad.addColorStop(1, "#1a1812");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(left, 0, right - left + 200, H);

    // 路燈光暈
    const lampX = (left + right) / 2 - left;
    const lamp = ctx.createRadialGradient(lampX, H - 180, 0, lampX, H - 180, 250);
    lamp.addColorStop(0, "rgba(255, 220, 120, 0.25)");
    lamp.addColorStop(0.5, "rgba(200, 160, 60, 0.08)");
    lamp.addColorStop(1, "transparent");
    ctx.fillStyle = lamp;
    ctx.fillRect(left, 0, right - left + 200, H);

    // 地面
    ctx.fillStyle = "#2a2820";
    ctx.fillRect(left, GROUND_Y, right - left + 200, H - GROUND_Y);
    ctx.fillStyle = "#3d3a30";
    ctx.fillRect(left, GROUND_Y + 2, right - left + 200, 8);

    // 鹹酥雞攤（在可見範圍內才畫）
    const stallScreenX = STALL_BOUNDS.x - cameraX;
    if (stallScreenX > -300 && stallScreenX < W + 300) {
      ctx.fillStyle = "#4a3728";
      ctx.fillRect(STALL_BOUNDS.x - cameraX, STALL_BOUNDS.y + 40, 220, 100);
      ctx.fillStyle = "#c9a227";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("鹹酥雞", STALL_BOUNDS.x - cameraX + 60, STALL_BOUNDS.y + 95);
      ctx.fillStyle = "#8b7355";
      ctx.fillRect(STALL_BOUNDS.x - cameraX + 20, STALL_BOUNDS.y + 70, 80, 40);
    }

    // NPC 剪影
    NPCS.forEach(function (npc) {
      const sx = npc.x - cameraX;
      if (sx < -80 || sx > W + 80) return;
      ctx.fillStyle = "#3d3d4a";
      ctx.fillRect(sx + 10, npc.y + 30, 30, 55);
      ctx.beginPath();
      ctx.arc(sx + 25, npc.y + 18, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // 物件：九層塔、蒜頭、食物袋
    OBJECTS.forEach(function (obj) {
      const sx = obj.x - cameraX;
      if (sx < -60 || sx > W + 60) return;
      if (obj.id === "obj_basil") {
        ctx.fillStyle = "#2d5a27";
        ctx.beginPath();
        ctx.ellipse(sx + 30, obj.y + 25, 28, 22, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (obj.id === "obj_garlic") {
        ctx.fillStyle = "#f5f0e0";
        ctx.beginPath();
        ctx.arc(sx + 20, obj.y + 22, 18, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#8b6914";
        ctx.fillRect(sx + 5, obj.y + 15, 45, 40);
        ctx.fillStyle = "#5c4a0e";
        ctx.fillRect(sx + 10, obj.y + 10, 35, 8);
      }
    });
  }

  return {
    getClickedId,
    getNpcsAtPlayer,
    isPlayerAtStall,
    draw,
    WORLD_WIDTH,
    STALL_BOUNDS,
    NPCS,
    OBJECTS
  };
})();
