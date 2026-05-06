const { sendError } = require("../utils/apiResponse");

function requireAdmin(req, res, next) {
  if (!req.user) {
    return sendError(res, "Authentication is required", 401);
  }

  if (req.user.role !== "admin") {
    return sendError(res, "Admin access is required", 403);
  }

  return next();
}

module.exports = requireAdmin;
