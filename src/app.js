const express = require("express");
const cors = require("cors");
const { sendSuccess, sendError } = require("./utils/apiResponse");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  return sendSuccess(res, { status: "ok" }, "Server is running");
});

app.use((req, res) => {
  return sendError(res, "Route not found", 404);
});

module.exports = app;
