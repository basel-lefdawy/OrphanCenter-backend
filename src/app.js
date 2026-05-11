const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { setupSwagger } = require("./docs/swagger");
const { sendSuccess, sendError } = require("./utils/apiResponse");

const app = express();

app.use(cors());
app.use(express.json());
setupSwagger(app);

app.get("/health", (req, res) => {
  return sendSuccess(res, { status: "ok" }, "Server is running");
});

app.use("/api", routes);

app.use((req, res) => {
  return sendError(res, "Route not found", 404);
});

module.exports = app;
