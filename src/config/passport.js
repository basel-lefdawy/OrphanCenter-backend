// config/passport.js
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/auth/user");
// This file configures Passport strategies,validating,take info for Facebook and Google OAuth.
function configurePassport() {

  const handleOAuthUser = async (provider, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error(`Email is required for ${provider} login`), null);
      }

      let user = await User.findOne({ where: { email } });

      if (user) {
        if (user.provider !== provider) {
          return done(new Error(`Email already registered with ${user.provider}`), null);
        }
        if (!user.providerId) {
          user.providerId = profile.id;
          await user.save();
        }
      } else {
        user = await User.create({
          name: profile.displayName || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          email,
          provider,
          providerId: profile.id,
          isEmailVerified: true,
        });
      }

      return done(null, {
        id: user.id,
        provider,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      return done(err, null);
    }
  };

  // ─── Facebook ───────────────────────────────────────────────────────────────

  const hasFacebookConfig =
    process.env.FACEBOOK_APP_ID &&
    process.env.FACEBOOK_APP_SECRET &&
    process.env.FACEBOOK_CALLBACK_URL;

  if (!hasFacebookConfig) {
    console.warn("Facebook OAuth is not configured. Missing Facebook environment variables.");
  } else {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: process.env.FACEBOOK_CALLBACK_URL,
          profileFields: ["id", "displayName", "emails", "photos"],
        },
        async function verify(accessToken, refreshToken, profile, done) {
          return handleOAuthUser("facebook", profile, done);
        }
      )
    );
  }

  // ─── Google ─────────────────────────────────────────────────────────────────

  const hasGoogleConfig =
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL;

  if (!hasGoogleConfig) {
    console.warn("Google OAuth is not configured. Missing Google environment variables.");
  } else {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
          scope: ["profile", "email"],
        },
        async function verify(accessToken, refreshToken, profile, done) {
          return handleOAuthUser("google", profile, done);
        }
      )
    );
  }

  return passport;
}

module.exports = {
  passport,
  configurePassport,
};