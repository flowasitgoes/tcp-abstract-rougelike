# 上傳到 itch.io

## 打包

在專案根目錄執行：

```bash
npm run build
# 或
./build-www.sh
```

會把所需檔案全部複製到 `www/`。

## www 內容

- **index.html** — 入口
- **css/** — style.css
- **js/** — 所有遊戲與語言腳本
- **public/translations.json** — 中英翻譯
- **public/sound/** — 音效 mp3
- **public/thumbnail-icons/** — SEO/分享用縮圖 jpg

## 上傳步驟

1. 到 [itch.io](https://itch.io/) 建立新專案（Project）。
2. **Kind of project** 選 **HTML**。
3. **Upload files**：
   - 作法 A：選取 `www` 資料夾「裡面的所有檔案與資料夾」（index.html、css、js、public），壓縮成 zip，上傳該 zip。
   - 作法 B：直接上傳 `www` 內的所有檔案（若 itch 支援資料夾上傳）。
4. 重要：解壓後 **index.html 必須在 zip 根目錄**，不要變成 `www/index.html`（所以壓縮時要選「www 裡面的內容」，不要選「www 資料夾」）。
5. 在專案設定裡把 **Execution mode** 設為 **Load in browser**，入口為 **index.html**。

上傳後用 itch.io 的預覽確認遊戲與音效、語言切換是否正常。
