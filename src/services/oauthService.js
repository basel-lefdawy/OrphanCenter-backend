const { generateTokens } = require("../utils/jwt");
const { saveRefreshToken } = require("./authService");
const { REFRESH_TOKEN_COOKIE_NAME, getRefreshTokenCookieOptions } = require("../config/cookie");

/**
 * Shared redirect logic for all OAuth providers.
 * After passport authenticates, we generate our own JWT tokens
 * and redirect to the frontend with the access token in the URL.
 * Also save refresh token to database and set it in a secure cookie.
 */
const handleOAuthCallback = async (req, res, providerName) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  if (!req.user) {
    return res.redirect(
      `${clientUrl}/login?error=${encodeURIComponent(providerName + " EMAIL_ALREADY_EXISTS")}`
    );
  }

  try {
    const tokens = generateTokens({ id: req.user.id, role: req.user.role });
    await saveRefreshToken(req.user.id, tokens.refreshToken);

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, getRefreshTokenCookieOptions());

    const redirectUrl = new URL(`/auth/${providerName.toLowerCase()}/success`, clientUrl);
    redirectUrl.searchParams.set("token", tokens.accessToken);

    return res.redirect(redirectUrl.toString());
  } catch (err) {
    console.error(`OAuth callback error for ${providerName}:`, err);
    return res.redirect(
      `${clientUrl}/login?error=${encodeURIComponent(providerName + " EMAIL_ALREADY_EXISTS")}`
    );
  }
};

module.exports = {
  handleOAuthCallback,
};
