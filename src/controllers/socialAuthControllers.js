const { handleOAuthCallback } = require("../services/oauthService");
const User = require("../models/auth/user");
const { sendSuccess } = require("../utils/apiResponse");

// when facebook redirects back to us, It generates our own JWT tokens and redirects to the frontend with the access token in the URL.
const facebookCallback = async (req, res) => {
  return handleOAuthCallback(req, res, "facebook");
};

const googleCallback = async (req, res) => {
  return handleOAuthCallback(req, res, "google");
};

/**
 * Returns the currently authenticated user.
 * Loads user data from the database using the numeric ID from JWT.
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const rawId = req.user.id;
    const numericId = Number(rawId);

    if (Number.isInteger(numericId) && numericId > 0) {
      const user = await User.findByPk(numericId);
      if (user) {
        return sendSuccess(res, {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
          },
        });
      }
    }

    // Fallback for any edge cases (shouldn't happen with fixed OAuth)
    return sendSuccess(res, { user: { id: rawId, role: req.user.role } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  facebookCallback,
  googleCallback,
  getCurrentUser,
};
