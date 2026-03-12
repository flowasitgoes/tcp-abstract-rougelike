#!/usr/bin/env bash
# 打包 itch.io 上傳用 www：index.html, css, js, public (sound, thumbnail-icons, translations)

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/www"

echo "Build www for itch.io -> $OUT"

rm -rf "$OUT"
mkdir -p "$OUT/css" "$OUT/js" "$OUT/public/sound" "$OUT/public/thumbnail-icons"

cp "$ROOT/index.html" "$OUT/"
cp "$ROOT/css/style.css" "$OUT/css/"
cp "$ROOT/js/"*.js "$OUT/js/"
cp "$ROOT/public/translations.json" "$OUT/public/"
cp "$ROOT/public/sound/"*.mp3 "$OUT/public/sound/" 2>/dev/null || true
cp "$ROOT/public/thumbnail-icons/"*.jpg "$OUT/public/thumbnail-icons/" 2>/dev/null || true

echo "Done. www contents:"
find "$OUT" -type f | sort
