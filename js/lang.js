/**
 * 語言切換：載入 translations.json，提供 Lang.getLang / setLang / getUI / getDialogues
 * 載入完成後觸發 document 的 translationsReady 事件
 */
(function () {
  const STORAGE_KEY = "lang";
  const defaultLang = "zh";

  function getStored() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s === "en" || s === "zh" ? s : defaultLang;
    } catch (e) {
      return defaultLang;
    }
  }

  let currentLang = getStored();
  let data = null;

  function setLang(lang) {
    if (lang !== "zh" && lang !== "en") return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    if (typeof window.onLangChange === "function") window.onLangChange(lang);
  }

  function getLang() {
    return currentLang;
  }

  function getUI() {
    return data && data[currentLang] && data[currentLang].ui ? data[currentLang].ui : null;
  }

  function getDialogues() {
    return data && data[currentLang] && data[currentLang].dialogues ? data[currentLang].dialogues : {};
  }

  function setData(d) {
    data = d;
  }

  window.Lang = {
    getLang,
    setLang,
    getUI,
    getDialogues,
    setData,
    isReady: function () {
      return data !== null;
    }
  };

  const path = "/public/translations.json";
  fetch(path)
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load " + path);
      return res.json();
    })
    .then(function (d) {
      window.TRANSLATIONS = d;
      window.Lang.setData(d);
      document.dispatchEvent(new Event("translationsReady"));
    })
    .catch(function (err) {
      console.warn("i18n: " + err.message + ", using fallback.");
      window.TRANSLATIONS = { zh: { ui: {}, dialogues: {} }, en: { ui: {}, dialogues: {} } };
      window.Lang.setData(window.TRANSLATIONS);
      document.dispatchEvent(new Event("translationsReady"));
    });
})();
