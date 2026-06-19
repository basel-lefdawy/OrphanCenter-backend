require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "rootpassword",
    database: process.env.DB_NAME || "orphancenter_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3308,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "rootpassword",
    database: process.env.DB_NAME ? `${process.env.DB_NAME}_test` : "orphancenter_db_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3307,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "rootpassword",
    database: process.env.DB_NAME || "orphancenter_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3307,
    dialect: process.env.DB_DIALECT || "mysql",
  },
};
