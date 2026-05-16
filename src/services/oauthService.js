const { generateTokens } = require("../utils/jwt");
const { saveRefreshToken } = require("./authService");

/**
 * Shared redirect logic for all OAuth providers.
 * After passport authenticates, we generate our own JWT tokens
 * and redirect to the frontend with the access token in the URL.
 * Also save refresh token to database.
 */
const handleOAuthCallback = async (req, res, providerName) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  if (!req.user) {
    return res.redirect(
      `${clientUrl}/login?error=${encodeURIComponent(providerName + " EMAIL_ALREADY_EXISTS")}`
    );
  }

  try {
    // Generate tokens using the numeric user ID from database after successful authentication
    const tokens = generateTokens({ id: req.user.id, role: req.user.role });

    // Save refresh token to database
    await saveRefreshToken(req.user.id, tokens.refreshToken);

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";;
    // Redirect to frontend with tokens in query params
    const redirectUrl = new URL(`/auth/${providerName.toLowerCase()}/success`, clientUrl);
    redirectUrl.searchParams.set("token", tokens.accessToken);
    redirectUrl.searchParams.set("refreshToken", tokens.refreshToken);

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
