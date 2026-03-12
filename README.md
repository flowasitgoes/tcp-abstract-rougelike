# 夜市鹹酥雞小遊戲（Night Market Fried Chicken Game）

玩家在凌晨 2 點的台灣夜市中左右移動，點擊場景中的旅人與物件觸發對話，最後到鹹酥雞攤買到一袋鹹酥雞，結尾呈現「大家理解並喜歡上台灣夜市文化」。

## 玩法

- **移動**：鍵盤 ← / → 或 A / D；手機可用畫面下方虛擬按鈕。
- **互動**：點擊場景中的 NPC（10 國旅人）、九層塔、蒜頭、食物袋或鹹酥雞攤，會出現對話或提示。
- **過關**：走到右側鹹酥雞攤，點擊攤位即可購買；買到後進入結尾畫面，可點「再玩一次」重來。

遊戲時間約 3–5 分鐘，氣氛與文化感為主，無複雜操作。

## 技術說明

- 單頁 Vanilla JS，無框架。
- 畫面：Canvas 2D 繪製場景與角色，橫向捲動（camera 跟隨玩家）。
- UI：DOM + CSS（對話框、結尾畫面、觸控按鈕）。
- 音效：油炸聲由 Web Audio API 合成（noise + bandpass）；人群、機車預留介面，可替換成外部音檔。

## 免費音效來源建議

- **Freesound.org**  
  - 關鍵字：`crowd murmur`、`market ambient`、`night market`（人群／環境）  
  - 關鍵字：`scooter`、`moped`、`motorcycle idle`（機車）  
  - 使用時請依授權標示（常見為 CC0、CC BY），並在專案中註明出處。

音效檔可放在 `assets/`，並在 `js/audio.js` 中以 `AudioContext.decodeAudioData` 載入後用 `AudioBufferSourceNode` 播放。

## 打包成手機 App

### PWA（加到主畫面）

- 在專案根目錄新增 `manifest.json`（name、short_name、start_url、display、icons）。
- 註冊 Service Worker，快取 `index.html`、`css/`、`js/`、`assets/`，離線可玩。
- 在 `index.html` 的 `<head>` 加上 `<link rel="manifest" href="manifest.json">`。

### Capacitor（原生 App）

1. `npm init -y`
2. `npm i @capacitor/core @capacitor/cli`
3. `npx cap init "夜市鹹酥雞" com.example.nightmarket`
4. 在 `capacitor.config.ts` 中將 `webDir` 指到專案根目錄（或 build 輸出目錄），並設定 `server.url` 或直接打包靜態檔。
5. `npx cap add ios` 或 `npx cap add android`
6. 以靜態伺服器或 build 產出作為 web 資源，執行 `npx cap sync` 後用 Xcode / Android Studio 開啟並建置。

專案為單頁、相對路徑資源，無需改程式即可作為 Capacitor 的 web 入口。

## 檔案結構

```
├── index.html
├── css/style.css
├── js/
│   ├── constants.js
│   ├── main.js
│   ├── scene.js
│   ├── player.js
│   ├── dialogues.js
│   └── audio.js
├── assets/          # 可選：音效、圖片
└── README.md
```

本地可直接用瀏覽器開啟 `index.html`，或使用任意靜態伺服器（例如 `npx serve .`）執行。
# tcp-abstract-rougelike
