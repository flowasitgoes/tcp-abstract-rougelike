/**
 * 音效管理：對話「下一句」、「關閉」、遇到路人、左右腳步
 * 使用 public/sound/ 下你下載的 Pixabay 音效
 */
const AudioManager = (function () {
  let nextAudio = null;
  let closeAudio = null;
  let npcMeetAudio = null;
  let walkLeftAudio = null;
  let walkRightAudio = null;
  let walkRightStopTimer = null;

  function ensureLoaded() {
    if (!nextAudio) {
      nextAudio = new Audio("public/sound/soundreality-pop-423717.mp3");
    }
    if (!closeAudio) {
      closeAudio = new Audio("public/sound/dragon-studio-pop-402323.mp3");
    }
    if (!npcMeetAudio) {
      npcMeetAudio = new Audio("public/sound/soundreality-battle-pop-424581.mp3");
    }
    if (!walkLeftAudio) {
      walkLeftAudio = new Audio("public/sound/walk-left.mp3");
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var src = ctx.createMediaElementSource(walkLeftAudio);
        var gain = ctx.createGain();
        gain.gain.value = 1.35;
        src.connect(gain);
        gain.connect(ctx.destination);
      } catch (e) {}
    }
    if (!walkRightAudio) {
      walkRightAudio = new Audio("public/sound/walk-right.mp3");
    }
  }

  function play(soundId) {
    ensureLoaded();
    if (soundId === "dialog_next" && nextAudio) {
      nextAudio.currentTime = 0;
      nextAudio.play().catch(function () {});
    }
    if (soundId === "dialog_close" && closeAudio) {
      closeAudio.currentTime = 0;
      closeAudio.play().catch(function () {});
    }
    if (soundId === "npc_meet" && npcMeetAudio) {
      npcMeetAudio.currentTime = 0;
      npcMeetAudio.play().catch(function () {});
    }
    if (soundId === "walk_left" && walkLeftAudio) {
      walkLeftAudio.currentTime = 0;
      walkLeftAudio.play().catch(function () {});
    }
    if (soundId === "walk_right" && walkRightAudio) {
      if (walkRightStopTimer) clearTimeout(walkRightStopTimer);
      walkRightAudio.currentTime = 0;
      walkRightAudio.play().catch(function () {});
      walkRightStopTimer = setTimeout(function () {
        walkRightStopTimer = null;
        walkRightAudio.pause();
        walkRightAudio.currentTime = 0;
      }, 2000);
    }
  }

  function stop() {}
  function setVolume() {}

  return {
    play,
    stop,
    setVolume
  };
})();
