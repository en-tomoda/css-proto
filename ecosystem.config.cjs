// pm2 プロセス管理設定
// 起動:  pm2 start ecosystem.config.cjs
// 更新後: npm run build && pm2 reload csas
// 保存:  pm2 save   （プロセス一覧を記憶。マシン再起動後も pm2 resurrect で復帰）
module.exports = {
  apps: [
    {
      name: "csas",
      // 設定ファイルのある場所（＝プロジェクトルート）を基準にする。サーバー上のパスに依存しない
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
      },
    },
  ],
};
