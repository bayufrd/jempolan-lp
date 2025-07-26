module.exports = {
    apps: [
      {
        name: "jempolan-fe",
        script: "react-scripts",
        args: "start",
        env: {
          PORT: 1234,
          REACT_APP_API_URL: "https://jempolan-be.gaspollmanagementcenter.com/api"
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 1234,
          REACT_APP_API_URL: "https://jempolan-be.gaspollmanagementcenter.com/api"
        }
      },
      {
        name: "jempolan-be",
        script: "backend/server.js",
        env: {
          PORT: 5000,
          BACKEND_PORT: 5000
        },
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