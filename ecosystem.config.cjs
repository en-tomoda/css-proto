module.exports = {
  apps: [
    {
      name: "css-proto",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3001 -H 0.0.0.0",
      interpreter: "node",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
