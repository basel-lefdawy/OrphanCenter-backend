const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { setupSwagger } = require("./docs/swagger");
const { passport, configurePassport } = require("./config/passport");
const { sendSuccess, sendError } = require("./utils/apiResponse");

const app = express();
configurePassport();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
app.use(passport.initialize());
setupSwagger(app);

// Health check
app.get("/health", (req, res) => {
  return sendSuccess(res, { status: "ok" }, "Server is running");
});

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  return sendError(res, "Route not found", 404);
});

module.exports = app;
