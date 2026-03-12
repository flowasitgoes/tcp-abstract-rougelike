/**
 * 對話文案：10 國旅人 + 攤主 + 物件
 */
const Dialogues = (function () {
  const dialogues = {
    npc_iceland: {
      title: "冰島旅人",
      lines: ["我們半夜只有極光，沒有炸雞……", "原來大家是來吃這個的，難怪這麼多人！"]
    },
    npc_mongolia: {
      title: "蒙古旅人",
      lines: ["草原上沒有這樣的攤子。", "半夜還能買到熱的，好厲害。"]
    },
    npc_bhutan: {
      title: "不丹旅人",
      lines: ["幸福指數裡有鹹酥雞嗎？", "聞起來很幸福。"]
    },
    npc_madagascar: {
      title: "馬達加斯加旅人",
      lines: ["跟我們那裡的夜市完全不一樣。", "這個香味我記住了！"]
    },
    npc_paraguay: {
      title: "巴拉圭旅人",
      lines: ["南美也愛宵夜，但沒有九層塔。", "我想試試看加九層塔的。"]
    },
    npc_slovenia: {
      title: "斯洛維尼亞旅人",
      lines: ["歐洲半夜只有酒吧。", "這裡的宵夜文化太有趣了。"]
    },
    npc_namibia: {
      title: "納米比亞旅人",
      lines: ["沙漠晚上只有星空與營火。", "沒想到城市裡也有這種溫暖。"]
    },
    npc_albania: {
      title: "阿爾巴尼亞旅人",
      lines: ["我們也有夜市，但沒有這種香味。", "蒜頭跟九層塔是秘密嗎？"]
    },
    npc_greenland: {
      title: "格陵蘭旅人",
      lines: ["冰天雪地裡熱騰騰的炸物很吸引人。", "我想買一袋帶回去。"]
    },
    npc_bolivia: {
      title: "玻利維亞旅人",
      lines: ["高海拔餓了也想來一袋。", "台灣人半夜不睡覺都在吃這個？"]
    },
    obj_basil: {
      title: "九層塔",
      lines: ["鹹酥雞的靈魂配角之一。"]
    },
    obj_garlic: {
      title: "蒜頭",
      lines: ["切碎加進去，香味加倍。"]
    },
    obj_food_bag: {
      title: "食物袋",
      lines: ["剛炸好的鹹酥雞，裝在袋子裡還熱熱的。"]
    },
    stall: {
      title: "鹹酥雞攤",
      lines: ["老闆：要什麼？", "（點「關閉」後若已滿足條件，可再點攤位購買）"]
    },
    stall_buy: {
      title: "鹹酥雞攤",
      lines: ["老闆：好，一袋鹹酥雞！", "你買到了一袋鹹酥雞。"]
    }
  };

  let overlayEl, titleEl, textEl, nextBtn, closeBtn, sceneWrapEl, sceneCanvasEl;
  let currentId = null;
  let lineIndex = 0;
  let onCloseCallback = null;

  function init() {
    overlayEl = document.getElementById("dialog-overlay");
    titleEl = document.getElementById("dialog-title");
    textEl = document.getElementById("dialog-text");
    nextBtn = document.getElementById("dialog-next");
    closeBtn = document.getElementById("dialog-close");
    sceneWrapEl = document.getElementById("dialog-scene-wrap");
    sceneCanvasEl = document.getElementById("dialog-scene");

    nextBtn.addEventListener("click", nextLine);
    closeBtn.addEventListener("click", close);
    overlayEl.addEventListener("click", function (e) {
      if (e.target === overlayEl) close();
    });
  }

  function nextLine() {
    const data = dialogues[currentId];
    if (!data || !data.lines) return;
    lineIndex++;
    if (lineIndex >= data.lines.length) {
      nextBtn.classList.add("hidden");
      closeBtn.classList.remove("hidden");
      textEl.textContent = data.lines[data.lines.length - 1];
    } else {
      textEl.textContent = data.lines[lineIndex];
      if (lineIndex === data.lines.length - 1) {
        nextBtn.classList.add("hidden");
        closeBtn.classList.remove("hidden");
      }
    }
  }

  function close() {
    if (typeof IcelandScene !== "undefined") IcelandScene.stop();
    if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
    if (typeof BhutanScene !== "undefined") BhutanScene.stop();
    if (sceneWrapEl) sceneWrapEl.classList.add("hidden");
    overlayEl.classList.add("hidden");
    nextBtn.classList.remove("hidden");
    closeBtn.classList.add("hidden");
    if (onCloseCallback) onCloseCallback(currentId);
    currentId = null;
    lineIndex = 0;
  }

  function show(id, options) {
    options = options || {};
    onCloseCallback = options.onClose || null;

    const data = dialogues[id];
    if (!data) return;
    currentId = id;
    lineIndex = 0;
    titleEl.textContent = data.title || "";
    textEl.textContent = data.lines[0] || "";
    nextBtn.classList.remove("hidden");
    closeBtn.classList.add("hidden");
    if (data.lines.length <= 1) {
      nextBtn.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    }
    overlayEl.classList.remove("hidden");

    if (id === "npc_iceland" && typeof IcelandScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      IcelandScene.start(sceneCanvasEl);
    } else if (id === "npc_mongolia" && typeof MongoliaScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      MongoliaScene.start(sceneCanvasEl);
    } else if (id === "npc_bhutan" && typeof BhutanScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      BhutanScene.start(sceneCanvasEl);
    } else {
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (sceneWrapEl) sceneWrapEl.classList.add("hidden");
    }
  }

  function isOpen() {
    return overlayEl && !overlayEl.classList.contains("hidden");
  }

  function advance() {
    if (!isOpen()) return;
    if (closeBtn.classList.contains("hidden")) nextLine();
    else close();
  }

  return {
    init,
    show,
    close,
    advance,
    isOpen,
    dialogues
  };
})();
