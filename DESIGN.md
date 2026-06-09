# デザインガイド

---

## カラー

### ブランドカラー

| 役割 | 名称 | Hex | OKLCH | 用途 |
|------|------|-----|-------|------|
| Primary | ネイビーブルー | `#0b3484` | `oklch(0.27 0.11 265)` | メインカラー、ロゴ左円、ボタン、見出し |
| Accent | ライトブルー | `#1ab1e6` | `oklch(0.68 0.13 215)` | アクセント、ロゴ右円、リンク、バッジ |
| White | ホワイト | `#ffffff` | `oklch(1 0 0)` | 背景、ロゴテキスト |
| Text | ダークグレー（推定） | `#333333` | `oklch(0.28 0 0)` | 本文テキスト |
| Background | ライトグレー（推定） | `#f5f5f5` | `oklch(0.97 0 0)` | セクション背景 |

### カラーの使い方

- **ネイビー (#0b3484)**: ヘッダー背景、プライマリボタン、アクティブなナビゲーション
- **ライトブルー (#1ab1e6)**: ホバーアクセント、アイコン、バッジ、リンクカラー
- **白**: ロゴ（ネイビー背景上）、カードの背景、テキストオンネイビー

---

## タイポグラフィ（推定）

| 要素 | font-family | サイズ | ウェイト |
|------|------------|--------|----------|
| 見出し h1 | Noto Sans JP, sans-serif | 2rem (32px) | 700 |
| 見出し h2 | Noto Sans JP, sans-serif | 1.5rem (24px) | 700 |
| 見出し h3 | Noto Sans JP, sans-serif | 1.25rem (20px) | 600 |
| 本文 | Noto Sans JP, sans-serif | 1rem (16px) | 400 |
| 小文字 | Noto Sans JP, sans-serif | 0.875rem (14px) | 400 |

---

## コンポーネントスタイル（推定）

### ボタン

```css
.btn-primary {
  background-color: #0b3484;
  color: #ffffff;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #0a2d70; /* 少し暗く */
}

.btn-outline {
  border: 2px solid #0b3484;
  color: #0b3484;
  background: transparent;
  border-radius: 4px;
  padding: 10px 22px;
}
```

### ナビゲーション

```css
header {
  background-color: #ffffff;
  border-bottom: 2px solid #0b3484;
}

nav a.active,
nav a:hover {
  color: #0b3484;
  border-bottom: 2px solid #1ab1e6;
}
```

### カード

```css
.card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

