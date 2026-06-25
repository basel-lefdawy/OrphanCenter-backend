const isProduction = process.env.NODE_ENV === "production";

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

module.exports = {
  REFRESH_TOKEN_COOKIE_NAME,
  getRefreshTokenCookieOptions,
};
