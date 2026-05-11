const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

function configurePassport() {
  const hasFacebookConfig =
    process.env.FACEBOOK_APP_ID &&
    process.env.FACEBOOK_APP_SECRET &&
    process.env.FACEBOOK_CALLBACK_URL;

  if (!hasFacebookConfig) {
    console.warn("Facebook OAuth is not configured. Missing Facebook environment variables.");
    return passport;
  }

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "emails", "photos"],
      },
      function verify(accessToken, refreshToken, profile, done) {
        const email = profile.emails?.[0]?.value || null;
        const photo = profile.photos?.[0]?.value || null;

        const user = {
          id: `facebook:${profile.id}`,
          provider: "facebook",
          facebookId: profile.id,
          name: profile.displayName || "Facebook User",
          email,
          photo,
          role: "user",
        };

        return done(null, user);
      }
    )
  );

  return passport;
}

module.exports = {
  passport,
  configurePassport,
};
