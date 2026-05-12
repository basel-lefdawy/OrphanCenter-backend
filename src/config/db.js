require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "orphancenter_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "rootpassword",
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully");

    await sequelize.sync({ alter: true });
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
