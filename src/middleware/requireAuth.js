const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/apiResponse");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return sendError(res, "Authentication token is required", 401);
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "change_this_secret");
    return next();
  } catch (error) {
    return sendError(res, "Invalid or expired token", 401);
  }
}

module.exports = requireAuth;
