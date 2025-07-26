// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "jempolan-fe",
        script: "npx",
        args: "serve -s build -l 1234",
        env_production: {
          NODE_ENV: "production",
          PORT: 1234,
          REACT_APP_API_URL: "https://jempolan-be.gaspollmanagementcenter.com/api"
        }
      },
      {
        name: "jempolan-be",
        script: "node",
        args: "backend/server.js",
        env_production: {
          NODE_ENV: "production",
          PORT: 5000,
          BACKEND_PORT: 5000
        },
        watch: false,
        max_memory_restart: "300M"
      }
    ]
};