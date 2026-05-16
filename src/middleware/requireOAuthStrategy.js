const { passport } = require("../config/passport");
const { sendError } = require("../utils/apiResponse");

// Middleware to check if the required OAuth strategy is configured before allowing access to the route.
const requireOAuthStrategy = (strategyName) => (req, res, next) => {
  if (!passport._strategy(strategyName)) {
    return sendError(
      res,
      `${strategyName} OAuth is not configured on the server.`,
      503
    );
  }
  return next();
};

module.exports = requireOAuthStrategy;
