const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/apiResponse");

function signAuthToken(user) {
  return jwt.sign(
    {
      id: user.id,
      provider: user.provider,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "change_this_secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
}

function facebookCallback(req, res) {
  if (!req.user) {
    return sendError(res, "Facebook authentication failed", 401);
  }

  const token = signAuthToken(req.user);
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const redirectUrl = new URL("/auth/facebook/success", clientUrl);
  redirectUrl.searchParams.set("token", token);

  return res.redirect(redirectUrl.toString());
}

function getCurrentUser(req, res) {
  return sendSuccess(res, {
    user: req.user,
  });
}

module.exports = {
  facebookCallback,
  getCurrentUser,
};
