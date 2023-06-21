
const dotenv = require('dotenv');
const fs = require('fs');
const envConfig = dotenv.parse(fs.readFileSync('./env/config.env'));

module.exports = {
  apps: [
    {
      name: 'wowcho-mgmt-api',
      script: './server.ts',
      interpreter: 'ts-node',
      instances: 2,
      exec_mode : "cluster", //cpu 負載平衡模式
      max_memory_restart: '1G',
      watch: true,
      port: 3001,
      env: {
        NODE_ENV: 'development',
        ...envConfig
      },
      env_production: {
        NODE_ENV: 'production',
        ...envConfig
      }
    }
  ]
}