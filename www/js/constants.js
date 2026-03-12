/**
 * 夜市鹹酥雞小遊戲 - 常數
 */
const CONST = {
  // 畫布（會依視窗縮放）
  CANVAS_WIDTH: 1280,
  CANVAS_HEIGHT: 720,

  // 世界與捲動
  WORLD_WIDTH: 3840, // 約 3 倍視窗寬
  CAMERA_DEAD_ZONE: 200, // 玩家超出此範圍才開始捲動

  // 玩家
  PLAYER_SPEED: 280,
  PLAYER_WIDTH: 48,
  PLAYER_HEIGHT: 80,
  PLAYER_START_X: 200,

  // 購買條件：與至少 N 位旅人互動後可買（0 = 直接可買）
  MIN_TALKS_TO_BUY: 0
};
