module.exports = {
  apps: [
    {
      name: "radarbrands-web",
      script: ".output/server/index.mjs",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
      max_memory_restart: "512M",
      error_file: "./logs/web-error.log",
      out_file: "./logs/web-out.log",
      merge_logs: true,
      time: true,
    },
    {
      name: "radarbrands-endpoints-worker",
      script: "npx",
      args: "tsx scripts/worker-endpoints.ts",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        ENDPOINTS_CRON_MS: "15000",
        ENDPOINTS_CRON_BATCH: "15",
      },
      max_memory_restart: "256M",
      error_file: "./logs/endpoints-error.log",
      out_file: "./logs/endpoints-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
