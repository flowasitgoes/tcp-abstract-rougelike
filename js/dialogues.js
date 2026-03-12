/**
 * 對話文案：由 Lang.getDialogues() 取得當前語言的內容（10 國旅人 + 攤主 + 物件）
 */
const Dialogues = (function () {
  function getDialogues() {
    return (typeof Lang !== "undefined" && Lang.getDialogues) ? Lang.getDialogues() : {};
  }

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
    const dialogues = getDialogues();
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
    if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
    if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
    if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
    if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
    if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
    if (typeof BasilScene !== "undefined") BasilScene.stop();
    if (typeof GarlicScene !== "undefined") GarlicScene.stop();
    if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
    if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
    if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
    if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
    if (sceneWrapEl) sceneWrapEl.classList.add("hidden");
    overlayEl.classList.add("hidden");
    overlayEl.setAttribute("aria-hidden", "true");
    nextBtn.classList.remove("hidden");
    closeBtn.classList.add("hidden");
    if (onCloseCallback) onCloseCallback(currentId);
    currentId = null;
    lineIndex = 0;
  }

  function show(id, options) {
    options = options || {};
    onCloseCallback = options.onClose || null;

    const dialogues = getDialogues();
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
    overlayEl.setAttribute("aria-hidden", "false");

    if (id === "npc_iceland" && typeof IcelandScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      IcelandScene.start(sceneCanvasEl);
    } else if (id === "npc_mongolia" && typeof MongoliaScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      MongoliaScene.start(sceneCanvasEl);
    } else if (id === "npc_bhutan" && typeof BhutanScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      BhutanScene.start(sceneCanvasEl);
    } else if (id === "npc_madagascar" && typeof MadagascarScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      MadagascarScene.start(sceneCanvasEl);
    } else if (id === "npc_paraguay" && typeof ParaguayScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      ParaguayScene.start(sceneCanvasEl);
    } else if (id === "npc_slovenia" && typeof SloveniaScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      SloveniaScene.start(sceneCanvasEl);
    } else if (id === "npc_namibia" && typeof NamibiaScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      NamibiaScene.start(sceneCanvasEl);
    } else if (id === "npc_albania" && typeof AlbaniaScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      AlbaniaScene.start(sceneCanvasEl);
    } else if (id === "npc_greenland" && typeof GreenlandScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      GreenlandScene.start(sceneCanvasEl);
    } else if (id === "npc_bolivia" && typeof BoliviaScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      BoliviaScene.start(sceneCanvasEl);
    } else if (id === "obj_basil" && typeof BasilScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      BasilScene.start(sceneCanvasEl);
    } else if (id === "obj_garlic" && typeof GarlicScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      GarlicScene.start(sceneCanvasEl);
    } else if (id === "obj_food_bag" && typeof FoodBagScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
      FoodBagScene.start(sceneCanvasEl);
    } else if (id === "stall_buy" && typeof FriedChickenScene !== "undefined" && sceneWrapEl && sceneCanvasEl) {
      sceneWrapEl.classList.remove("hidden");
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      FriedChickenScene.start(sceneCanvasEl);
    } else {
      if (typeof IcelandScene !== "undefined") IcelandScene.stop();
      if (typeof MongoliaScene !== "undefined") MongoliaScene.stop();
      if (typeof BhutanScene !== "undefined") BhutanScene.stop();
      if (typeof MadagascarScene !== "undefined") MadagascarScene.stop();
      if (typeof ParaguayScene !== "undefined") ParaguayScene.stop();
      if (typeof SloveniaScene !== "undefined") SloveniaScene.stop();
      if (typeof NamibiaScene !== "undefined") NamibiaScene.stop();
      if (typeof AlbaniaScene !== "undefined") AlbaniaScene.stop();
      if (typeof BasilScene !== "undefined") BasilScene.stop();
      if (typeof GarlicScene !== "undefined") GarlicScene.stop();
      if (typeof GreenlandScene !== "undefined") GreenlandScene.stop();
      if (typeof FoodBagScene !== "undefined") FoodBagScene.stop();
      if (typeof BoliviaScene !== "undefined") BoliviaScene.stop();
      if (typeof FriedChickenScene !== "undefined") FriedChickenScene.stop();
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
    isOpen
  };
})();
