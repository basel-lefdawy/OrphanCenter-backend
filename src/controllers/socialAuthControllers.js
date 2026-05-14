// controllers/socialAuth.controller.js
const { generateTokens } = require("../utils/jwt");
const { saveRefreshToken } = require("../services/authService");
const User = require("../models/auth/user");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// ─── Shared Helper ────────────────────────────────────────────────────────────

/**
 * Shared redirect logic for all OAuth providers.
 * After passport authenticates, we generate our own JWT tokens
 * and redirect to the frontend with the access token in the URL.
 * Also save refresh token to database.
 */
const handleOAuthCallback = async (req, res, providerName) => {
  if (!req.user) {
    return sendError(res, `${providerName} authentication failed`, 401);
  }

  try {
    // Generate tokens using the numeric user ID from database
    const tokens = generateTokens({ id: req.user.id, role: req.user.role });

    // Save refresh token to database
    await saveRefreshToken(req.user.id, tokens.refreshToken);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";;
    const redirectUrl = new URL(`/auth/${providerName.toLowerCase()}/success`, clientUrl);
    redirectUrl.searchParams.set("token", tokens.accessToken);
    redirectUrl.searchParams.set("refreshToken", tokens.refreshToken);

    return res.redirect(redirectUrl.toString());
  } catch (err) {
    console.error(`OAuth callback error for ${providerName}:`, err);
    return sendError(res, "Authentication failed", 500);
  }
};

// ─── Facebook ─────────────────────────────────────────────────────────────────

const facebookCallback = async (req, res) => {
  return handleOAuthCallback(req, res, "facebook");
};

// ─── Google ───────────────────────────────────────────────────────────────────

const googleCallback = async (req, res) => {
  return handleOAuthCallback(req, res, "google");
};

// ─── Get Current User ─────────────────────────────────────────────────────────

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

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  facebookCallback,
  googleCallback,
  getCurrentUser,
};