module.exports = {
  apps: [
    {
      name: "css-proto",
      script: "npm",
      args: "run start",
      cwd: "/Users/kazuya_tomoda/Develop/css-proto",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
