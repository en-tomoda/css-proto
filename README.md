# CSAS（キャリアセレクタビリティシステム）モック

AIとの対話でキャリア目標設定・アクション管理を支援し、上司が本人の承認のもとメンバーの状態を把握できる社内向けアプリのモックです。

- 技術: Next.js 16 / React / Tailwind CSS v4 / shadcn/ui / recharts / sonner
- 仕様: [`docs/career-support-app-spec.md`](docs/career-support-app-spec.md)
- データはすべてインメモリのダミー（DBなし）。ページをリロードすると状態はリセットされます

---

## 動作要件

- Node.js 20.11 以上
- npm
- 常駐運用する場合: [pm2](https://pm2.keymetrics.io/)（`npm install -g pm2`）

---

## ローカルで開発する

```bash
npm install
npm run dev
```

http://localhost:3000 を開く。コードを編集すると自動でリロードされます。

---

## サーバーで起動する（pm2 で常駐）

git でプルしたあと、本番ビルドを pm2 に載せて常駐させます。
（`next dev` ではなく本番ビルド + `next start` を使うため、軽量で安定します）

### 初回セットアップ

```bash
# 1. リポジトリを取得
git clone git@github.com:en-tomoda/css-proto.git
cd css-proto

# 2. 依存インストール
npm ci            # package-lock.json どおりに厳密インストール（なければ npm install）

# 3. pm2 を入れる（未インストールの場合のみ・グローバル）
npm install -g pm2

# 4. 本番ビルド
npm run build

# 5. pm2 で起動（ポート 3001）
pm2 start ecosystem.config.cjs

# 6. プロセス一覧を保存
pm2 save
```

起動後は **http://localhost:3001** で稼働します。

### 2回目以降（更新をデプロイする）

コードを変更したら、必ず**ビルドし直してから** reload します。

```bash
git pull
npm ci            # 依存に変更があった場合
npm run build
pm2 reload csas   # 無停止で入れ替え
```

### マシン再起動後も自動で立ち上げる（任意・sudo が必要）

```bash
pm2 startup       # 出力される「sudo ...」のコマンドをコピーして実行
pm2 save          # 現在のプロセス一覧を保存
```

これで OS 再起動後も pm2 が CSAS を自動起動します。
設定しない場合でも、手動で `pm2 resurrect` すれば保存済みの状態から復帰できます。

---

## pm2 運用コマンド

| 目的 | コマンド |
|---|---|
| 状態確認 | `pm2 list` / `pm2 status` |
| ログ確認 | `pm2 logs csas` |
| 停止 | `pm2 stop csas` |
| 起動 | `pm2 start csas` |
| 再起動 | `pm2 restart csas` |
| 無停止リロード | `pm2 reload csas` |
| 削除 | `pm2 delete csas` |

---

## ポート設定

ポートは [`ecosystem.config.cjs`](ecosystem.config.cjs) の `args`（`start -p 3001`）と `env.PORT` で管理しています。
変更する場合は両方を書き換えて `pm2 reload csas` してください。
`cwd: __dirname` としているため、サーバー上のどのパスに配置しても動作します。

---

## 主なディレクトリ

```
app/                  各画面（login / onboarding / mypage / chat / history / members / admin）
components/           共通コンポーネント（app-shell, ta-section, reflection-list, en-logo など）
lib/                  data.ts（ダミーデータ・型）, store.tsx（アプリ状態）
public/               ロゴ画像
docs/                 仕様書
ecosystem.config.cjs  pm2 設定
```
