#!/usr/bin/env bash
set -euo pipefail

APP_NAME="css-proto"

echo "==> Fetch latest code"
git pull --ff-only

echo "==> Install dependencies"
npm install

echo "==> Build application"
npm run build

echo "==> Start or restart PM2 process"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  pm2 start ecosystem.config.cjs --env production
fi

echo "==> Save PM2 process list"
pm2 save

echo "==> Done"
