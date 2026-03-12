# Vercel 部署說明（根路徑 404 時必看）

## 1. 檢查 Root Directory

若 `https://你的網址.vercel.app/` 出現 404：

1. 打開 [Vercel Dashboard](https://vercel.com/dashboard) → 點進該專案
2. **Settings** → **General** → **Root Directory**
3. 若你的遊戲檔案（`index.html`、`css`、`js`、`public`）在 **repo 的子資料夾**裡（例如 `TPC-small-game-2`），請把 Root Directory 設成該資料夾，例如：`TPC-small-game-2`
4. 若遊戲檔案就在 **repo 根目錄**（一打開 repo 就看到 `index.html`），Root Directory 請**留空**
5. 儲存後到 **Deployments** 點 **Redeploy** 重新部署

## 2. 檢查 Framework Preset

1. **Settings** → **General** → **Framework Preset**
2. 請選 **Other**（不要選 Vite、Next.js 等），這樣才會當成純靜態 HTML 站
3. **Build Command** 留空
4. **Output Directory** 留空（或與 `vercel.json` 裡的 `outputDirectory` 一致）
5. 儲存後再 **Redeploy** 一次

## 3. 確認 repo 根目錄結構

部署用的根目錄底下應大致長這樣：

```
index.html
vercel.json
css/
  style.css
js/
  (所有 .js)
public/
  translations.json
  sound/
  thumbnail-icons/
package.json  (可選)
```

`index.html` 和 `vercel.json` 必須在**同一個**根目錄下，Vercel 才會把首頁當成 `/`。
