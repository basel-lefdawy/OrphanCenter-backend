require("dotenv").config();

const { Sequelize } = require("sequelize");
const configs = require("../../config/config");

const env = process.env.NODE_ENV || "development";
const config = configs[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully");

    await sequelize.sync();
    console.log("All models were synchronized successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    throw error;
  }
}

module.exports = {
  sequelize,
  connectDB,
};
