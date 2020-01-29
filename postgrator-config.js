require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "migrate": "postgrator --config postgrator-config.js",
  "connectionString": process.env.DB_URL,
}