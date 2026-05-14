const { verifyAccessToken } = require("../utils/jwt");
const { sendError } = require("../utils/apiResponse");

/**
 * Requires a valid access JWT in `Authorization: Bearer <token>`.
 * Sets `req.user` to `{ id, role }` (aligned with token payload `sub`).
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return sendError(res, "Authentication token is required", 401);
  }

  const { valid, decoded, error } = verifyAccessToken(token);
  if (!valid || !decoded) {
    return sendError(res, error || "Invalid or expired token", 401);
  }

  req.user = {
    id: decoded.sub,
    role: decoded.role,
  };
  return next();
}

module.exports = requireAuth;
