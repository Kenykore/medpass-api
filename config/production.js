require('dotenv').config();
const productionConfig = {
  port: process.env.PORT || 3000,
  node_environment: process.env.ENVIRONMENT,
  database_url: process.env.PRODUCTION_DB_URL,

};

module.exports = productionConfig;
