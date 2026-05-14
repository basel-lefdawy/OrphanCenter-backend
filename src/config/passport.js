// config/passport.js
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/auth/user");

function configurePassport() {

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
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error("Email is required for Facebook login"), null);
            }

            // Check if user already exists with this email (any provider)
            let user = await User.findOne({ where: { email } });

            if (user) {
              // If user exists but with different provider, prevent duplicate
              if (user.provider !== "facebook") {
                return done(new Error(`Email already registered with ${user.provider}`), null);
              }
              // If Facebook user exists, update if needed
              if (!user.providerId) {
                user.providerId = profile.id;
                await user.save();
              }
            } else {
              // Create new Facebook user
              user = await User.create({
                name: profile.displayName || "Facebook User",
                email,
                provider: "facebook",
                providerId: profile.id,
              });
            }

            // Return user object for passport
            return done(null, {
              id: user.id, // Use numeric DB ID
              provider: "facebook",
              name: user.name,
              email: user.email,
              role: user.role,
            });
          } catch (err) {
            return done(err, null);
          }
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
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error("Email is required for Google login"), null);
            }

            // Check if user already exists with this email (any provider)
            let user = await User.findOne({ where: { email } });

            if (user) {
              // If user exists but with different provider, prevent duplicate
              if (user.provider !== "google") {
                return done(new Error(`Email already registered with ${user.provider}`), null);
              }
              // If Google user exists, update if needed
              if (!user.providerId) {
                user.providerId = profile.id;
                await user.save();
              }
            } else {
              // Create new Google user
              user = await User.create({
                name: profile.displayName || "Google User",
                email,
                provider: "google",
                providerId: profile.id,
              });
            }

            // Return user object for passport
            return done(null, {
              id: user.id, // Use numeric DB ID
              provider: "google",
              name: user.name,
              email: user.email,
              role: user.role,
            });
          } catch (err) {
            return done(err, null);
          }
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